import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import api from '../../api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const FeedbackForm = ({ subject, onCancel, onSubmit }) => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState({
    q1: 5,
    q2: 5,
    q3: 5,
    q4: 5,
    q5: 5,
  });
  const [comments, setComments] = useState('');

  const questions = [
    { key: 'q1', label: 'Teaching Quality', desc: 'How would you rate the teaching quality?' },
    { key: 'q2', label: 'Course Content', desc: 'How would you rate the course content?' },
    { key: 'q3', label: 'Punctuality', desc: 'How would you rate the punctuality?' },
    { key: 'q4', label: 'Clarity', desc: 'How would you rate the clarity of explanations?' },
    { key: 'q5', label: 'Overall Experience', desc: 'How would you rate the overall experience?' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/student/submit', {
        subjectId: subject._id,
        ratings,
        comments: comments.trim(),
      });
      success('Feedback submitted successfully!');
      onSubmit();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Card className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Feedback Form
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {subject.name} ({subject.code})
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Faculty: {subject.faculty?.name}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.key} className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Q{index + 1}: {question.label}
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">{question.desc}</p>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatings({ ...ratings, [question.key]: star })}
                    className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all ${
                      ratings[question.key] >= star
                        ? 'bg-yellow-400 text-white scale-110'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Star
                      size={20}
                      fill={ratings[question.key] >= star ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
                <span className="ml-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {ratings[question.key]}/5
                </span>
              </div>
            </div>
          ))}

          <div>
            <label className="label">Additional Comments (Optional)</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="input"
              rows="4"
              placeholder="Share your thoughts..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {comments.length}/500 characters
            </p>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading} disabled={loading}>
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default FeedbackForm;
