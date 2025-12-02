import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Subject from '../models/Subject.js';
import Feedback from '../models/Feedback.js';
import mongoose from 'mongoose';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        const studentCount = await Student.countDocuments();
        const facultyCount = await Faculty.countDocuments();
        const subjectCount = await Subject.countDocuments();
        const feedbackCount = await Feedback.countDocuments();

        // Get recent feedbacks
        const recentFeedbacks = await Feedback.find({})
            .populate('student', 'name roll')
            .populate('subject', 'name code')
            .populate('faculty', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        // Average ratings per question
        const avgRatings = await Feedback.aggregate([
            {
                $group: {
                    _id: null,
                    avgQ1: { $avg: '$ratings.q1' },
                    avgQ2: { $avg: '$ratings.q2' },
                    avgQ3: { $avg: '$ratings.q3' },
                    avgQ4: { $avg: '$ratings.q4' },
                    avgQ5: { $avg: '$ratings.q5' },
                    avgOverall: { $avg: '$averageRating' }
                }
            }
        ]);

        // Rating distribution
        const ratingDistribution = await Feedback.aggregate([
            {
                $group: {
                    _id: '$averageRating',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Feedback by department
        const feedbackByDept = await Feedback.aggregate([
            {
                $lookup: {
                    from: 'subjects',
                    localField: 'subject',
                    foreignField: '_id',
                    as: 'subjectData'
                }
            },
            { $unwind: '$subjectData' },
            {
                $group: {
                    _id: '$subjectData.department',
                    count: { $sum: 1 },
                    avgRating: { $avg: '$averageRating' }
                }
            }
        ]);

        // Top rated faculties
        const topFaculties = await Feedback.aggregate([
            {
                $group: {
                    _id: '$faculty',
                    avgRating: { $avg: '$averageRating' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { avgRating: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'faculties',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'facultyData'
                }
            },
            { $unwind: '$facultyData' },
            {
                $project: {
                    name: '$facultyData.name',
                    department: '$facultyData.department',
                    avgRating: { $round: ['$avgRating', 2] },
                    count: 1
                }
            }
        ]);

        res.json({
            counts: {
                students: studentCount,
                faculty: facultyCount,
                subjects: subjectCount,
                feedback: feedbackCount
            },
            analytics: {
                averageRatings: avgRatings[0] || {},
                ratingDistribution,
                feedbackByDepartment: feedbackByDept,
                topFaculties
            },
            recentFeedbacks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
export const getStudents = async (req, res) => {
    try {
        const students = await Student.find({})
            .select('-submittedSubjects')
            .sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add new faculty
// @route   POST /api/admin/faculty
// @access  Private/Admin
export const addFaculty = async (req, res) => {
    try {
        const { name, department, designation, email, phone } = req.body;

        if (!name || !department || !designation) {
            return res.status(400).json({ message: 'Name, department, and designation are required' });
        }

        const faculty = await Faculty.create({ name, department, designation, email, phone });
        res.status(201).json(faculty);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Faculty with this email already exists' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all faculty
// @route   GET /api/admin/faculty
// @access  Private/Admin
export const getFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.find({}).sort({ name: 1 });
        res.json(faculty);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update faculty
// @route   PUT /api/admin/faculty/:id
// @access  Private/Admin
export const updateFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, department, designation, email, phone } = req.body;

        const faculty = await Faculty.findByIdAndUpdate(
            id,
            { name, department, designation, email, phone },
            { new: true, runValidators: true }
        );

        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        res.json(faculty);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete faculty
// @route   DELETE /api/admin/faculty/:id
// @access  Private/Admin
export const deleteFaculty = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if faculty is assigned to any subject
        const subjectsWithFaculty = await Subject.find({ faculty: id });
        if (subjectsWithFaculty.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete faculty. Please reassign subjects first.',
                subjectsCount: subjectsWithFaculty.length
            });
        }

        const faculty = await Faculty.findByIdAndDelete(id);
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        res.json({ message: 'Faculty deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add new subject
// @route   POST /api/admin/subject
// @access  Private/Admin
export const addSubject = async (req, res) => {
    try {
        const { name, code, department, semester, facultyId, credits } = req.body;

        if (!name || !code || !department || !semester || !facultyId) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Check if faculty exists
        const faculty = await Faculty.findById(facultyId);
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        const subject = await Subject.create({
            name,
            code: code.toUpperCase(),
            department,
            semester,
            faculty: facultyId,
            credits: credits || 3
        });

        const populatedSubject = await Subject.findById(subject._id).populate('faculty', 'name department');
        res.status(201).json(populatedSubject);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Subject with this code already exists' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all subjects
// @route   GET /api/admin/subjects
// @access  Private/Admin
export const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({})
            .populate('faculty', 'name department designation')
            .sort({ department: 1, semester: 1, name: 1 });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update subject
// @route   PUT /api/admin/subject/:id
// @access  Private/Admin
export const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, department, semester, facultyId, credits } = req.body;

        const subject = await Subject.findByIdAndUpdate(
            id,
            { name, code: code?.toUpperCase(), department, semester, faculty: facultyId, credits },
            { new: true, runValidators: true }
        ).populate('faculty', 'name department');

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        res.json(subject);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete subject
// @route   DELETE /api/admin/subject/:id
// @access  Private/Admin
export const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if subject has feedback
        const feedbackCount = await Feedback.countDocuments({ subject: id });
        if (feedbackCount > 0) {
            return res.status(400).json({
                message: 'Cannot delete subject. It has existing feedback.',
                feedbackCount
            });
        }

        const subject = await Subject.findByIdAndDelete(id);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all feedbacks
// @route   GET /api/admin/feedbacks
// @access  Private/Admin
export const getFeedbacks = async (req, res) => {
    try {
        const { subjectId, facultyId, page = 1, limit = 20 } = req.query;
        const query = {};

        if (subjectId) query.subject = subjectId;
        if (facultyId) query.faculty = facultyId;

        const feedbacks = await Feedback.find(query)
            .populate('student', 'name roll department')
            .populate('subject', 'name code')
            .populate('faculty', 'name department')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Feedback.countDocuments(query);

        res.json({
            feedbacks,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get feedback summary/analytics
// @route   GET /api/admin/summary
// @access  Private/Admin
export const getFeedbackSummary = async (req, res) => {
    try {
        const { subjectId, facultyId } = req.query;

        const matchQuery = {};
        if (subjectId) matchQuery.subject = mongoose.Types.ObjectId(subjectId);
        if (facultyId) matchQuery.faculty = mongoose.Types.ObjectId(facultyId);

        // Overall statistics
        const totalFeedbacks = await Feedback.countDocuments(matchQuery);

        // Average ratings
        const avgRatings = await Feedback.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    avgQ1: { $avg: '$ratings.q1' },
                    avgQ2: { $avg: '$ratings.q2' },
                    avgQ3: { $avg: '$ratings.q3' },
                    avgQ4: { $avg: '$ratings.q4' },
                    avgQ5: { $avg: '$ratings.q5' },
                    avgOverall: { $avg: '$averageRating' }
                }
            }
        ]);

        // Rating distribution
        const distribution = await Feedback.aggregate([
            { $match: matchQuery },
            {
                $bucket: {
                    groupBy: '$averageRating',
                    boundaries: [1, 2, 3, 4, 5, 6],
                    default: 'other',
                    output: {
                        count: { $sum: 1 }
                    }
                }
            }
        ]);

        // Feedback by subject
        const bySubject = await Feedback.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$subject',
                    count: { $sum: 1 },
                    avgRating: { $avg: '$averageRating' }
                }
            },
            { $sort: { avgRating: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'subjects',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'subjectData'
                }
            },
            { $unwind: '$subjectData' }
        ]);

        res.json({
            totalFeedbacks,
            averageRatings: avgRatings[0] || {},
            distribution,
            bySubject
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
