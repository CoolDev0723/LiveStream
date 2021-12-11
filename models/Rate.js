import { Schema, model } from 'mongoose';

const RateSchema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    required: false,
    type: String,
    default: ""
  }
});

const Rate = model('Rate', RateSchema);

export default Rate;
