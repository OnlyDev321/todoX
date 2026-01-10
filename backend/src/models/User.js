import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String, // link cdn de hien thi hinh
    },
    avatarId: {
      type: String, // Cloudinary public_id de xoa hinh
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    phone: {
      type: String,
      sparse: true, //cho phep null, nhung ko dc trung
    },
  },
  {
    timestamps: true, //createAt va updateAt tu dong them vao
  }
);

const User = mongoose.model("User", userSchema);
export default User;
