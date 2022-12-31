import mongoose, { Schema } from "mongoose";

export interface Post {
  thumbnailImg: string;
  urlSlug: string;
  title: string;
  subTitle: string;
  date: string;
  content: string;
  tags: Array<String>;
}

const PostSchema: Schema = new Schema<Post>({
  thumbnailImg: {
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
  content: {
    type: String,
    requried: true,
  },
  tags: {
    type: [String],
    required: false,
  },
});

export default mongoose.model<Post>("posts", PostSchema);
