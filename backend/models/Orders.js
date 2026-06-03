import mongoose from "mongoose";
const shopOrderItemSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    name: String,
    price: Number,
    quantity: Number,
  },
  { timestamps: true },
);
const shopOrderSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subTotal: Number,
    shopOrderItems: [shopOrderItemSchema],
    status: {
      type: String,
      enum: [
        "pending",
        "preparing",
        "out for delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DelAssignment",
      default: null,
    },
    assignedDelBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deliveryOtp: { type: String, default:null },
    otpExpiry: { type: Date, default:null },
    deliveredAt:{
      type:Date,
      default:null
    }
  },
  
  { timestamps: true },
);
const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },
    delAddress: {
      text: String,
      latitude: Number,
      longitude: Number,
    },
    totalAmount: {
      type: Number,
    },
    shopOrders: [shopOrderSchema],
    payment:{
      type:Boolean,
      default:false
    },
    razorpayOrderId:{
      type:String,
      default:""
    },
    razorpaySecretId:{
      type:String,
      default:""
    },
    razorpayPaymentId:{
      type:String,
      default:""
    }
  },

  { timestamps: true },
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
