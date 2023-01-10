import { Router } from "express";
import { login } from "../controllers/auth";

// 태그 목록 가져오기
const router = Router();

router.post("/liu", login());

export default router;
