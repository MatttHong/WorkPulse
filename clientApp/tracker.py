import pynput
import logging
from datetime import datetime

# Custom formatter to include microseconds
class MyFormatter(logging.Formatter):
    def formatTime(self, record, datefmt=None):
        if not datefmt:
            return super().formatTime(record, datefmt=datefmt)
        return datetime.fromtimestamp(record.created).astimezone().strftime(datefmt)

# Set up logging with the custom formatter
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

# 2. Modify the callbacks

# Mouse Listener
def on_move(x, y):
    movement_logger.info(f"Mouse moved to ({x}, {y})")


def on_click(x, y, button, pressed):
    if pressed:
        click_logger.info(f"Mouse clicked at ({x}, {y}) with button {button}")
    else:
        click_logger.info(f"Mouse released at ({x}, {y}) with button {button}")


def on_scroll(x, y, dx, dy):
    movement_logger.info(
        f"Mouse scrolled at ({x}, {y}) with delta ({dx}, {dy})")


mouse_listener = pynput.mouse.Listener(
    on_move=on_move,
    on_click=on_click,
    on_scroll=on_scroll
)

# Keyboard Listener


def on_key_press(key):
    try:
        keyboard_logger.info(f"Key {key.char} pressed")
    except AttributeError:
        keyboard_logger.info(f"Special key {key} pressed")


def on_key_release(key):
    keyboard_logger.info(f"Key {key} released")
    if key == pynput.keyboard.Key.esc:
        mouse_listener.stop()
        return False


keyboard_listener = pynput.keyboard.Listener(
    on_press=on_key_press,
    on_release=on_key_release
)

# Start listeners
with mouse_listener as m, keyboard_listener as k:
    m.join()
    k.join()