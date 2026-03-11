import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    comment: String,
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

const FoodSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: String,
    price: { type: Number, required: true, min: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    isAvailable: { type: Boolean, default: true },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Food = mongoose.model('Food', FoodSchema);

export default Food;
