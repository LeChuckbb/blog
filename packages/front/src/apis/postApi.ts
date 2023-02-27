import axiosInstance from ".";

export const uploadThumbnail = (formData: any) =>
  axiosInstance.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

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

export const getPostTags = () => axiosInstance.get(`/tags`);
