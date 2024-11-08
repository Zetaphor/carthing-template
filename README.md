# Spotify CarThing Development Kit 🚗

A modern development template for creating custom applications for the Spotify CarThing device, featuring both client and server components.

## ✨ Features

- **TypeScript & SCSS Support**: Built-in support for TypeScript and SCSS, compiled using Deno
- **WebSocket Integration**: Built-in WebSocket server for real-time communication
- **SOCKS Proxy**: Integrated SOCKS proxy server for internet connectivity
- **Easy Development**: Includes scripts for quick deployment and testing

## 🚀 Getting Started

1. Clone this repository
2. Run the included setup scripts:
   - `update-time.sh` - Ensures correct device time for HTTPS requests
   - `setup-adb-ports.sh` - Configures required ADB port forwarding
   - `push-app.sh` - Builds and deploys your app to the CarThing
3. Follow the instructions in `NOTES.md` to setup the device proxy and allow internet access

## 📦 What's Included

- **Client Application**: Based on [`superbird-custom-webapp`](https://github.com/pajowu/superbird-custom-webapp/tree/main/example_webapp) project
- **Server Component**: A Deno-based server with WebSocket and SOCKS5 proxy support
- **Utility Scripts**:
  - Device proxy setup scripts (modified from [DeskThing](https://github.com/ItsRiprod/DeskThing))
  - Port forwarding configuration
  - Build and deployment tools

## 🛠️ Development

The template includes everything needed to start developing your own CarThing applications:

- Example WebSocket communication implementation
- Built-in proxy support for internet access
- Chrome Remote Debugging capability
- Automated build and deployment process

## 💻 System Requirements

This template has been developed and tested on Linux systems. While it may work on macOS with minor modifications, Linux is recommended for the best development experience.

## 🤝 Credits

This project builds upon:
- [`superbird-custom-webapp`](https://github.com/pajowu/superbird-custom-webapp/tree/main/example_webapp)
- [DeskThing](https://github.com/ItsRiprod/DeskThing)

## 📄 License

[MIT License](LICENSE)

### 🤖 Built with Claude

Most of this codebase and the entirety of this README was written by Claude Sonnet 3.5.
