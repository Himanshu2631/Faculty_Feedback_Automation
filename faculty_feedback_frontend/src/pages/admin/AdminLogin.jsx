import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import api from '../../api';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { success, error } = useToast();

    const { login } = useAuth(); // Get login function from context

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            error('Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            const result = await login({ email, password }, 'admin');

            if (result.success) {
                success('Login successful! Redirecting...');
                setTimeout(() => navigate('/admin/dashboard'), 500);
            } else {
                error(result.message || 'Login failed');
            }
        } catch (err) {
            console.error('Admin login error:', err);
            error('An unexpected error occurred');
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

                {/* Left Side: Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative z-10">
                    <div className="text-center md:text-left mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
                        <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-medium mb-6">
                            Admin Portal
                        </div>
                        <p className="text-gray-500 text-sm">Use your email and password</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-700 placeholder-gray-400"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-700 placeholder-gray-400"
                                required
                            />
                        </div>

                        <div className="text-right">
                            <a href="#" className="text-xs text-gray-500 hover:text-indigo-600 transition-colors">
                                Forget Password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'SIGNING IN...' : 'SIGN IN'}
                        </button>
                    </form>

                    <div className="mt-8 text-center md:hidden">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/admin/signup')}
                                className="text-indigo-600 font-bold hover:underline"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                </div>

                {/* Right Side: Info Panel */}
                <div className="hidden md:flex w-1/2 bg-indigo-600 text-white p-12 flex-col justify-center items-center text-center relative">
                    {/* Curved Shape */}
                    <div className="absolute top-0 left-0 w-full h-full bg-indigo-600" style={{ borderRadius: '100px 0 0 100px', transform: 'scale(1.1) translateX(10%)' }}></div>

                    <div className="relative z-10 max-w-xs">
                        <h2 className="text-3xl font-bold mb-4">Hello Admin!</h2>
                        <p className="text-indigo-100 mb-8 text-sm leading-relaxed">
                            Register your personal details and start managing the faculty feedback system efficiently.
                        </p>
                        <button
                            onClick={() => navigate('/admin/signup')}
                            className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-lg shadow-lg hover:bg-gray-50 transition-all transform hover:scale-105"
                        >
                            SIGN UP
                        </button>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default AdminLogin;
