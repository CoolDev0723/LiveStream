import { Schema, model } from 'mongoose';

// Create Schema
const EventSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
  },
  subCat: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  state: {
    type: String,
    default: '',
  },
  timeZone: {
    type: String,
    default: '',
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  numberOfBroadCasters: {
    type: Number,
    default: 0,
  },
  broadcasts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'BroadCast',
    },
  ],
});

const Event = model('Event', EventSchema);

export default Event;
