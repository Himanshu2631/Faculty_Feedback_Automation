import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ShieldCheck } from 'lucide-react';
import "../styles/Login.css";
import "../styles/globals.css";

const Login = () => {
    const location = useLocation();
    // Default to student, but check if URL contains 'admin'
    const [isStudent, setIsStudent] = useState(!location.pathname.includes('admin'));

    // Update state if URL changes (though usually this component remounts)
    useEffect(() => {
        setIsStudent(!location.pathname.includes('admin'));
    }, [location.pathname]);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Prepare credentials (always email/password now)
        const credentials = { email: formData.email, password: formData.password };
        const role = isStudent ? 'student' : 'admin';

        const result = await login(credentials, role);

        if (result.success) {
            // Navigate after login succeeds
            navigate(isStudent ? '/student/dashboard' : '/admin/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">

                {/* LEFT PANEL - SIGN IN */}
                <div className="left-panel">
                    <h2>Sign In</h2>

                    {/* Role Switch */}
                    {/* Role Switch Removed - Role determined by URL */}
                    <div className="mb-6 text-center">
                        <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${isStudent ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'}`}>
                            {isStudent ? 'Student Login' : 'Admin Login'}
                        </span>
                    </div>

                    <p style={{ fontSize: "12px", marginBottom: "10px" }}>
                        Use your email and password
                    </p>

                    {error && (
                        <div style={{
                            background: "#ffe5e5",
                            padding: "10px",
                            borderRadius: "6px",
                            marginBottom: "10px",
                            color: "red"
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Inputs */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <a href="#" style={{ fontSize: "12px", marginTop: "5px" }}>
                        Forget Password
                    </a>

                    <button onClick={handleSubmit}>
                        SIGN IN
                    </button>

                    {/* Signup Link for mobile screens */}
                    <p className="mt-3 text-center text-sm">
                        Don't have an account?
                        <Link to="/student/signup" style={{ marginLeft: 5, color: "#6a11cb" }}>
                            Sign Up
                        </Link>
                    </p>
                </div>

                {/* RIGHT PANEL - SIGN UP REDIRECT */}
                <div className="right-panel">
                    <h2>Hello {isStudent ? "Student" : "Admin"}</h2>
                    <p>Register your personal details and have a encounter with this lovely web app</p>

                    <button onClick={() => navigate("/student/signup")}>
                        SIGN UP
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Login;
