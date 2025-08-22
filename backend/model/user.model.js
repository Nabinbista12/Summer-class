import { Schema, model } from "mongoose";

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  skills: {
    type: [String],
    default: [],
  },
  experience: [
    {
      title: { type: String, required: true },
      company: { type: String, required: true },
      years: { type: Number, required: true },
      description: { type: String, default: "" },
    },
  ],
  projects: [
    {
      title: { type: String, required: false },
      description: { type: String, default: "" },
      link: { type: String, default: "" },
      imageUrl: { type: String, default: "" },
    },
  ],
  profilePicture: {
    url: {
      type: String,
    },
    public_id: {
      type: String,
    },
  },
  connections: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = model("User", userSchema);
export default User;
