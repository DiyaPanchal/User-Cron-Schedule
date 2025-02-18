import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  status: "active" | "inactive";
  lastLogin: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  lastLogin: { type: Date, default: null },
});

export default mongoose.model<IUser>("User", UserSchema);
