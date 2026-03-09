import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import api from '../config/api';

const News = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/blog');
      setPosts(response.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container-custom py-12"
    >
      <h1 className="text-5xl font-serif font-bold mb-4">News & Stories</h1>
      <p className="text-lg opacity-70 mb-12">Latest updates from Niskaups</p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-neutral-200 h-64 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <motion.div
              key={post._id}
              whileHover={{ y: -10 }}
              className="card-glass overflow-hidden"
            >
              {post.image?.url && (
                <div className="w-full h-64 overflow-hidden">
                  <img
                    src={post.image.url}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-110 transition duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <p className="text-sm text-neutral-600 mb-2">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                  <h3 className="font-serif font-bold text-2xl mb-3">{post.title}</h3>
                  <p className="text-neutral-700 mb-4 line-clamp-3">{post.excerpt}</p>
                  <Link to={`/news/${post.slug}`} className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary hover:gap-3 transition-all duration-300">
                    Read More
                    <ArrowRight size={18} className="transition-transform duration-300" />
                  </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
          <p className="text-neutral-600">No news posts yet</p>
        </div>
      )}
    </motion.div>
  );
};

export default News;
