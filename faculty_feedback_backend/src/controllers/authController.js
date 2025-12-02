import Student from "../models/Student.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ===============================
// 📌 STUDENT SIGNUP
// ===============================
export const studentSignup = async (req, res) => {
    try {
        let { fullName, rollNumber, email, password, department, year } = req.body;

        // Handle alternate key names from frontend
        const name = fullName || req.body.name;
        const roll = rollNumber || req.body.roll;

        if (!name || !roll || !email || !password || !department || !year) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check email duplicate
        const existingEmail = await Student.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Check roll number duplicate
        const existingRoll = await Student.findOne({ roll });
        if (existingRoll) {
            return res.status(400).json({ message: "Roll number already exists" });
        }

        // Create new student
        const newStudent = await Student.create({
            name,
            roll,
            email,
            password,
            department,
            year
        });

        // Generate token
        const token = generateToken(newStudent._id, "student");

        return res.json({
            success: true,
            message: "Signup successful",
            token: token,
            student: {
                _id: newStudent._id,
                name: newStudent.name,
                roll: newStudent.roll,
                email: newStudent.email,
                department: newStudent.department,
                year: newStudent.year
            }
        });

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: error.message });
    }
};

// ===============================
// 📌 STUDENT LOGIN
// ===============================
export const studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email });
        if (!student)
            return res.status(400).json({ success: false, message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch)
            return res.status(400).json({ success: false, message: "Invalid credentials" });

        return res.json({
            success: true,
            token: generateToken(student._id, "student"),
            student: {
                _id: student._id,
                name: student.name,
                roll: student.roll,
                email: student.email,
                department: student.department,
                year: student.year
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ===============================
// 📌 ADMIN LOGIN
// ===============================
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Import Admin model
        const Admin = (await import("../models/Admin.js")).default;

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        return res.json({
            message: "Login successful",
            token: generateToken(admin._id, "admin"),
            admin
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
