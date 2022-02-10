import { Schema, model } from 'mongoose';

// Create Schema
const LanguageSchema = new Schema({
  language: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  }
});

const Language = model('Language', LanguageSchema);

export default Language;
