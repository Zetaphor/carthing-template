const sourceFile = "index.html";
const targetFile = "static/index.html";

async function copyHtml() {
  try {
    await Deno.copyFile(sourceFile, targetFile);
    console.log("✓ Copied index.html to static folder");
  } catch (error) {
    console.error("Error copying index.html:", error);
  }
}

if (import.meta.main) {
  await copyHtml();
}