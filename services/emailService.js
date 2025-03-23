const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const path = require('path');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EMAIL_USER = process.env.EMAIL_USER;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendOrderConfirmationEmail = async (toEmail, orderDetails = {}, user = {}) => {
  try {
    // Fallback values for order details
    const orderId = orderDetails.orderId || 'N/A';
    // Ensure products are sent from the checkout process
    const products = Array.isArray(orderDetails.products) ? orderDetails.products : [];
    const totalAmount = orderDetails.totalAmount != null ? orderDetails.totalAmount : 0;
    const deliveryDate = orderDetails.deliveryDate ? new Date(orderDetails.deliveryDate).toDateString() : 'N/A';
    const trackingLink = orderDetails.trackingLink || '#';

    // Fallback for user data
    const userName = user.name || 'Valued Customer';

    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });

    // Build the HTML for the products table (with product images and SKU)
    const productsHtml = products.length
      ? products.map(p => `
          <tr>
            <td style="padding:8px; border-bottom:1px solid #e2e8f0; vertical-align: middle;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <img 
                  src="${p.imageUrl || '/assets/products/default.jpg'}" 
                  alt="${p.name}" 
                  style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;"
                />
                <div>
                  <div style="font-weight: 600;">${p.name || 'Product N/A'}</div>
                  <div style="color: #718096;">
                    SKU: MM-${p._id ? p._id.slice(-6) : '000000'}
                  </div>
                </div>
              </div>
            </td>
            <td style="padding:8px; border-bottom:1px solid #e2e8f0; vertical-align: middle;">
              ${p.quantity || 0}
            </td>
            <td style="padding:8px; border-bottom:1px solid #e2e8f0; vertical-align: middle;">
              ₹${(p.price * p.quantity).toFixed(2)}
            </td>
          </tr>
        `).join('')
      : `
        <tr>
          <td colspan="3" style="padding:8px; text-align:center;">
            No products in this order.
          </td>
        </tr>
      `;

    // Email Template updated for MarketMitra
    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order Confirmation - MarketMitra</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <style>
          body, table, td, div, p { 
            margin: 0; padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          }
          body { background: #f4f4f4; }
          .email-wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; }
          .header { 
            background: linear-gradient(135deg, #2f855a, #38a169); 
            padding: 30px; 
            text-align: center; 
          }
          .header img { width: 120px; height: auto; }
          .header h1 { color: #ffffff; font-size: 24px; margin: 15px 0 5px; }
          .header p { color: rgba(255,255,255,0.9); font-size: 16px; }
          .banner { text-align: center; }
          .banner img { width: 100%; max-width: 600px; display: block; margin-bottom: 20px; }
          .content { padding: 20px; color: #333333; }
          .order-summary { background: #f7fafc; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
          .order-summary h2 { color: #2f855a; margin-bottom: 10px; }
          .product-table { width: 100%; border-collapse: collapse; }
          .product-table th, .product-table td { padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
          .order-total { text-align: right; font-weight: bold; margin-top: 10px; }
          .cta-button { 
            display: inline-block; 
            padding: 12px 20px; 
            background: linear-gradient(135deg, #2f855a, #38a169); 
            color: #ffffff; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 600; 
            margin: 20px 0; 
            transition: transform 0.2s;
          }
          .cta-button:hover { transform: translateY(-2px); }
          .tracking-box { background: #fff5f5; border-radius: 8px; padding: 15px; text-align: center; margin-bottom: 20px; }
          .footer { background: #edf2f7; padding: 20px; text-align: center; color: #718096; font-size: 14px; }
          .footer a { color: #2f855a; text-decoration: none; margin: 0 8px; }
          @media screen and (max-width: 600px) {
            .email-wrapper { width: 100% !important; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <!-- Header -->
          <div class="header">
            <img src="cid:logo@marketmitra" alt="MarketMitra Logo" />
            <h1>Order Confirmed!</h1>
            <p>Thank you for your purchase, ${userName}!</p>
          </div>
          <!-- Inline Banner Image -->
          <div class="banner">
            <img src="cid:banner@marketmitra" alt="MarketMitra Banner" />
          </div>
          <!-- Content -->
          <div class="content">
            <p>Your order has been successfully confirmed and is now being processed. Below is your order summary:</p>
            <div class="order-summary">
              <h2>Order #${orderId}</h2>
              <table class="product-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsHtml}
                </tbody>
              </table>
              <p class="order-total">Grand Total: ₹${totalAmount}</p>
            </div>
            <div style="text-align: center;">
              <a href="${trackingLink}" class="cta-button">
                <i class="fas fa-map-marker-alt"></i> Track Your Order
              </a>
            </div>
            <div class="tracking-box">
              <p><i class="fas fa-truck"></i> Estimated Delivery: <strong>${deliveryDate}</strong></p>
            </div>
            <p>If you have any questions, please <a href="mailto:support@marketmitra.com">contact our support team</a>.</p>
          </div>
          <!-- Footer -->
          <div class="footer">
            <p>Follow us on:</p>
            <p>
              <a href="[Facebook URL]"><i class="fab fa-facebook-f"></i></a>
              <a href="[Twitter URL]"><i class="fab fa-twitter"></i></a>
              <a href="[Instagram URL]"><i class="fab fa-instagram"></i></a>
            </p>
            <p>&copy; ${new Date().getFullYear()} MarketMitra<br />
            123 Market Street, Commerce City, IN 560001<br />
            <a href="[Privacy Policy URL]">Privacy Policy</a> | 
            <a href="[Terms of Service URL]">Terms of Service</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `MarketMitra 🚀 <${EMAIL_USER}>`,
      to: toEmail,
      subject: `✅ Order #${orderId} Confirmed! Your Order is On Its Way`,
      html: emailTemplate,
      attachments: [
        {
          filename: 'logo1.jpg',
          path: path.join(__dirname, '../client/public/assets/logo1.jpg'),
          cid: 'logo@marketmitra'
        },
        {
          filename: 'farm-banner.jpg',
          path: path.join(__dirname, '../client/public/assets/farm-background.jpg'),
          cid: 'banner@marketmitra'
        }
      ]
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', result);
    return result;

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

module.exports = { sendOrderConfirmationEmail };