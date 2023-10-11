import os
import pyautogui
import pytesseract
import time

# Detect the OS and apply OS-specific configurations
if os.name == 'nt':  # This checks if the OS is Windows.
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def capture_and_log():
    # Capture the screenshot using pyautogui
    screenshot = pyautogui.screenshot()
    # Convert the screenshot to bytes
    screenshot_bytes = screenshot.tobytes()
    # Use pytesseract to extract text from the bytes
    text = pytesseract.image_to_string(screenshot_bytes)
    # Filtering lines that contain ".com"
    domains = [line for line in text.split('\n') if '.com' in line]
    # Writing filtered lines to a log file
    with open('domains_log.txt', 'a') as f:
        for domain in domains:
            print(domain)
            f.write(domain + '\n')

for _ in range(10):  # Run 10 times
    print("a")
    capture_and_log()
    time.sleep(5)  # Wait for 5 seconds before the next iteration
