import { Router } from "express";
import { login, isAuth, logout, register } from "../controllers/auth";
import ValidateTokens from "../middleware/validateTokens";

// 태그 목록 가져오기
const router = Router();

router.post("/liu", login());

router.get("/logout", logout());

router.get("/isAuth", ValidateTokens, isAuth());

// router.post("/register", register());

export default router;
