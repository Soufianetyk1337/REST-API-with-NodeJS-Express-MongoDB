import { BoardModel } from "../model/board.model.js";
import { SectionModel } from "../model/section.model.js";
import { TaskModel } from "../model/task.model.js";

export const createBoard = async (req, res) => {
  try {
    const totalBoards = await BoardModel.find().count();

    const board = await BoardModel.create({
      user: req.session.sid,
      position: totalBoards > 0 ? totalBoards : 0,
      ...req.body,
    });
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllBoards = async (req, res) => {
  // eslint-disable-next-line no-undef
  try {
    const boards = await BoardModel.find({ user: req.session.sid }).sort(
      "-position"
    );
    res.status(200).json(boards);
  } catch (err) {
    res.status(500).json(err);
  }
};
export const updateBoards = async (req, res) => {
  const { boards } = req.body;
  try {
    for (const key in boards.reverse()) {
      const board = boards[key];
      await BoardModel.findByIdAndUpdate(board.id, { $set: { position: key } });
    }
    res.status(200).json("Boards Updated");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getfavoritesBoards = async (req, res) => {
  try {
    const favorites = await BoardModel.find({
      user: req.session.sid,
      favorite: true,
    }).sort("-favoriteIndex");
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const updatefavoriteBoard = async (req, res) => {
  const { boards } = req.body;
  try {
    for (const key in boards.reverse()) {
      const board = boards[key];
      await BoardModel.findOneAndUpdate(board.id, {
        $set: { favoriteIndex: key },
      });
    }
    res.status(200).json("favorite Board Updated Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getBoard = async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await BoardModel.findOne({
      user: req.session.sid,
      _id: boardId,
    });
    if (!board) return res.status(404).json("Board Not Found");
    const sections = await SectionModel.find({ board: boardId });
    for (const section of sections) {
      const tasks = await TaskModel.find({ section: section.id })
        .populate("section")
        .sort("-index");
      section._doc.tasks = tasks;
    }
    board._doc.sections = sections;

    res.status(200).json(board);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const updateBoard = async (req, res) => {
  const { boardId } = req.params;
  const { title, description, favorite } = req.body;
  try {
    if (title === "") req.body.title = "Untitled";
    if (description === "") req.body.description = "Insert a description.";
    const currentBoard = await BoardModel.findById(boardId);
    if (!currentBoard) return res.status(404).json("Board Not found!");
    if (favorite !== undefined && currentBoard.favorite !== favorite) {
      const favorites = await BoardModel.find({
        user: currentBoard.user,
        favorite: true,
        _id: { $ne: boardId },
      }).sort("favoriteIndex");
      if (favorite) {
        req.body.favoriteIndex = favorites.length > 0 ? favorites.length : 0;
      } else {
        for (const key in favorites) {
          const element = favorite[key];
          await BoardModel.findByIdAndUpdate(element.id, {
            $set: { favoriteIndex: key },
          });
        }
      }
    }
    const board = await BoardModel.findByIdAndUpdate(
      boardId,
      {
        $set: req.body,
      },
      { new: true }
    );

    // eslint-disable-next-line no-undef
    console.log(board);

    res.status(200).json(board);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteBoard = async (req, res) => {
  const { boardId } = req.params;
  try {
    const sections = await SectionModel.find({ board: boardId });
    for (const section of sections) {
      await TaskModel.deleteMany({ section: section.id });
    }
    await SectionModel.deleteMany({ board: boardId });
    const currentBoard = await BoardModel.findById(boardId);
    if (currentBoard.favorite) {
      const favorites = await BoardModel.find({
        user: currentBoard.user,
        favorite: true,
        _id: { $ne: boardId },
      }).sort("favoriteIndex");
      for (const key in favorites) {
        const element = favorites[key];
        await BoardModel.findByIdAndUpdate(element.id, {
          $set: { favoriteIndex: key },
        });
      }
    }
    await BoardModel.deleteOne({ _id: boardId });
    const boards = await BoardModel.find().sort("position");
    for (const key in boards) {
      const board = boards[key];
      await BoardModel.findByIdAndUpdate(board.id, { $set: { position: key } });
    }
    res.status(200).json("Board Deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
};
