import sys
import requests
import pynput
import logging
from datetime import datetime
from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton, QVBoxLayout, QWidget

# Custom formatter class
class MyFormatter(logging.Formatter):
    def formatTime(self, record, datefmt=None):
        if not datefmt:
            return super().formatTime(record, datefmt=datefmt)
        return datetime.fromtimestamp(record.created).astimezone().strftime(datefmt)

# Set up logging with the custom formatter
def setup_logging():
    formatter = MyFormatter('%(asctime)s: %(message)s', datefmt='%Y-%m-%d %H:%M:%S.%f %Z')

    # Mouse Movements Logger
    movement_logger = logging.getLogger('mouse_movement')
    movement_logger.setLevel(logging.INFO)
    file_handler_movement = logging.FileHandler('mouse_movements.log')
    file_handler_movement.setFormatter(formatter)
    movement_logger.addHandler(file_handler_movement)

    # Mouse Clicks Logger
    click_logger = logging.getLogger('mouse_click')
    click_logger.setLevel(logging.INFO)
    file_handler_click = logging.FileHandler('mouse_clicks.log')
    file_handler_click.setFormatter(formatter)
    click_logger.addHandler(file_handler_click)

    # Keyboard Logger
    keyboard_logger = logging.getLogger('keyboard')
    keyboard_logger.setLevel(logging.INFO)
    file_handler_keyboard = logging.FileHandler('keyboard_inputs.log')
    file_handler_keyboard.setFormatter(formatter)
    keyboard_logger.addHandler(file_handler_keyboard)

    return movement_logger, click_logger, keyboard_logger

# PyQt5 UI Class
class LoggerUI(QMainWindow):
    def __init__(self):
        super().__init__()
        self.current_log_id = None  # This will store the ID of the current log
        self.movement_logger, self.click_logger, self.keyboard_logger = setup_logging()
        self.init_ui()

    def init_ui(self):
        self.setWindowTitle('Tracker App')
        self.setGeometry(100, 100, 200, 100)

        layout = QVBoxLayout()

        self.start_button = QPushButton('Start Logging')
        self.start_button.clicked.connect(self.start_logging)
        layout.addWidget(self.start_button)

        self.stop_button = QPushButton('Stop Logging')
        self.stop_button.clicked.connect(self.stop_logging)
        self.stop_button.setEnabled(False)
        layout.addWidget(self.stop_button)

        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

    def start_logging(self):
        # Add your API URL here
        api_url = 'http://localhost:3000/logs'
        log_data = {
            'employee': '654467918111a89f6cdd9546',  # Replace with the actual employee ID
            'task': 'Start of logging session',
            'department': 'Department Name',
            'project': 'Project Name',
            'status': 'In Progress',
            'log': 'Log session started'
        }
        response = requests.post(api_url, json=log_data)
        if response.status_code == 201:
            self.current_log_id = response.json()['log']['_id']
            self.start_button.setEnabled(False)
            self.stop_button.setEnabled(True)
            # Start listeners
            self.mouse_listener = pynput.mouse.Listener(on_move=self.on_move, on_click=self.on_click, on_scroll=self.on_scroll)
            self.keyboard_listener = pynput.keyboard.Listener(on_press=self.on_key_press, on_release=self.on_key_release)
            self.mouse_listener.start()
            self.keyboard_listener.start()
        else:
            print("Failed to start log session:", response.text)

    def stop_logging(self):
        if self.current_log_id:
            # Add your API URL here
            api_url = f'http://localhost:3000/logs/{self.current_log_id}/end'
            response = requests.patch(api_url)
            if response.status_code == 200:
                print("Log session ended successfully.")
                self.current_log_id = None
            else:
                print("Failed to end log session:", response.text)
        self.start_button.setEnabled(True)
        self.stop_button.setEnabled(False)
        # Stop listeners
        if hasattr(self, 'mouse_listener'):
            self.mouse_listener.stop()
        if hasattr(self, 'keyboard_listener'):
            self.keyboard_listener.stop()

    def add_log_entry(self):
        if self.current_log_id:
            # Add your API URL here
            api_url = f'http://localhost:3000/logs/{self.current_log_id}/entry'
            log_entry_data = {
                'log': 'Periodic log entry'  # Replace with actual log entry content
            }
            response = requests.put(api_url, json=log_entry_data)
            if response.status_code == 200:
                print("Log entry added successfully.")
            else:
                print("Failed to add log entry:", response.text)

    # Mouse and keyboard event handlers
    def on_move(self, x, y):
        self.movement_logger.info(f"Mouse moved to ({x}, {y})")

    def on_click(self, x, y, button, pressed):
        if pressed:
            self.click_logger.info(f"Mouse clicked at ({x}, {y}) with {button}")
        else:
            self.click_logger.info(f"Mouse released at ({x}, {y}) with {button}")

    def on_scroll(self, x, y, dx, dy):
        self.movement_logger.info(f"Mouse scrolled at ({x}, {y}) by {dx}, {dy}")

    def on_key_press(self, key):
        try:
            self.keyboard_logger.info(f"Key {key.char} pressed")
        except AttributeError:
            self.keyboard_logger.info(f"Special key {key} pressed")

    def on_key_release(self, key):
        self.keyboard_logger.info(f"Key {key} released")
        if key == pynput.keyboard.Key.esc:
            # Stop the log session if the escape key is pressed
            self.stop_logging()

# PyQt5 Application Execution
if __name__ == '__main__':
    app = QApplication(sys.argv)
    logger_ui = LoggerUI()
    logger_ui.show()
    sys.exit(app.exec_())
