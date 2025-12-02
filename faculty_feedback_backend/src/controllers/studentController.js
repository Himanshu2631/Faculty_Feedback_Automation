import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Subject from '../models/Subject.js';
import Feedback from '../models/Feedback.js';

// @desc    Get student dashboard data
// @route   GET /api/student/dashboard
// @access  Private/Student
export const getStudentDashboard = async (req, res) => {
    try {
        const student = await Student.findById(req.user._id);

        // Get all subjects
        const allSubjects = await Subject.find({})
            .populate('faculty', 'name department designation')
            .sort({ department: 1, semester: 1 });

        // Get submitted feedbacks
        const submittedFeedbacks = await Feedback.find({ student: req.user._id })
            .populate('subject', 'name code')
            .populate('faculty', 'name')
            .sort({ createdAt: -1 });

        // Filter pending subjects
        const pendingSubjects = allSubjects.filter(
            sub => !student.submittedSubjects.some(
                submittedId => submittedId.toString() === sub._id.toString()
            )
        );

        res.json({
            student: {
                _id: student._id,
                name: student.name,
                roll: student.roll,
                email: student.email
            },
            pendingSubjects,
            submittedFeedbacks,
            stats: {
                totalSubjects: allSubjects.length,
                pendingCount: pendingSubjects.length,
                submittedCount: submittedFeedbacks.length
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get subjects for student (excluding submitted ones)
// @route   GET /api/student/subjects
// @access  Private/Student
export const getStudentSubjects = async (req, res) => {
    try {
        const allSubjects = await Subject.find({})
            .populate('faculty', 'name department designation')
            .sort({ department: 1, semester: 1 });

        res.json(allSubjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all faculties
// @route   GET /api/student/faculties
// @access  Private/Student
export const getFaculties = async (req, res) => {
    try {
        const faculties = await Subject.find({})
            .populate('faculty', 'name department designation')
            .distinct('faculty');

        const uniqueFaculties = await Faculty.find({ _id: { $in: faculties } })
            .sort({ name: 1 });

        res.json(uniqueFaculties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Submit feedback
// @route   POST /api/student/submit
// @access  Private/Student
export const submitFeedback = async (req, res) => {
    try {
        const { subjectId, ratings, comments } = req.body;
        const studentId = req.user._id;

        // Validate required fields
        if (!subjectId || !ratings) {
            return res.status(400).json({ message: 'Subject ID and ratings are required' });
        }

        // Validate ratings
        const ratingKeys = ['q1', 'q2', 'q3', 'q4', 'q5'];
        for (const key of ratingKeys) {
            if (!ratings[key] || ratings[key] < 1 || ratings[key] > 5) {
                return res.status(400).json({ message: `Invalid rating for ${key}. Must be between 1 and 5.` });
            }
        }

        // Get subject to get faculty
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Check if already submitted
        const existingFeedback = await Feedback.findOne({
            student: studentId,
            subject: subjectId
        });

        if (existingFeedback) {
            return res.status(400).json({ message: 'Feedback already submitted for this subject' });
        }

        // Calculate average rating
        const avgRating = (
            (ratings.q1 + ratings.q2 + ratings.q3 + ratings.q4 + ratings.q5) / 5
        ).toFixed(2);

        // Create feedback
        const feedback = await Feedback.create({
            student: studentId,
            subject: subjectId,
            faculty: subject.faculty,
            ratings,
            comments: comments || '',
            averageRating: parseFloat(avgRating)
        });

        // Update student's submittedSubjects
        await Student.findByIdAndUpdate(studentId, {
            $push: { submittedSubjects: subjectId }
        });

        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback: {
                _id: feedback._id,
                subject: subject.name,
                averageRating: avgRating
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
