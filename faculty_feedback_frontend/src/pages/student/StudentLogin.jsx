import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const StudentLogin = () => {
  const [roll, setRoll] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginStudent } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roll.trim()) {
      error('Please enter your roll number');
      return;
    }

    setLoading(true);
    const result = await loginStudent(roll.trim());
    setLoading(false);

    if (result.success) {
      success('Login successful! Redirecting...');
      setTimeout(() => navigate('/student/dashboard'), 500);
    } else {
      error(result.message || 'Invalid roll number');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
              <GraduationCap className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Student Login
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your roll number to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Roll Number"
              type="text"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              placeholder="Enter your roll number"
              required
              autoFocus
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Admin?{' '}
              <a
                href="/admin/login"
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                Login here
              </a>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default StudentLogin;
