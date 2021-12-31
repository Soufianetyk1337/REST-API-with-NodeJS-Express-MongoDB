import "dotenv/config";
import express from "express";
import process, { env } from "process";
import connect from "./utils/connect.js";
import { logger } from "./utils/logger.js";
import { routes } from "./routes.js";
import { userSessionIsActive } from "./middleware/userSessionIsActive.js";
import { sessionConfig } from "./config/session.js";
import session from 'express-session'
import helmet from "helmet";
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerDocument = require('./swagger.json')
const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({
  extended: true
}))
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
app.use(session(sessionConfig))
app.use(userSessionIsActive)
const PORT = env.PORT || 5000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.listen(PORT, "0.0.0.0", () => {
  connect();
  logger.success(`Listening on PORT : ${PORT}`);
  routes(app);
});
// app.use((req, res, next) => {
//   res.status(400).json({ message: "Not Found!" })
// })
app.use((err, req, res, next) => {
  logger.error(err.stack)
  res.status(500).json({ message: "Internal Server Error" })
})
process.on("SIGINT", () => {
  process.exit();
});