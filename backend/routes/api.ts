import express from "express";
import bodyParser from "body-parser";
import * as UserController from "../controllers/UserController";
import authMiddleware from "../middlewares/AuthMiddleware";

const apiRouter = express.Router();
apiRouter.use(bodyParser.json());

apiRouter.post("/login", UserController.userLogin);
apiRouter.post("/register", UserController.userRegister);
apiRouter.post("/logout", authMiddleware, UserController.userLogout);

// apiRouter.delete("/delete/:id",authMiddleware,adminMiddleware, UserController.userDelete);
// apiRouter.put(
//   "/update/:id",
//   authMiddleware,
//   adminMiddleware,
//   UserController.userUpdate
// );
// apiRouter.get(
//   "/users",
//   authMiddleware,
//   adminMiddleware,
//   UserController.searchUser
// );
// apiRouter.get(
//   "/allusers",
//   UserController.getAllUsers
// );

export default apiRouter;
