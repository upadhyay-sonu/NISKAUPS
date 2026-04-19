import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, ArrowUpRight, Sparkles } from 'lucide-react';

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        ease: [0.16, 1, 0.3, 1]
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
      viewport={{ once: true, margin: "-100px" }}
      variants={footerVariants}
      className="bg-background pt-20 pb-10 border-t border-borderDark relative z-10"
    >
      <div className="container-custom relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-accentBlue/20 to-transparent blur-sm"></div>
        
        {/* Main Footer Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* About */}
          <div className="col-span-1 md:col-span-4 lg:col-span-4">
             <Link to="/" className="text-2xl font-bold font-serif text-white tracking-widest block mb-6">
                NISKAUPS
             </Link>
            <p className="text-sm font-light text-secondaryText leading-relaxed mb-6 max-w-sm">
              Premium bookstore dedicated to curating the finest selection of literature for discerning readers worldwide. Experience books like never before.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-borderDark flex items-center justify-center text-secondaryText hover:text-white hover:border-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-borderDark flex items-center justify-center text-secondaryText hover:text-white hover:border-white transition-all">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-borderDark flex items-center justify-center text-secondaryText hover:text-white hover:border-white transition-all">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div className="col-span-1 md:col-span-8 lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-6">Explore</h4>
              <ul className="space-y-4 text-sm font-medium text-secondaryText">
                <li>
                  <Link to="/" className="hover:text-white transition-colors flex items-center group">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/books/current" className="hover:text-white transition-colors flex items-center group">
                    Collections <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors flex items-center group">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="hover:text-white transition-colors flex items-center group">
                    Journal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-6">Assistance</h4>
              <ul className="space-y-4 text-sm font-medium text-secondaryText">
                <li>
                  <Link to="/faq" className="hover:text-white transition-colors flex items-center group">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="hover:text-white transition-colors flex items-center group">
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="hover:text-white transition-colors flex items-center group">
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors flex items-center group">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-6">Legal</h4>
              <ul className="space-y-4 text-sm font-medium text-secondaryText">
                <li>
                  <Link to="/terms" className="hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          variants={itemVariants}
          className="border-t border-borderDark pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-medium text-secondaryText"
        >
          <p>&copy; {new Date().getFullYear()} Niskaups. All rights reserved.</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
             <span>Designed for the Elite</span>
             <Sparkles size={12} className="text-accentBlue" />
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
