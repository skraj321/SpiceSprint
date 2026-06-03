import express from "express";
import { isAuth } from "../middleware/authUser.js";
import {
  getMyOrders,
  placeOrder,
  updateOrderStatus,
  getAssignment,
  acceptOrder,
  currentOrder,
  getOrderById,
  sendDelOtp,
  verifyDeliveryOtp,
  verifyPayment,
    getTotalDeliveries
} from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place-order", isAuth, placeOrder);
orderRouter.post("/verify-payment", isAuth, verifyPayment);
orderRouter.get("/my-orders", isAuth, getMyOrders);
orderRouter.get("/get-assignment", isAuth, getAssignment);
orderRouter.get("/accept-order/:assignmentId", isAuth, acceptOrder);
orderRouter.get("/get-current-order", isAuth, currentOrder);
orderRouter.post("/send-del-otp", isAuth, sendDelOtp);
orderRouter.post("/verify-del-otp", isAuth, verifyDeliveryOtp);
orderRouter.post("/update-status/:orderId/:shopId", isAuth, updateOrderStatus);
orderRouter.get("/get-order-byId/:orderId", isAuth, getOrderById);
orderRouter.get("/get-total-deliveries", isAuth, getTotalDeliveries);

export default orderRouter;
