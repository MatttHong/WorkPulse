import tkinter as tk
from tkinter import messagebox
from unittest import mock
from pynput import mouse, keyboard
import requests
from datetime import datetime
from unittest.mock import Mock
import threading
import time
import platform


# Set this to True when testing without a server
TESTING_WITHOUT_SERVER = False

global_bearer_token = None
USER_ID = None
LOG_ID = None
END = False

# Mock responses for testing
mock_post_response = Mock()
mock_post_response.ok = True
mock_post_response.json.return_value = {'id': 'test-log-id'}

mock_patch_response = Mock()
mock_patch_response.ok = True

mock_put_response = Mock()
mock_put_response.ok = True


# Replace with the actual base URL of your API
API_BASE_URL = 'http://20.81.211.176:3000/api/log'

# This will hold the log ID once logging has started

def get_bearer_token(url, username, password):
    global global_bearer_token
    global USER_ID

    # Replace these with the appropriate fields required by your API
    auth_data = {
        'email': username,
        'password': password
    }

    # Making a POST request to the API to get the token
    response = requests.post(url, json=auth_data)

    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()
        global_bearer_token = data.get("token")
        USER_ID = data.get("data").get("_id")
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
            # Replace 'your_auth_endpoint' with the actual endpoint URL
            get_bearer_token('http://20.81.211.176:3000/api/auth', username, password)
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
        self.track_duration = 2  # Duration of tracking in seconds
        self.tracking = False  # Flag to indicate if tracking is active
        self.active_timers = []
        self.has_been_stopped = False 

    def start_track_timers(self):
        current_time = datetime.now()
        for interval in self.track_intervals:
            delta_seconds = interval - current_time.second
            if delta_seconds < 0:
                delta_seconds += 60

            timer = threading.Timer(delta_seconds, self.start_mouse_tracking)
            self.active_timers.append(timer)
            timer.start()

            
    def stop_all_timers(self):
        for timer in self.active_timers:
            timer.cancel()  # Cancel each timer
        self.active_timers.clear()

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
        global END
        """Handle mouse movement event."""
        if END:
            return 
        if not END and self.logged_in:  # Only track movements if logged in and tracking is active
            self.add_log_entry(f'Mouse moved to position ({x}, {y})')

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
        global LOG_ID, END

        # Stop all active timers
        self.stop_all_timers()

        # Stop the mouse listener
        if self.mouse_listener.is_alive():
            self.mouse_listener.stop()

        # Stop the keyboard listener if it's running
        if self.keyboard_listener.running:
            self.keyboard_listener.stop()

        # Reset the tracking
        #  flag
        self.tracking = False
        END = True
        # Reset logged in state and update UI elements
        self.logged_in = False
        self.update_login_state()
        messagebox.showinfo("Logout", "You have been logged out.")

        # If a logging session is active, stop it
        if LOG_ID:
            self.stop_logging()  # This will handle the API call to stop logging

        LOG_ID = None


    def start_logging(self):
        global LOG_ID, END
        url = f'{API_BASE_URL}'
        log_data = {
            'employee': USER_ID
        }
        headers = {
            'Authorization': f'Bearer {global_bearer_token}'
        }
        try:
            response = requests.post(url, json=log_data, headers=headers)
            response.raise_for_status()
            data = response.json()
            LOG_ID = data.get('log', {}).get('_id')           
            print(f'Logging started with ID: {LOG_ID}')
            self.start_button['state'] = tk.DISABLED
            self.stop_button['state'] = tk.NORMAL

            if self.has_been_stopped:
                self.reinitialize_listeners_and_timers()
                self.has_been_stopped = False  # Reset the flag for future operations
                END = False

            # Start the mouse listener if it's not already running
            if not self.mouse_listener.is_alive():
                self.mouse_listener.start()
            
            

            # Start tracking timers
            self.start_track_timers()

            # Uncomment the following line if you want to start the keyboard listener
            if platform.system() == 'Darwin':
    # This code will run if the operating system is macOS
                print("keyboard architecture not compatible")


            else:
                # This code will run if the operating system is not macOS
                print("Not running on macOS")
                self.keyboard_listener.start()
        except requests.exceptions.RequestException as e:
            print(f'Failed to start logging: {e}')

    def reinitialize_listeners_and_timers(self):
        # Re-create mouse and keyboard listeners
        self.mouse_listener = mouse.Listener(on_click=self.on_click, on_scroll=self.on_scroll, on_move=self.on_move)
        self.keyboard_listener = keyboard.Listener(on_press=self.on_press)

        # Clear any existing timers
        self.stop_all_timers()  # Assuming you have a method to stop all active timers

        # Reset and start the timers
        self.start_track_timers()
        
    def stop_all_timers(self):
        for timer in self.active_timers:
            timer.cancel()
        self.active_timers.clear()

    def stop_logging(self):
        global LOG_ID, END
        self.has_been_stopped = True

        # Stop all active timers
        self.stop_all_timers()

        # Stop the mouse listener
        if self.mouse_listener.is_alive():
            self.mouse_listener.stop()

        # Stop the keyboard listener if it's running
        if self.keyboard_listener.running:
            self.keyboard_listener.stop()

        # Reset the tracking flag
        self.tracking = False
        END = True
        if LOG_ID:
            url = f'{API_BASE_URL}/{LOG_ID}/end'
            headers = {
                'Authorization': f'Bearer {global_bearer_token}'
            }
            try:
                response = requests.patch(url, headers=headers)
                response.raise_for_status()
                print('Logging stopped successfully')
                self.start_button['state'] = tk.NORMAL
                self.stop_button['state'] = tk.DISABLED


            except requests.exceptions.RequestException as e:
                print(f'Failed to stop logging: {e}')


    def add_log_entry(self, action, x=None, y=None, timestamp=None):
        if not self.logged_in or not LOG_ID:
            return 
        if timestamp is None:
            timestamp = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]

        entry = {
            'log': [action, timestamp, x, y]
        }
        url = f'{API_BASE_URL}/{LOG_ID}/entry'
        headers = {
            'Authorization': f'Bearer {global_bearer_token}'
        }
        try:
            response = requests.put(url, json=entry, headers=headers)
            response.raise_for_status()
            print('Log entry added successfully:', entry)
        except requests.exceptions.RequestException as e:
            print(f'Failed to add log entry: {e}')

    def on_click(self, x, y, button, pressed):
        if END:
            return 
        if not END:
            if pressed:
                self.add_log_entry(f'Mouse clicked with {button}', x, y)

    def on_scroll(self, x, y, dx, dy):
        if END:
            return
        if not END:
            self.add_log_entry(f'Mouse scrolled with delta ({dx}, {dy})', x, y)

    def on_press(self, key):
        if END:
            return 
        try:
            key_name = key.char  # Get the character of the key pressed
        except AttributeError:
            key_name = str(key)  # For special keys, convert to string

        timestamp = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]
        self.add_log_entry(f'Key pressed: {key_name}', timestamp=timestamp)
# Create and run the GUI
app = LoggingApp()
app.mainloop()