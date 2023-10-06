import os
import logging
import socket
import pyautogui
from scapy.all import sniff, DNSQR, TCP, IP
from PIL import Image
import pytesseract
import time

# Initialize the dictionary to store IP: [domain, count(packets)] mapping
ip_domain_count_dict = {}

# Set up logging for DNS queries
dns_logger = logging.getLogger('dnsLogger')
dns_logger.setLevel(logging.INFO)
dns_handler = logging.FileHandler('dns_domains.log')
dns_handler.setFormatter(logging.Formatter('%(asctime)s - %(message)s'))
dns_logger.addHandler(dns_handler)

# Set up logging for HTTP/HTTPS connections
http_logger = logging.getLogger('httpLogger')
http_logger.setLevel(logging.INFO)
http_handler = logging.FileHandler('http_ips.log')
http_handler.setFormatter(logging.Formatter('%(asctime)s - %(message)s'))
http_logger.addHandler(http_handler)

# Detect the OS and apply OS-specific configurations
if os.name == 'nt':  # This checks if the OS is Windows.
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def ip_to_domain(ip_address):
    try:
        domain_name = socket.gethostbyaddr(ip_address)[0]
        return domain_name
    except socket.herror:
        # Return the original IP if reverse lookup fails
        return ip_address

def update_log_file():
    # Create a log entry for each IP in the dictionary and write to the log file
    with open('ip_domain_count.log', 'w') as f:
        for ip, (domain, count) in ip_domain_count_dict.items():
            f.write(f"{ip}: [{domain}, {count}]\n")

def process_packet(packet):
    try:
        # Check for DNS queries
        if packet.haslayer(DNSQR):
            domain = packet[DNSQR].qname.decode('utf-8')
            dns_logger.info(domain)
        
        # Check for HTTP/HTTPS connections
        if packet.haslayer(TCP) and (packet[TCP].dport == 80 or packet[TCP].dport == 443):
            ip = packet[IP].dst
            http_logger.info(ip)  # Log the IP directly
            domain_from_ip = ip_to_domain(ip)
            http_logger.info(domain_from_ip)

            # Update the IP: [domain, count(packets)] dictionary
            if ip in ip_domain_count_dict:
                _, count = ip_domain_count_dict[ip]
                count += 1
                ip_domain_count_dict[ip] = (domain_from_ip, count)
            else:
                ip_domain_count_dict[ip] = (domain_from_ip, 1)

    except Exception as e:
        print(f"Error processing packet: {e}")

# Sniff for both DNS queries and HTTP/HTTPS connections
sniff(prn=process_packet, filter="udp port 53 or tcp port 80 or tcp port 443", store=0)

# Periodically update the log file every 30 seconds
while True:
    update_log_file()
    time.sleep(30)
