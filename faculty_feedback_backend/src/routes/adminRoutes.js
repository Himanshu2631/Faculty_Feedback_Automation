import express from 'express';
const router = express.Router();
import {
    getDashboardStats,
    getStudents,
    addFaculty,
    getFaculty,
    updateFaculty,
    deleteFaculty,
    addSubject,
    getSubjects,
    updateSubject,
    deleteSubject,
    getFeedbacks,
    getFeedbackSummary
} from '../controllers/adminController.js';
import { adminLogin } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

// Public routes
router.post('/login', adminLogin);

// Protected routes
router.use(protect);
router.use(adminOnly);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Students
router.get('/students', getStudents);

// Faculty routes
router.route('/faculty')
    .get(getFaculty)
    .post(addFaculty);

router.route('/faculty/:id')
    .put(updateFaculty)
    .delete(deleteFaculty);

// Subject routes
router.route('/subjects')
    .get(getSubjects)
    .post(addSubject);

router.route('/subjects/:id')
    .put(updateSubject)
    .delete(deleteSubject);

// Feedback routes
router.get('/feedbacks', getFeedbacks);
router.get('/summary', getFeedbackSummary);

export default router;
