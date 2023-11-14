import tkinter as tk
from tkinter import messagebox
from unittest import mock
from pynput import mouse, keyboard
import requests
from datetime import datetime
from unittest.mock import Mock
import threading
import time

# Set this to True when testing without a server
TESTING_WITHOUT_SERVER = True

# Mock responses for testing
mock_post_response = Mock()
mock_post_response.ok = True
mock_post_response.json.return_value = {'id': 'test-log-id'}

mock_patch_response = Mock()
mock_patch_response.ok = True

mock_put_response = Mock()
mock_put_response.ok = True

# Mock functions to replace 'requests' methods
# Define a mock bearer token for testing purposes
MOCK_BEARER_TOKEN = 'mock_token'

def check_bearer_token(headers):
    """Function to check if the correct bearer token is provided in the headers."""
    auth_header = headers.get('Authorization', '')
    return auth_header == f'Bearer {MOCK_BEARER_TOKEN}'

def mock_post(url, json, headers=None):
    if headers is None or not check_bearer_token(headers):
        raise requests.exceptions.HTTPError("Unauthorized: No valid token provided", response=mock.Mock(status=401))
    print(f"Mock POST request to {url} with {json}")
    return mock_post_response

def mock_patch(url, headers=None):
    if headers is None or not check_bearer_token(headers):
        raise requests.exceptions.HTTPError("Unauthorized: No valid token provided", response=mock.Mock(status=401))
    print(f"Mock PATCH request to {url}")
    return mock_patch_response

def mock_put(url, json, headers=None):
    if headers is None or not check_bearer_token(headers):
        raise requests.exceptions.HTTPError("Unauthorized: No valid token provided", response=mock.Mock(status=401))
    print(f"Mock PUT request to {url} with {json}")
    return mock_put_response


# Replace 'requests' methods with mocks if testing without server
if TESTING_WITHOUT_SERVER:
    requests.post = mock_post
    requests.patch = mock_patch
    requests.put = mock_put

# Replace with the actual base URL of your API
API_BASE_URL = 'http://localhost:3000/api/log'

# This will hold the log ID once logging has started
LOG_ID = None

def get_bearer_token(url, username, password):
    # Replace these with the appropriate fields required by your API
    auth_data = {
        'email': username,
        'password': password
    }

    # Making a POST request to the API to get the token
    response = requests.post(url, json=auth_data)

    # Check if the request was successful
    if response.status_code == 200:
        # Extract the token from the response
        token = response.json().get('access_token')
        return token
    else:
        # Handle errors
        error_message = response.json().get('message', 'Failed to retrieve token')
        raise Exception(f"{error_message}, status code: {response.status_code}")


class LoginPage(tk.Toplevel):
    def __init__(self, parent):
        super().__init__(parent)
        self.title('Login')
        self.geometry('300x150')
        self.parent = parent

        tk.Label(self, text='Username:').pack()
        self.username_entry = tk.Entry(self)
        self.username_entry.pack()
        self.username_entry.focus()

        tk.Label(self, text='Password:').pack()
        self.password_entry = tk.Entry(self, show='*')
        self.password_entry.pack()

        self.login_button = tk.Button(self, text='Login', command=self.login)
        self.login_button.pack(pady=10)

        self.bind('<Return>', lambda event: self.login())

    def login(self):
        username = self.username_entry.get()
        password = self.password_entry.get()
        try:
            self.parent.bearer_token = get_bearer_token('token_url', username, password)
            self.parent.logged_in = True
            self.parent.update_login_state()
            self.destroy()
        except Exception as e:
            messagebox.showerror("Login Failed", str(e))

class LoggingApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title('Logging Control Panel')
        self.geometry('300x200')
        self.logged_in = False

        self.login_page = LoginPage(self)

        self.start_button = tk.Button(self, text='Start Logging', command=self.start_logging, state=tk.DISABLED)
        self.start_button.pack(pady=10)

        self.stop_button = tk.Button(self, text='Stop Logging', command=self.stop_logging, state=tk.DISABLED)
        self.stop_button.pack(pady=10)

        self.logout_button = tk.Button(self, text='Logout', command=self.logout, state=tk.DISABLED)
        self.logout_button.pack(pady=10)

        # Set up listeners
        self.mouse_listener = mouse.Listener(on_click=self.on_click, on_scroll=self.on_scroll)
        self.keyboard_listener = keyboard.Listener(on_press=self.on_press)

        self.track_intervals = [10, 30, 50]  # Seconds after the minute to start tracking
        self.track_duration = 5  # Duration of tracking in seconds
        self.tracking = False  # Flag to indicate if tracking is active

    def start_track_timers(self):
        """Start timers to trigger mouse movement tracking."""
        current_time = datetime.now()
        for interval in self.track_intervals:
            # Calculate the time until the next interval
            delta_seconds = interval - current_time.second
            if delta_seconds < 0:
                delta_seconds += 60
            # Set a timer to start tracking
            threading.Timer(delta_seconds, self.start_mouse_tracking).start()

    def start_mouse_tracking(self):
        """Start tracking mouse movement for a set duration."""
        if not self.tracking:
            self.tracking = True
            self.mouse_listener = mouse.Listener(on_move=self.on_move)
            self.mouse_listener.start()
            # Set a timer to stop tracking after the duration
            threading.Timer(self.track_duration, self.stop_mouse_tracking).start()

    def stop_mouse_tracking(self):
        """Stop tracking mouse movement."""
        if self.tracking:
                if self.mouse_listener.is_alive():
                    self.mouse_listener.stop()
                self.tracking = False
                # Restart the tracking timers for the next minute
                self.start_track_timers()

    def on_move(self, x, y):
        """Handle mouse movement event."""
        if self.tracking and self.logged_in:  # Only track movements if logged in and tracking is active
            timestamp = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]
            self.add_log_entry(f'Mouse moved at {timestamp} to position ({x}, {y})')
            print()

    def update_login_state(self):
        if self.logged_in:
            self.start_button['state'] = tk.NORMAL
            self.logout_button['state'] = tk.NORMAL
        else:
            self.start_button['state'] = tk.DISABLED
            self.stop_button['state'] = tk.DISABLED
            self.logout_button['state'] = tk.DISABLED
            self.login_page = LoginPage(self)
    def logout(self):
        global LOG_ID
        self.logged_in = False
        self.update_login_state()
        messagebox.showinfo("Logout", "You have been logged out.")

        # Stop the mouse listener
        if self.mouse_listener.is_alive():
            self.mouse_listener.stop()

        # Stop the keyboard listener if it's running
        if self.keyboard_listener.running:
            self.keyboard_listener.stop()

        # Reset the tracking flag
        self.tracking = False

        # If a logging session is active, stop it
        if LOG_ID:
            self.stop_logging()

    def start_logging(self):
        global LOG_ID
        url = f'{API_BASE_URL}'
        log_data = {
            'employee': '654467918111a89f6cdd9546'
        }
        headers = {
            'Authorization': f'Bearer {self.bearer_token}'
        }
        try:
            response = requests.post(url, json=log_data, headers=headers)
            response.raise_for_status()
            LOG_ID = response.body._id
            print(f'Logging started with ID: {LOG_ID}')
            self.start_button['state'] = tk.DISABLED
            self.stop_button['state'] = tk.NORMAL

            # Start the mouse listener if it's not already running
            if not self.mouse_listener.is_alive():
                self.mouse_listener.start()

            # Start tracking timers
            self.start_track_timers()

            # Uncomment the following line if you want to start the keyboard listener
            # self.keyboard_listener.start()
        except requests.exceptions.RequestException as e:
            print(f'Failed to start logging: {e}')

    def stop_logging(self):
        global LOG_ID
        if LOG_ID:
            url = f'{API_BASE_URL}/{LOG_ID}/end'
            headers = {
                'Authorization': f'Bearer {self.bearer_token}'
            }
            try:
                response = requests.patch(url, headers=headers)
                response.raise_for_status()
                print('Logging stopped successfully')
                self.start_button['state'] = tk.NORMAL
                self.stop_button['state'] = tk.DISABLED

                # Stop the mouse listener
                if self.mouse_listener.is_alive():
                    self.mouse_listener.stop()

                # Stop the keyboard listener if it's running
                if self.keyboard_listener.running:
                    self.keyboard_listener.stop()

                # Reset the tracking flag
                self.tracking = False

                LOG_ID = None
            except requests.exceptions.RequestException as e:
                print(f'Failed to stop logging: {e}')

        # Reset the mouse listener
        self.mouse_listener = mouse.Listener(on_click=self.on_click, on_scroll=self.on_scroll)

    def add_log_entry(self, action, x=None, y=None):
        global LOG_ID
        if LOG_ID:
            timestamp = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]
            entry = {
                'action': action,
                'timestamp': timestamp,
                'x': x,
                'y': y
            }
            url = f'{API_BASE_URL}/{LOG_ID}/entry'
            headers = {
                'Authorization': f'Bearer {self.bearer_token}'
            }
            try:
                response = requests.put(url, json=entry, headers=headers)
                response.raise_for_status()
                print('Log entry added successfully:', entry)
            except requests.exceptions.RequestException as e:
                print(f'Failed to add log entry: {e}')

    def on_click(self, x, y, button, pressed):
        if pressed:
            self.add_log_entry(f'Mouse clicked with {button}', x, y)

    def on_scroll(self, x, y, dx, dy):
        self.add_log_entry(f'Mouse scrolled with delta ({dx}, {dy})', x, y)

    def on_press(self, key):
        try:
            self.add_log_entry(f'Key pressed: {key.char}')
        except AttributeError:
            self.add_log_entry(f'Special key pressed: {key}')

# Create and run the GUI
app = LoggingApp()
app.mainloop()
