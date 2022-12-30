import mongoose, { Schema } from "mongoose";

export interface Post {
  image: string;
  urlSlug: string;
  title: string;
  subTitle: string;
  date: string;
  tags: Array<String>;
}

const PostSchema: Schema = new Schema<Post>({
  image: {
    type: String,
    required: true,
  },
  urlSlug: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: false,
  },
});

export default mongoose.model<Post>("posts", PostSchema);
