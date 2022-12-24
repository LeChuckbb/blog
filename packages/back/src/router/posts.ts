import { Router } from "express";
import model from "../models/Posts";
import controller from "../controllers/Generic";

const router = Router();

router.get("/test", async (req, res) => {
  try {
    const post = new model({});

    const staticRes = model.postSchemaStatic();
    const hi = await model.findAll();

    res.send(hi);
    // res.json(hi);
  } catch (e) {
    console.log("test API 실패");
    console.error(e);
  }
});

// 게시글 목록 가져오기
router.get("/", controller.getAll(model));

// 게시글 목록 가져오기 (id)
router.get("/:id", controller.get(model));

// 게시글 작성
router.post("/", controller.create(model));

// 게시글 수정
router.put("/", controller.update(model));

// 게시글 삭제
// router.delete("/", controller.remove(model));

export default router;
