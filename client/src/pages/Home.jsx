import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, PenTool, Sparkles, ArrowRight, Star, ChevronRight, Mail } from "lucide-react";
import api from "../config/api";
import BookCard from "../components/BookCard";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parallax bindings
  const { scrollYProgress } = useScroll();
  const yHeroText = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacityHeroText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products/featured");
        const productsData = response.data?.products || [];
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        setError(err.message || "Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className="w-full bg-background overflow-hidden relative">
      {/* Absolute Glow Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accentPurple/20 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-accentBlue/10 blur-[120px] pointer-events-none mix-blend-screen" />

      {/* Cinematic Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden perspective-1000">
        <motion.div 
          className="absolute inset-0 z-0 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2690&ixlib=rb-4.0.3')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            y: useTransform(scrollYProgress, [0, 1], [0, 150])
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-0" />
        
        <motion.div 
          style={{ y: yHeroText, opacity: opacityHeroText }}
          className="container-custom relative z-10 text-center flex flex-col items-center mt-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="inline-block px-4 py-1.5 rounded-full border border-borderHilight bg-surface/30 backdrop-blur-md mb-8 text-sm font-medium text-white tracking-widest uppercase"
          >
            A New Era of Reading
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 leading-tight max-w-4xl"
          >
            Elegance in <span className="text-gradient">Literature</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-secondaryText max-w-2xl mx-auto mb-12 font-light"
          >
            Curated collections of extraordinary books. Discover masterpieces that transcend time and thought.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link to="/books/current" className="btn-glow flex items-center justify-center gap-2 group">
              Explore Collections
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
            <Link to="/about" className="btn-outline">
              The Niskaups Experience
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-secondaryText z-10"
        >
          <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-secondaryText to-transparent relative overflow-hidden">
             <motion.div 
               className="w-full h-full bg-white absolute top-0"
               animate={{ y: ['-100%', '100%'] }}
               transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
             />
          </div>
        </motion.div>
      </section>

      {/* Featured Categories (Grid-style) */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
          >
            <div className="max-w-2xl">
              <h2 className="text-sm font-medium text-accentBlue tracking-widest uppercase mb-3">Curations</h2>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-white">Categories crafted for the modern intellect.</h3>
            </div>
            <Link to="/books/current" className="text-white flex items-center gap-2 hover:text-accentPurple transition-colors group pb-1 border-b border-white/20">
              View All Categories <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { name: "Current Selection", path: "/books/current", Icon: BookOpen, desc: "Our latest and most popular titles." },
              { name: "Signed Books", path: "/books/signed", Icon: PenTool, desc: "Autographed editions from renowned authors." },
              { name: "Special Editions", path: "/books/special", Icon: Sparkles, desc: "Limited and collector edition volumes." },
            ].map((collection, idx) => (
              <motion.div key={idx} variants={itemFadeUp}>
                <Link to={collection.path} className="block group h-full">
                  <div className="glass-panel glass-panel-hover p-10 h-full flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accentPurple/0 to-accentPurple/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div>
                      <div className="w-14 h-14 rounded-full bg-surfaceHilight border border-borderHilight flex items-center justify-center mb-8 text-white group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-accentPurple group-hover:to-accentBlue transition-all duration-500">
                        <collection.Icon size={24} />
                      </div>
                      <h4 className="text-2xl font-serif font-bold text-white mb-4">{collection.name}</h4>
                      <p className="text-secondaryText text-sm leading-relaxed">{collection.desc}</p>
                    </div>
                    
                    <div className="mt-8 flex items-center text-sm font-medium text-white opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      Explore <ArrowRight size={16} className="ml-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-24 md:py-32 bg-surface/30 border-y border-borderDark relative z-10">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
             <h2 className="text-sm font-medium text-accentPurple tracking-widest uppercase mb-3 text-glow">Masterpieces</h2>
             <h3 className="text-4xl md:text-5xl font-serif font-bold text-white">Featured Selections</h3>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-surfaceHover h-[400px] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-lg text-red-400">{error}</p>
            </div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-secondaryText">No featured products available</p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {products.map((product) => (
                <motion.div key={product._id} variants={itemFadeUp} className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-accentPurple to-accentBlue rounded-3xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                  <BookCard product={product} variant="dark" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Words from the Wise</h3>
            <p className="text-secondaryText max-w-xl mx-auto">Discover why readers worldwide choose Niskaups for their literary journey.</p>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { text: "A truly elevated experience. The selection of rare books is unmatched anywhere else online.", author: "Elena R.", role: "Collector" },
              { text: "The signed copy arrived in pristine condition. Niskaups embodies the luxury of reading.", author: "Marcus T.", role: "Literary Critic" },
              { text: "Finding first editions has never felt this seamless and elegant. Highly recommended.", author: "Sophia P.", role: "Author" },
            ].map((item, idx) => (
              <motion.div key={idx} variants={itemFadeUp} className="glass-panel p-8">
                <div className="flex gap-1 mb-6 text-accentBlue">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="text-white text-lg mb-8 font-serif leading-relaxed">"{item.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surfaceHover flex items-center justify-center text-white font-serif font-bold text-sm">
                    {item.author.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-white text-sm font-medium">{item.author}</h5>
                    <p className="text-xs text-secondaryText">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      {!user && (
        <section className="py-24 md:py-32 border-t border-borderDark relative z-10 overflow-hidden">
          {/* Subtle background glow for newsletter */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-gradient-to-b from-accentPurple/5 to-transparent rounded-[100%] blur-[80px] pointer-events-none" />
          
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto glass-panel p-12 md:p-20 text-center relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-accentBlue/20 blur-[60px] rounded-full pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accentPurple/20 blur-[60px] rounded-full pointer-events-none"></div>

              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                   <Mail className="text-white" size={28} />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white tracking-tight">
                Join the Inner Circle
              </h2>
              <p className="text-lg text-secondaryText mb-10 max-w-xl mx-auto font-light">
                Subscribe to our newsletter for exclusive releases, early access to rare editions, and curated recommendations.
              </p>
              
              <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="flex-1 relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full pl-5 pr-4 py-4 bg-black/40 border border-borderDark backdrop-blur-md rounded-xl text-white placeholder-secondaryText focus:outline-none focus:border-accentPurple focus:ring-1 focus:ring-accentPurple transition-all"
                    required
                  />
                </div>
                <button type="submit" className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
