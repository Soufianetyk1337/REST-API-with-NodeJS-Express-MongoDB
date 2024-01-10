import express from "express";
import { body, param } from "express-validator";
import * as TaskController from "../controller/task.controller.js";
import * as validation from "../helpers/validation.js";
import { userIsLoggedIn } from "../middleware/userIsLoggedIn.js";
import { userIsVerified } from "../middleware/userIsVerified.js";

var router = express.Router({ mergeParams: true });

router.post(
  "/",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid id");
    } else return Promise.resolve();
  }),
  body("sectionId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid section id.");
    } else return Promise.resolve();
  }),
  validation.validate,
  userIsLoggedIn,
  userIsVerified,
  TaskController.createTask
);

router.put(
  "/update-position",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid id");
    } else return Promise.resolve();
  }),
  validation.validate,
  userIsLoggedIn,
  userIsVerified,
  TaskController.updateTaskPosition
);

router.delete(
  "/:taskId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid id");
    } else return Promise.resolve();
  }),
  param("taskId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid id");
    } else return Promise.resolve();
  }),
  validation.validate,
  userIsLoggedIn,
  userIsVerified,
  TaskController.deleteTask
);

router.put(
  "/taskId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid id");
    } else return Promise.resolve();
  }),
  param("taskId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid id");
    } else return Promise.resolve();
  }),
  validation.validate,
  userIsLoggedIn,
  userIsVerified,
  TaskController.updateTask
);

export { router as taskRouter };
