#!/usr/bin/env bash

set -eu

# Hardcode the Vue directory relative to this script's location
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR="$SCRIPT_DIR/app"

# Optional device ID as the only argument now
DEVICE_ID=""
if [ "$#" -ge 1 ]; then
    DEVICE_ID="$1"
fi

ADB_COMMAND="adb"
if [ ! -z "$DEVICE_ID" ]; then
    ADB_COMMAND="$ADB_COMMAND -s $DEVICE_ID"
fi

pushd $APP_DIR
deno task build
popd

$ADB_COMMAND shell 'mountpoint /usr/share/qt-superbird-app/webapp/ > /dev/null && umount /usr/share/qt-superbird-app/webapp'
$ADB_COMMAND shell 'rm -rf /tmp/webapp'
$ADB_COMMAND push "$APP_DIR/static" /tmp/webapp
$ADB_COMMAND shell 'mount --bind /tmp/webapp /usr/share/qt-superbird-app/webapp'
$ADB_COMMAND shell 'supervisorctl restart superbird'
$ADB_COMMAND shell 'supervisorctl restart chromium'

$SCRIPT_DIR/setup-adb-ports.sh $DEVICE_ID
