import { Router } from "express";
import model from "../models/Posts";
import controller from "../controllers/Generic";
import {
  getPostById,
  getPostByPage,
  getPostBySlug,
} from "../controllers/posts";

const router = Router();

// 게시글 목록 가져오기 (dynamic routing 페이지 경로 사전 생성시 사용)
router.get("/", controller.getAll(model));

// 게시글 작성
router.post("/", controller.create(model));

// 게시글 목록 가져오기 (id)
// ex) GET /artists/1, GET /artists/1/company/entertainment
// router.get("/:id", controller.get(model));
router.get("/findById", getPostById(model));
// ID or Slug 선택할 것
router.get(`/findBySlug`, getPostBySlug(model));

// 게시글 수정
router.put("/", controller.update(model));

// 게시글 삭제
router.delete("/:slug", controller.remove(model));

// page로 게시글 가져오기
// ex) GET /artists?name=hello
router.get(`/findByPage`, getPostByPage(model));

export default router;
