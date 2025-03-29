const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    userName: { type: String, required:true },
    email: { type: String, required:true, unique:true },
    password: { type:String, required:true },
    bio: { type: String, default: "" }, 
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], 
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], 
    createdAt: { type: Date, default: Date.now},
})

module.exports = mongoose.model("User", userSchema);