import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  GraduationCap,
  BookOpen,
  MessageSquare,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import api from '../../api';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import AdminNavbar from '../../components/admin/AdminNavbar';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const { error } = useToast();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/dashboard');
      setDashboardData(data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      if (err.response?.status === 401) {
        error('Session expired. Please login again.');
        navigate('/admin/login');
      } else {
        error('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card>
          <p className="text-gray-600 dark:text-gray-400">Failed to load dashboard</p>
        </Card>
      </div>
    );
  }

  const { counts, analytics, recentFeedbacks } = dashboardData;

  // Prepare chart data
  const ratingDistribution = analytics.ratingDistribution?.map((item) => ({
    name: `${item._id?.toFixed(1)}⭐`,
    value: item.count,
  })) || [];

  const departmentData = analytics.feedbackByDepartment?.map((item) => ({
    department: item._id,
    feedbacks: item.count,
    avgRating: parseFloat(item.avgRating?.toFixed(2) || 0),
  })) || [];

  const topFacultiesData = analytics.topFaculties?.map((item) => ({
    name: item.name,
    rating: item.avgRating,
    feedbacks: item.count,
    department: item.department
  })) || [];

  const radarData = analytics.averageRatings
    ? [
      { subject: 'Q1', A: parseFloat(analytics.averageRatings.avgQ1?.toFixed(2) || 0), fullMark: 5 },
      { subject: 'Q2', A: parseFloat(analytics.averageRatings.avgQ2?.toFixed(2) || 0), fullMark: 5 },
      { subject: 'Q3', A: parseFloat(analytics.averageRatings.avgQ3?.toFixed(2) || 0), fullMark: 5 },
      { subject: 'Q4', A: parseFloat(analytics.averageRatings.avgQ4?.toFixed(2) || 0), fullMark: 5 },
      { subject: 'Q5', A: parseFloat(analytics.averageRatings.avgQ5?.toFixed(2) || 0), fullMark: 5 },
    ]
    : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{user?.name}</span> 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Here's what's happening in your portal today.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Students', value: counts.students, icon: Users, color: 'blue', bg: 'bg-blue-500' },
              { label: 'Total Faculty', value: counts.faculty, icon: GraduationCap, color: 'emerald', bg: 'bg-emerald-500' },
              { label: 'Active Subjects', value: counts.subjects, icon: BookOpen, color: 'violet', bg: 'bg-violet-500' },
              { label: 'Total Feedbacks', value: counts.feedback, icon: MessageSquare, color: 'amber', bg: 'bg-amber-500' },
            ].map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer transform hover:-translate-y-1 hover:scale-[1.02]">
                  <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} opacity-5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />

                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg} bg-opacity-10 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:bg-opacity-20 transition-colors`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center text-green-500 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      +12%
                    </div>
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {stat.value}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rating Distribution */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-indigo-500" />
                  Rating Distribution
                </h3>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={ratingDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {ratingDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Department Performance */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-emerald-500" />
                  Department Performance
                </h3>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    />
                    <Bar dataKey="feedbacks" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Radar Chart */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-violet-500" />
                  Question Analysis
                </h3>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#374151" opacity={0.2} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                    <Radar
                      name="Average Rating"
                      dataKey="A"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fill="#8b5cf6"
                      fillOpacity={0.2}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Top Faculties List */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-amber-500" />
                  Top Performers
                </h3>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {topFacultiesData.map((faculty, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-shadow">
                        {faculty.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {faculty.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {faculty.department} • {faculty.feedbacks} reviews
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-amber-500 font-bold">
                        <span>{faculty.rating}</span>
                        <span className="text-xs text-gray-400">/ 5.0</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Feedbacks Table */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Feedbacks</h3>
              <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Faculty</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentFeedbacks?.map((feedback) => (
                    <tr key={feedback._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {feedback.student?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{feedback.student?.name}</p>
                            <p className="text-xs text-gray-500">{feedback.student?.roll}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                        {feedback.subject?.name}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                        {feedback.faculty?.name}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
