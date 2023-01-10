import { Router } from "express";
import Post from "./posts";
import Auth from "./auth";

const router = Router();

router.use("/posts", Post);

router.use("/auth", Auth);

export default router;
