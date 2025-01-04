import mongoose, { Schema, Document } from 'mongoose'

export interface IComment extends Document {
  content: string
  author: mongoose.Types.ObjectId
  post: mongoose.Types.ObjectId
  parentComment?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new Schema({
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 1000
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }
}, {
  timestamps: true
})

export const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema) 