import re
from datetime import datetime
import math

# Function to safely parse timestamps with or without microseconds
def parse_timestamp(timestamp_str):
    # Ignoring the timezone part by splitting on space and taking the first two parts
    # This works if the timezone is always at the end and the date and time are the first two parts separated by a space
    datetime_part = ' '.join(timestamp_str.split()[:2])
    for fmt in ('%Y-%m-%d %H:%M:%S.%f', '%Y-%m-%d %H:%M:%S'):
        try:
            return datetime.strptime(datetime_part, fmt)
        except ValueError:
            continue
    raise ValueError(f"time data {datetime_part} does not match any valid format")


# Function to calculate the hold durations (time between click and release)
def calculate_hold_durations(log_file_path):
    hold_durations = []
    with open(log_file_path, 'r') as file:
        click_time = None
        for line in file:
            if "Mouse clicked" in line:
                click_time = parse_timestamp(line.split(": Mouse")[0])
            elif "Mouse released" in line and click_time is not None:
                release_time = parse_timestamp(line.split(": Mouse")[0])
                hold_durations.append((release_time - click_time).total_seconds())
                click_time = None  # Reset click_time for the next pair
    return hold_durations

# Function to calculate variance
def calculate_variance(durations):
    if len(durations) < 2:  # Variance calculation requires at least 2 data points
        return 0
    mean_duration = sum(durations) / len(durations)
    variance = sum((duration - mean_duration) ** 2 for duration in durations) / (len(durations) - 1)
    return variance

def calculate_movement_rates(movement_log_file_path):
    distances = []
    rates = []
    previous_position = None
    previous_time = None
    with open(movement_log_file_path, 'r') as file:
        for line in file:
            parts = line.split(": Mouse moved to ")
            current_time = parse_timestamp(parts[0])
            x, y = map(float, re.findall(r'[\d.]+', parts[1]))
            if previous_position is not None and previous_time is not None:
                time_interval = (current_time - previous_time).total_seconds()
                distance = math.sqrt((x - previous_position[0])**2 + (y - previous_position[1])**2)
                rate = distance / time_interval if time_interval > 0 else 0
                distances.append(distance)
                rates.append(rate)
            previous_position = (x, y)
            previous_time = current_time
    return rates

# Path to the log file
log_file_path = '/Users/matthong/WorkPulse/clientApp/mouse_clicks.log'
movement_log_file_path = '/Users/matthong/WorkPulse/clientApp/mouse_movements.log'

# Calculate hold durations
hold_durations = calculate_hold_durations(log_file_path)

# Calculate variance
variance_of_hold_durations = calculate_variance(hold_durations)

# Calculate rates of mouse movement
movement_rates = calculate_movement_rates(movement_log_file_path)

# Calculate variance of movement rates
variance_of_movement_rates = calculate_variance(movement_rates)

# Output the results
# Output the results for mouse clicks
print(f"Mouse Click Hold Durations: {hold_durations}")
print(f"Variance of Mouse Click Hold Durations: {variance_of_hold_durations}")

# Output the results for mouse movement
# print(f"Mouse Movement Rates: {movement_rates}")
print(f"Variance of Mouse Movement Rates: {variance_of_movement_rates}")


