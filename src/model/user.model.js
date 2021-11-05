import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { env } from "process";
import { logger } from "../utils/logger.js";

const userSchema = new mongoose.Schema(
  {

    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSaltSync(10);
  const hash = await bcrypt.hashSync(user.password, salt);
  user.password = hash;
  return next();
});


userSchema.methods.comparePassword = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password).catch(error => false)
}
export const UserModel = mongoose.model("User", userSchema);
