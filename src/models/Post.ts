import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: false
  },
  slug: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const Post = mongoose.models.Post || mongoose.model('Post', postSchema) 