import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  avatar?: string
  coverImage?: string
  bio?: string
  role: string
  socialLinks?: {
    twitter?: string
    github?: string
    linkedin?: string
    website?: string
  }
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  coverImage: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500,
    default: null
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  socialLinks: {
    type: new Schema({
      twitter: { type: String, default: null },
      github: { type: String, default: null },
      linkedin: { type: String, default: null },
      website: { type: String, default: null }
    }, { _id: false }),
    default: () => ({
      twitter: null,
      github: null,
      linkedin: null,
      website: null
    })
  }
}, {
  timestamps: true
})

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema) 