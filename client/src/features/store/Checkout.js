import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiArrowLeft, FiCreditCard, FiTruck } from "react-icons/fi";

import api from "../../utils/api";
import HeroHeader from "../../components/common/HeroHeader";
import { useAuth } from "../../context/AuthContext";

// Import the CSS module
import styles from "./Checkout.module.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const retryOrder = location.state?.retryOrder || null;

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    street: currentUser?.address?.street || "",
    city: currentUser?.address?.city || "",
    state: currentUser?.address?.state || "",
    postalCode: currentUser?.address?.postalCode || "",
    country: currentUser?.address?.country || "India",
  });

  useEffect(() => {
    if (retryOrder && retryOrder.products?.length) {
      setCart(
        retryOrder.products.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        }))
      );
      setTotal(
        retryOrder.products.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      );
      setShippingAddress((prev) => ({
        ...prev,
        ...retryOrder.shippingAddress,
      }));
    } else {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
      const sum = storedCart.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );
      setTotal(sum);
    }
  }, [retryOrder]);

  const handleAddressChange = (e) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      alert("Please fill in all required address fields.");
      return;
    }
    if (!cart.length) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Payment gateway failed to load");

      const orderPayload = {
        user: currentUser._id,
        products: cart.map((item) => ({
          product: item.product._id,
          quantity: Number(item.quantity),
          price: parseFloat(item.product.price || item.price),
        })),
        totalAmount: parseFloat(total.toFixed(2)),
        shippingAddress,
        originalOrderId: retryOrder?._id || null,
      };

      const { data } = await api.post("/orders/create", orderPayload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!data?.razorpayOrder?.id || !data?.order?.orderId) {
        throw new Error("Invalid order creation response");
      }
      if (!window.Razorpay) {
        throw new Error("Razorpay not loaded");
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: "FarmiCulture Equipment",
        description: `Order ${data.order.orderId}`,
        order_id: data.razorpayOrder.id,
        handler: async (response) => {
          try {
            const { data: verification } = await api.post("/orders/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.success) {
              localStorage.removeItem("cart");
              navigate("/payment-success", {
                state: {
                  orderId: verification.order.orderId,
                  amount: verification.order.totalAmount,
                  deliveryDate: verification.deliveryDate,
                },
              });

              // Fire-and-forget email
              api
                .post("/orders/send-confirmation", {
                  email: currentUser.email,
                  orderDetails: {
                    orderId: verification.order.orderId,
                    // You can uncomment and add other fields as needed:
                    // totalAmount: verification.order.totalAmount,
                    // deliveryDate: verification.deliveryDate,
                    // products: verification.order.products,
                  },
                  // user: currentUser,
                })
                .catch((emailError) => {
                  console.error("Email sending failed:", emailError);
                });
            } else {
              navigate("/payment-failed", { state: { error: verification.error } });
            }
          } catch (error) {
            console.error("Verification error:", error);
            navigate("/payment-failed", {
              state: {
                error: error.response?.data?.error || "Payment verification failed",
              },
            });
          }
        },
        prefill: {
          name: currentUser.username || currentUser.fullName,
          email: currentUser.email,
          contact: currentUser.phone || "9999999999",
        },
        theme: { color: "#2e7d32" },
        modal: {
          ondismiss: () => {
            setLoading(false);
            alert("Payment cancelled. Please try again if needed.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        setLoading(false);
        navigate("/payment-failed", {
          state: {
            error: response.error.description,
            _id: data.order._id,
          },
        });
      });

      rzp.open();
    } catch (error) {
      console.error("Full payment error:", error);
      const serverError = error.response?.data?.error;
      const validationError = error.response?.data?.errors?.[0]?.msg;
      const errorMessage = serverError || validationError || error.message;

      alert(`Payment Error: ${errorMessage}`);
      setLoading(false);

      if (error.response?.status === 400) {
        localStorage.removeItem("cart");
        setCart([]);
      }
    }
  };

  return (
    <div className={styles["checkout-page"]}>
      <HeroHeader
        title="Secure Checkout"
        subtitle="Complete your purchase with confidence"
        backgroundImage="/assets/head/check.jpg"
      />

      <div className={styles["checkout-container"]}>
        <button
          className={styles["btn-back"]}
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft /> Back to Cart
        </button>

        <div className={styles["checkout-grid"]}>
          <div className={styles["checkout-details"]}>
            {/* Delivery / Address */}
            <section className={styles["checkout-section"]}>
              <h2>
                <FiTruck /> Delivery Information
              </h2>
              <div className={styles["delivery-info"]}>
                <div className={styles["address-form"]}>
                  <div className={styles["form-group"]}>
                    <label>Street Address *</label>
                    <input
                      type="text"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className={styles["form-group"]}>
                      <label>State *</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>Postal Code *</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className={styles["form-group"]}>
                      <label>Country</label>
                      <input
                        type="text"
                        name="country"
                        value={shippingAddress.country}
                        onChange={handleAddressChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className={styles["checkout-section"]}>
              <h2>
                <FiCreditCard /> Payment Method
              </h2>
              <div className={styles["payment-methods"]}>
                <div className={`${styles["payment-card"]} ${styles["active"]}`}>
                  <div className={styles["payment-header"]}>
                    <img src="/assets/razorpay-logo.png" alt="Razorpay" />
                    <span>Cards, UPI, NetBanking</span>
                  </div>
                  <p>Secure payment processing powered by Razorpay</p>
                </div>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className={styles["order-summary"]}>
            <div className={styles["summary-card"]}>
              <h2>Order Summary</h2>
              <div className={styles["order-items"]}>
                {cart.map((item) => (
                  <div key={item.product._id} className={styles["order-item"]}>
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className={styles["item-image"]}
                    />
                    <div className={styles["item-details"]}>
                      <h4>{item.product.name}</h4>
                      <p className={styles.quantity}>
                        {item.quantity} × ₹{item.product.price}
                      </p>
                      <p className={styles.subtotal}>
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles["summary-total"]}>
                <div className={`${styles["total-row"]} ${styles["grand-total"]}`}>
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className={styles["btn-pay"]}
                disabled={loading}
              >
                {loading ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
              </button>

              <p className={styles["security-note"]}>
                <img src="/assets/ssl-secure.png" alt="SSL Secure" />
                Your payment is securely encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;