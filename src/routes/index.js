import express from "express";
import { authRouter } from "./auth.js";
import { BoardRouter } from "./board.js";
import { sectionRouter } from "./section.js";
import { taskRouter } from "./task.js";
var router = express.Router();

router.get("/ping", (req, res) => {
  return res.sendStatus(200);
});
router.use("/users", authRouter);
router.use("/boards/", BoardRouter);
router.use("/boards/:boardId/sections", sectionRouter);
router.use("/boards/:boardId/tasks", taskRouter);

export default router;
