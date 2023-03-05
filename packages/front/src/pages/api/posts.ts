import type { NextApiHandler } from "next";
import useMongo from "../../lib/useMongo";
import { apiHandler } from "../../lib/api";
import ObjectID from "bson-objectid";

const PAGE_SIZE = 8;

const createTags = async (tags: any) => {
  if (tags === "" || undefined) return;
  if (typeof tags === "string") tags = [tags]; // []타입이 아니면 forEach에서 에러가 발생
  const { tagsCollection } = await useMongo();

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

const getPost: NextApiHandler = async (req, res) => {
  const { postsCollection } = await useMongo();
  if (req.query?.slug) {
    // getPostBySlug
    const results = await postsCollection.findOne({
      urlSlug: req.query.slug,
    });
    const resultBody = {
      ...results,
      // html: decode(results?.html),
      html: results?.html,
      markdown: results?.markdown,
    };
    res.status(200).json(resultBody);
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
        : // 8 *
          await postsCollection
            .find({ tags: tagQuery }, { projection: { html: 0, markdown: 0 } })
            .sort({ date: -1, _id: 1 })
            .skip(PAGE_SIZE * (page - 1))
            .limit(PAGE_SIZE)
            .toArray();

    res.status(200).json({ count, next, prev, results });
  }
};

const createPost: NextApiHandler = async (req, res) => {
  // req.body에서 content 항목이 있으면 encode하여 DB에 저장
  // XSS 방지를 위해 HTML markdown -> entity로 변경
  const { postsCollection } = await useMongo();
  const body = {
    ...req.body,
  };
  const result = await postsCollection.insertOne(body);
  await createTags(body?.tags);

  res.status(200).json({ insertResult: result, urlSlug: req.body.urlSlug });
};

const updatePost: NextApiHandler = async (req, res) => {
  const { postsCollection } = await useMongo();
  const body = {
    ...req.body,
  };

  const result = await postsCollection.findOneAndUpdate(
    { _id: ObjectID.createFromHexString(req.query.id as string) },
    {
      $set: {
        thumbnail: body.thumbnail,
        urlSlug: body.urlSlug,
        title: body.title,
        subTitle: body.subTitle,
        date: body.date,
        html: body.html,
        markdown: body.markdown,
        tags: body.tags,
      },
    }
  );

  if (result.value === null) throw new Error("게시글 업데이트 실패");

  await updateTags(result?.value?.tags, body.tags);
  res.status(200).json({ updateResult: result, urlSlug: req.body.urlSlug });
};

const deletePost: NextApiHandler = async (req, res) => {
  const { postsCollection } = await useMongo();
  const result = await postsCollection.findOneAndDelete({
    _id: ObjectID.createFromHexString(req.query.id as string),
  });

  await deleteTags(result?.value?.tags);
  res.status(200).end();
};

export default apiHandler({
  GET: getPost,
  POST: createPost,
  PATCH: updatePost,
  DELETE: deletePost,
});
