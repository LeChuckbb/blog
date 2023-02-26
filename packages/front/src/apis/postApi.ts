import axiosInstance, { atlasInstance } from ".";

export const uploadThumbnail = (formData: any) =>
  atlasInstance.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getPost = () => atlasInstance.get(`/posts`);

export const getPostBySlug = (slug: string) =>
  atlasInstance.get(`/posts?slug=${slug}`);

export const createPost = (body: any) => atlasInstance.post("/posts", body);

export const updatePost = (slug: string, body: any) =>
  atlasInstance.patch(`/posts?slug=${slug}`, body);

export const deletePost = (slug: string) =>
  atlasInstance.delete(`/posts?slug=${slug}`);

export const getPostByPage = async (page: number, tag: string) => {
  const res = await atlasInstance.get(`/posts?page=${page}&tag=${tag}`);
  return res.data;
};

export const getPostTags = () => atlasInstance.get(`/tags`);
