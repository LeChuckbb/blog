import { Request, Response } from "express";
import { Post } from "../models/Posts";
import { Tags } from "../models/Tags";
import { decode } from "html-entities";
import mongoose, { Document, Model, Error, Mongoose } from "mongoose";
import { encode } from "html-entities";
import { MongoError } from "mongodb";
import modelTags from "../models/Tags";
import modelPost from "../models/Posts";

const PAGE_SIZE = 8;

export const getPostByPage =
  (model: Model<Post>) => async (req: Request, res: Response) => {
    try {
      const count = await model.count({});
      const page = Number(req.query.page);
      const IS_NEXT_PAGE_EXIST = count - page * PAGE_SIZE <= 0 ? null : true;
      const next = !IS_NEXT_PAGE_EXIST ? IS_NEXT_PAGE_EXIST : page;
      const prev = page === 1 ? null : page - 1;

      // find에서 content는 제외
      const results = await model
        .find({}, { content: 0 })
        .skip(PAGE_SIZE * (page - 1))
        .limit(PAGE_SIZE);

      return res.status(200).json({
        count,
        next,
        prev,
        results,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };

export const getPostBySlug =
  (model: Model<Post>) => async (req: Request, res: Response) => {
    try {
      const results = await model.findOne({ urlSlug: req.query.slug });
      const resultObj = results?.toObject();
      const resultBody = {
        ...resultObj,
        content: decode(results?.content),
      };

      return res.status(200).json(resultBody);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };

// 에러 처리 요망 (catch에서 잡아주는지?)
const createTags = (tags: any) => {
  tags.forEach(async (tag: string) => {
    // 1. tags collection에 동명의 tag document가 이미 존재하는 경우 -> count 증가
    const result = await modelTags.findOneAndUpdate(
      { name: tag },
      { $inc: { count: 1 } }
    );
    // 2. 동명의 tag documnet가 비존재 -> 새 document추가
    if (result === null) await modelTags.create({ name: tag, count: 1 });
  });
};

export const createPost =
  (model: Model<Post>) => async (req: Request, res: Response) => {
    try {
      // req.body에서 content 항목이 있으면 encode하여 DB에 저장
      // XSS 방지를 위해 HTML markup -> entity로 변경
      const body = req?.body?.content
        ? {
            ...req.body,
            content: encode(req.body.content),
          }
        : req.body;
      const result = await model.create(body);
      createTags(body.tags);

      return res.status(201).json({ result });
    } catch (error) {
      if (error instanceof Error.ValidationError) {
        console.log("Mongoose Error Here");
      } else if ((error as MongoError).code === 11000) {
        return res.status(409).json({
          message: "duplicate key error",
          error: error,
        });
      }
      return res.status(500).json({ error });
    }
  };

const updateTags = async (
  currentTags: Array<String>,
  inputTags: Array<String>
) => {
  // [] or ['val1', 'val2'...]
  const removeList = currentTags.filter((x) => !inputTags.includes(x));
  const addList = inputTags.filter((x) => !currentTags.includes(x));

  removeList.length !== 0 && (await deleteTags(removeList));
  addList.length !== 0 && (await createTags(addList));
};

export const updatePost =
  (model: Model<Post>, populate?: string[]) =>
  async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const body = req.body;

    try {
      const result = await model.findOneAndUpdate(
        { urlSlug: slug },
        {
          $set: {
            thumbnail: body.thumbnail,
            urlSlug: body.urlSlug,
            title: body.title,
            subTitle: body.subTitle,
            date: body.date,
            content: body.content,
            tags: body.tags,
          },
        }
      );

      if (result === null) throw new Error("update 에러. result = null");
      // 1. tag를 추가한 경우 createTags()
      // 2. tag를 삭제한 경우 removeTags
      // body.tags(input)와 result.tags(current)를 비교
      updateTags(result?.tags, body.tags);
      return res.status(200).json({ result });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };

const deleteTags = (tags: Array<String>) => {
  tags.forEach(async (tag) => {
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

export const deletePost =
  (model: Model<Post>) => async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      // 1. post 삭제.
      const result = await model.findOneAndDelete({ urlSlug: slug });
      // 2. post에 존재하던 tags를 받아와서 Tags 콜렉션에 검색
      // 3. tag document의 count 값이 1 초과인경우 count만 증감. 1 이하인 경우 document 자체를 삭제
      if (result !== null) deleteTags(result.tags);

      return result === null
        ? res
            .status(204)
            .json({ message: "삭제 실패. 존재하지 않는 slug입니다." })
        : res.status(200).json({ message: "삭제 성공." });
    } catch (error) {
      console.log("ERROR");
      console.log(error);
      return res.status(500).json({ error });
    }
  };

export const getPostTags =
  (model: Model<Tags>) => async (req: Request, res: Response) => {
    try {
      const tags = await model.find({});
      const count = await modelPost.count();
      return res.status(200).json({ count, tags });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
