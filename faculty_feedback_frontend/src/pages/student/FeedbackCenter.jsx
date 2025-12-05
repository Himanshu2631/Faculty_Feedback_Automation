import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MessageSquarePlus,
    BookOpen,
    CheckCircle,
    Clock,
    ChevronRight,
    User,
    Star,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import api from '../../api';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import FeedbackForm from './FeedbackForm';
import StudentNavbar from "../../components/student/StudentNavbar";

const StudentFeedbackCenter = () => {
    const { user } = useAuth();
    const { success, error } = useToast();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [pendingSubjects, setPendingSubjects] = useState([]);
    const [submittedFeedbacks, setSubmittedFeedbacks] = useState([]);
    const [stats, setStats] = useState({ totalSubjects: 0, submittedCount: 0, pendingCount: 0 });
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [viewFeedback, setViewFeedback] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/student/login');
            return;
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [subjectsRes, dashboardRes] = await Promise.all([
                api.get('/student/subjects'),
                api.get('/student/dashboard')
            ]);

            const allSubjects = subjectsRes.data;
            const dashboard = dashboardRes.data;

            // Calculate pending subjects based on dashboard data or subjects API
            // The dashboard API returns pendingSubjects and submittedFeedbacks directly
            setPendingSubjects(dashboard.pendingSubjects || []);
            setSubmittedFeedbacks(dashboard.submittedFeedbacks || []);
            setStats(dashboard.stats || {
                totalSubjects: allSubjects.length,
                submittedCount: dashboard.submittedFeedbacks?.length || 0,
                pendingCount: dashboard.pendingSubjects?.length || 0
            });

        } catch (err) {
            console.error('Feedback Center fetch error:', err);
            if (err.response?.status === 401) {
                error('Session expired. Please login again.');
                navigate('/student/login');
            } else {
                error('Failed to load feedback data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFeedbackSubmit = () => {
        setSelectedSubject(null);
        fetchData();
        success('Feedback submitted successfully!');
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <StudentNavbar />

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                {/* Top Banner */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <MessageSquarePlus size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Feedback Center</h1>
                            <p className="text-indigo-100 text-lg">Help improve teaching by sharing your experience.</p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="flex items-center p-6">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4">
                            <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Subjects</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalSubjects}</h3>
                        </div>
                    </Card>

                    <Card className="flex items-center p-6">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mr-4">
                            <Clock className="text-yellow-600 dark:text-yellow-400" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pending Feedback</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pendingCount}</h3>
                        </div>
                    </Card>

                    <Card className="flex items-center p-6">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mr-4">
                            <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.submittedCount}</h3>
                        </div>
                    </Card>
                </div>

                {selectedSubject ? (
                    <FeedbackForm
                        subject={selectedSubject}
                        onCancel={() => setSelectedSubject(null)}
                        onSubmit={handleFeedbackSubmit}
                    />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column: Pending Feedback */}
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Clock className="text-yellow-500" size={24} />
                                Pending Feedback
                            </h2>

                            {pendingSubjects.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pendingSubjects.map((subject) => (
                                        <div key={subject._id} className="group">
                                            <Card
                                                className="h-full border-l-4 border-indigo-500 hover:shadow-md transition-all cursor-pointer"
                                                onClick={() => setSelectedSubject(subject)}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors">
                                                            {subject.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">{subject.code}</p>
                                                    </div>
                                                    <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                                        <BookOpen size={18} className="text-indigo-600" />
                                                    </div>
                                                </div>

                                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                                            {subject.faculty?.name?.charAt(0) || <User size={12} />}
                                                        </div>
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                            {subject.faculty?.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-medium text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                        Give Feedback <ChevronRight size={16} />
                                                    </span>
                                                </div>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Card className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 border-dashed">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">All Caught Up!</h3>
                                    <p className="text-gray-500">You've submitted feedback for all your subjects.</p>
                                </Card>
                            )}
                        </div>

                        {/* Right Column: Completed Feedback History */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <CheckCircle className="text-green-500" size={24} />
                                Feedback History
                            </h2>

                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {submittedFeedbacks.length > 0 ? (
                                    submittedFeedbacks.map((feedback) => (
                                        <div key={feedback._id} className="group">
                                            <div
                                                className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
                                                onClick={() => setViewFeedback(feedback)}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                            {feedback.subject?.name}
                                                        </h4>
                                                        <p className="text-xs text-gray-500">
                                                            {feedback.faculty?.name}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                                                        <Star size={12} className="text-green-600 dark:text-green-400 fill-current" />
                                                        <span className="text-xs font-bold text-green-700 dark:text-green-300">
                                                            {/* Calculate average rating if available, otherwise show a placeholder or total */}
                                                            {feedback.ratings ? (Object.values(feedback.ratings).reduce((a, b) => a + b, 0) / 5).toFixed(1) : '5.0'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                                                    <span>{new Date(feedback.createdAt || Date.now()).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        View Details <ChevronRight size={12} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                        No feedback submitted yet.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                )}

                {/* Feedback Details Modal */}
                {viewFeedback && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start sticky top-0 bg-white dark:bg-gray-800 z-10">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Feedback Details</h2>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Submitted on {new Date(viewFeedback.createdAt || Date.now()).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setViewFeedback(null)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 font-bold text-xl">
                                        {viewFeedback.faculty?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{viewFeedback.subject?.name}</h3>
                                        <p className="text-gray-500 text-sm">{viewFeedback.faculty?.name}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-2">
                                        Ratings
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {viewFeedback.ratings && Object.entries(viewFeedback.ratings).map(([key, value]) => (
                                            <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                                <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                                                    {key.replace('q', 'Question ')}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <Star size={14} className="text-yellow-400 fill-current" />
                                                    <span className="font-bold text-gray-900 dark:text-gray-100">{value}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {viewFeedback.comments && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-2">
                                            Comments
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                                            "{viewFeedback.comments}"
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                <button
                                    onClick={() => setViewFeedback(null)}
                                    className="w-full py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default StudentFeedbackCenter;

