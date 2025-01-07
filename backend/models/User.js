import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isadmin: Boolean,
});

const User = mongoose.model("User", userSchema);

export default User;
