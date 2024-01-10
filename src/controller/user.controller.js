import { createUser } from "../service/user.service.js";
import { UserModel } from "../model/user.model.js";
import { verify } from "crypto";
import nodemailer from "nodemailer";
import { env } from "process";
import { PasswordResetModel } from "../model/passwordReset.model.js";
import { tokenGenerator } from "../helpers/tokenGenerator.js";
import { passwordForgot } from "../template/passwordForgot.js";
import { emailVerification } from "../template/emailVerification.js";
import { verifyJwt } from "../utils/jwt_utils.js";
const BASE_URL =
  env.NODE_ENV === "development" ? env.BASE_URL : env.BASE_URL_PROD;
export const createUserHandler = async (req, res) => {
  // eslint-disable-next-line no-undef
  console.log("Register attempt", req.body);
  try {
    const user = await createUser(req, res);
    if (user.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Email address already in use" });
    }
    const token = tokenGenerator(user.email);
    const link = `${BASE_URL}/users/email/verify?id=${user._id}&verificationToken=${token}`;
    let mailOptions = {
      from: '"John Doe" <john-doe@gmail.com>',
      to: user.email,
      subject: "email verification",
      html: emailVerification(
        link,
        user.name,
        env.PASSWORD_RESET_EXPIRY_IN_MINUTES || 15,
        verify
      ),
    };
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        user: env.NODEMAILER_USER,
        pass: env.NODEMAILER_PASS,
      },
    });
    const mailSent = await transporter.sendMail(mailOptions);
    if (mailSent) {
      return res.status(201).json({
        success: "true",
        message:
          "You have successfully created your account. Check your email to verify it.",
        created: { user },
      });
    } else {
      return res.status(409).json({ mailSent });
    }
  } catch (error) {
    return res.status(409).json({ success: false, message: "Invalid Email" });
  }
};

export const sendEmailToVerifyUserAccount = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    return res.status(404).json("Invalid email");
  }
  const token = tokenGenerator(user.email);
  const link = `${BASE_URL}/users/email/verify?id=${user._id}&verificationToken=${token}`;
  let mailOptions = {
    from: '"John Doe" <john-doe@gmail.com>',
    to: user.email,
    subject: "email verification",
    html: emailVerification(
      link,
      user.name,
      env.PASSWORD_RESET_EXPIRY_IN_MINUTES || 15,
      verify
    ),
  };
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: env.NODEMAILER_USER,
      pass: env.NODEMAILER_PASS,
    },
  });
  const mailSent = await transporter.sendMail(mailOptions);
  if (mailSent) {
    return res.status(201).json({
      success: "true",
      message:
        "Verify link sent successfully. Check your email to verify your account.",
      created: { user },
    });
  } else {
    return res.status(409).json({ mailSent });
  }
};

export const createUserPasswordReset = async (req, res) => {
  const { id, token } = req.query;
  const { newPassword } = req.body;
  if (!id || !token) {
    return res.status(401).json({
      success: "false",
      message: "Please check your email for reset password link",
    });
  }
  const { valid, expired } = verifyJwt(token);
  if (valid && !expired) {
    // eslint-disable-next-line no-unused-vars
    const passwordResetAttempt = await PasswordResetModel.findOne({
      userId: id,
    });
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).send("Something went wrong try again later.");
    }
    user.password = await user.hashPassword(newPassword);
    await user.save();
    return res.status(200).json({
      success: true,
      message: "You have succesfully reset your password",
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Your password reset link expired",
    });
  }
};
// User should confirm his password if he changes some critical data
export const createUserPasswordConfirm = async (req, res) => {
  const { password } = req.body;
  const { sid } = req.session;
  const user = await UserModel.findById(sid);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    return res.status(401).json({ message: "Password is incorrect" });
  }
  req.session.passwordConfirmedAt = Date.now();
  return res.status(200).json({ message: "Password confirmed successfully" });
};

export const createUserEmailVerification = async (req, res) => {
  const { id, verificationToken } = req.query;
  if (!id || !verificationToken) {
    return res.status(401).json({
      success: "false",
      message: "Please check your email for verification link",
    });
  }

  const { valid, expired } = verifyJwt(verificationToken);
  if (valid && !expired) {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { confirmed: true },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      message: "You have succesfully verified your account",
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Your verification link expired",
    });
  }
};

export const createUserPasswordForgot = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(400).send("Invalid Email.");
  }
  const userId = user._id;
  const previousPasswordResetAttempt = await PasswordResetModel.findOne({
    userId,
  });
  if (previousPasswordResetAttempt) {
    // eslint-disable-next-line no-unused-vars
    const previousPasswordResetDoc = await PasswordResetModel.deleteOne({
      userId,
    });
  }
  const token = tokenGenerator();
  const passwordResetAttempt = await PasswordResetModel.create({
    userId,
    email,
    token,
  });
  if (!passwordResetAttempt) {
    return res.status(500).send("Something went wrong. Try again later");
  }
  const link = `${BASE_URL}/users/password/reset?id=${user._id}&token=${token}`;
  let mailOptions = {
    from: '"John Doe" <john-doe@gmail.com>',
    to: user.email,
    subject: "Reset your account password",
    html: passwordForgot(
      link,
      user.name,
      env.PASSWORD_RESET_EXPIRY_IN_MINUTES || 15
    ),
  };

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: env.NODEMAILER_USER,
      pass: env.NODEMAILER_PASS,
    },
  });
  const mailSent = await transporter.sendMail(mailOptions);
  if (mailSent) {
    return res
      .status(200)
      .json({ success: true, message: "Check your email for reset link" });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Unable to send email." });
  }
};

export const createUserSendEmailVerification = (req, res) => {};
/**
 * @description
 * @api
 * @access
 * @type
 */
