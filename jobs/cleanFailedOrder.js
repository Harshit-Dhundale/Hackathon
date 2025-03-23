const cron = require('node-cron');
const Order = require('../models/Order');
const axios = require('axios');
const dotenv = require('dotenv');

cron.schedule('0 * * * *', async () => {
    console.log('Running cleanup job for failed orders');
    try {
      const cutoff = new Date(Date.now() - 36 * 60 * 60 * 1000); // 36 hours ago
      await Order.deleteMany({ paymentStatus: 'failed', createdAt: { $lt: cutoff } });
      console.log('Cleanup of failed orders completed');
    } catch (error) {
      console.error('Error in cleanup job:', error);
    }
  });

  