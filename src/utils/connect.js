import mongoose from "mongoose";
import process, { env } from "process";
import { logger } from "./logger.js";

const connect = () => {
  const dbURI = env.NODE_ENV === 'development' ? env.DB_URI_LOCAL : env.DB_URI_PROD;
  mongoose.connection
    .on('error', logger.error)
    .on('disconnected', connect)
  return mongoose.connect(dbURI, {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => logger.success("Successfully connected to the database"))
    .catch((error) => {
      logger.error(error);
      process.exit(1);
    })
}
export default connect;
