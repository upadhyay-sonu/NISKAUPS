import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, User, ShoppingCart, Menu, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react';
import { logout } from '../redux/authSlice';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setShowMenu(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`fixed w-full top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}
    >
      <div className="container-custom py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold font-serif text-primary">
          NISKAUPS
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:opacity-60 transition">
            Home
          </Link>
          <div className="relative group">
            <button className="flex items-center gap-2 hover:opacity-60 transition">
              Books
              <ChevronDown size={16} />
            </button>
            <div className="hidden group-hover:block absolute left-0 mt-2 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg">
              <Link to="/books/current" className="block px-4 py-2 hover:bg-neutral-50 transition-colors">
                Current Selection
              </Link>
              <Link to="/books/signed" className="block px-4 py-2 hover:bg-neutral-50 transition-colors">
                Signed Books
              </Link>
              <Link to="/books/special" className="block px-4 py-2 hover:bg-neutral-50 transition-colors">
                Special Editions
              </Link>
              <Link to="/books/coming-soon" className="block px-4 py-2 hover:bg-neutral-50 transition-colors">
                Coming Soon
              </Link>
            </div>
          </div>
          <Link to="/news" className="hover:opacity-60 transition">
            News
          </Link>
          <Link to="/about" className="hover:opacity-60 transition">
            About
          </Link>
          <Link to="/contact" className="hover:opacity-60 transition">
            Contact
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button onClick={() => setShowSearch(!showSearch)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <Search size={20} className="text-neutral-700" />
          </button>

          {/* Account */}
          {token ? (
            <div className="relative group">
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <User size={20} className="text-neutral-700" />
              </button>
              <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg">
                <div className="px-4 py-2 border-b border-neutral-200">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-neutral-600">{user?.email}</p>
                </div>
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-50 transition-colors text-sm">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-red-50 transition-colors text-red-600 text-sm">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <User size={20} className="text-neutral-700" />
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <ShoppingCart size={20} className="text-neutral-700" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse-badge">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <Menu size={20} className="text-neutral-700" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-neutral-200"
        >
          <nav className="container-custom py-4 flex flex-col gap-4">
            <Link to="/" onClick={() => setShowMenu(false)}>
              Home
            </Link>
            <Link to="/books/current" onClick={() => setShowMenu(false)}>
              Current Selection
            </Link>
            <Link to="/books/signed" onClick={() => setShowMenu(false)}>
              Signed Books
            </Link>
            <Link to="/books/special" onClick={() => setShowMenu(false)}>
              Special Editions
            </Link>
            <Link to="/news" onClick={() => setShowMenu(false)}>
              News
            </Link>
            <Link to="/about" onClick={() => setShowMenu(false)}>
              About
            </Link>
            <Link to="/contact" onClick={() => setShowMenu(false)}>
              Contact
            </Link>
          </nav>
        </motion.div>
      )}

      {/* Search Bar */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-neutral-50 border-t border-neutral-200"
        >
          <div className="container-custom py-4">
            <input
              type="text"
              placeholder="Search books, authors..."
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
