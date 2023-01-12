import { Router } from "express";
import model from "../models/Posts";
import modelTags from "../models/Tags";
import controller from "../controllers/Generic";
import {
  createPost,
  deletePost,
  getPostByPage,
  getPostBySlug,
  updatePost,
  getPostTags,
} from "../controllers/posts";
import passport from "passport";
import ValidateTokens from "../middleware/validateTokens";

// 태그 목록 가져오기
const router = Router();

// 게시글 목록 가져오기 (dynamic routing 페이지 경로 사전 생성시 사용)
router.get("/", controller.getAll(model));
// 게시글 작성
router.post(
  "/",
  ValidateTokens,
  // passport.authenticate("jwt", { session: false }),
  createPost(model)
);
// page로 게시글 목록 가져오기
router.get(`/findByPage`, getPostByPage(model));
// slug로 게시글 가져오기 (게시글 상세보기 + 게시글 수정하기)
router.get(`/findBySlug`, getPostBySlug(model));

// 게시글 수정
/*
  Route Parameters
  Request URL : http://localhost:8000/api/v1/posts/제목1
  req.params: {slug: '제목1}
*/
router.patch(
  "/:slug",
  // passport.authenticate("jwt", { session: false }),
  ValidateTokens,
  updatePost(model)
);

// 게시글 삭제
router.delete(
  "/:slug",
  // passport.authenticate("jwt", { session: false }),
  ValidateTokens,
  deletePost(model)
);

router.get("/tags", getPostTags(modelTags));

export default router;
