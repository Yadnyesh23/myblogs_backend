import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    //   required: true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
      required: true,
    },
    comments: [
      {
        content: String,
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
},
{
    timestamps:true
})

export const Blog = mongoose.model("Blog", blogSchema)