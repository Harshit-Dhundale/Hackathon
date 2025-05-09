const cron = require('node-cron');
const Order = require('../models/Order');
const Product = require('../models/Product'); // Import Product model to restore stock
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Schedule a job to run every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('Running order verification job');

  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    // Find orders with pending payment older than 30 minutes
    const pendingOrders = await Order.find({
      paymentStatus: 'pending',
      createdAt: { $lt: thirtyMinutesAgo },
    });

    for (let order of pendingOrders) {
      try {
        // Verify payment status using Razorpay API
        const response = await axios.get(
          `https://api.razorpay.com/v1/orders/${order.razorpayOrderId}`,
          {
            auth: {
              username: process.env.RAZORPAY_KEY_ID,
              password: process.env.RAZORPAY_KEY_SECRET,
            },
          }
        );

        const razorpayOrder = response.data;

        if (razorpayOrder.status === 'paid') {
          // Mark order as paid
          order.paymentStatus = 'paid';
          console.log(`Order ${order._id} marked as paid`);
        } else {
          // Mark order as failed and restore product stock
          order.paymentStatus = 'failed';
          order.deliveryStatus = null; // Clear delivery status
          console.log(`Order ${order._id} marked as failed. Restoring stock...`);

          // Restore product stock
          for (const item of order.products) {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { stock: item.quantity }, // Increment stock back
            });
          }
        }

        await order.save();
      } catch (razorpayError) {
        console.error(`Error verifying Razorpay payment for order ${order._id}:`, razorpayError.message);
      }
    }
  } catch (error) {
    console.error('Error in order verification job:', error);
  }
});
