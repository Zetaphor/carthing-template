const HOST = "127.0.0.1";
const PORT = 1080;

// Add export keyword to make the class available for importing
export class SOCKS5Server {
  private server: Deno.Listener;
  private isRunning = false;

  constructor(host: string, port: number) {
    this.server = Deno.listen({ hostname: host, port: port });
  }

  async start() {
    this.isRunning = true;
    console.log(`SOCKS5 proxy server listening on ${HOST}:${PORT}`);

    while (this.isRunning) {
      try {
        const conn = await this.server.accept();
        this.handleConnection(conn).catch((err) => {
          // console.error("Connection handler error:", err);
        });
      } catch (err) {
        if (this.isRunning) {
          // console.error("Accept error:", err);
        }
      }
    }
  }

  async stop() {
    console.log("Stopping SOCKS server...");
    this.isRunning = false;
    try {
      this.server.close();
    } catch (err) {
      console.error("Error closing SOCKS server:", err);
    }
  }

  private async handleConnection(conn: Deno.Conn) {
    try {
      // Read initial greeting
      const buf = new Uint8Array(2);
      const readResult = await conn.read(buf);
      if (!readResult) {
        conn.close();
        return;
      }

      // Check SOCKS version
      if (buf[0] !== 0x05) {
        console.error("Unsupported SOCKS version");
        conn.close();
        return;
      }

      // Read authentication methods
      const nMethods = buf[1];
      const methodsBuf = new Uint8Array(nMethods);
      await conn.read(methodsBuf);

      // Send auth method response (no auth required)
      await conn.write(new Uint8Array([0x05, 0x00]));

      // Read connection request
      const requestBuf = new Uint8Array(4);
      await conn.read(requestBuf);

      const cmd = requestBuf[1];
      if (cmd !== 0x01) {
        console.error(`Unsupported command: ${cmd}`);
        await conn.write(new Uint8Array([0x05, 0x07, 0x00, 0x01, 0, 0, 0, 0, 0, 0]));
        conn.close();
        return;
      }

      // Read address type and address
      const addrType = requestBuf[3];
      let targetHost: string;
      let targetPort: number;

      switch (addrType) {
        case 0x01: { // IPv4
          const ipv4Buf = new Uint8Array(4);
          await conn.read(ipv4Buf);
          targetHost = Array.from(ipv4Buf).join('.');
          break;
        }
        case 0x03: { // Domain name
          const lenBuf = new Uint8Array(1);
          await conn.read(lenBuf);
          const domainLen = lenBuf[0];
          const domainBuf = new Uint8Array(domainLen);
          await conn.read(domainBuf);
          targetHost = new TextDecoder().decode(domainBuf);
          break;
        }
        case 0x04: { // IPv6
          const ipv6Buf = new Uint8Array(16);
          await conn.read(ipv6Buf);
          targetHost = Array.from(ipv6Buf).map(b => b.toString(16).padStart(2, '0'))
            .join(':').replace(/(:0)+:/, '::');
          break;
        }
        default: {
          console.error("Unsupported address type");
          await conn.write(new Uint8Array([0x05, 0x08, 0x00, 0x01, 0, 0, 0, 0, 0, 0]));
          conn.close();
          return;
        }
      }

      // Read port
      const portBuf = new Uint8Array(2);
      await conn.read(portBuf);
      targetPort = (portBuf[0] << 8) | portBuf[1];

      // console.log(`Connecting to ${targetHost}:${targetPort}`);

      // Connect to target
      try {
        const target = await Deno.connect({
          hostname: targetHost,
          port: targetPort,
          transport: "tcp",
        });

        // Send success response
        await conn.write(new Uint8Array([0x05, 0x00, 0x00, 0x01,
          127, 0, 0, 1,  // bound address (localhost)
          (PORT >> 8) & 0xff, PORT & 0xff])); // bound port

        // Start proxying data
        await this.proxy(conn, target);
      } catch (err) {
        // console.error("Failed to connect to target:", err);
        try {
          await conn.write(new Uint8Array([0x05, 0x04, 0x00, 0x01, 0, 0, 0, 0, 0, 0]));
        } catch (_) {
          // Ignore write errors during error handling
        } finally {
          conn.close();
        }
      }
    } catch (err) {
      // console.error("Connection error:", err);
      try {
        conn.close();
      } catch (_) {
        // Ignore close errors
      }
    }
  }

  private async proxy(client: Deno.Conn, target: Deno.Conn) {
    const pipe = async (from: Deno.Conn, to: Deno.Conn) => {
      try {
        const buffer = new Uint8Array(8192);
        while (true) {
          const readResult = await from.read(buffer);
          if (!readResult) break;
          const writeResult = await to.write(buffer.subarray(0, readResult));
          if (!writeResult) break;
        }
      } catch (err) {
        if (!(err instanceof Deno.errors.Interrupted)) {
          // console.error("Proxy error:", err);
        }
      }
    };

    try {
      await Promise.all([
        pipe(client, target),
        pipe(target, client),
      ]);
    } finally {
      try {
        client.close();
      } catch (_) {
        // Ignore close errors
      }
      try {
        target.close();
      } catch (_) {
        // Ignore close errors
      }
    }
  }
}

// Start the server
try {
  const server = new SOCKS5Server(HOST, PORT);
  await server.start();
} catch (error) {
  console.error("Failed to start server:", error);
}
