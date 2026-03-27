// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Quote from './Components/QuoteForm';
import Home from './pages/Home';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import ProductList from './pages/ProductList';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import MyOrders from './pages/MyOrders';
import Account from './pages/Account';
import HelpCenter from './pages/HelpCenter';
import Checkout from './pages/Checkout';
import ProtectedRoute from './Components/ProtectedRoute';
import PrivateRoute from './Components/PrivateRoute';
// import VerifyEmail from './pages/VerifyEmail';
import CustomerProfile from './pages/CustomerProfile';
import Contact from "./pages/Contact";
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import CartBar from "./Components/CartBar";
import MobileNav from "./Components/MobileNav";
import ScrollToTop from "./Components/ScrollToTop";
import Subservices from './pages/Subservices';
import { AuthContext } from './context/AuthContext';
import Payment from './pages/Payment';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivacyPolicy from './pages/PrivacyPolicy';

export default function App() {
  const { user, setUser } = useContext(AuthContext);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (!user && localStorage.getItem("token")) {
      fetchUserProfile();
    }
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/subservices/:id" element={<Subservices />} />
          <Route path="/subservices" element={<Subservices />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/verify-email" element={<VerifyEmail />} /> */}
          <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path='/privacyPolicy' element={<PrivacyPolicy/>} />
        </Routes>
      </main>

      <CartBar />
      <MobileNav />
      <Footer />
    </div>
  );
}
