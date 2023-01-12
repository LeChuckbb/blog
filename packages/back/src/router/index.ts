import { Router } from "express";
import Post from "./posts";
import Auth from "./auth";
const errorHandler = require("../middleware/errorHandler");

const router = Router();

router.use("/posts", Post);

router.use("/auth", Auth);

router.use(errorHandler);

export default router;
