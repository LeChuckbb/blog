import axiosInstance from ".";

export const getPost = () => axiosInstance.get(`/posts`);

export const createPost = (body: any) => axiosInstance.post("/posts", body);

export const updatePost = (slug: string, body: any) =>
  axiosInstance.patch(`/posts/${slug}`, body);

export const deletePost = (slug: string) =>
  axiosInstance.delete(`/posts/${slug}`);

export const getPostBySlug = (slug: string) =>
  axiosInstance.get(`/posts/findBySlug?slug=${slug}`);

export const getPostByPage = (page: number) =>
  axiosInstance.get(`/posts/findByPage?page=${page}`);
