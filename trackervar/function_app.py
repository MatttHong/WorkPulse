import azure.functions as func
import logging
import json
from datetime import datetime, timedelta
import numpy as np
from collections import defaultdict
import requests

LOW_VARIANCE_THRESHOLD = 1

def is_low_variance(variance):
    return variance < LOW_VARIANCE_THRESHOLD

def evaluate_interval_variances(interval_variances):
    evaluated_intervals = {}
    for interval, variances in interval_variances.items():
        time_idle = is_idle_variance(variances.get("time_variance"))
        x_idle = is_idle_variance(variances.get("x_coordinate_variance"))
        y_idle = is_idle_variance(variances.get("y_coordinate_variance"))

        evaluated_intervals[interval] = {
            "time": time_idle,
            "x": x_idle,
            "y": y_idle
        }
    return evaluated_intervals

def determine_final_status(evaluated_clicked, evaluated_scrolled, evaluated_moved):
    final_statuses = {}
    all_intervals = set(evaluated_clicked) | set(evaluated_scrolled) | set(evaluated_moved)

    for interval in all_intervals:
        idle_count = sum([
            evaluated_clicked.get(interval, 1),
            evaluated_scrolled.get(interval, 1),
            evaluated_moved.get(interval, 1)
        ])
        final_statuses[interval] = 'Idle' if idle_count >= 2 else 'Working'
    
    return final_statuses

def is_idle_variance(variance):
    """ Check if the variance is considered 'Idle' (low variance) """
    return 0 if variance is not None and variance < LOW_VARIANCE_THRESHOLD else 1

def evaluate_interval(variances):
    """ Evaluate if the interval is idle (0) or active (1) based on variances """
    idle_counts = sum(is_idle_variance(var) for var in variances.values())
    return 0 if idle_counts >= 2 else 1

def evaluate_intervals(interval_variances):
    evaluated_intervals = {}
    for interval, variances in interval_variances.items():
        evaluated_intervals[interval] = evaluate_interval(variances)
    return evaluated_intervals
def group_logs_by_interval(logs, interval_minutes=5):
    grouped_logs = defaultdict(list)
    for log in logs:
        timestamp = parse_timestamp(log[1])
        interval_start = timestamp - timedelta(minutes=timestamp.minute % interval_minutes, 
                                               seconds=timestamp.second, 
                                               microseconds=timestamp.microsecond)
        grouped_logs[interval_start].append(log)
    return grouped_logs

def parse_timestamp(timestamp):
    return datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%S.%f")

def calculate_time_differences(logs):
    times = [parse_timestamp(entry[1]) for entry in logs]
    return [(times[i] - times[i - 1]).total_seconds() for i in range(1, len(times))]

def calculate_coordinate_differences(logs, index):
    return [logs[i][index] - logs[i - 1][index] for i in range(1, len(logs))]

def format_response(final_statuses):
    formatted_intervals = []
    for interval, status in final_statuses.items():
        start_time, end_time = interval.split(" - ")
        formatted_intervals.append({
            "start": start_time,
            "end": end_time,
            "status": status
        })
    return formatted_intervals

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)
@app.route(route="http_trigger")
def http_trigger(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        # Parse the JSON body of the request
        req_body = req.get_json()
    except ValueError:
        # If the JSON is invalid, return an error response
        return func.HttpResponse(
            "Invalid JSON in request body",
            status_code=400
        )

    # Extract the 'log' array from the JSON data
    log_data_body = req_body.get('logData', {})
    
    # Extract 'log', '_id' from 'logData' object
    log_data = log_data_body.get('log', [])
    id = log_data_body.get('_id', None)

    # Extract 'loginToken' from the request body
    login_token = req_body.get('loginToken', None)

    # Separate the logs into different categories
    clicked_logs = [entry for entry in log_data if entry[0].startswith('Mouse clicked with')]
    scrolled_logs = [entry for entry in log_data if entry[0].startswith('Mouse scrolled with delta')]
    moved_logs = [entry for entry in log_data if entry[0].startswith('Mouse moved to position')]

    clicked_intervals = group_logs_by_interval(clicked_logs)
    scrolled_intervals = group_logs_by_interval(scrolled_logs)
    moved_intervals = group_logs_by_interval(moved_logs)

    def calculate_variances(logs):
        if logs:
            time_diffs = calculate_time_differences(logs)
            x_diffs = calculate_coordinate_differences(logs, 2)
            y_diffs = calculate_coordinate_differences(logs, 3)

            return {
                "time_variance": np.var(time_diffs),
                "x_coordinate_variance": np.var(x_diffs) if x_diffs else None,
                "y_coordinate_variance": np.var(y_diffs) if y_diffs else None
            }
        return {"time_variance": None, "x_coordinate_variance": None, "y_coordinate_variance": None}
    
    def calculate_interval_variances(interval_logs):
        interval_variances = {}
        for start_time, logs in interval_logs.items():
            variances = calculate_variances(logs)
            interval_label = f"{start_time.strftime('%Y-%m-%dT%H:%M:%S')} - {(start_time + timedelta(minutes=5)).strftime('%Y-%m-%dT%H:%M:%S')}"
            interval_variances[interval_label] = variances
        return interval_variances
    
    interval_clicked_variances = calculate_interval_variances(clicked_intervals)
    interval_scrolled_variances = calculate_interval_variances(scrolled_intervals)
    interval_moved_variances = calculate_interval_variances(moved_intervals)

    evaluated_clicked_variances = evaluate_intervals(interval_clicked_variances)
    evaluated_scrolled_variances = evaluate_intervals(interval_scrolled_variances)
    evaluated_moved_variances = evaluate_intervals(interval_moved_variances)

    final_interval_statuses = determine_final_status(
        evaluated_clicked_variances, 
        evaluated_scrolled_variances, 
        evaluated_moved_variances
)
    formatted_response = format_response(final_interval_statuses)


    # Create a response with the calculated data
    response_data = {
    "log": format_response(final_interval_statuses),
    "status": "Finished"
    }

    if id and login_token:
        api_url = f'http://20.81.211.176:3000/api/log/{id}'
        headers = {'Authorization': f'Bearer {login_token}'}
        try:
            api_response = requests.put(api_url, json=response_data, headers=headers)
            if api_response.status_code != 200:
                logging.error(f"API request failed: {api_response.status_code}, {api_response.text}")
            else:
                logging.info("API request successful.")
        except requests.exceptions.RequestException as e:
            logging.error(f"Error making API request: {e}")

    return func.HttpResponse(
        json.dumps(response_data),
        mimetype="application/json",
        status_code=200
    )