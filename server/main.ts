async function main() {
  // Start all servers as separate processes
  const wsServer = new Deno.Command("deno", {
    args: ["run", "--allow-net", "websocket-server.ts"],
    stdout: "inherit",
    stderr: "inherit"
  });

  const socksServer = new Deno.Command("deno", {
    args: ["run", "--allow-net", "socks-server.ts"],
    stdout: "inherit",
    stderr: "inherit"
  });

  // Start all processes
  const wsProcess = wsServer.spawn();
  const socksProcess = socksServer.spawn();

  // Handle shutdown
  const shutdown = () => {
    console.log("\nShutting down servers...");
    wsProcess.kill("SIGTERM");
    socksProcess.kill("SIGTERM");
    Deno.exit();
  };

  // Handle Ctrl+C
  Deno.addSignalListener("SIGINT", shutdown);
  Deno.addSignalListener("SIGTERM", shutdown);

  // Wait for all processes
  try {
    await Promise.all([
      wsProcess.status,
      socksProcess.status
    ]);
  } catch (error) {
    console.error("Error running servers:", error);
    shutdown();
  }
}

if (import.meta.main) {
  main();
}