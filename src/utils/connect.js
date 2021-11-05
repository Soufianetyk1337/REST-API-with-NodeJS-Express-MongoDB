import mongoose from "mongoose";
import { env } from "process";
import { logger } from "./logger.js";

const connect = () => {
  const dbURI = env.DB_URI;
  try {
    mongoose.connect(dbURI);
    logger.success("Successfully connected to the database");
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};
export default connect;
