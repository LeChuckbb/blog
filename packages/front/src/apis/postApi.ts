import axiosInstance from ".";

export const getPost = () => axiosInstance.get(`/posts`);

export const createPost = (body: any) => axiosInstance.post("/posts", body);

export const getPostByIdApi = (postId: string) =>
  axiosInstance.get(`/posts/${postId}`);

export const updatePost = (postId: string) =>
  axiosInstance.get(`/posts/${postId}`);

export const deletePost = (postId: string) =>
  axiosInstance.delete(`/posts/${postId}`);

export const getPostByPage = (page: number) =>
  axiosInstance.get(`/posts/findByAge?page=${page}`);

export const detailApi = (movieId: string) =>
  axiosInstance.get(`/movie/${movieId}`);

export const similarApi = (movieId: string) =>
  axiosInstance.get(`/movie/${movieId}/similar`);

export const searchApi = (query: string) =>
  axiosInstance.get(`/search/movie?query=${query}`);
