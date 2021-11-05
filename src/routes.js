import { createUserHandler } from './controller/user.controller.js'
import { createUserSessionHandler, deleteUserSessionHandler, getUserSessionHandler } from './controller/session.controller.js'
import { createUserValidationSchema } from './schema/user.schema.js'
import { createSessionValidationSchema } from './schema/session.schema.js'
import { validate } from './middleware/validate.js'
import { userRequired } from './middleware/userRequired.js'

export const routes = (app) => {
  app.get("/ping", (req, res) => {
    res.sendStatus(200);
  });
  app.post("/api/users", validate(createUserValidationSchema), createUserHandler)
  app.post("/api/sessions", validate(createSessionValidationSchema), createUserSessionHandler)
  app.get("/api/sessions", userRequired, getUserSessionHandler)
  app.delete("/api/sessions", userRequired, deleteUserSessionHandler)

};
