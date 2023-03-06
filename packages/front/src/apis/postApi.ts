import axiosInstance from ".";
import { PostSchema } from "../types/post";

// export const getPost = () => axiosInstance.get(`/posts`);

export const getPostBySlug = (slug: string): Promise<PostSchema> =>
  axiosInstance.get(`/posts?slug=${slug}`);

export const getPostById = (id: string) => axiosInstance.get(`/posts?id=${id}`);

export const getPostByPage = async (page: number, tag: string) => {
  const res = await axiosInstance.get(`/posts?page=${page}&tag=${tag}`);
  return res.data;
};

export const createPost = (body: any) => axiosInstance.post("/posts", body);

export const updatePost = (id: string, body: any) =>
  axiosInstance.patch(`/posts?id=${id}`, body);

export const deletePost = (id: string) =>
  axiosInstance.delete(`/posts?id=${id}`);

export const getPostTags = async () => {
  const res = await axiosInstance.get(`/tags`);
  return res.data;
};
