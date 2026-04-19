import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, ShoppingCart, Menu, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react';
import { logout } from '../redux/authSlice';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [booksDropdownOpen, setBooksDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-background/70 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)] py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold font-serif text-white tracking-widest relative group">
          NISKAUPS
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accentPurple transition-all duration-300 group-hover:w-full"></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link justify="center" to="/" className="text-sm font-medium text-secondaryText hover:text-white transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <div 
            className="relative"
            onMouseEnter={() => setBooksDropdownOpen(true)}
            onMouseLeave={() => setBooksDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-secondaryText hover:text-white transition-colors">
              Books
              <ChevronDown size={14} className={`transition-transform duration-300 ${booksDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {booksDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-4 w-56 glass-panel overflow-hidden z-50"
                >
                  <Link 
                    to="/books/current" 
                    className="block px-5 py-3 text-sm text-secondaryText hover:text-white hover:bg-surfaceHover transition-colors"
                    onClick={() => setBooksDropdownOpen(false)}
                  >
                    Current Selection
                  </Link>
                  <div className="h-px bg-borderDark"></div>
                  <Link 
                    to="/books/signed" 
                    className="block px-5 py-3 text-sm text-secondaryText hover:text-white hover:bg-surfaceHover transition-colors"
                    onClick={() => setBooksDropdownOpen(false)}
                  >
                    Signed Books
                  </Link>
                  <div className="h-px bg-borderDark"></div>
                  <Link 
                    to="/books/special" 
                    className="block px-5 py-3 text-sm text-secondaryText hover:text-white hover:bg-surfaceHover transition-colors"
                    onClick={() => setBooksDropdownOpen(false)}
                  >
                    Special Editions
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link to="/about" className="text-sm font-medium text-secondaryText hover:text-white transition-colors relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/contact" className="text-sm font-medium text-secondaryText hover:text-white transition-colors relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-5">
          {/* Search */}
          <button onClick={() => setShowSearch(!showSearch)} className="text-secondaryText hover:text-white transition-colors">
            <Search size={18} />
          </button>

          {/* Account */}
          {token ? (
           <div 
             className="relative"
             onMouseEnter={() => setAccountDropdownOpen(true)}
             onMouseLeave={() => setAccountDropdownOpen(false)}
           >
             <button className="text-secondaryText hover:text-white transition-colors flex items-center">
               <User size={18} />
             </button>
             <AnimatePresence>
               {accountDropdownOpen && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   transition={{ duration: 0.2 }}
                   className="absolute right-0 mt-4 w-56 glass-panel overflow-hidden z-50"
                 >
                   <div className="px-5 py-4 border-b border-borderDark bg-surfaceHover/50">
                     <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                     <p className="text-xs text-secondaryText truncate mt-1">{user?.email}</p>
                   </div>
                   <Link 
                     to="/dashboard" 
                     className="flex items-center gap-3 px-5 py-3 text-sm text-secondaryText hover:text-white hover:bg-surfaceHover transition-colors"
                     onClick={() => setAccountDropdownOpen(false)}
                   >
                     <LayoutDashboard size={16} />
                     Dashboard
                   </Link>
                   <div className="h-px bg-borderDark"></div>
                   <button 
                     onClick={() => {
                       handleLogout();
                       setAccountDropdownOpen(false);
                     }} 
                     className="w-full flex items-center gap-3 text-left px-5 py-3 text-sm text-accentPink hover:bg-surfaceHover transition-colors"
                   >
                     <LogOut size={16} />
                     Logout
                   </button>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
          ) : (
           <Link to="/login" className="text-secondaryText hover:text-white transition-colors">
             <User size={18} />
           </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative text-secondaryText hover:text-white transition-colors">
            <ShoppingCart size={18} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-accentPurple text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="md:hidden text-secondaryText hover:text-white transition-colors ml-2"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel mt-4 mx-4 overflow-hidden"
          >
            <nav className="flex flex-col py-2 px-4">
              <Link to="/" className="py-3 border-b border-borderDark text-secondaryText hover:text-white transition-colors" onClick={() => setShowMenu(false)}>Home</Link>
              <Link to="/books/current" className="py-3 border-b border-borderDark text-secondaryText hover:text-white transition-colors" onClick={() => setShowMenu(false)}>Current Selection</Link>
              <Link to="/books/signed" className="py-3 border-b border-borderDark text-secondaryText hover:text-white transition-colors" onClick={() => setShowMenu(false)}>Signed Books</Link>
              <Link to="/about" className="py-3 border-b border-borderDark text-secondaryText hover:text-white transition-colors" onClick={() => setShowMenu(false)}>About</Link>
              <Link to="/contact" className="py-3 text-secondaryText hover:text-white transition-colors" onClick={() => setShowMenu(false)}>Contact</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full p-4"
          >
            <div className="container-custom max-w-2xl relative">
              <input
                type="text"
                placeholder="Search books, authors..."
                className="w-full pl-12 pr-4 py-4 bg-surface/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-glow focus:outline-none focus:border-accentBlue text-white placeholder-secondaryText"
              />
              <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-secondaryText" size={20} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
