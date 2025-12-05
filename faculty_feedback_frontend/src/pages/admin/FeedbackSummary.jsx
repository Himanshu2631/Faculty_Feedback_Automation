import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ArrowLeft, Download } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import api from '../../api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import AdminNavbar from '../../components/admin/AdminNavbar';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];



const FeedbackSummary = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { error } = useToast();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchSummary();
  }, [user, navigate]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/summary');
      setSummary(data);
    } catch (err) {
      error('Failed to load summary');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  if (!summary) return null;

  const distributionData = summary.distribution?.map((item, index) => ({
    name: `${item._id || index + 1}⭐`,
    count: item.count,
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <BarChart3 className="w-8 h-8 mr-3 text-primary-600" />
              Feedback Summary
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Overview of feedback performance and statistics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Feedbacks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {summary.totalFeedbacks}
                </p>
              </div>
              {summary.averageRatings && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Overall</p>
                    <p className="text-xl font-bold text-primary-600">
                      {parseFloat(summary.averageRatings.avgOverall || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Q1</p>
                    <p className="text-xl font-bold text-primary-600">
                      {parseFloat(summary.averageRatings.avgQ1 || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSummary;
