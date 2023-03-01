import axiosInstance from ".";
import axios, { AxiosResponse } from "axios";

export const getUploadImageURL = () => axiosInstance.get(`/uploadURL`);

export const getFileFromCF = async (
  imageId: string
): Promise<{ result: AxiosResponse; base64Image: string }> => {
  const url = `${process.env.NEXT_PUBLIC_CF_RECEIVE_URL}/${imageId}/public`;
  const result = await axios.get(url, {
    responseType: "arraybuffer",
  });
  const base64Image = btoa(
    new Uint8Array(result.data).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );

  return { result, base64Image };
};
