# Spotify CarThing App/Server Template

This is a template for a Spotify CarThing app/server. The client application is based on the [`superbird-custom-webapp`](https://github.com/pajowu/superbird-custom-webapp/tree/main/example_webapp) project, but with the addition of Typescript and SCSS support compiled with Deno.

The server is a simple Deno application that integrates a WebSocket server and a SOCKS proxy server.

The webapp contains a basic example of communicating with the websocket server.

By following the documentation in `NOTES.md` you can set the system and Chromium browser to use the proxy server giving you internet access. Make sure to run the `update-time.sh` script to set the correct time on your device otherwise HTTPS requests will fail.

You will need to forward/reverse the ports using ADB so that the carthing can communicate with the server. The `setup-adb-ports.sh` script will setup the required ports for SSH, SOCKS, HTTP/Websocket, and Chrome Remote Debugging.

The `push-app.sh` script will build the app, push it to the carthing, setup the on-device HTTP/Websocket proxy, restart Chromium, and setup the adb ports.

The `on-device-proxy.sh` script and `install-proxy.sh` scripts are both modified versions from [DeskThing](https://github.com/ItsRiprod/DeskThing).

This script was developed and tested on Linux, it may work on MacOS with slight modifications.