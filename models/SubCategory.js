import { Schema, model } from 'mongoose';

// Create Schema
const SubCategorySchema = new Schema({
  category: {
    type: String,
    required: true,
    unique: true
  },
  subCategory: {
    type: String,
    required: true,
    unique: true
  }
});

const SubCategory = model('SubCategory', SubCategorySchema);

export default SubCategory;
