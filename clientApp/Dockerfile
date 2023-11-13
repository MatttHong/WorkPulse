# Use Python 3.8 Slim as the base image
FROM python:3.8-slim

# Install dependencies required for Xvfb and your application
RUN apt-get update && apt-get install -y \
    gcc \
    libc6-dev \
    libx11-dev \
    tk \
    xvfb

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the application source code to the container
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the start script to the container
COPY start.sh /usr/src/app

# Make the start script executable
RUN chmod +x /usr/src/app/start.sh

# Set the start script as the entry point
ENTRYPOINT ["/usr/src/app/start.sh"]
