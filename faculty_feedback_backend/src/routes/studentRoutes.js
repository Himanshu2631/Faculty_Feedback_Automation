import express from 'express';
const router = express.Router();
import {
    getStudentDashboard,
    getStudentSubjects,
    getFaculties,
    submitFeedback
} from '../controllers/studentController.js';
import { studentLogin, studentSignup } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

// Public routes
router.post('/login', studentLogin);
router.post('/signup', studentSignup);

// Protected routes
router.use(protect);

router.get('/dashboard', getStudentDashboard);
router.get('/subjects', getStudentSubjects);
router.get('/faculties', getFaculties);
router.post('/submit', submitFeedback);

export default router;
