import logging
from scapy.all import sniff, DNSQR, TCP, IP
import socket

def ip_to_domain(ip_address):
    try:
        domain_name = socket.gethostbyaddr(ip_address)[0]
        return domain_name
    except socket.herror:
        # Return the original IP if reverse lookup fails
        return ip_address
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

    except Exception as e:
        print(f"Error processing packet: {e}")

# Sniff for both DNS queries and HTTP/HTTPS connections
sniff(prn=process_packet, filter="udp port 53 or tcp port 80 or tcp port 443", store=0)
