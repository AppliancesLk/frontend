const { createRequire } = require("node:module");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const backendPath =
  process.env.CART_BACKEND_DIR || path.resolve(__dirname, "../../../backend");
const backendRequire = createRequire(path.join(backendPath, "package.json"));
const envFile = path.join(backendPath, ".env");
if (fs.existsSync(envFile)) {
  const parsed = backendRequire("dotenv").parse(fs.readFileSync(envFile));
  for (const [key, value] of Object.entries(parsed)) process.env[key] ??= value;
}
process.env.FRONTEND_URL =
  process.env.CART_FRONTEND_URL || "http://localhost:5174";
process.env.PAYHERE_MERCHANT_ID = "1238776";
process.env.PAYHERE_MERCHANT_SECRET = "frontend-e2e-payhere-secret";
process.env.PAYHERE_MODE = "sandbox";
const apiUrl = new URL(process.env.CART_BACKEND_URL || "http://localhost:3001");
backendRequire("reflect-metadata");
(async () => {
  const { NestFactory } = await import(
    pathToFileURL(backendRequire.resolve("@nestjs/core")).href
  );
  const { AppModule } = backendRequire("./dist/app.module");
  const { configureApp } = backendRequire("./dist/app.setup");
  const app = await NestFactory.create(AppModule, { logger: ["error"] });
  configureApp(app);
  await app.listen(Number(apiUrl.port), apiUrl.hostname);
  app.enableShutdownHooks();
})().catch(() => {
  console.error(
    "Unable to start the isolated Cart test backend. Build the backend and check its database configuration.",
  );
  process.exitCode = 1;
});
