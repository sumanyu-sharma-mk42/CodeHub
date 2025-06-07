import {Router} from "express";
import { protectroute } from "../middlewares/auth.middleware.js";
import { getMessages, getUserForSidebar, searchUsers, sendMessages } from "../controllers/message.controllers.js";

const mssgRouter = Router();

mssgRouter.get("/users",protectroute,getUserForSidebar);
mssgRouter.get("/:id",protectroute,getMessages);
mssgRouter.post("/send/:id",protectroute,sendMessages);
mssgRouter.get("/search/your_query", searchUsers);

export default mssgRouter;