import { Router } from "express";
import { adding, deleting, edit, login, logout, signup } from "../controllers/auth.controllers.js";
import { protectroute } from "../middlewares/auth.middleware.js";
import { update } from "../controllers/auth.controllers.js";
import { check } from "../controllers/auth.controllers.js";
const authRouter = Router();

authRouter.post("/signup", signup)
authRouter.post("/login", login)
authRouter.post("/logout", logout)
authRouter.put("/profile", protectroute,update);
authRouter.get("/check", protectroute,check); // just to check if the user already authenticated or not
authRouter.get("/delete/:index", protectroute,deleting);
authRouter.put("/add", protectroute,adding);
authRouter.put("/edit/:index", protectroute,edit);
export {authRouter}