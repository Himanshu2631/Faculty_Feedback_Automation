import express from "express";
const router = express.Router();

import {
    studentSignup,
    studentLogin,
} from "../controllers/authController.js";

import {
    getStudentDashboard,
    getStudentSubjects,
    getFaculties,
    submitFeedback,
} from "../controllers/studentController.js";

import { protect } from "../middleware/authMiddleware.js";

// Public Routes
router.post("/signup", studentSignup);
router.post("/login", studentLogin);

// Protected Routes
router.use(protect);

router.get("/dashboard", getStudentDashboard);
router.get("/subjects", getStudentSubjects);
router.get("/faculties", getFaculties);
router.post("/submit", submitFeedback);

export default router;
