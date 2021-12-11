import { Schema, model } from 'mongoose';

// Create Schema
const TimeZoneSchema = new Schema({
  lang: {
    type: String,
    required: true,
    unique: true
  }
});

const TimeZone = model('TimeZone', TimeZoneSchema);

export default TimeZone;
