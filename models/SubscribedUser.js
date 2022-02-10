import { Schema, model } from 'mongoose';

const SubscribedUserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const SubscribedUser = model('SubscribedUser', SubscribedUserSchema);

export default SubscribedUser;
