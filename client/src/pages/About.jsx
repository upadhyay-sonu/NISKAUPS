import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Hero */}
      <section className="container-custom py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl font-serif font-bold mb-6">About Niskaups</h1>
          <p className="text-xl opacity-70 leading-relaxed">
            Niskaups is a premium bookstore dedicated to curating the finest selection of books
            for discerning readers. We believe in the power of literature to inspire, educate, and
            transform lives.
          </p>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="container-custom py-12 md:py-20 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}>
            <h2 className="text-4xl font-serif font-bold mb-6">Our Mission</h2>
            <p className="opacity-70 leading-relaxed mb-4">
              We are committed to celebrating exceptional literature and connecting readers with
              books that matter. Each title in our collection is carefully selected for its quality,
              significance, and ability to enrich the reading experience.
            </p>
            <p className="opacity-70 leading-relaxed">
              Our curated selections span across categories—from contemporary fiction to rare
              editions, signed books to special publications—ensuring something meaningful for
              every reader.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-accent rounded-lg p-8"
          >
            <h3 className="font-serif font-bold text-2xl mb-6">Why Choose Niskaups</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Curated collections of exceptional books</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Signed and limited edition books</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Fast and secure shipping worldwide</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Exceptional customer service</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-custom py-12 md:py-20 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <p className="text-5xl font-serif font-bold text-primary mb-2">5000+</p>
            <p className="opacity-70">Books in Collection</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-5xl font-serif font-bold text-primary mb-2">50K+</p>
            <p className="opacity-70">Happy Readers</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-5xl font-serif font-bold text-primary mb-2">150+</p>
            <p className="opacity-70">Countries Shipped</p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
