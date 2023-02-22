import mongoose, { Schema } from "mongoose";

export interface Post extends mongoose.Document {
  urlSlug: string;
  title: string;
  subTitle: string;
  date: string;
  markup: string;
  html: string;
  tags: Array<String>;
  thumbnail: {
    fieldname: string;
    orignalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  };
}

const PostSchema: Schema = new Schema<Post>({
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
  html: {
    type: String,
    required: true,
  },
  markup: {
    type: String,
    required: true,
  },
  tags: [String],
  thumbnail: {
    fieldname: {
      type: String,
    },
    orignalname: {
      type: String,
    },
    encoding: {
      type: String,
    },
    mimetype: {
      type: String,
    },
    destination: {
      type: String,
    },
    filename: {
      type: String,
    },
    path: {
      type: String,
    },
    size: {
      type: Number,
    },
  },
});

export default mongoose.model<Post>("Post", PostSchema);
