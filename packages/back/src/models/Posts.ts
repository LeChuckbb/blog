import mongoose, { Schema } from "mongoose";

export interface Post {
  thumbnail: string;
  urlSlug: string;
  title: string;
  subTitle: string;
  date: string;
  content: string;
  tags: Array<String>;
}

const PostSchema: Schema = new Schema<Post>({
  thumbnail: {
    type: String,
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
  },
  date: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    requried: true,
  },
  tags: {
    type: [String],
  },
});

export default mongoose.model<Post>("posts", PostSchema);
