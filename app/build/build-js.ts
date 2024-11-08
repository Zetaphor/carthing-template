import * as esbuild from "npm:esbuild";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";

try {
  const result = await esbuild.build({
    plugins: [...denoPlugins()],
    entryPoints: ["./src/typescript/main.ts"],
    outfile: "static/js/main.bundle.js",
    bundle: true,
    format: "iife",
    target: ["chrome69", "firefox62", "safari12", "edge18"],
    minify: true,
  });

  console.log("✓ JavaScript bundling complete");
} catch (error) {
  console.error("JavaScript bundling failed:", error);
  Deno.exit(1);
} finally {
  esbuild.stop();
}