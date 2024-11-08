#!/bin/bash

# Check if device ID is provided
if [ -z "$1" ]; then
    echo "Error: Device ID not provided"
    echo "Usage: $0 <device_id>"
    exit 1
fi

DEVICE_ID="$1"
SCRIPT_DIR="$(dirname "$0")"
PROXY_SCRIPT="$SCRIPT_DIR/on-device-proxy.sh"

# Check if on-device-proxy.sh exists
if [ ! -f "$PROXY_SCRIPT" ]; then
    echo "Error: on-device-proxy.sh not found at $PROXY_SCRIPT"
    exit 1
fi

# Function to run ADB commands with device ID
run_adb() {
    adb -s "$DEVICE_ID" $@
    if [ $? -ne 0 ]; then
        echo "Error: ADB command failed: adb -s $DEVICE_ID $@"
        exit 1
    fi
}

echo "Setting up proxy for device: $DEVICE_ID"

# Remount filesystem as writable
echo "Remounting filesystem..."
run_adb shell mount -o remount,rw /

# Upload and setup proxy script
echo "Uploading proxy script..."
run_adb push "$PROXY_SCRIPT" /tmp/on-device-proxy.sh
run_adb shell chmod +x /tmp/on-device-proxy.sh
run_adb shell mv /tmp/on-device-proxy.sh /etc/on-device-proxy.sh

# Create supervisor config
echo "Creating supervisor config..."
cat > /tmp/proxy.conf << EOL
[program:setupProxy]
command=/etc/on-device-proxy.sh
autostart=true
autorestart=true
stderr_logfile=/var/log/setup-proxy.err.log
stdout_logfile=/var/log/setup-proxy.out.log
user=root
EOL

# Upload supervisor config
echo "Uploading supervisor config..."
run_adb push /tmp/proxy.conf /etc/supervisor.d/setup-proxy.conf
rm /tmp/proxy.conf

# Update supervisor
echo "Updating supervisor..."
run_adb shell supervisorctl reread
run_adb shell supervisorctl update
run_adb shell supervisorctl start setupProxy

echo "Proxy setup completed successfully"