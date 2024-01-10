import { UserModel } from "../model/user.model.js";
export const userIsVerified = async (req, res, next) => {
  const { email } = req.body;
  const userId = req.session.sid;

  let user;
  if (req.body.email) {
    user = await UserModel.findOne({ email: email });
  }
  if (req.session.sid) {
    user = await UserModel.findById(userId);
  }
  if (!user) {
    return res.status(500).send({
      success: false,
      message: "Internal server error.",
    });
  }
  if (user?.confirmed !== true) {
    return res.status(401).json({
      success: false,
      message: "Activate your account",
    });
  }
  next();
};
