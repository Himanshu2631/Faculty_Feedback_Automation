import express from "express";
const router = express.Router();

import {
    studentSignup,
    studentLogin,
    adminSignup,
    adminLogin
} from "../controllers/authController.js";

// Student Auth Routes
router.post("/student/signup", studentSignup);
router.post("/student/login", studentLogin);

// Admin Auth Routes
router.post("/admin/signup", adminSignup);
router.post("/admin/login", adminLogin);

export default router;
