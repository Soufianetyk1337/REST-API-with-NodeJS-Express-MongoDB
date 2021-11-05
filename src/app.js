import "dotenv/config";
import express from "express";
import { env } from "process";
import connect from "./utils/connect.js";
import { logger } from "./utils/logger.js";
import { routes } from "./routes.js";
import { deserializeUser } from "./middleware/deserializeUser.js";
const app = express();
app.use(express.json());
app.use(deserializeUser);
const PORT = env.PORT || 5000;
app.listen(PORT, async () => {
  logger.success(`Listening on PORT : ${PORT}`);
  await connect();
  routes(app);
});
process.on("SIGINT", () => {
  console.log("Bye bye!");
  process.exit();
});
