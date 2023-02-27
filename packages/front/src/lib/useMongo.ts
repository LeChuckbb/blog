import clientPromise from "./mongodb";

const useMongo = async () => {
  const client = await clientPromise;
  const db = client.db("blog");

  const postsCollection = db.collection("posts");
  const tagsCollection = db.collection("tags");
  const authCollection = db.collection("auths");

  return { postsCollection, tagsCollection, authCollection };
};

export default useMongo;
