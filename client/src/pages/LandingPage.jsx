import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../config/api";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";

// Shared Variables
const SPRING_EASING = [0.16, 1, 0.3, 1];

// -------------------------------------------------------------
// SECTION 1: PRELOADER
// -------------------------------------------------------------
const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 10) + 2;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(onComplete, 400); // short delay at 100%
      }
      setProgress(current);
    }, 150);
    return () => clearInterval(interval);
  }, [onComplete]);

  const letterAnimation = {
    hidden: { strokeDashoffset: 100 },
    visible: i => ({
      strokeDashoffset: 0,
      transition: { delay: i * 0.15, duration: 1.5, ease: "easeInOut" }
    })
  };

  return (
    <motion.div
      exit={{ y: "-100vh" }}
      transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.9 }}
      className="fixed inset-0 z-[9999] bg-[#04040a] flex flex-col items-center justify-center pointer-events-auto"
    >
      <div className="absolute top-8 right-8 text-landing-primary font-mono text-xl">{progress}%</div>
      <svg width="400" height="120" viewBox="0 0 400 120" className="opacity-90">
        <text 
          x="50%" 
          y="50%" 
          dominantBaseline="middle" 
          textAnchor="middle" 
          className="font-serif text-[80px]"
          fill="none" 
          stroke="#a78bfa" 
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="100"
        >
          {["N","I","S","K","A","U","P","S"].map((char, i) => (
            <motion.tspan 
               key={i} 
               custom={i} 
               variants={letterAnimation} 
               initial="hidden" 
               animate="visible"
            >
              {char}
            </motion.tspan>
          ))}
        </text>
      </svg>
      <div className="w-[300px] h-px bg-white/10 mt-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full bg-landing-primary transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>
    </motion.div>
  );
};

// -------------------------------------------------------------
// SEC 2: NAV (AND CURSOR)
// -------------------------------------------------------------
const Navigation = () => {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(4,4,10,0)", "rgba(4,4,10,0.85)"]);
  const blur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(16px)"]);
  const border = useTransform(scrollY, [0, 80], ["1px solid rgba(255,255,255,0)", "1px solid rgba(255,255,255,0.06)"]);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.nav 
        style={{ background: bg, backdropFilter: blur, WebkitBackdropFilter: blur, borderBottom: border }}
        className="fixed top-0 w-full z-[100] transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="text-white font-serif font-bold text-2xl tracking-widest">
            N<span className="text-transparent bg-clip-text bg-gradient-to-br from-landing-primary to-landing-tertiary">I</span>SKAUPS
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-sans">
            {["Home", "Features", "Books", "About", "Contact"].map((item) => (
              <div key={item} className="relative group cursor-pointer group-hover:text-white text-white/50 transition-colors">
                {item}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-landing-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-landing-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <Link to="/shop" className="shimmer-btn bg-[length:200%_auto] bg-gradient-to-r from-transparent via-white/10 to-transparent border border-landing-primary/50 text-landing-primary hover:bg-landing-primary hover:text-white transition-all duration-300 px-6 py-2 rounded-full font-sans text-sm">
              Enter Bookstore &rarr;
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center" onClick={() => setMenuOpen(!menuOpen)}>
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white cursor-pointer"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-[#04040a] flex flex-col items-center justify-center gap-8 md:hidden text-white font-serif text-3xl"
          >
            {["Home", "Features", "Books", "About", "Contact"].map((item, i) => (
              <motion.div 
                key={item}
                initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </motion.div>
            ))}
            <Link to="/shop" className="text-landing-primary mt-8 border border-landing-primary px-8 py-3 rounded-full text-xl" onClick={() => setMenuOpen(false)}>Enter Bookstore</Link>
            <div className="absolute top-6 right-6 p-4" onClick={() => setMenuOpen(false)}>✕</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// -------------------------------------------------------------
// SEC 3: HERO
// -------------------------------------------------------------
const Counter = ({ from, to }) => {
  const nodeRef = useRef();
  const inView = useInView(nodeRef, { once: true });
  useEffect(() => {
    if (!inView) return;
    const controls = animate(from, to, {
      duration: 2,
      onUpdate(value) {
        if(nodeRef.current) nodeRef.current.textContent = value.toFixed(1).replace(".0","");
      }
    });
    return () => controls.stop();
  }, [from, to, inView]);
  return <span ref={nodeRef} />;
};

import { animate } from "framer-motion";

const Hero = () => {
  const [dots, setDots] = useState([]);
  useEffect(() => {
    const arr = [];
    for(let i=0; i<80; i++) {
       arr.push({
         left: `${Math.random() * 100}%`,
         dur: `${8 + Math.random() * 12}s`,
         delay: `-${Math.random() * 20}s`,
         color: ["#a78bfa", "#38bdf8", "#f0abfc"][Math.floor(Math.random() * 3)]
       });
    }
    setDots(arr);
  }, []);

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {dots.map((dot, i) => (
          <div key={i} className="absolute bottom-0 w-1 h-1 rounded-full landing-dot"
            style={{ left: dot.left, backgroundColor: dot.color, animationDuration: dot.dur, animationDelay: dot.delay }} />
        ))}
        {/* Blobs */}
        <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-landing-primary/20 blur-[120px] rounded-full landing-blob" style={{"--dx": "100px", "--dy": "-50px"}} />
        <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-landing-secondary/20 blur-[120px] rounded-full landing-blob" style={{"--dx": "-100px", "--dy": "100px", "--blob-dur": "25s"}} />
        <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-landing-tertiary/10 blur-[150px] rounded-full landing-blob" style={{"--dx": "50px", "--dy": "-100px", "--blob-dur": "30s"}} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto mt-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
          className="border border-landing-primary/30 bg-landing-primary/5 px-4 py-1.5 rounded-full text-landing-primary text-xs tracking-widest uppercase mb-8">
          ✦ Premium Bookstore 2024
        </motion.div>

        <div className="flex flex-col gap-2">
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-white/80 text-5xl md:text-7xl font-serif">Discover Your</motion.div>
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.8 }} className="text-white text-6xl md:text-8xl font-serif font-bold">Next Favourite</motion.div>
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="text-transparent bg-clip-text bg-gradient-to-r from-landing-primary via-landing-tertiary to-landing-secondary text-6xl md:text-8xl font-serif font-bold">Book.</motion.div>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }} 
          className="text-white/50 text-lg md:text-xl max-w-xl mx-auto mt-8 font-sans">
          A curated premium bookstore with intelligent recommendations, beautiful reading experiences, and seamless delivery.
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-6 mt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}>
            <Link to="/shop" className="inline-block bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-8 py-4 rounded-full font-medium transition-all hover:scale-105 shadow-lg shadow-landing-primary/20 hover:shadow-landing-primary/40 magnetic-btn">
              Browse Books
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.8 }}>
            <Link to="/books" className="inline-block border border-white/20 text-white/70 px-8 py-4 rounded-full transition-all hover:border-white/50 hover:text-white">
              View Collection &rarr;
            </Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 1 }} className="mt-20 flex gap-8 md:gap-16 items-center">
          <div className="flex flex-col items-center">
             <div className="text-3xl text-landing-primary font-bold"><Counter from={0} to={10} />,000+</div>
             <div className="text-white/40 text-sm mt-1 uppercase tracking-wider">Books</div>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="flex flex-col items-center">
             <div className="text-3xl text-landing-primary font-bold"><Counter from={0} to={4.9} />★</div>
             <div className="text-white/40 text-sm mt-1 uppercase tracking-wider">Rating</div>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="flex flex-col items-center">
             <div className="text-3xl text-landing-primary font-bold"><Counter from={0} to={50} />k+</div>
             <div className="text-white/40 text-sm mt-1 uppercase tracking-wider">Readers</div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-sm font-sans" style={{ animation: "bounceIndicator 1.5s infinite" }}>
        scroll
        <svg w="16" h="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-landing-primary opacity-70"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// SEC 4: MARQUEE
// -------------------------------------------------------------
const MarqueeStrip = () => {
  return (
    <div className="w-full border-y border-landing-primary/15 py-6 overflow-hidden flex flex-col gap-4 font-serif text-5xl font-bold bg-[#04040a]">
      <div className="flex w-[200%] animate-[marquee_20s_linear_infinite]">
         {[...Array(8)].map((_, i) => (
           <div key={`a-${i}`} className="flex items-center gap-8 px-4 whitespace-nowrap">
             <span className="text-white">NISKAUPS</span> <span className="text-landing-primary/30">·</span>
             <span className="text-landing-primary">BOOKS</span> <span className="text-landing-primary/30">·</span>
             <span className="text-white">PREMIUM</span> <span className="text-landing-primary/30">·</span>
             <span className="text-landing-primary">CURATED</span> <span className="text-landing-primary/30">·</span>
           </div>
         ))}
      </div>
      <div className="flex w-[200%] ml-[-50%] animate-[marquee-reverse_25s_linear_infinite]">
         {[...Array(8)].map((_, i) => (
           <div key={`b-${i}`} className="flex items-center gap-8 px-4 whitespace-nowrap">
             <span className="text-white">FAST DELIVERY</span> <span className="text-landing-primary/30">·</span>
             <span className="text-landing-primary">SECURE</span> <span className="text-landing-primary/30">·</span>
             <span className="text-white">TRUSTED</span> <span className="text-landing-primary/30">·</span>
             <span className="text-landing-primary">AUTHENTIC</span> <span className="text-landing-primary/30">·</span>
           </div>
         ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SEC 5: FEATURES
// -------------------------------------------------------------
const Features = () => {
  const cards = [
    { title: "Vast Collection", desc: "Over 10,000 titles across every genre, from classics to new releases.", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { title: "Smart Search", desc: "Find exactly what you're looking for with intelligent filtering and sorting.", icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" },
    { title: "Secure Checkout", desc: "Stripe-powered payments. Your data is always encrypted and safe.", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" },
    { title: "Order Tracking", desc: "Real-time order history and delivery tracking in your dashboard.", icon: "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" },
    { title: "Book Reviews", desc: "Authentic reader reviews and community ratings to guide your next pick.", icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" },
    { title: "News & Blog", badge: "✦ NEW", desc: "Stay updated with book news, author interviews, and reading lists.", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" }
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-landing-primary tracking-[0.2em] uppercase text-sm mb-4 font-sans font-medium">Why Niskaups</div>
      <h2 className="text-white font-serif text-4xl md:text-5xl font-bold mb-16">Everything a book lover needs.</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: SPRING_EASING }}
            whileHover={{ y: -8, borderColor: "rgba(167,139,250,0.4)" }}
            className="bg-landing-surface border border-landing-border rounded-2xl p-7 relative transition-colors"
            key={i}
          >
            {c.badge && <div className="absolute top-6 right-6 bg-landing-primary/10 text-landing-primary text-xs px-2 py-1 rounded border border-landing-primary/30">{c.badge}</div>}
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-9 h-9 text-landing-primary mb-6">
              <path strokeLinecap="round" strokeLinejoin="round" d={c.icon}></path>
            </svg>
            <h3 className="text-white text-lg font-medium font-sans mb-2">{c.title}</h3>
            <p className="text-white/50 text-sm font-sans leading-relaxed">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// SEC 6: LIVE PRODUCT SHOWCASE
// -------------------------------------------------------------
const LiveShowcase = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBooks = async () => {
       try {
         const res = await api.get("/products/featured");
         setBooks(res.data?.products?.slice(0, 5) || []);
       } catch (err) {
         console.warn("API load failed for showcase", err);
       } finally {
         setLoading(false);
       }
    };
    fetchBooks();
  }, []);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <h2 className="text-white font-serif text-4xl md:text-5xl font-bold mb-4">Featured Books</h2>
      <p className="text-white/50 text-lg mb-12">Handpicked titles from our live collection.</p>

      <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-8 -mx-6 px-6 snap-x">
        {loading ? [...Array(4)].map((_,i) => (
          <div key={i} className="min-w-[280px] h-[420px] bg-white/5 animate-pulse rounded-2xl border border-white/10 shrink-0" />
        )) : books.map((book) => (
          <div key={book._id} className="min-w-[260px] md:min-w-[280px] bg-landing-surface border border-landing-border rounded-2xl p-4 shrink-0 snap-start flex flex-col group">
             <div className="w-full aspect-[3/4] bg-white/5 rounded-xl overflow-hidden relative">
               <img src={book.images?.[0]?.url || 'https://via.placeholder.com/300x400?text=No+Cover'} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
             </div>
             <div className="mt-4 flex-grow flex flex-col">
               <h3 className="text-white text-sm font-medium line-clamp-2">{book.title}</h3>
               <p className="text-white/40 text-xs mt-1">{book.author || "Unknown"}</p>
               <div className="flex justify-between items-center mt-auto pt-4">
                 <span className="text-landing-primary font-semibold">${book.salePrice || book.price}</span>
                 <button onClick={() => dispatch(addToCart(book))} className="text-xs border border-landing-primary text-landing-primary hover:bg-landing-primary hover:text-white px-3 py-1 rounded-full transition-colors">Add</button>
               </div>
             </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
         <Link to="/books" className="inline-block border border-white/20 text-white/70 px-8 py-3 rounded-full transition-all hover:border-white/50 hover:text-white">View All Books &rarr;</Link>
      </div>
    </section>
  );
};



// -------------------------------------------------------------
// SEC 8: TESTIMONIALS
// -------------------------------------------------------------
const Testimonials = () => (
  <section className="py-24 px-6 max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { q: "NISKAUPS has the most curated selection I've seen. Beautiful experience.", n: "Priya M.", r: "Avid Reader", i: "PM" },
        { q: "The checkout is seamless. I ordered 5 books in under 2 minutes.", n: "Rahul S.", r: "Student", i: "RS" },
        { q: "Dashboard and order tracking is so clean. Love this store.", n: "Anjali K.", r: "Book Blogger", i: "AK" }
      ].map((t, i) => (
        <div key={i} className="bg-landing-surface border border-landing-border p-8 rounded-2xl relative">
          <svg className="w-16 h-16 text-landing-primary opacity-20 absolute top-4 left-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
          <p className="text-white/70 italic text-sm mt-8 mb-6 relative z-10 leading-relaxed">"{t.q}"</p>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-landing-primary flex items-center justify-center text-black font-bold font-sans text-xs">{t.i}</div>
             <div>
               <div className="text-white text-sm font-medium">{t.n}</div>
               <div className="text-white/40 text-xs">{t.r}</div>
             </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// -------------------------------------------------------------
// SEC 9: CTA
// -------------------------------------------------------------
const CTASection = () => {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    return (
      <section className="relative w-full min-h-[480px] flex flex-col items-center justify-center text-center px-6 overflow-hidden border-t border-white/5 py-32">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[400px] h-[400px] bg-landing-primary/10 blur-[100px] rounded-full landing-blob" style={{"--dx": "50px", "--dy": "-20px"}} />
          <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[300px] h-[300px] bg-landing-secondary/10 blur-[80px] rounded-full landing-blob" style={{"--dx": "-50px", "--dy": "50px", "--blob-dur":"15s"}} />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-white font-serif text-5xl md:text-6xl font-bold mb-6">Welcome back, {user.name || user.email}.</h2>
          <p className="text-white/50 text-lg md:text-xl mb-12">Your next great read is waiting.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-10 py-4 rounded-full font-medium transition-all hover:scale-105">Continue Reading &rarr;</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-[480px] flex flex-col items-center justify-center text-center px-6 overflow-hidden border-t border-white/5 py-32">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[400px] h-[400px] bg-landing-primary/10 blur-[100px] rounded-full landing-blob" style={{"--dx": "50px", "--dy": "-20px"}} />
        <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[300px] h-[300px] bg-landing-secondary/10 blur-[80px] rounded-full landing-blob" style={{"--dx": "-50px", "--dy": "50px", "--blob-dur":"15s"}} />
      </div>
      
      <div className="relative z-10">
        <h2 className="text-white font-serif text-5xl md:text-6xl font-bold mb-6">Start your reading journey today.</h2>
        <p className="text-white/50 text-lg md:text-xl mb-12">Join thousands of readers on NISKAUPS.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-10 py-4 rounded-full font-medium transition-all hover:scale-105">Create Free Account</Link>
          <Link to="/shop" className="border border-white/20 text-white/70 px-10 py-4 rounded-full hover:border-white/50 hover:text-white transition-all">Browse as Guest &rarr;</Link>
        </div>
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// SEC 10: FOOTER
// -------------------------------------------------------------
const Footer = () => (
  <footer className="w-full bg-[#04040a] border-t border-landing-primary/15 py-16 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
      <div>
        <div className="font-serif font-bold text-2xl text-white mb-2 tracking-widest">NISKAUPS</div>
        <p className="text-white/40 text-sm mb-6">Premium books, beautifully delivered.</p>
        <p className="text-white/20 text-xs">© 2024 NISKAUPS. All rights reserved.</p>
      </div>
      <div>
        <div className="text-white font-medium mb-6">Quick Links</div>
        <div className="flex flex-col gap-3 text-sm">
          {[['Browse Books', '/books'], ['My Cart', '/cart'], ['Dashboard', '/dashboard'], ['News', '/news'], ['About', '/about'], ['Contact', '/contact']].map(([n, p]) => (
            <Link key={n} to={p} className="text-white/50 hover:text-landing-primary transition-colors hover:translate-x-1 inline-block w-fit">{n} &rarr;</Link>
          ))}
        </div>
      </div>
      <div>
        <div className="text-white font-medium mb-6">Connect</div>
        <div className="flex gap-4">
          <svg className="w-6 h-6 text-white/30 hover:text-landing-primary transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          <svg className="w-6 h-6 text-white/30 hover:text-landing-primary transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
          <svg className="w-6 h-6 text-white/30 hover:text-landing-primary transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-12 flex justify-between items-center text-xs text-white/30">
      <div className="flex gap-4">
        <span className="hover:text-landing-primary cursor-pointer border border-landing-primary/30 px-2 py-1 rounded bg-landing-primary/10 text-landing-primary transition" onClick={() => window.open('https://github.com/upadhyay-sonu/NISKAUPS', '_blank')}>⭐ View on GitHub</span>
      </div>
      <button onClick={() => window.scrollTo(0,0)} className="hover:text-white transition-colors">Back to top ↑</button>
    </div>
  </footer>
);

// -------------------------------------------------------------
// MAIN PAGE EXPORT
// -------------------------------------------------------------
export default function LandingPage() {
  const [showPreloader, setShowPreloader] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    // Console Easter Egg
    console.log(`%c
    _   _ _____  _____ _  __   _    _    _ _____   _____ 
   | \\ | |_   _|/ ____| |/ /  / \\  | |  | |  __ \\ / ____|
   |  \\| | | | | (___ | ' /  / _ \\ | |  | | |__) | (___  
   | . \` | | |  \\___ \\|  <  / ___ \\| |  | |  ___/ \\___ \\ 
   | |\\  |_| |_ ____) | . \\/ /   \\ \\ |__| | |     ____) |
   |_| \\_|_____|_____/|_|\\_\\/     \\_\\____/|_|    |_____/ 
    `, 'color: #a78bfa; font-weight: bold;');
    console.log("Hi recruiter 👋 — Built with ❤️ by Sonu Upadhyay | github.com/upadhyay-sonu");

    // Session Storage check
    if (!sessionStorage.getItem("niskaups_visited")) {
      setShowPreloader(true);
      sessionStorage.setItem("niskaups_visited", "true");
    }
  }, []);

  // Custom cursor logic
  useEffect(() => {
    const cursor = document.createElement("div");
    const dot = document.createElement("div");
    
    if (window.matchMedia("(pointer: fine)").matches) {
       cursor.className = "fixed top-0 left-0 w-[18px] h-[18px] border border-landing-primary bg-landing-primary/20 rounded-full mix-blend-difference pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out";
       dot.className = "fixed top-0 left-0 w-1 h-1 bg-landing-primary rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2";
       document.body.appendChild(cursor);
       document.body.appendChild(dot);
       document.body.style.cursor = "none";

       let cx=0, cy=0, tx=0, ty=0;
       
       const move = (e) => { tx = e.clientX; ty = e.clientY; dot.style.left = tx+'px'; dot.style.top = ty+'px'; };
       window.addEventListener('mousemove', move);

       const animate = () => {
         cx += (tx - cx) * 0.2;
         cy += (ty - cy) * 0.2;
         cursor.style.left = cx + 'px';
         cursor.style.top = cy + 'px';
         requestAnimationFrame(animate);
       };
       requestAnimationFrame(animate);

       const applyHover = () => {
          document.querySelectorAll('a, button, input').forEach(el => {
             el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(2.5)');
             el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
          });
       };
       setTimeout(applyHover, 1000);

       return () => {
         window.removeEventListener('mousemove', move);
         cursor.remove();
         dot.remove();
         document.body.style.cursor = "auto";
       }
    }
  }, []);

  return (
    <div className="bg-[#04040a] min-h-screen text-white font-sans overflow-x-hidden selection:bg-landing-primary selection:text-black">
      <AnimatePresence>
        {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}
      </AnimatePresence>

      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-landing-primary origin-left z-[9000]" 
        style={{ scaleX: scrollYProgress, filter: 'drop-shadow(0 0 8px rgba(167,139,250,0.8))' }} 
      />

      <Navigation />
      <Hero />
      <MarqueeStrip />
      <Features />
      <LiveShowcase />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}
