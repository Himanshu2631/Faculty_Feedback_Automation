import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, BookOpen, Monitor } from 'lucide-react';
import "../styles/globals.css";

const RoleSelection = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-gray-50">

            {/* Student Section */}
            <div
                className="flex-1 flex flex-col items-center justify-center p-10 cursor-pointer transition-all duration-300 hover:bg-indigo-50 group border-b md:border-b-0 md:border-r border-gray-200"
                onClick={() => navigate('/student/login')}
            >
                <div className="bg-indigo-100 p-8 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen size={64} className="text-indigo-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4 group-hover:text-indigo-700">Student</h2>
                <p className="text-gray-500 text-center max-w-md text-lg">
                    Focus on learning and skill development. Access your courses, feedback, and results.
                </p>
                <button className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    Login as Student
                </button>
            </div>

            {/* Divider (VS Circle) */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg border border-gray-100">
                <span className="font-bold text-gray-400">OR</span>
            </div>

            {/* Admin Section */}
            <div
                className="flex-1 flex flex-col items-center justify-center p-10 cursor-pointer transition-all duration-300 hover:bg-purple-50 group"
                onClick={() => navigate('/admin/login')}
            >
                <div className="bg-purple-100 p-8 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Monitor size={64} className="text-purple-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4 group-hover:text-purple-700">Admin</h2>
                <p className="text-gray-500 text-center max-w-md text-lg">
                    Manage resources and support. Oversee faculty, subjects, and feedback systems.
                </p>
                <button className="mt-8 px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    Login as Admin
                </button>
            </div>

        </div>
    );
};

export default RoleSelection;
