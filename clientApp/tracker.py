from pynput import mouse, keyboard
import requests
from datetime import datetime

# Replace with the actual base URL of your API
API_BASE_URL = 'http://localhost:3000/api/log'

# Replace with the actual log ID you receive after starting a logging session
LOG_ID = 'your-log-id-here'

def start_logging():
    url = f'{API_BASE_URL}'
    log_data = {
        'employee': '654467918111a89f6cdd9546'
    }
    try:
        response = requests.post(url, json=log_data)
        response.raise_for_status()  # This will raise an HTTPError if the HTTP request returned an unsuccessful status code
        global LOG_ID
        LOG_ID = response.json().get('id')  # Assuming the response contains the log ID
        print(f'Logging started with ID: {LOG_ID}')
    except requests.exceptions.RequestException as e:
        print(f'Failed to start logging: {e}')

def stop_logging():
    url = f'{API_BASE_URL}/{LOG_ID}/end'
    try:
        response = requests.patch(url)
        response.raise_for_status()
        print('Logging stopped successfully')
    except requests.exceptions.RequestException as e:
        print(f'Failed to stop logging: {e}')

def add_log_entry(action, x=None, y=None):
    timestamp = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]
    entry = {
        'action': action,
        'timestamp': timestamp,
        'x': x,
        'y': y
    }
    url = f'{API_BASE_URL}/{LOG_ID}/entry'
    try:
        response = requests.put(url, json=entry)
        response.raise_for_status()
        print('Log entry added successfully:', entry)
    except requests.exceptions.RequestException as e:
        print(f'Failed to add log entry: {e}')

def on_click(x, y, button, pressed):
    if pressed:
        add_log_entry(f'Mouse clicked with {button}', x, y)

def on_scroll(x, y, dx, dy):
    add_log_entry(f'Mouse scrolled with delta ({dx}, {dy})', x, y)

def on_press(key):
    try:
        add_log_entry(f'Key pressed: {key.char}')
    except AttributeError:
        add_log_entry(f'Special key pressed: {key}')

start_logging()

mouse_listener = mouse.Listener(on_click=on_click, on_scroll=on_scroll)
mouse_listener.start()

keyboard_listener = keyboard.Listener(on_press=on_press)
keyboard_listener.start()

try:
    while True:
        pass
except KeyboardInterrupt:
    stop_logging()
    mouse_listener.stop()
    keyboard_listener.stop()
