import type { NextApiHandler } from "next";
import useMongo from "../../lib/useMongo";
import { apiHandler } from "../../lib/api";
import ObjectID from "bson-objectid";
import { AppError } from "../../lib/api";

const PAGE_SIZE = 8;

const CreateTags = async (tags: string[]) => {
  const { tagsCollection } = await useMongo();
  if (!tags || tags.length === 0) return;
  if (typeof tags === "string") tags = [tags]; // []타입이 아니면 forEach에서 에러가 발생

  // 1. tags collection에 동명의 tag document가 이미 존재하는 경우 -> count 증가
  // 2. 동명의 tag documnet가 비존재 -> 새 document추가
  for (const tag of tags) {
    await tagsCollection.findOneAndUpdate(
      { name: tag },
      { $inc: { count: 1 } },
      { upsert: true }
    );
  }
};

const DeleteTags = async (tags: string[]) => {
  const { tagsCollection } = await useMongo();
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

const updateTags = async (currentTags: string[], inputTags: string[]) => {
  const removeList = currentTags?.filter((x) => !inputTags?.includes(x));
  const addList = inputTags?.filter((x) => !currentTags?.includes(x));

  if (removeList?.length !== 0) await DeleteTags(removeList);
  if (addList?.length !== 0) await CreateTags(addList);
};

const GetPost: NextApiHandler = async (req, res) => {
  const { postsCollection } = await useMongo();
  if (req.query?.slug) {
    // getPostBySlug
    const results = await postsCollection.findOne({
      urlSlug: req.query.slug,
    });
    res.status(200).json({ ...results });
  } else if (req.query?.id) {
    // getPostById
    const result = await postsCollection.findOne({
      _id: ObjectID.createFromHexString(req.query.id as string),
    });

    if (!result)
      throw new AppError(
        "POE007",
        "게시글을 찾을 수 없습니다. 입력한 id가 올바른지 확인하세요.",
        404
      );

    res.status(200).json({ ...result });
  } else if (req.query?.page) {
    // getPostByPage
    const tagQuery = req.query.tag;
    const pageQuery = req.query.page;
    const page = Number(pageQuery);

    const count =
      tagQuery === "all"
        ? await postsCollection.count({})
        : await postsCollection.count({ tags: tagQuery });
    const IS_NEXT_PAGE_EXIST = count - page * PAGE_SIZE <= 0 ? null : true;
    const next = !IS_NEXT_PAGE_EXIST ? IS_NEXT_PAGE_EXIST : page + 1;
    const prev = page === 1 ? null : page - 1;

    const results =
      tagQuery === "all"
        ? await postsCollection
            .find({}, { projection: { html: 0, markdown: 0 } })
            .sort({ date: -1, _id: 1 })
            .skip(PAGE_SIZE * (page - 1))
            .limit(PAGE_SIZE)
            .toArray()
        : await postsCollection
            .find({ tags: tagQuery }, { projection: { html: 0, markdown: 0 } })
            .sort({ date: -1, _id: 1 })
            .skip(PAGE_SIZE * (page - 1))
            .limit(PAGE_SIZE)
            .toArray();

    res.status(200).json({ count, next, prev, results });
  }
};

const CreatePost: NextApiHandler = async (req, res) => {
  const { postsCollection } = await useMongo();
  const body = { ...req.body };

  const result = await postsCollection.insertOne(body);
  await CreateTags(body?.tags);

  res.status(200).json({ insertResult: result, urlSlug: body.urlSlug });
};

const UpdatePost: NextApiHandler = async (req, res) => {
  const { postsCollection } = await useMongo();
  const body = { ...req.body };

  const result = await postsCollection.findOneAndUpdate(
    { _id: ObjectID.createFromHexString(req.query.id as string) },
    {
      $set: { ...body },
    }
  );

  if (result.value === null)
    throw new AppError(
      "POE005",
      "게시글 업데이트 실패. 요청한 게시글을 찾을 수 없음",
      404
    );

  await updateTags(result?.value?.tags, body.tags);
  res.status(200).json({ updateResult: result, urlSlug: req.body.urlSlug });
};

const DeletePost: NextApiHandler = async (req, res) => {
  const { postsCollection } = await useMongo();
  const result = await postsCollection.findOneAndDelete({
    _id: ObjectID.createFromHexString(req.query.id as string),
  });

  if (result.value === null)
    throw new AppError(
      "POE006",
      "게시글 삭제 실패. 요청한 게시글을 찾을 수 없음",
      404
    );

  await DeleteTags(result?.value?.tags);
  res.status(200).end();
};

export default apiHandler({
  GET: GetPost,
  POST: CreatePost,
  PATCH: UpdatePost,
  DELETE: DeletePost,
});
