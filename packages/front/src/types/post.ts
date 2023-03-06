export interface PostSchema {
  _id?: string;
  title: string;
  subTitle?: string;
  date: string;
  urlSlug: string;
  tags: [string] | [];
  html: string;
  markdown: string;
  thumbnail: {
    name: string;
    id: string;
  };
}
