import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    CreditCard,
    Building,
    Calendar,
    Lock,
    Camera,
    Save,
    CheckCircle,
    Clock,
    BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import api from '../../api';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import StudentNavbar from "../../components/student/StudentNavbar";

const Profile = () => {
    const { user } = useAuth(); // Assuming setUser is available to update context
    const { success, error } = useToast();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [stats, setStats] = useState({ totalSubjects: 0, submittedCount: 0, pendingCount: 0 });

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        rollNumber: '',
        department: '',
        year: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/student/login');
            return;
        }

        // Initialize profile data from user context
        setProfileData({
            name: user.name || '',
            email: user.email || '',
            rollNumber: user.rollNumber || '',
            department: user.department || '',
            year: user.year || ''
        });

        fetchDashboardStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/student/dashboard');
            setStats(data.stats || { totalSubjects: 0, submittedCount: 0, pendingCount: 0 });
        } catch (err) {
            console.error('Profile stats fetch error:', err);
            // Don't block profile load on stats error
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // API call to update profile
            await api.put('/student/update-profile', {
                name: profileData.name,
                email: profileData.email
            });

            // Update local user context if possible (mock update)
            // setUser({ ...user, name: profileData.name, email: profileData.email });

            success('Profile updated successfully!');
        } catch (err) {
            console.error('Profile update error:', err);
            error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            error('Password must be at least 6 characters');
            return;
        }

        setPasswordLoading(true);
        try {
            await api.post('/student/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            success('Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error('Password change error:', err);
            error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
            // In a real app, you would upload this file to the server here
            success('Profile picture updated (preview only)');
        }
    };

    if (loading && !user) {
        return <Loader fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
            <StudentNavbar />

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Top Header Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden animate-fade-in">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white/30 overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-105">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0) || <User size={48} />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2.5 bg-white text-indigo-600 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-all duration-300 hover:scale-110">
                                <Camera size={18} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>

                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-4xl font-extrabold tracking-tight">{user?.name}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-indigo-100 text-lg font-medium">
                                <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                    <Building size={16} /> {user?.department}
                                </span>
                                <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                    <Calendar size={16} /> Year {user?.year}
                                </span>
                            </div>
                            <p className="text-indigo-200 text-sm pt-1 opacity-90">Manage your profile and account settings</p>
                        </div>
                    </div>

                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-60 h-60 bg-purple-500/20 rounded-full blur-2xl"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Personal Details Card */}
                        <div className="animate-slide-up delay-100">
                            <Card className="p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Personal Details</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal information</p>
                                    </div>
                                </div>

                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-start gap-x-10">
                                            <label className="w-40 text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                            <div className="flex-1">
                                                <Input
                                                    icon={User}
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    placeholder="Enter your full name"
                                                    className="focus:ring-indigo-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-start gap-x-10">
                                            <label className="w-40 text-sm font-medium text-gray-700 dark:text-gray-300">Roll Number</label>
                                            <div className="flex-1">
                                                <Input
                                                    icon={CreditCard}
                                                    value={profileData.rollNumber}
                                                    disabled
                                                    className="bg-gray-50 dark:bg-gray-800 opacity-75 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-start gap-x-10">
                                            <label className="w-40 text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                            <div className="flex-grow">
                                                <Input
                                                    icon={Mail}
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                    placeholder="Enter your email"
                                                    className="focus:ring-indigo-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-start gap-x-10">
                                            <label className="w-40 text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                                            <div className="flex-1">
                                                <Input
                                                    icon={Building}
                                                    value={profileData.department}
                                                    disabled
                                                    className="bg-gray-50 dark:bg-gray-800 opacity-75 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-start gap-x-10">
                                            <label className="w-40 text-sm font-medium text-gray-700 dark:text-gray-300">Year / Semester</label>
                                            <div className="flex-1">
                                                <Input
                                                    icon={Calendar}
                                                    value={`Year ${profileData.year}`}
                                                    disabled
                                                    className="bg-gray-50 dark:bg-gray-800 opacity-75 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            loading={saving}
                                            className="px-8 py-2.5 transition-all hover:scale-[1.02] shadow-md hover:shadow-lg bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            <Save size={18} className="mr-2" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </div>

                        {/* Change Password Card */}
                        <div className="animate-slide-up delay-200">
                            <Card className="p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
                                    <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400 shadow-sm">
                                        <Lock size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Change Password</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Ensure your account is secure</p>
                                    </div>
                                </div>

                                <form onSubmit={handlePasswordChange} className="space-y-6">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-start gap-x-10">
                                            <label className="w-40 text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                                            <div className="flex-1">
                                                <Input
                                                    type="password"
                                                    icon={Lock}
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    placeholder="Enter current password"
                                                    className="focus:ring-purple-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-start gap-x-10">
                                            <label className="w-40 text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                                            <div className="flex-1">
                                                <Input
                                                    type="password"
                                                    icon={Lock}
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    placeholder="Enter new password"
                                                    className="focus:ring-purple-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-start gap-x-10">
                                            <label className="w-40 text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                                            <div className="flex-1">
                                                <Input
                                                    type="password"
                                                    icon={Lock}
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    placeholder="Confirm new password"
                                                    className="focus:ring-purple-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button
                                            type="submit"
                                            variant="secondary"
                                            loading={passwordLoading}
                                            className="px-8 py-2.5 transition-all hover:scale-[1.02] shadow-sm hover:shadow-md"
                                        >
                                            Update Password
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </div>

                    </div>

                    {/* Right Column: Stats & Photo */}
                    <div className="space-y-8 animate-slide-up delay-300">

                        {/* Activity Stats Card */}
                        <Card className="p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                                <div className="p-2.5 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 shadow-sm">
                                    <CheckCircle size={22} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Activity Stats</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                                            <CheckCircle size={18} />
                                        </div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Feedback Submitted</span>
                                    </div>
                                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.submittedCount}</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400">
                                            <Clock size={18} />
                                        </div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Pending Feedback</span>
                                    </div>
                                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.pendingCount}</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                                            <BookOpen size={18} />
                                        </div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Total Subjects</span>
                                    </div>
                                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.totalSubjects}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Profile Photo Upload Card (Extra explicit section) */}
                        <Card className="p-8 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                            <div className="mb-6 flex justify-center">
                                <div className="w-24 h-24 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner animate-pulse">
                                    <Camera size={40} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Profile Picture</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 px-4">
                                Upload a new profile picture. JPG, GIF or PNG. Max size of 800K.
                            </p>
                            <label className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-all duration-300 w-full hover:shadow-md transform hover:-translate-y-0.5">
                                <Camera size={18} className="mr-2" />
                                Upload New Picture
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </Card>

                    </div>

                </div>
            </main>
        </div>
    );
};

export default Profile;
