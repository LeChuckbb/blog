import { Router } from "express";

import Post from "./post";

const router = Router();

router.use("/post", Post);

export default router;
