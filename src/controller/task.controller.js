import { SectionModel } from "../model/section.model.js";
import { TaskModel } from "../model/task.model.js";

export const createTask = async (req, res) => {
  const { sectionId } = req.body;
  try {
    const section = await SectionModel.findById(sectionId);
    const tasksCount = await TaskModel.find({ section: sectionId }).count();
    const task = await TaskModel.create({
      section: sectionId,
      position: tasksCount > 0 ? tasksCount : 0,
    });
    task._doc.section = section;
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = TaskModel.findbyIdAndUpdate(taskId, { $set: req.body });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const currentTask = await TaskModel.findById(taskId);
    await TaskModel.deleteOne({ _id: taskId });
    const tasks = await TaskModel.find({ section: currentTask.section }).sort(
      "position"
    );
    for (const key in tasks) {
      await TaskModel.findByIdAndUpdate(tasks[key].id, {
        $set: { position: key },
      });
    }
    res.status(200).json("Task Deleted");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateTaskPosition = async (req, res) => {
  const {
    sourceTasks,
    destinationTasks,
    resourceSectionId,
    destinationSectionId,
  } = req.body;
  const reversedSourceTasks = sourceTasks.reverse();
  const reversedDestinationTasks = destinationTasks.reverse();
  try {
    if (resourceSectionId !== destinationSectionId) {
      for (const key in reversedSourceTasks) {
        await TaskModel.findByIdAndUpdate(reversedSourceTasks[key].id, {
          $set: {
            section: resourceSectionId,
            position: key,
          },
        });
      }
    }
    for (const key in reversedDestinationTasks) {
      await TaskModel.findByIdAndUpdate(reversedDestinationTasks[key].id, {
        $set: {
          section: destinationSectionId,
          position: key,
        },
      });
    }
    res.status(200).json("Task Updated");
  } catch (error) {
    res.status(500).json(error);
  }
};
