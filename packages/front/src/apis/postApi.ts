import axiosInstance from ".";

export const getPost = () => axiosInstance.get(`/posts`);

export const getPostBySlug = (slug: string) =>
  axiosInstance.get(`/posts?slug=${slug}`);

export const createPost = (body: any) => axiosInstance.post("/posts", body);

export const updatePost = (slug: string, body: any) =>
  axiosInstance.patch(`/posts?slug=${slug}`, body);

export const deletePost = (slug: string) =>
  axiosInstance.delete(`/posts?slug=${slug}`);

export const getPostByPage = async (page: number, tag: string) => {
  const res = await axiosInstance.get(`/posts?page=${page}&tag=${tag}`);
  return res.data;
};

export const getPostTags = async () => {
  const res = await axiosInstance.get(`/tags`);
  return res.data;
};
