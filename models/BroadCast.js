import { Schema, model } from 'mongoose';

const BroadCastSchema = new Schema({
  streamId: {
    type: String,
    default: '',
  },
  eventId: {
    type: String,
    default: '',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  language: {
    type: String,
    default: '',
  },
  isBroadcasting: {
    type: Boolean,
    default: false,
  },
});

const BroadCast = model('BroadCast', BroadCastSchema);

export default BroadCast;
