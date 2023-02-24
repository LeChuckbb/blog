import { Request, Response } from "express";
import { Post } from "../models/Posts";
import { Tags } from "../models/Tags";
import { decode } from "html-entities";
import { Model } from "mongoose";
import { encode } from "html-entities";
import modelTags from "../models/Tags";
import modelPost from "../models/Posts";
import { tryCatch } from "../util/tryCatch";
import { AppError } from "../util/types";

const PAGE_SIZE = 8;

export const getPostByPage = (model: Model<Post>) =>
  tryCatch(async (req: Request, res: Response) => {
    const tagQuery = req?.query?.tag;
    const count =
      tagQuery === "all"
        ? await model.count({})
        : await model.count({ tags: tagQuery });
    const page = Number(req.query.page);
    const IS_NEXT_PAGE_EXIST = count - page * PAGE_SIZE <= 0 ? null : true;
    const next = !IS_NEXT_PAGE_EXIST ? IS_NEXT_PAGE_EXIST : page + 1;
    const prev = page === 1 ? null : page - 1;

    const results =
      tagQuery === "all"
        ? await model
            .find({}, { html: 0, markup: 0 })
            .sort({ date: -1 })
            .skip(PAGE_SIZE * (page - 1))
            .limit(PAGE_SIZE)
        : await model
            .find({ tags: tagQuery }, { html: 0, markup: 0 })
            .sort({ date: -1 })
            .skip(PAGE_SIZE * (page - 1))
            .limit(PAGE_SIZE);

    return res.status(200).json({
      count,
      next,
      prev,
      results,
    });
  });

export const getPostBySlug = (model: Model<Post>) =>
  tryCatch(async (req: Request, res: Response) => {
    const results = await model.findOne({ urlSlug: req.query.slug });
    const resultObj = results?.toObject();
    const resultBody = {
      ...resultObj,
      html: decode(results?.html),
      markup: results?.markup,
    };

    return res.status(200).json(resultBody);
  });

// 에러 처리 요망 (catch에서 잡아주는지?)
const createTags = (tags: any) => {
  if (tags === "" || undefined) return;
  console.log(tags);
  console.log(tags?.length);
  console.log(typeof tags);

  tags?.forEach(async (tag: string) => {
    // 1. tags collection에 동명의 tag document가 이미 존재하는 경우 -> count 증가
    const result = await modelTags.findOneAndUpdate(
      { name: tag },
      { $inc: { count: 1 } }
    );
    // 2. 동명의 tag documnet가 비존재 -> 새 document추가
    if (result === null) await modelTags.create({ name: tag, count: 1 });
  });
};

export const createPost = (model: Model<Post>) =>
  tryCatch(async (req: Request, res: Response) => {
    // req.body에서 content 항목이 있으면 encode하여 DB에 저장
    // XSS 방지를 위해 HTML markup -> entity로 변경
    const body = {
      ...req.body,
      thumbnail: req.file,
      html: encode(req.body.html),
      markup: req.body.markup,
    };
    const result = await model.create(body);
    await createTags(body.tags);

    return res.status(201).json({ result });
  });

const updateTags = async (
  currentTags: Array<String>,
  inputTags: Array<String>
) => {
  // [] or ['val1', 'val2'...]
  const removeList = currentTags?.filter((x) => !inputTags?.includes(x));
  const addList = inputTags?.filter((x) => !currentTags?.includes(x));

  removeList.length !== 0 && (await deleteTags(removeList));
  addList.length !== 0 && (await createTags(addList));
};

export const updatePost = (model: Model<Post>) =>
  tryCatch(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const body = {
      ...req.body,
      thumbnail: req.file,
      html: encode(req.body.html),
      markup: req.body.markup,
    };

    const result = await model.findOneAndUpdate(
      { urlSlug: slug },
      {
        $set: {
          thumbnail: body.thumbnail,
          urlSlug: body.urlSlug,
          title: body.title,
          subTitle: body.subTitle,
          date: body.date,
          html: body.html,
          markup: body.markup,
          tags: body.tags,
        },
      }
    );

    if (result == undefined)
      throw new AppError(
        "POE002",
        "업데이트 실패. 존재하지 않는 slug 입니다.",
        404
      );
    // 1. tag를 추가한 경우 createTags()
    // 2. tag를 삭제한 경우 removeTags
    // body.tags(input)와 result.tags(current)를 비교
    updateTags(result?.tags, body.tags);
    return res.status(200).json({ result });
  });

const deleteTags = (tags: Array<String>) => {
  tags?.forEach(async (tag) => {
    const result: Tags | null = await modelTags.findOne({ name: tag });
    if (result) {
      if (result.count > 1) {
        // 1. count가 1 초과인 경우 -> count만 감소
        await modelTags.findOneAndUpdate(
          { name: tag },
          { $inc: { count: -1 } }
        );
      } else {
        // 2. count가 1 이하인 경우 -> 해당 documnet를 삭제
        await modelTags.deleteOne({ name: tag });
      }
    }
  });
};

export const deletePost = (model: Model<Post>) =>
  tryCatch(async (req: Request, res: Response) => {
    const slug = req.params.slug;
    // 1. post 삭제.
    const result = await model.findOneAndDelete({ urlSlug: slug });
    // 2. post에 존재하던 tags를 받아와서 Tags 콜렉션에 검색
    // 3. tag document의 count 값이 1 초과인경우 count만 증감. 1 이하인 경우 document 자체를 삭제
    if (result == undefined)
      throw new AppError(
        "POE002",
        "삭제 실패. 존재하지 않는 slug 입니다.",
        404
      );

    deleteTags(result.tags);
    return res.status(200).json({ message: "삭제 성공." });
  });

export const getPostTags = (model: Model<Tags>) =>
  tryCatch(async (req: Request, res: Response) => {
    const tags = await model.find({});
    const count = await modelPost.count();
    return res.status(200).json({ count, tags });
  });
