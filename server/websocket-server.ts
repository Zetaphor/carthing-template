export class WebSocketServer {
  private connections = new Set<WebSocket>();
  private port: number;
  private isRunning = false;

  constructor(port: number) {
    this.port = port;
  }

  async start() {
    this.isRunning = true;
    console.log(`WebSocket server listening on ws://127.0.0.1:${this.port}`);

    await Deno.serve({ port: this.port }, (request) => {
      if (request.headers.get("upgrade") !== "websocket") {
        return new Response("WebSocket connections only", { status: 400 });
      }

      const { socket: ws, response } = Deno.upgradeWebSocket(request);

      this.connections.add(ws);
      console.log("New client connected");

      ws.onmessage = (event) => {
        console.log(`Received message: ${event.data}`);
        this.connections.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(event.data);
          }
        });
      };

      ws.onclose = () => {
        console.log("Client disconnected");
        this.connections.delete(ws);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.connections.delete(ws);
      };

      return response;
    });
  }

  stop() {
    console.log("Stopping WebSocket server...");
    this.isRunning = false;
    this.connections.forEach(ws => ws.close());
    this.connections.clear();
  }
}

// For standalone testing
if (import.meta.main) {
  const server = new WebSocketServer(8800);
  Deno.addSignalListener("SIGINT", () => {
    console.log("Shutting down...");
    server.stop();
    Deno.exit();
  });
  await server.start();
}
