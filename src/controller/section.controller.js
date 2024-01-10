import { SectionModel } from "../model/section.model.js";
import { TaskModel } from "../model/task.model.js";

export const createSection = async (req, res) => {
  const { boardId } = req.params;
  try {
    const section = await SectionModel.create({ board: boardId });
    section._doc.tasks = [];
    res.status(201).json(section);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateSection = async (req, res) => {
  // eslint-disable-next-line no-undef
  const { sectionId } = req.params;
  try {
    const section = await SectionModel.findByIdAndUpdate(
      sectionId,
      {
        $set: req.body,
      },
      { new: true }
    );
    section._doc.tasks = [];
    res.status(200).json(section);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteSection = async (req, res) => {
  const { sectionId } = req.params;
  try {
    await TaskModel.deleteMany({
      section: sectionId,
    });
    await SectionModel.deleteOne({ _id: sectionId });
    res.status(200).json("Section deleted.");
  } catch (error) {
    res.status(500).json(error);
  }
};
