/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { logger } from "../utils/logger.js";
import { createUser } from "../service/user.service.js";
import omit from "lodash/omit.js"
import { UserModel } from '../model/user.model.js'
import { createHmac, randomBytes } from 'crypto'
import nodemailer from "nodemailer"
import dayjs from "dayjs"
import { env } from 'process'
import mongoose from 'mongoose';
import crypto from 'crypto'
import { PasswordResetModel } from '../model/passwordReset.model.js'
import { getEmailProvider } from '../helpers/getEmailProvider.js'
import { html, compress } from '../helpers/emailTemplate.js'
import { limitSlowBruteForceByIp, limitFastBruteForceByIp } from '../middleware/rateLimiter.js'
import { add } from "lodash-es";
export const createUserHandler = async (req, res) => {
  try {
    const user = await createUser(req, res);
    return res.status(201).send(user)
  } catch (error) {
    logger.error(error);
    return res.status(409).send(`error from controller :${error}`);
  }
};


export const createUserPasswordReset = async (req, res) => {
  const { id, token } = req.query;
  const { newPassword } = req.body;
  const passwordResetAttempt = await PasswordResetModel.findOne({ userId: id })

  // Check if the link is still valid 
  const isLinkStillValid = dayjs(passwordResetAttempt.createdAt).add(+env.PASSWORD_RESET_EXPIRY_IN_MINUTES, 'minute').valueOf()
  console.log(isLinkStillValid)
  console.log(Date.now())
  const expiresAt = dayjs().add(+env.PASSWORD_RESET_EXPIRY_IN_MINUTES, 'minute').unix()
  if (isLinkStillValid < Date.now()) {
    return res.status(400).send("Link expired.")
  }
  const user = await UserModel.findById(id)
  user.password = newPassword
  user.updateOne((error, record) => {
    if (error) {
      console.log(error)
    };
  })

  return res.status(200).json({ success: true, message: "You have succesfully reset your password" })
}
// User should confirm his password if he changes some critical data
export const createUserPasswordConfirm = async (req, res) => {
  const { password } = req.body;
  const { sid } = req.session
  const user = await UserModel.findById(id)
  if (!user) {
    return res.status(400).json({ message: "User not found" })
  }
  const passwordMatches = await user.comparePassword(password)
  if (!passwordMatches) {
    return res.status(401).json({ message: "Password is incorrect" })
  }
  req.session.passwordConfirmedAt = Date.now();
  return res.status(200).json({ message: "Password confirmed successfully" })
}


export const createUserEmailVerification = async (req, res) => {
  console.log(req.ip)
  const ipAddress = req.connection.remoteAddress;
  const [responseFastBruteForceByIp, responseSlowBruteForceByIp] = await Promise.all([
    limitFastBruteForceByIp.get(ipAddress),
    limitSlowBruteForceByIp.get(ipAddress),
  ])
  console.log(responseSlowBruteForceByIp)
  const { email } = req.body;
  const emailProvider = getEmailProvider(email).toLowerCase()
  console.log(emailProvider)
  res.json({ emailProvider })

}

export const createUserPasswordForgot = async (req, res) => {
  const { email } = req.body
  const user = await UserModel.findOne({ email })
  if (!user) {
    return res.status(400).send("Invalid Email.")
  }
  const userId = user._id;
  const previousPasswordResetAttempt = await PasswordResetModel.findOne({ userId })
  if (previousPasswordResetAttempt) {
    const previousPasswordResetDoc = await PasswordResetModel.deleteOne({ userId })
    // if (previousPasswordResetDoc) {
    //   console.log(previousPasswordResetDoc)
    // }
  }
  const randomByte = randomBytes(+env.PASSWORD_RESET_TOKEN_LENGTH).toString("hex")
  const token = createHmac("sha256", env.PASSWORD_RESET_SECRET).update(randomByte).digest("hex")

  const passwordResetAttempt = await PasswordResetModel.create({ userId, email, token })
  if (!passwordResetAttempt) {
    return res.status(500).send("Something went wrong. Try again later");
  }
  const link = `${env.BASE_URL}/users/reset-password?id=${user._id}&token=${token}`
  let mailOptions = {
    from: 'test@gmail.com',
    // to: "sz.fanel@gmail.com" || user.email,
    to: user.email,
    subject: 'Reset your account password',
    html: compress(html(link, user.name, env.PASSWORD_RESET_EXPIRY_IN_MINUTES || 15))
  }

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: env.NODEMAILER_USER,
      pass: env.NODEMAILER_PASS
    }
  })
  const mailSent = await transporter.sendMail(mailOptions)
  if (mailSent) {
    return res.status(200).json({ success: true, userId, token })
  } else {
    return res.status(400).json({ message: "Unable to send email." })
  }
}
