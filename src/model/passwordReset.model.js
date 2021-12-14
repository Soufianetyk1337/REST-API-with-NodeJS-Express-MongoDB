import "dotenv/config";
import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        token: { type: String, required: true },
    },
    {
        timestamps: true,
    }, { collection: 'password_resets' }
);

export const PasswordResetModel = mongoose.model("PasswordReset", passwordResetSchema);
