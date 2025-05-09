import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiTruck,
  FiCreditCard,
  FiClipboard,
  FiClock,
  FiUser,
  FiMapPin,
  FiDollarSign,
  FiAlertCircle,
} from "react-icons/fi";
import HeroHeader from "../../components/common/HeroHeader";
import api from "../../utils/api";
import styles from "./OrderDetails.module.css";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const getStatusBadge = (status) => {
    if (!status) {
      return (
        <span className={styles.statusBadge} style={{ backgroundColor: "#6c757d" }}>
          N/A
        </span>
      );
    }

    const statusColors = {
      paid: "#28a745",
      pending: "#ffc107",
      failed: "#dc3545",
      processing: "#17a2b8",
      shipped: "#007bff",
      delivered: "#28a745",
    };

    return (
      <span
        className={styles.statusBadge}
        style={{ backgroundColor: statusColors[status.toLowerCase()] || "#6c757d" }}
      >
        {status}
      </span>
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleRetry = async () => {
    try {
      await api.post(`/orders/${order._id}/retry`);
      navigate(`/retry-payment/${order._id}`);
    } catch (error) {
      console.error("Retry Payment error:", error);
      alert("Unable to retry payment at this time.");
    }
  };

  if (loading)
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading order details...</p>
      </div>
    );

  if (!order) return <p className={styles.errorMessage}>Order not found.</p>;

  return (
    <div className={styles.orderDetails}>
      <HeroHeader
        title={`Order #${order.orderId}`}
        subtitle="Detailed view of your order"
        backgroundImage="/assets/head/order-history.jpg"
      />

      <div className={styles.orderDetailsContainer}>
        {/* Back Button Positioned at the Top */}
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>

        <div className={styles.horizontalLayout}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            <div className={`${styles.card} ${styles.overviewCard}`}>
              <h2>
                <FiClipboard /> Order Overview
              </h2>
              <div className={styles.overviewGrid}>
                <div className={styles.overviewItem}>
                  <FiUser className={styles.icon} />
                  <div>
                    <label>Customer</label>
                    <p>{order.user?.username || order.user?.email || "N/A"}</p>
                  </div>
                </div>
                <div className={styles.overviewItem}>
                  <FiClock className={styles.icon} />
                  <div>
                    <label>Order Date</label>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={styles.overviewItem}>
                  <FiDollarSign className={styles.icon} />
                  <div>
                    <label>Total Amount</label>
                    <p>₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                <div className={styles.overviewItem}>
                  <FiTruck className={styles.icon} />
                  <div>
                    <label>Delivery Status</label>
                    {getStatusBadge(order.deliveryStatus)}
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.card} ${styles.shippingCard}`}>
              <h2>
                <FiMapPin /> Shipping Details
              </h2>
              <div className={styles.shippingInfo}>
                <p className={styles.addressLine}>{order.shippingAddress.street}</p>
                <p className={styles.addressLine}>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p className={styles.addressLine}>
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
                <div className={styles.deliveryEstimate}>
                  <FiClock className={styles.icon} />
                  <span>
                    Estimated Delivery:{" "}
                    {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            <div className={`${styles.card} ${styles.itemsCard}`}>
              <h2>
                <FiPackage /> Order Items
              </h2>
              <div className={styles.responsiveTable}>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Unit Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((item) => (
                      <tr key={item.product._id}>
                        <td className={styles.productCell}>
                          <img
                            src={
                              item.product?.imageUrl
                                ? item.product.imageUrl.startsWith("/")
                                  ? item.product.imageUrl
                                  : "/" + item.product.imageUrl
                                : "/assets/products/default.jpg"
                            }
                            alt={item.product?.name || "Product"}
                            className={styles.productImage}
                          />
                          <span>{item.product.name}</span>
                        </td>
                        <td>₹{item.price.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {order.razorpayPaymentId && (
              <div className={`${styles.card} ${styles.paymentCard}`}>
                <h2>
                  <FiCreditCard /> Payment Details
                </h2>
                <div className={styles.paymentDetails}>
                  <div className={styles.paymentItem}>
                    <label>Payment Status:</label>
                    {getStatusBadge(order.paymentStatus)}
                  </div>
                  <div className={styles.paymentItem}>
                    <label>Razorpay Order ID:</label>
                    <span
                      className={styles.clickableId}
                      onClick={() => copyToClipboard(order.razorpayOrderId)}
                    >
                      {order.razorpayOrderId}
                    </span>
                  </div>
                  <div className={styles.paymentItem}>
                    <label>Payment ID:</label>
                    <span
                      className={styles.clickableId}
                      onClick={() => copyToClipboard(order.razorpayPaymentId)}
                    >
                      {order.razorpayPaymentId}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {(!order.razorpayPaymentId &&
              (order.paymentStatus.toLowerCase() === "failed" ||
                order.paymentStatus.toLowerCase() === "pending")) && (
              <div className={styles.retryPaymentContainer}>
                <button onClick={handleRetry} className={`${styles.btn} ${styles.retryButton}`}>
                  <FiAlertCircle /> Retry Payment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;