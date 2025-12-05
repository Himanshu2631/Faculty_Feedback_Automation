import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Bell,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
// import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../hooks/useToast';
import api from '../../api';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import FeedbackForm from './FeedbackForm';
import StudentNavbar from "../../components/student/StudentNavbar";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/student/login');
      return;
    }
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/student/dashboard');
      setDashboardData(data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      if (err.response?.status === 401) {
        error('Session expired. Please login again.');
        navigate('/student/login');
      } else {
        error('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = () => {
    setSelectedSubject(null);
    fetchDashboard();
    success('Feedback submitted successfully!');
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <p className="text-gray-600 dark:text-gray-400">Failed to load dashboard</p>
        </Card>
      </div>
    );
  }

  const { student, pendingSubjects, submittedFeedbacks, stats } = dashboardData;
  const progressPercentage = Math.round((stats.submittedCount / stats.totalSubjects) * 100) || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <StudentNavbar />

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Notification Banner */}
        <div
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between shadow-xl animate-slide-down"
        >
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Bell size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Feedback Period is Open!</h3>
              <p className="text-indigo-100 opacity-90">Please submit feedback for all your subjects before the deadline.</p>
            </div>
          </div>
          <button className="px-6 py-2.5 bg-white text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            View Details
          </button>
        </div>

        {/* Greeting & Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Greeting */}
          <div className="lg:col-span-2 animate-fade-in">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{student.name.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Here's an overview of your academic feedback progress.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-slide-up delay-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">Feedback Progress</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.submittedCount} <span className="text-lg text-gray-400 font-medium">/ {stats.totalSubjects} Subjects</span>
                </h3>
              </div>
              <div className="text-indigo-600 font-extrabold text-3xl">{progressPercentage}%</div>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                style={{ width: `${progressPercentage}%` }}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-1000 ease-out shadow-md"
              />
            </div>
          </div>
        </div>

        {selectedSubject ? (
          <div className="animate-fade-in">
            <FeedbackForm
              subject={selectedSubject}
              onCancel={() => setSelectedSubject(null)}
              onSubmit={handleFeedbackSubmit}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left Column: Pending Subjects */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 animate-fade-in delay-200">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Clock className="text-yellow-600 dark:text-yellow-500" size={24} />
                  </div>
                  Pending Feedback
                </h2>
                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800">
                  {pendingSubjects.length} Remaining
                </span>
              </div>

              {pendingSubjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingSubjects.map((subject, index) => (
                    <div
                      key={subject._id}
                      className="group animate-slide-up"
                      style={{ animationDelay: `${(index + 2) * 100}ms` }}
                    >
                      <Card
                        className="h-full border-l-[6px] border-indigo-500 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-[1.02] bg-white dark:bg-gray-800 rounded-xl overflow-hidden"
                        onClick={() => setSelectedSubject(subject)}
                      >
                        <div className="p-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors">
                                {subject.name}
                              </h3>
                              <p className="text-sm font-medium text-gray-500 mt-1 bg-gray-100 dark:bg-gray-700 inline-block px-2 py-0.5 rounded text-xs">
                                {subject.code}
                              </p>
                            </div>
                            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                              <BookOpen size={20} className="text-indigo-600 group-hover:text-white transition-colors" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-700 shadow-sm">
                                {subject.faculty?.name?.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {subject.faculty?.name}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                              Start Feedback <ChevronRight size={14} />
                            </span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="animate-fade-in">
                  <Card className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">All Caught Up!</h3>
                    <p className="text-gray-500 max-w-md mx-auto">You've successfully submitted feedback for all your assigned subjects. Great job!</p>
                  </Card>
                </div>
              )}
            </div>

            {/* Right Column: Recently Submitted */}
            <div className="space-y-8 animate-slide-up delay-300">
              <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="text-green-600 dark:text-green-500" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Recently Submitted
                </h2>
              </div>

              <div className="space-y-4">
                {submittedFeedbacks.length > 0 ? (
                  submittedFeedbacks.slice(0, 5).map((feedback, index) => (
                    <div
                      key={feedback._id}
                      className="group"
                    >
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-all duration-300 hover:border-green-200 dark:hover:border-green-900">
                        <div className="p-2.5 bg-green-50 dark:bg-green-900/20 rounded-full group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-colors">
                          <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate text-sm">
                            {feedback.subject?.name}
                          </h4>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {feedback.faculty?.name}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md">
                          Done
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <p>No feedback submitted yet.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
