import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import store from "./redux/store";
import { initializeAuth } from "./redux/authSlice";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Original Pages
import Home from "./pages/Home";
import Books from "./pages/Books";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import News from "./pages/News";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Destination from "./pages/Destination";
import Favorites from "./pages/Favorites";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import OrderConfirmation from "./pages/OrderConfirmation";

// New Landing Page
import LandingPage from "./pages/LandingPage";

const StoreLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const AppContent = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Konami Easter Egg
  useEffect(() => {
    const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let idx = 0;
    const ks = (e) => {
      if(e.key === konami[idx]) {
        idx++;
        if(idx === konami.length) {
          triggerConfetti();
          idx=0;
        }
      } else { idx = 0; }
    };
    window.addEventListener('keydown', ks);
    return () => window.removeEventListener('keydown', ks);
  }, []);

  const triggerConfetti = () => {
     const c = document.createElement('div');
     c.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:99999;";
     document.body.appendChild(c);
     for(let i=0; i<50; i++) {
        const d = document.createElement('div');
        d.style.cssText = `position:absolute;top:50%;left:50%;width:10px;height:10px;background:${['#a78bfa','#38bdf8','#f0abfc'][Math.floor(Math.random()*3)]};transition:all 1s ease-out;`;
        c.appendChild(d);
        setTimeout(() => {
           d.style.transform = `translate(${(Math.random()-0.5)*100}vw, ${(Math.random()-0.5)*100}vh) rotate(${Math.random()*360}deg)`;
           d.style.opacity = '0';
        }, 10);
     }
     setTimeout(() => {
        alert("You found the secret. We like the way you think. 🎉");
        c.remove();
     }, 1000);
  };

  // If we are exactly at "/", render purely the LandingPage
  if (location.pathname === "/") {
    return <LandingPage />;
  }

  // Otherwise, render the standard MERN app layout with Header and Footer
  return (
    <StoreLayout>
      <Routes>
        <Route path="/shop" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:category" element={<Books />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/news" element={<News />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/destination" element={<Destination />} />

        {/* Protected Routes */}
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/payment/:orderId" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
      </Routes>
    </StoreLayout>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;
