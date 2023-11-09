from pynput import mouse, keyboard
import requests
from datetime import datetime


# Replace with the actual base URL of your API
API_BASE_URL = 'http://localhost:3000/api/log'

# Replace with the actual log ID you receive after starting a logging session
LOG_ID = 'your-log-id-here'

# This function will send a POST request to start logging
def start_logging():
    url = f'{API_BASE_URL}'
    log_data = {
        'employee': '654467918111a89f6cdd9546'
        }
    response = requests.post(url, json=log_data)
    if response.ok:
        global LOG_ID
        LOG_ID = response.json().get('id')  # Assuming the response contains the log ID
        print(f'Logging started with ID: {LOG_ID}')
    else:
        print('Failed to start logging')

# This function will send a PATCH request to stop logging
def stop_logging():
    url = f'{API_BASE_URL}/{LOG_ID}/end'
    response = requests.patch(url)
    if response.ok:
        print('Logging stopped successfully')
    else:
        print('Failed to stop logging')

def add_log_entry(action, x=None, y=None):
    # Get the current date and time with milliseconds
    timestamp = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]  # Truncate microseconds to milliseconds
    entry = {
        'action': action,
        'timestamp': timestamp,
        'x': x,
        'y': y
    }
    url = f'{API_BASE_URL}/{LOG_ID}/entry'
    response = requests.put(url, json=entry)
    if response.ok:
        print('Log entry added successfully:', entry)
    else:
        print('Failed to add log entry:', entry)


# This function will be called when a mouse click event occurs
def on_click(x, y, button, pressed):
    if pressed:
        add_log_entry(f'Mouse clicked with {button}', x, y)

# This function will be called when a mouse scroll event occurs
def on_scroll(x, y, dx, dy):
    add_log_entry(f'Mouse scrolled with delta ({dx}, {dy})', x, y)

# This function will be called when a keyboard event occurs
def on_press(key):
    try:
        add_log_entry(f'Key pressed: {key.char}')
    except AttributeError:
        add_log_entry(f'Special key pressed: {key}')

# Start logging when the script runs
start_logging()

# Start the mouse listener in a non-blocking fashion
mouse_listener = mouse.Listener(on_click=on_click, on_scroll=on_scroll)
mouse_listener.start()

# Start the keyboard listener in a non-blocking fashion
keyboard_listener = keyboard.Listener(on_press=on_press)
keyboard_listener.start()

# Keep the script running
try:
    while True:
        pass
except KeyboardInterrupt:
    # Stop logging when you press Ctrl+C
    stop_logging()
    mouse_listener.stop()
    keyboard_listener.stop()
