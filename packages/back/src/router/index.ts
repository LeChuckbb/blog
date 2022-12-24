import { Router } from "express";
import Post from "./posts";

const router = Router();

router.use("/posts", Post);

export default router;
