import mongoose from "mongoose";
const Schema = mongoose.Schema;

const boardSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled",
    },
    icon: {
      type: String,
      default: "📃",
    },
    description: {
      type: String,
      default: "Insert a description. ",
    },
    position: {
      type: Number,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    favoriteIndex: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamp: true,
  }
);

export const BoardModel = mongoose.model("Board", boardSchema);
