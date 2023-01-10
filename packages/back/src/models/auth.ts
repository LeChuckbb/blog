import mongoose, { Schema } from "mongoose";

export interface Auth {
  id: string;
  salt: string;
  hashedPwd: string;
}

const AuthSchema: Schema = new Schema<Auth>({
  id: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  hashedPwd: {
    type: String,
    required: true,
  },
});

export default mongoose.model<Auth>("Auth", AuthSchema);
