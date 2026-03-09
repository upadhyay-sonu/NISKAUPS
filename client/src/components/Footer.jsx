import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
      className="bg-white border-t border-neutral-200 py-12 md:py-16"
    >
      <div className="container-custom">
        {/* Newsletter Section */}
        <motion.div variants={itemVariants} className="mb-12 pb-12 border-b border-neutral-200">
          <h3 className="text-2xl font-serif font-bold mb-4">Subscribe to Our Newsletter</h3>
          <p className="mb-6 text-neutral-600">
            Get exclusive offers, new releases, and curated book recommendations.
          </p>
          <div className="flex gap-2 max-w-md">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="btn-primary">Subscribe</button>
          </div>
        </motion.div>

        {/* Main Footer Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-4">Niskaups</h4>
            <p className="text-sm opacity-70 leading-relaxed">
              Premium bookstore dedicated to curating the finest selection of books for discerning readers
              worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:opacity-60 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/books/current" className="hover:opacity-60 transition">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:opacity-60 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:opacity-60 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="hover:opacity-60 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:opacity-60 transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:opacity-60 transition">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:opacity-60 transition">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Instagram size={20} className="text-neutral-700" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Facebook size={20} className="text-neutral-700" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Twitter size={20} className="text-neutral-700" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          variants={itemVariants}
          className="border-t border-neutral-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-600"
        >
          <p>&copy; 2024 Niskaups. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/terms" className="hover:opacity-100 transition">
              Terms & Conditions
            </Link>
            <Link to="/privacy" className="hover:text-neutral-900 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
