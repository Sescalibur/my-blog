import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  role: {
    type: String,
    default: 'user'
  }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema); 