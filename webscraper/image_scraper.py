import os
import pyautogui
from PIL import Image
import pytesseract
import time

# Detect the OS and apply OS-specific configurations
if os.name == 'nt':  # This checks if the OS is Windows.
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def capture_and_log():
    screenshot = pyautogui.screenshot()
    text = pytesseract.image_to_string(screenshot)
    # Filtering lines that contain ".com"
    domains = [line for line in text.split('\n') if '.com' in line]
    # Writing filtered lines to a log file
    with open('domains_log.txt', 'a') as f:
        for domain in domains:
            f.write(domain + '\n')

for _ in range(10):  # Run 10 times
    print("a")
    capture_and_log()
    time.sleep(5)  # Wait for 5 seconds before the next iteration
