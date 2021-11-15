import mongoose from "mongoose";
import { env } from "process";
import { logger } from "./logger.js";

const connect = async () => {
  const dbURI = env.DB_URI;

  await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.success("Successfully connected to the database"))
    .catch((error) => {
      console.log(error);
      process.exit(1);
    })
}
export default connect;
