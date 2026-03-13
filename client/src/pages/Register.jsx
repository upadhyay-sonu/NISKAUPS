import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import api from '../config/api';
import { registerSuccess, registerFailure } from '../redux/authSlice';
import { showToast } from '../utils/toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      
      // Extract data from response
      const { token, user } = response.data;
      
      // Dispatch register success with the correct payload
      dispatch(registerSuccess({ token, user }));
      showToast('Registered successfully', 'success');
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch(registerFailure(errorMessage));
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
        <h1 className="text-3xl font-serif font-bold mb-6 text-center">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
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
            {loading ? 'Registering...' : 'Register'}
          </motion.button>
        </form>

        <p className="text-center mt-6 opacity-70">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:opacity-60">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
