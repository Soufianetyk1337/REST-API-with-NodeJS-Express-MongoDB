import mongoose from "mongoose";
const Schema = mongoose.Schema;

const sectionSchema = new Schema(
  {
    board: {
      type: Schema.Types.ObjectId,
      ref: "Baord",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled",
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

export const SectionModel = mongoose.model("Section", sectionSchema);
