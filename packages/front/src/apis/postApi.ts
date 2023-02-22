import axiosInstance from ".";

export const getPost = () => axiosInstance.get(`/posts`);

export const createPost = (body: any) => {
  return axiosInstance.post("/posts", body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updatePost = (slug: string, body: any) => {
  return axiosInstance.patch(`/posts/${slug}`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deletePost = (slug: string) =>
  axiosInstance.delete(`/posts/${slug}`);

export const getPostBySlug = (slug: string) =>
  axiosInstance.get(`/posts/findBySlug?slug=${slug}`);

export const getPostByPage = (page: number, tag: string) =>
  axiosInstance.get(`/posts/findByPage?page=${page}&tag=${tag}`);

export const getPostTags = () => axiosInstance.get(`/posts/tags`);
