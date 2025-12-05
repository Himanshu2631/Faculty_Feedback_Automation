import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import api from '../../api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';

import AdminNavbar from '../../components/admin/AdminNavbar';

const ManageSubjects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: '',
    semester: 1,
    facultyId: '',
    credits: 3,
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subjectsRes, facultiesRes] = await Promise.all([
        api.get('/admin/subjects'),
        api.get('/admin/faculty'),
      ]);
      setSubjects(subjectsRes.data);
      setFaculties(facultiesRes.data);
    } catch (err) {
      error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await api.put(`/admin/subjects/${editingSubject._id}`, formData);
        success('Subject updated successfully');
      } else {
        await api.post('/admin/subjects', formData);
        success('Subject added successfully');
      }
      setIsModalOpen(false);
      setEditingSubject(null);
      setFormData({ name: '', code: '', department: '', semester: 1, facultyId: '', credits: 3 });
      fetchData();
    } catch (err) {
      error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      department: subject.department,
      semester: subject.semester,
      facultyId: subject.faculty._id || subject.faculty,
      credits: subject.credits || 3,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    try {
      await api.delete(`/admin/subjects/${id}`);
      success('Subject deleted successfully');
      fetchData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete subject');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-primary-600" />
              Manage Subjects
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Add, edit, or remove subjects and assign faculty.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setEditingSubject(null);
              setFormData({ name: '', code: '', department: '', semester: 1, facultyId: '', credits: 3 });
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Subject
          </Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium">Code</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Department</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Semester</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Faculty</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 text-sm font-medium">{subject.code}</td>
                    <td className="py-3 px-4 text-sm">{subject.name}</td>
                    <td className="py-3 px-4 text-sm">{subject.department}</td>
                    <td className="py-3 px-4 text-sm">{subject.semester}</td>
                    <td className="py-3 px-4 text-sm">{subject.faculty?.name || '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(subject)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(subject._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSubject(null);
          }}
          title={editingSubject ? 'Edit Subject' : 'Add Subject'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Subject Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Subject Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              required
            />
            <Input
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            />
            <Input
              label="Semester"
              type="number"
              min="1"
              max="8"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
              required
            />
            <Input
              label="Credits"
              type="number"
              min="1"
              max="6"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
            />
            <div>
              <label className="label">Faculty</label>
              <select
                className="input"
                value={formData.facultyId}
                onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                required
              >
                <option value="">Select Faculty</option>
                {faculties.map((faculty) => (
                  <option key={faculty._id} value={faculty._id}>
                    {faculty.name} - {faculty.department}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingSubject ? 'Update' : 'Add'} Subject
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageSubjects;
