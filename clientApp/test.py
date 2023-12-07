import requests
import json
from datetime import datetime, timedelta
import random

def generate_test_data(start_time, duration_minutes, interval_minutes=5):
    test_data = []
    current_time = start_time
    end_time = start_time + timedelta(minutes=duration_minutes)

    while current_time < end_time:
        # Randomly choose between click, scroll, and move events
        event_type = random.choice(["click", "scroll", "move"])
        
        if event_type == "click":
            button = random.choice(["Button.left", "Button.right"])
            entry = [f"Mouse clicked with {button}", current_time.strftime("%Y-%m-%dT%H:%M:%S.%f")]
        elif event_type == "scroll":
            dx, dy = random.randint(-10, 10), random.randint(-10, 10)
            entry = [f"Mouse scrolled with delta ({dx}, {dy})", current_time.strftime("%Y-%m-%dT%H:%M:%S.%f")]
        else:  # move
            x, y = random.randint(0, 1920), random.randint(0, 1080)  # Assuming a 1920x1080 screen resolution
            entry = [f"Mouse moved to position ({x}, {y})", current_time.strftime("%Y-%m-%dT%H:%M:%S.%f")]

        test_data.append(entry)
        current_time += timedelta(minutes=interval_minutes)

    return test_data

def main():
    url = 'https://app-trackervariancealgo.azurewebsites.net/api/http_trigger?code=olQrLPqMdULrdatXD2uyPke2X_xLoisd_pRmtv3ZahxlAzFuVymqoA%3D%3D'
    test_logs = generate_test_data(datetime.now(), 40)

    # Prepare the payload to match the expected format of the Azure Function
    payload = {
        'logData': {
            'log': test_logs,
            '_id': 'test_id'  # Replace with a relevant id, if needed
        },
        'loginToken': 'test_token'  # Include this only if your function requires a token
    }

    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print("Response:")
    print(response.json())

if __name__ == "__main__":
    main()