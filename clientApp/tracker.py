import tkinter as tk
from tkinter import messagebox
from pynput import mouse, keyboard
import requests
from datetime import datetime
from unittest.mock import Mock

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
def mock_post(url, json):
    print(f"Mock POST request to {url} with {json}")
    return mock_post_response

def mock_patch(url):
    print(f"Mock PATCH request to {url}")
    return mock_patch_response

def mock_put(url, json):
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
        if username == "admin" and password == "password":  # Replace with actual validation
            self.parent.logged_in = True
            self.parent.update_login_state()
            self.destroy()
        else:
            messagebox.showerror("Login Failed", "The username or password is incorrect.")

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
        self.logged_in = False
        self.update_login_state()
        messagebox.showinfo("Logout", "You have been logged out.")
    def start_logging(self):
        global LOG_ID
        url = f'{API_BASE_URL}'
        log_data = {
            'employee': '654467918111a89f6cdd9546'
        }
        try:
            response = requests.post(url, json=log_data)
            response.raise_for_status()
            LOG_ID = response.json().get('id')
            print(f'Logging started with ID: {LOG_ID}')
            self.start_button['state'] = tk.DISABLED
            self.stop_button['state'] = tk.NORMAL
            self.mouse_listener.start()
            # self.keyboard_listener.start()
        except requests.exceptions.RequestException as e:
            print(f'Failed to start logging: {e}')

    def stop_logging(self):
        global LOG_ID
        if LOG_ID:
            url = f'{API_BASE_URL}/{LOG_ID}/end'
            try:
                response = requests.patch(url)
                response.raise_for_status()
                print('Logging stopped successfully')
                self.start_button['state'] = tk.NORMAL
                self.stop_button['state'] = tk.DISABLED
                self.mouse_listener.stop()
                self.keyboard_listener.stop()
                LOG_ID = None
            except requests.exceptions.RequestException as e:
                print(f'Failed to stop logging: {e}')

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
            try:
                response = requests.put(url, json=entry)
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
