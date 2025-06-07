import { Router } from "express";
import { protectroute } from "../middlewares/auth.middleware.js";
import { createSession, getSession, saveChanges } from "../controllers/code.controllers.js";


const codeRouter = Router();

codeRouter.post("/create/:id",protectroute,createSession);
codeRouter.put("/saving/:sessionid",protectroute,saveChanges);
codeRouter.get("/getsession/:sessionid",protectroute,getSession);

export default codeRouter;