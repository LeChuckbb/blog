import clientPromise from "../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { decode, encode } from "html-entities";
import useMongo from "../../lib/useMongo";
import { apiHandler } from "../../lib/api";

const PAGE_SIZE = 8;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const createTags = (tags: any) => {
    if (tags === "" || undefined) return;
    if (typeof tags === "string") tags = [tags]; // []타입이 아니면 forEach에서 에러가 발생

    tags?.forEach(async (tag: string) => {
      // 1. tags collection에 동명의 tag document가 이미 존재하는 경우 -> count 증가
      const result = await tagsCollection.findOneAndUpdate(
        { name: tag },
        { $inc: { count: 1 } }
      );
      // 2. 동명의 tag documnet가 비존재 -> 새 document추가
      if (result.value === null)
        await tagsCollection.insertOne({ name: tag, count: 1 });
    });
  };

  const deleteTags = async (tags: Array<String>) => {
    tags?.forEach(async (tag) => {
      const result = await tagsCollection.findOne({ name: tag });
      if (result) {
        if (result.count > 1) {
          // 1. count가 1 초과인 경우 -> count만 감소
          await tagsCollection.findOneAndUpdate(
            { name: tag },
            { $inc: { count: -1 } }
          );
        } else {
          // 2. count가 1 이하인 경우 -> 해당 documnet를 삭제
          await tagsCollection.deleteOne({ name: tag });
        }
      }
    });
  };

  const updateTags = async (
    currentTags: Array<String>,
    inputTags: Array<String>
  ) => {
    // [] or ['val1', 'val2'...]
    const removeList = currentTags?.filter((x) => !inputTags?.includes(x));
    const addList = inputTags?.filter((x) => !currentTags?.includes(x));

    removeList?.length !== 0 && (await deleteTags(removeList));
    addList?.length !== 0 && (await createTags(addList));
  };

  const createPost = async (payload: any) => {
    // req.body에서 content 항목이 있으면 encode하여 DB에 저장
    // XSS 방지를 위해 HTML markup -> entity로 변경
    const body = {
      ...payload,
      tags: payload?.tags,
      thumbnail: payload?.file,
      html: encode(payload.html),
    };
    const result = await postsCollection.insertOne(body);
    await createTags(body?.tags);

    return result;
  };

  const getPostBySlug = async (slug: string) => {
    const results = await postsCollection.findOne({
      urlSlug: slug,
    });
    const resultBody = {
      ...results,
      html: decode(results?.html),
      markup: results?.markup,
    };
    return resultBody;
  };

  const deletePost = async (slug: string) => {
    const result = await postsCollection.findOneAndDelete({ urlSlug: slug });

    await deleteTags(result?.value?.tags);
    return result;
  };

  const updatePost = async (prevSlug: string, payload: any) => {
    const body = {
      ...payload,
      html: encode(payload.html),
    };

    const result = await postsCollection.findOneAndUpdate(
      { urlSlug: prevSlug },
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

    await updateTags(result?.value?.tags, body.tags);
    return result;
  };

  const getPostByPage = async (tagQuery: string, pageQuery: string) => {
    const count =
      tagQuery === "all"
        ? await postsCollection.count({})
        : await postsCollection.count({ tags: tagQuery });
    const page = Number(pageQuery);
    const IS_NEXT_PAGE_EXIST = count - page * PAGE_SIZE <= 0 ? null : true;
    const next = !IS_NEXT_PAGE_EXIST ? IS_NEXT_PAGE_EXIST : page + 1;
    const prev = page === 1 ? null : page - 1;

    const results =
      tagQuery === "all"
        ? await postsCollection
            .find({}, { projection: { html: 0, markup: 0 } })
            .sort({ date: -1 })
            .skip(PAGE_SIZE * (page - 1))
            .limit(PAGE_SIZE)
            .toArray()
        : await postsCollection
            .find({ tags: tagQuery }, { projection: { html: 0, markup: 0 } })
            .sort({ date: -1 })
            .skip(PAGE_SIZE * (page - 1))
            .limit(PAGE_SIZE)
            .toArray();

    return { count, next, prev, results };
  };

  const { postsCollection, tagsCollection } = await useMongo();

  if (req.method === "POST") {
    const results = await createPost(req.body);
    res.json({ status: 200, results });
  } else if (req.method === "GET") {
    if (req.query?.slug) {
      // getPostBySlug
      const results = await getPostBySlug(req.query.slug as string);
      res.json({ status: 200, results });
    } else if (req.query?.page) {
      const results = await getPostByPage(
        req.query.tag as string,
        req.query.page as string
      );
      res.json({ ...results });
    }
  } else if (req.method === "PATCH") {
    const updateResult = await updatePost(req.query.slug as string, req.body);
    res.json(updateResult);
  } else if (req.method === "DELETE") {
    const result = await deletePost(req.query.slug as string);
    res.json(result);
  }
};
