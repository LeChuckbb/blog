import axiosInstance from ".";

export const getPost = () => axiosInstance.get(`/posts`);

export const getPostById = (postId: string) =>
  axiosInstance.get(`/posts/findById?id=${postId}`);

export const getPostByPage = (page: number) =>
  axiosInstance.get(`/posts/findByPage?page=${page}`);

export const createPost = (body: any) => axiosInstance.post("/posts", body);

export const updatePost = (postId: string) =>
  axiosInstance.get(`/posts/${postId}`);

export const deletePost = (postId: string) =>
  axiosInstance.delete(`/posts/${postId}`);

export const getPostBySlug = (slug: string) =>
  axiosInstance.get(`/posts/findBySlug?slug=${slug}`);
