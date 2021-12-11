import { Schema, model } from 'mongoose';

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  timezone: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  register_date: {
    type: Date,
    default: Date.now
  }
});

const User = model('User', UserSchema);

export default User;
