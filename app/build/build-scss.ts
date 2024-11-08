import sass from "https://deno.land/x/denosass@1.0.6/mod.ts";

// Read the SCSS file
const scssContent = await Deno.readTextFile("src/styles/main.scss");

const compiler = sass(scssContent, {
  style: "compressed",
  quiet: true,
});

// Ensure the css directory exists
try {
  await Deno.mkdir("static/css", { recursive: true });
} catch (error) {
  if (!(error instanceof Deno.errors.AlreadyExists)) {
    throw error;
  }
}

// Write the compiled CSS to main.bundle.css
const cssOutput = compiler.to_string();
if (typeof cssOutput === "string") {
  await Deno.writeTextFile(
    "static/css/main.bundle.css",
    cssOutput
  );
} else {
  throw new Error("SCSS compilation failed");
}

console.log("✓ SCSS compilation complete");