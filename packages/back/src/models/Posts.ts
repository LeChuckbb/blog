import mongoose, { Schema } from "mongoose";

export interface Post extends mongoose.Document {
  thumbnail: string;
  urlSlug: string;
  title: string;
  subTitle: string;
  date: string;
  content: string;
  tags: Array<String>;
  // tags: any;
}

const PostSchema: Schema = new Schema<Post>({
  thumbnail: String,
  urlSlug: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  subTitle: String,
  date: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    requried: true,
  },
  tags: [String],
  // tags: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Tag",
  // },
});

export default mongoose.model<Post>("Post", PostSchema);
