import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    ChevronRight,
    User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import api from '../../api';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import StudentNavbar from "../../components/student/StudentNavbar";

const StudentCourses = () => {
    const { user } = useAuth();
    const { error } = useToast();
    const navigate = useNavigate();

    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/student/login');
            return;
        }
        fetchSubjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/student/subjects');
            setSubjects(data);
        } catch (err) {
            console.error('Subjects fetch error:', err);
            if (err.response?.status === 401) {
                error('Session expired. Please login again.');
                navigate('/student/login');
            } else {
                error('Failed to load subjects. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    if (!subjects && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card>
                    <p className="text-gray-600 dark:text-gray-400">Failed to load subjects</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <StudentNavbar />

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Your Enrolled Subjects
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        All the courses you are taking this semester.
                    </p>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subjects.map((subject) => (
                        <div
                            key={subject._id || subject.code} // Fallback to code if _id is missing
                            className="group"
                        >
                            <Card
                                className="h-full border-l-4 border-indigo-500 hover:shadow-md transition-all cursor-pointer"
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
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                            {subject.faculty?.name?.charAt(0) || <User size={12} />}
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {subject.faculty?.name || 'Unknown Faculty'}
                                        </span>
                                    </div>
                                    <span className="text-xs font-medium text-indigo-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Details <ChevronRight size={14} />
                                    </span>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>

                {subjects.length === 0 && (
                    <Card className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 border-dashed">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Subjects Found</h3>
                        <p className="text-gray-500">You are not enrolled in any subjects yet.</p>
                    </Card>
                )}

            </main>
        </div>
    );
};

export default StudentCourses;

