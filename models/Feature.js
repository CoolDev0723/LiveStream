import { Schema, model } from 'mongoose';

const FeatureSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    required: true
  },
  subCat: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  state: {
    type: String,
    default: ""
  },
  timeZone: {
    type: String,
    default: ""
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  broadcasts:[{
    type: Schema.Types.ObjectId,
    ref: 'BroadCast'
  }]
});

const Feature = model('Feature', FeatureSchema);

export default Feature;
