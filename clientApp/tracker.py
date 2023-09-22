import pynput
import logging

# 1. Set up logging

# Mouse Movements Logger
movement_logger = logging.getLogger('mouse_movement')
movement_logger.setLevel(logging.INFO)
file_handler = logging.FileHandler('mouse_movements.log')
movement_logger.addHandler(file_handler)

# Mouse Clicks Logger
click_logger = logging.getLogger('mouse_click')
click_logger.setLevel(logging.INFO)
file_handler = logging.FileHandler('mouse_clicks.log')
click_logger.addHandler(file_handler)

# Keyboard Logger
keyboard_logger = logging.getLogger('keyboard')
keyboard_logger.setLevel(logging.INFO)
file_handler = logging.FileHandler('keyboard_inputs.log')
keyboard_logger.addHandler(file_handler)


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
