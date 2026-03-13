import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import api from '../config/api';
import { loginSuccess, loginFailure } from '../redux/authSlice';
import { showToast } from '../utils/toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Extract data from response
      const { token, user } = response.data;
      
      // Dispatch login success with the correct payload
      dispatch(loginSuccess({ token, user }));
      showToast('Logged in successfully', 'success');
      
      // Navigate to home page or intended destination
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      showToast(errorMessage, 'error');
    }

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container-custom py-12 flex items-center justify-center min-h-[70vh]"
    >
      <div className="card-glass p-8 max-w-md w-full">
        <h1 className="text-3xl font-serif font-bold mb-6 text-center">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 text-sm"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>

        <p className="text-center mt-6 opacity-70">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-semibold hover:opacity-60">
            Register
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
