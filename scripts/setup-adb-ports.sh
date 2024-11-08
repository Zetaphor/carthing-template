#!/usr/bin/env bash

set -eu

# Optional device ID as the only argument now
DEVICE_ID=""
if [ "$#" -ge 1 ]; then
    DEVICE_ID="$1"
fi

ADB_COMMAND="adb"
if [ ! -z "$DEVICE_ID" ]; then
    ADB_COMMAND="$ADB_COMMAND -s $DEVICE_ID"
fi

# Forward the Chrome remote debugging port
$ADB_COMMAND forward tcp:2222 tcp:2222

# Reverse the WebSocket port
$ADB_COMMAND reverse tcp:8800 tcp:8800

# Reverse the SOCKS5 proxy port
$ADB_COMMAND reverse tcp:1080 tcp:1080

# Reverse the time server port
$ADB_COMMAND reverse tcp:8037 tcp:8037
