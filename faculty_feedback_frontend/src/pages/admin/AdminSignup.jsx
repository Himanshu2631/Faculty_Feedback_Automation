import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../../hooks/useToast';
import api from '../../api';

const AdminSignup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { success, error } = useToast();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/admin/signup', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            success('Registration successful! Please login.');
            setTimeout(() => navigate('/admin/login'), 1000);
        } catch (err) {
            console.error('Admin signup error:', err);
            error(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-[30px] shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row min-h-[500px]"
            >

                {/* Left Side: Info Panel (Flipped for Signup) */}
                <div className="hidden md:flex w-1/2 bg-indigo-600 text-white p-12 flex-col justify-center items-center text-center relative order-2 md:order-1">
                    {/* Curved Shape - Flipped */}
                    <div className="absolute top-0 right-0 w-full h-full bg-indigo-600" style={{ borderRadius: '0 100px 100px 0', transform: 'scale(1.1) translateX(-10%)' }}></div>

                    <div className="relative z-10 max-w-xs">
                        <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                        <p className="text-indigo-100 mb-8 text-sm leading-relaxed">
                            To keep connected with us please login with your personal info.
                        </p>
                        <button
                            onClick={() => navigate('/admin/login')}
                            className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-lg shadow-lg hover:bg-gray-50 transition-all transform hover:scale-105"
                        >
                            SIGN IN
                        </button>
                    </div>
                </div>

                {/* Right Side: Signup Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative z-10 order-1 md:order-2">
                    <div className="text-center md:text-left mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-medium mb-4">
                            Admin Portal
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-700 placeholder-gray-400"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-700 placeholder-gray-400"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-700 placeholder-gray-400"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-700 placeholder-gray-400"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'REGISTERING...' : 'SIGN UP'}
                        </button>
                    </form>

                    <div className="mt-6 text-center md:hidden">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/admin/login')}
                                className="text-indigo-600 font-bold hover:underline"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default AdminSignup;
