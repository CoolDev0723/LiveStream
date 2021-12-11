import { Schema, model } from 'mongoose';

// Create Schema
const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
});

const Category = model('Category', CategorySchema);

export default Category;
