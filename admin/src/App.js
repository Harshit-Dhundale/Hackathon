import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AOS from "aos";
import "aos/dist/aos.css";

// Existing feature imports...
import Home from "./features/home/Home";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
// import CropRecommend from "./features/crops/CropRecommend";
// import CropResult from "./features/crops/CropResult";
// import FertilizerRecommend from "./features/fertilizers/FertilizerRecommend";
// import FertilizerResult from "./features/fertilizers/FertilizerResult";
// import DiseaseDetection from "./features/diseases/DiseaseDetection";
// import DiseaseResult from "./features/diseases/DiseaseResult";
import Forum from "./features/forum/Forum";
import PostDetails from "./features/forum/PostDetails";
import Dashboard from "./features/dashboard/Dashboard";
import CreatePost from "./features/forum/CreatePost";
import About from "./features/aboutus/About";
import Profile from "./features/profile/Profile";
import Contact from "./features/contact/Contact";
import ProductDetail from "./features/store/ProductDetail";
import Cart from "./features/store/Cart";
import Checkout from "./features/store/Checkout";
import Store from "./features/store/Store";
import PaymentSuccess from "./features/store/PaymentSuccess";
import PaymentFailure from "./features/store/PaymentFailure";
import OrderHistory from "./features/store/OrderHistory";
import OrderDetails from "./features/store/OrderDetails";
import AdminPanel from "./features/admin/AdminPanel";
import ForgotPassword from "./features/auth/ForgotPassword";
import ForgotPasswordOTP from "./features/auth/ForgotPasswordOTP";
import ResetPassword from "./features/auth/ResetPassword";
import RetryPayment from "./features/store/RetryPayment";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      disable: "mobile",
      anchorPlacement: "top-bottom",
    });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/forgot-password/otp" element={<ForgotPasswordOTP />}/>
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* Main Layout Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/:postId" element={<PostDetails />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/store" element={<Store />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                {/* <Route
                  path="/crop-recommendation"
                  element={<CropRecommend />}
                />
                <Route path="/crop-result" element={<CropResult />} />
                <Route
                  path="/fertilizer-recommendation"
                  element={<FertilizerRecommend />}
                />
                <Route
                  path="/fertilizer-result"
                  element={<FertilizerResult />}
                />
                <Route
                  path="/disease-detection"
                  element={<DiseaseDetection />}
                />
                <Route path="/disease-result" element={<DiseaseResult />} /> */}
                <Route path="/profile" element={<Profile />} />

                {/* Equipment Buying Feature Routes */}
                <Route path="/store/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failed" element={<PaymentFailure />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/retry-payment/:orderId" element={<RetryPayment />} />
                <Route
                  path="/order-details/:orderId"
                  element={<OrderDetails />}
                />
                <Route path="/admin" element={<AdminPanel />} />
                {/* Fallback route */}
                <Route path="*" element={<div>404 Not Found</div>} />
              </Route>
            </Route>
          </Routes>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;
