import "dotenv/config";
import express from "express";
import process, { env } from "process";
import connect from "./utils/connect.js";
import { logger } from "./utils/logger.js";
import { userSessionIsActive } from "./middleware/userSessionIsActive.js";
import { sessionConfig } from "./config/session.js";
import session from "express-session";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
import router from "./routes/index.js";

const require = createRequire(import.meta.url);
const swaggerDocument = require("./swagger.json");
const app = express();
const swaggerUiOptions = {
  swaggerOptions: {
    requestInterceptor: (request) => {
      const value = "; " + document.cookie;
      const parts = value.split("; XSRF-TOKEN=");
      if (parts.length === 2) {
        request.headers["X-XSRF-TOKEN"] = parts.pop().split(";").shift();
      }
      return request;
    },
  },
};
app.use(express.json({ limit: "10kb" }));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(session(sessionConfig));
app.use(userSessionIsActive);
const PORT = env.PORT || 5000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", (req, res) => {
  return res.redirect("/api-docs");
});
app.use("/api/v1/", router);
app.listen(PORT, "0.0.0.0", () => {
  connect();
  logger.success(`Listening on PORT : ${PORT}`);
});
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});
process.on("SIGINT", () => {
  process.exit();
});
