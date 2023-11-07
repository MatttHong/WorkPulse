import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton, QVBoxLayout, QWidget
import pynput
import logging
from datetime import datetime

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

# Define the callback functions
def on_move(x, y):
    movement_logger.info(f"Mouse moved to ({x}, {y})")

def on_click(x, y, button, pressed):
    if pressed:
        click_logger.info(f"Mouse clicked at ({x}, {y}) with button {button}")
    else:
        click_logger.info(f"Mouse released at ({x}, {y}) with button {button}")

def on_scroll(x, y, dx, dy):
    movement_logger.info(f"Mouse scrolled at ({x}, {y}) with delta ({dx}, {dy})")

def on_key_press(key):
    try:
        keyboard_logger.info(f"Key {key.char} pressed")
    except AttributeError:
        keyboard_logger.info(f"Special key {key} pressed")

def on_key_release(key):
    keyboard_logger.info(f"Key {key} released")
    if key == pynput.keyboard.Key.esc:
        # To ensure proper GUI functionality, we'll handle listener stop in the UI class.
        pass

# PyQt5 UI Class
class LoggerUI(QMainWindow):
    def __init__(self):
        super().__init__()
        self.mouse_listener = pynput.mouse.Listener(
            on_move=on_move,
            on_click=on_click,
            on_scroll=on_scroll
        )
        self.keyboard_listener = pynput.keyboard.Listener(
            on_press=on_key_press,
            on_release=on_key_release
        )
        self.init_ui()

    def init_ui(self):
        self.setWindowTitle('Log Collector')
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
        self.start_button.setEnabled(False)
        self.stop_button.setEnabled(True)
        self.mouse_listener.start()
        # self.keyboard_listener.start()

    def stop_logging(self):
        self.start_button.setEnabled(True)
        self.stop_button.setEnabled(False)
        if self.mouse_listener is not None:
            self.mouse_listener.stop()
        if self.keyboard_listener is not None:
            self.keyboard_listener.stop()

# PyQt5 Application Execution
if __name__ == '__main__':
    app = QApplication(sys.argv)
    movement_logger, click_logger, keyboard_logger = setup_logging()
    logger_ui = LoggerUI()
    logger_ui.show()
    sys.exit(app.exec_())