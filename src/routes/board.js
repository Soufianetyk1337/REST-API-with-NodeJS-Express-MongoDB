import express from "express";
import { param } from "express-validator";
import * as BoardController from "../controller/board.controller.js";
import * as validation from "../helpers/validation.js";
import { userIsLoggedIn } from "../middleware/userIsLoggedIn.js";
import { userIsVerified } from "../middleware/userIsVerified.js";
var router = express.Router();
router.get("/board/ping", (req, res) => {
  res.send("The route is reachable");
});

router.post("/", userIsLoggedIn, userIsVerified, BoardController.createBoard);
router.get("/", userIsLoggedIn, userIsVerified, BoardController.getAllBoards);
router.put("/", userIsLoggedIn, userIsVerified, BoardController.updateBoards);
router.get(
  "/favorites",
  userIsLoggedIn,
  userIsVerified,
  BoardController.getfavoritesBoards
);
router.put(
  "/favorites",
  userIsLoggedIn,
  userIsVerified,
  BoardController.updatefavoriteBoard
);
router.get(
  "/:boardId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid Id");
    } else return Promise.resolve();
  }),
  validation.validate,
  userIsLoggedIn,
  userIsVerified,
  BoardController.getBoard
);
router.put(
  "/:boardId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid id");
    } else return Promise.resolve();
  }),
  validation.validate,
  userIsLoggedIn,
  userIsVerified,
  BoardController.updateBoard
);
router.delete(
  "/:boardId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid id");
    } else return Promise.resolve();
  }),
  validation.validate,
  userIsLoggedIn,
  userIsVerified,
  BoardController.deleteBoard
);

export { router as BoardRouter };
