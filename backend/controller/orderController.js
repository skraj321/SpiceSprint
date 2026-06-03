import Shop from "../models/ShopModel.js";
import Order from "../models/Orders.js";
import User from "../models/User.js";
import DelAssignment from "../models/DelAssignment.js";
import { response } from "express";
import { sendDelOtpMail } from "../utils/mail.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, delAddress, totalAmount } = req.body;
    if (cartItems.length == 0 || !cartItems)
      return res.status(400).json({ message: "Cart is empty" });
    if (!delAddress.text || !delAddress.latitude || !delAddress.longitude)
      return res.status(400).json({ message: "Delivery address is required" });
    const groupItemsByShop = {};
    cartItems.forEach((item) => {
      const shopId = item.shop;
      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }
      groupItemsByShop[shopId].push(item);
    });
    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("admin");
        if (!shop) return res.status(404).json({ message: "Shop not found" });
        const items = groupItemsByShop[shopId];
        const subTotal = items.reduce(
          (total, i) => total + Number(i.price) * Number(i.quantity),
          0,
        );
        return {
          shop: shopId,
          admin: shop.admin._id,
          subTotal,
          shopOrderItems: items.map((i) => ({
            item: i.id,
            price: i.price,
            quantity: i.quantity,
            name: i.name,
          })),
        };
      }),
    );
    if (paymentMethod == "online") {
      const razorOrder = await instance.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
      const order = await Order.create({
        user: req.user.id,
        paymentMethod,
        delAddress,
        totalAmount,
        shopOrders,
        razorpayOrderId: (await razorOrder).id,
        payment: false,
      });
      return res.status(200).json({
        razorOrder,
        orderId: order._id,
      });
    }
    const order = await Order.create({
      user: req.user.id,
      paymentMethod,
      delAddress,
      totalAmount,
      shopOrders,
    });
    await order.populate("shopOrders.shop", "name image");
    await order.populate("shopOrders.shopOrderItems.item", "name image price");
    await order.populate("shopOrders.admin", "name email socketId");
    await order.populate("user", "name email mobile");
    const io = req.app.get("io");
    if (io) {
      order.shopOrders.forEach((shopOrder) => {
        const adminSocketId = shopOrder.admin.socketId;
        if (adminSocketId) {
          io.to(adminSocketId).emit("newOrder", order);
        }
      });
    }
    return res
      .status(201)
      .json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, orderId } = req.body;
    const payment = await instance.payments.fetch(razorpay_payment_id);
    if (!payment || payment.status != "captured") {
      return res.status(400).json({ message: "payment not captured" });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }
    order.payment = true;
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();
    await order.populate("shopOrders.shop", "name image");
    await order.populate("shopOrders.shopOrderItems.item", "name image price");
    await order.populate("shopOrders.admin", "name email socketId");
    await order.populate("user", "name email mobile");
    const io = req.app.get("io");
    if (io) {
      order.shopOrders.forEach((shopOrder) => {
        const adminSocketId = shopOrder.admin.socketId;
        if (adminSocketId) {
          io.to(adminSocketId).emit("newOrder", order);
        }
      });
    }
    return res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "verify Payment server error" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "user") {
      const orders = await Order.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.admin", "name email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");

      return res.status(200).json({ orders });
    } else if (user.role === "admin") {
      const orders = await Order.find({ "shopOrders.admin": req.user.id })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("user")
        .populate("shopOrders.shopOrderItems.item", "name image price")
        .populate("shopOrders.assignedDelBoy", "name mobile");

      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        shopOrders: order.shopOrders.find((o) => o.admin._id == req.user.id),
        createdAt: order.createdAt,
        delAddress: order.delAddress,
        payment: order.payment,
      }));

      return res.status(200).json({ orders: filteredOrders });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    const shopOrder = order.shopOrders.find(
      (o) => o.shop.toString() === shopId,
    );
    if (!shopOrder)
      return res.status(404).json({ message: "Shop order not found" });
    shopOrder.status = status;
    let delBoyPayload = [];
    if (status == "out for delivery" && !shopOrder.assignment) {
      const { longitude, latitude } = order.delAddress;
      const nearByDelBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: 20000,
          },
        },
      });
      const nearByIds = nearByDelBoys.map((d) => d._id);
      const busyIds = await DelAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((id) => id.toString()));
      const availableBoys = nearByDelBoys.filter(
        (d) => !busyIdSet.has(d._id.toString()),
      );
      const candidates = availableBoys.map((d) => d._id);
      if (candidates.length == 0) {
        return res.status(200).json({
          message:
            "Order status updated but no delivery boy available currently",
        });
      }
      const delAssignment = await DelAssignment.create({
        order: order._id,
        shop: shopOrder.shop,
        shoporderId: shopOrder._id,
        brodcastedTo: candidates,
        status: "broadcasted",
      });
      shopOrder.assignedDelBoy = delAssignment.assignedTo;
      shopOrder.assignment = delAssignment._id;
      delBoyPayload = availableBoys.map((d) => ({
        id: d._id,
        name: d.name,
        longitude: d.location.coordinates?.[0],
        latitude: d.location.coordinates?.[1],
        mobile: d.mobile,
        email: d.email,
      }));
      await delAssignment.populate("shop");
      await delAssignment.populate("order");

      const io = req.app.get("io");
      if (io) {
        availableBoys.forEach((boy) => {
          const boySocketId = boy.socketId;
          if (boySocketId) {
            io.to(boySocketId).emit("newAssignment", {
              sentTo:boy._id,
              assignmentId: delAssignment._id,
              orderId: delAssignment.order._id,
              shopName: delAssignment.shop.name,
              delAddress: delAssignment.order.delAddress,
              items:
                delAssignment.order.shopOrders.find((so) => so._id.equals(delAssignment.shoporderId))
                  ?.shopOrderItems || [],
              subTotal: delAssignment.order.shopOrders.find((so) =>
                so._id.equals(delAssignment.shoporderId),
              )?.subTotal,
            });
          }
        });
      }
    }
    await order.save();
    const updatedShopOrder = order.shopOrders.find(
      (o) => o.shop.toString() === shopId,
    );
    await order.populate("shopOrders.shop", "name");
    await order.populate("shopOrders.assignedDelBoy", "name mobile email");
    await order.populate("user", "socketId");
    const io = req.app.get("io");
    if (io) {
      const userSocketId = order.user.socketId;
      if (userSocketId) {
        io.to(userSocketId).emit("updateStatus", {
          orderId: order._id,
          shopId: updatedShopOrder.shop._id,
          status: updatedShopOrder.status,
          userId: order.user._id,
        });
      }
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      shopOrderstatus: updatedShopOrder,
      assignedDelBoy: updatedShopOrder?.assignedDelBoy,
      availableBoys: delBoyPayload,
      assignmentId: updatedShopOrder?.assignment,
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAssignment = async (req, res) => {
  try {
    const userId = req.user.id;
    const assignment = await DelAssignment.find({
      brodcastedTo: userId,
      status: "broadcasted",
    })
      .populate("order")
      .populate("shop");

    const formated = assignment.map((a) => ({
      assignmentId: a._id,
      orderId: a.order._id,
      shopName: a.shop.name,
      delAddress: a.order.delAddress,
      items:
        a.order.shopOrders.find((so) => so._id.equals(a.shoporderId))
          ?.shopOrderItems || [],
      subTotal: a.order.shopOrders.find((so) => so._id.equals(a.shoporderId))
        ?.subTotal,
    }));
    return res.status(200).json({ assignment: formated });
  } catch (err) {
    console.error("get Assignment assignment:", err);
    res.status(500).json({ message: "get Assignment server error" });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await DelAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(400).json({ message: "assignment not found" });
    }
    if (assignment.status != "broadcasted") {
      return res.status(400).json({ message: "assignment is expired" });
    }
    const alreadyAssigned = await DelAssignment.findOne({
      assignedTo: req.user.id,
      status: { $nin: ["broadcasted", "completed"] },
    });
    if (alreadyAssigned) {
      return res
        .status(400)
        .json({ message: "You are already assigned to another order" });
    }
    assignment.assignedTo = req.user.id;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();
    const order = await Order.findById(assignment.order);
    if (!order) {
      return res.status(400).json({ message: "Order Not Found" });
    }
    const shopOrder = order.shopOrders.find((so) =>
      so._id.equals(assignment.shoporderId),
    );
    shopOrder.assignedDelBoy = req.user.id;
    await order.save();
    await order.populate("shopOrders.assignedDelBoy");
    return res.status(200).json({
      message: "Order Accepted",
    });
  } catch (err) {
    res.status(500).json({ message: "Accept Order server error", err });
  }
};

export const currentOrder = async (req, res) => {
  try {
    const assignment = await DelAssignment.findOne({
      assignedTo: req.user.id,
      status: "assigned",
    })
      .populate("shop", "name")
      .populate("assignedTo", "name email mobile location")
      .populate({
        path: "order",
        populate: [{ path: "user", select: "name email location mobile" }],
      });

    if (!assignment) {
      return res.status(400).json({ message: "Assignment Not Found" });
    }
    if (!assignment.order) {
      return res.status(400).json({ message: "Order Not Found" });
    }
    const shopOrder = assignment.order.shopOrders.find(
      (so) => so._id.toString() === assignment.shoporderId.toString(),
    );
    if (!shopOrder) {
      return res.status(400).json({ message: "ShopOrder Not Found" });
    }

    let delBoyLocation = { lat: null, long: null };
    if (assignment.assignedTo.location.coordinates.length == 2) {
      delBoyLocation.lat = assignment.assignedTo.location.coordinates[1];
      delBoyLocation.long = assignment.assignedTo.location.coordinates[0];
    }
    let customerLocation = { lat: null, long: null };
    if (assignment.order.delAddress) {
      customerLocation.lat = assignment.order.delAddress.latitude;
      customerLocation.long = assignment.order.delAddress.longitude;
    }
    return res.status(200).json({
      _id: assignment.order._id,
      user: assignment.order.user,
      shop: assignment.shop,
      shopOrder,
      delAddress: assignment.order.delAddress,
      delBoyLocation,
      customerLocation,
    });
  } catch (err) {
    res.status(500).json({ message: "Current Order server error", err });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("user")
      .populate({
        path: "shopOrders.shop",
        model: "Shop",
      })
      .populate({
        path: "shopOrders.assignedDelBoy",
        model: "User",
      })
      .populate({
        path: "shopOrders.shopOrderItems.item",
        model: "Item",
      })
      .lean();

    if (!order) {
      return res.status(400).json({ msg: "Order Not Found" });
    }
    return res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "getting Order By id server error", err });
  }
};

export const sendDelOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId } = req.body;
    const order = await Order.findById(orderId).populate("user");
    const shopOrder = order.shopOrders.id(shopOrderId);
    if (!order || !shopOrder) {
      return res.status(400).json({ msg: "Enter valid order" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    shopOrder.deliveryOtp = otp;
    shopOrder.otpExpiry = Date.now() + 5 * 60 * 1000;
    await order.save();
    await sendDelOtpMail(order.user, otp);
    return res
      .status(200)
      .json({ msg: `OTP sent successfully to ${order?.user?.name}` });
  } catch (err) {
    res.status(500).json({ message: "Delivery time server error", err });
  }
};

export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId, otp } = req.body;
    const order = await Order.findById(orderId).populate("user");
    const shopOrder = order.shopOrders.id(shopOrderId);
    if (shopOrder.deliveryOtp !== otp || !shopOrder.otpExpiry) {
      return res.status(400).json({ msg: "Invalid/Expired OTP" });
    }
    if (shopOrder.otpExpiry < Date.now()) {
      return res.status(400).json({ msg: "Invalid/Expired OTP" });
    }
    shopOrder.status = "delivered";
    shopOrder.deliveredAt = Date.now();
    await order.save();
    await DelAssignment.deleteOne({
      shoporderId: shopOrder._id,
      order: order._id,
      assignedTo: shopOrder.assignedDelBoy,
    });
    return res.status(200).json({ msg: "Order delivered successfully" });
  } catch (err) {
    res.status(500).json({ message: "verifying Del Otp server error", err });
  }
};

export const getTotalDeliveries = async (req, res) => {
  try {
    const delBoyId = req.user.id;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const orders = await Order.find({
      "shopOrders.assignedDelBoy": delBoyId,
      "shopOrders.status": "delivered",
      "shopOrders.deliveredAt": { $gte: startOfDay },
    }).lean()
    let totalDeliveries = []
    orders.forEach(order =>{
      order.shopOrders.forEach(so =>{
        if(so.assignedDelBoy?.toString() === delBoyId.toString() && so.status === "delivered" &&
        so.deliveredAt >= startOfDay){
          totalDeliveries.push(so)
        }
      })
    })
    let stats={}
    totalDeliveries.forEach(so =>{
      const hour=new Date(so.deliveredAt).getHours();
      stats[hour]=(stats[hour] || 0)+1;
    })

    let formatedStats = Object.keys(stats).map(hour => ({
      hour:parseInt(hour),
      count:stats[hour]
    }))
    formatedStats.sort((a,b) => a.hour - b.hour)
    return res.status(200).json(formatedStats);
  }catch(err){
    res.status(500).json({ message: "get Total Deliveries server error", err });
  }
}