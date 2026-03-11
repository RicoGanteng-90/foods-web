import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: String,
    imgUrl: String,
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
