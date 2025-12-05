import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { Mail, Lock, User, Hash, Chrome, Facebook, Linkedin } from "lucide-react";
import "../styles/signup.css";
import "../styles/globals.css";


const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        rollNumber: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const { signup } = useAuth();
    const { success: showSuccess } = useToast();
    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        // Map formData fields to backend expected format
        const mappedData = {
            name: formData.fullName,
            roll: formData.rollNumber,
            email: formData.email,
            password: formData.password,
            department: "CSE",
            year: 3
        };

        const result = await signup(mappedData);

        if (result.success) {
            showSuccess("Account successully created !! Please sign in.");
            navigate("/student/login");
        } else {
            setError(result.message);
        }
    };

    return (

        <div className="w-full h-screen flex items-center justify-center bg-gray-100 p-4">

            <div className="w-full max-w-5xl h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex signup-card">


                {/* LEFT SIDE */}
                <div className="w-1/2 bg-white p-12 flex flex-col justify-center">

                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Create Account
                    </h2>

                    <p className="text-sm text-gray-500 mb-8">
                        Use your details to register
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Social Icons */}
                    <div className="flex space-x-4 mb-8">
                        <div className="signup-social"><Chrome size={20} /></div>
                        <div className="signup-social"><Facebook size={20} /></div>
                        <div className="signup-social"><Linkedin size={20} /></div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                            <input
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-3 rounded-xl signup-input"
                            />
                        </div>

                        {/* Roll */}
                        <div className="relative">
                            <Hash className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                            <input
                                name="rollNumber"
                                placeholder="Roll Number"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-3 rounded-xl signup-input"
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                            <input
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-3 rounded-xl signup-input"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-3 rounded-xl signup-input"
                            />
                        </div>

                        <button className="w-full bg-indigo-600 text-white py-3 rounded-xl text-lg font-semibold signup-cta">
                            SIGN UP
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-gray-600">
                        Already have an account?
                        <Link to="/" className="text-indigo-600 ml-1 font-semibold">
                            Login here
                        </Link>
                    </p>
                </div>

                {/* RIGHT PURPLE PANEL */}
                <div className="w-1/2 bg-gradient-to-br from-purple-700 to-indigo-600 text-white flex flex-col items-center justify-center px-10 signup-right">
                    <h1 className="text-4xl font-bold mb-4">Hello Guys</h1>

                    <p className="text-center text-lg mb-6">
                        Register your personal details and use this web and all features
                    </p>

                    <Link
                        to="/"
                        className="bg-white text-purple-700 px-8 py-3 rounded-xl font-semibold shadow signup-cta"
                    >
                        SIGN IN
                    </Link>
                </div>

            </div>
        </div>
    );
};
console.log("Rendering REAL StudentSignup.jsx");


export default Signup;
