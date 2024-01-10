import express from "express";
import { param } from "express-validator";
import * as SectionController from "../controller/section.controller.js";
import * as validation from "../helpers/validation.js";

import { userIsLoggedIn } from "../middleware/userIsLoggedIn.js";
import { userIsVerified } from "../middleware/userIsVerified.js";

var router = express.Router({ mergeParams: true });

router.post(
  "/",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid board id");
    } else return Promise.resolve();
  }),

  validation.validate,
  userIsLoggedIn,
  userIsVerified,
  SectionController.createSection
);

router.put(
  "/:sectionId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid board id");
    } else return Promise.resolve();
  }),
  param("sectionId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid section id");
    } else return Promise.resolve();
  }),
  validation.validate,
  userIsLoggedIn,
  userIsVerified,
  SectionController.updateSection
);
router.delete(
  "/:sectionId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid board id");
    } else return Promise.resolve();
  }),
  param("sectionId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("invalid section id");
    } else return Promise.resolve();
  }),
  validation.validate,
  userIsLoggedIn,
  userIsVerified,
  SectionController.deleteSection
);

export { router as sectionRouter };
