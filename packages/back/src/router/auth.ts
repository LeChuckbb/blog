import { Router } from "express";
import { login, isAuth, logout } from "../controllers/auth";

// 태그 목록 가져오기
const router = Router();

router.post("/liu", login());

// router.get("/logout", logout());

// router.get("/isAuth", isAuth());

export default router;
