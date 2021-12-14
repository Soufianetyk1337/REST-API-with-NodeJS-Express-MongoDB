import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import {
  env
} from "process";
import {
  logger
} from "../utils/logger.js";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  confirmed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
});
userSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (!user.isModified("password")) {
      return next();
    }
    user.password = await user.hashPassword(user.password)
    return next();
  } catch (error) {
    logger.error(error.message)
  }
});
userSchema.methods.hashPassword = async function (password) {
  const salt = await bcrypt.genSaltSync(+env.SALT_WORK_FACTOR);
  const hash = await bcrypt.hashSync(password, salt);
  return hash;
}
userSchema.methods.comparePassword = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password).catch(error => false)
}
export const UserModel = mongoose.model("User", userSchema);