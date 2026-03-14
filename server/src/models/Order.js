import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    note: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Food',
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    note: String,
    deliveryAddress: deliverySchema,
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cooking', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    total: { type: Number, required: true },
    paymentMethod: String,
    paymentStatus: { type: Boolean },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
