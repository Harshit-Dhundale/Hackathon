const cron = require("node-cron");
const Order = require("../models/Order");
const axios = require("axios");
const dotenv = require("dotenv");

cron.schedule("0 * * * *", async () => {
  console.log("Running delivery status update job");
  try {
    const orders = await Order.find({ paymentStatus: "paid" });
    orders.forEach(async (order) => {
      const now = Date.now();
      // jobs/deliveryStatusUpdate.js - Use paymentVerifiedAt instead of createdAt
      const orderAge = now - (order.paymentVerifiedAt || order.createdAt);
      if (orderAge < 24 * 60 * 60 * 1000) {
        order.deliveryStatus = "processing";
      } else if (orderAge < 48 * 3600 * 1000) {
        order.deliveryStatus = "shipped";
      } else if (orderAge < 72 * 3600 * 1000) {
        order.deliveryStatus = "out-for-delivery";
      } else {
        order.deliveryStatus = "delivered";
      }
      await order.save();
    });
  } catch (error) {
    console.error("Error in delivery status update job:", error);
  }
});
