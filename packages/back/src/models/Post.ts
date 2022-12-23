import mongoose, { Schema, Model } from "mongoose";

interface Post {
  image: string;
  title: string;
  subTitle: string;
  date: string;
  tags: Array<String>;
}

// Static 정의
interface PostMethods extends Model<Post> {
  postSchemaStatic(): number;
  findAll(): any;
}

// Method 정의
// interface PostMethods extends Model<Post> {
// postSchemaMethod(): number;
// }

// type PostMethodModel = Model<Post, {}, PostMethods>;

const PostSchema: Schema = new Schema<Post>({
  image: {
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

// 메서드 정의
PostSchema.method("postSchemaMethod", function () {
  console.log(this);
  // 각종 쿼리식
  return 23;
});

// static 정의
PostSchema.static("postSchemaStatic", function () {
  return 42;
});

PostSchema.statics.findAll = () => {
  // PostSchema.statics.findAll = () => {
  // console.log(this);
  // console.log(this.find({}));
  console.log(this);
  // return this.find({});
};

export default mongoose.model<Post, PostMethods>("posts", PostSchema);
