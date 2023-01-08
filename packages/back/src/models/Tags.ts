import mongoose, { ObjectId, Schema } from "mongoose";

export interface Tags {
  name: string;
  count: number;
}

const TagsSchema: Schema = new Schema<Tags>({
  count: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model<Tags>("Tag", TagsSchema);
