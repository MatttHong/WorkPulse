import logging
from scapy.all import sniff, DNSQR

# Set up logging
logging.basicConfig(filename='domains.log', level=logging.INFO, format='%(asctime)s - %(message)s')

def process_packet(packet):
    if packet.haslayer(DNSQR):
        domain = packet[DNSQR].qname.decode('utf-8')
        logging.info(domain)  # Log the domain to domains.log

sniff(prn=process_packet, filter="udp port 53", store=0)
