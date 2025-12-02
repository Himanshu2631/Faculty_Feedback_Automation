import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';

import Admin from '../models/Admin.js';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import Subject from '../models/Subject.js';
import Feedback from '../models/Feedback.js';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected\n');

        // --------------------------------------------------
        // 1️⃣ CLEAR EXISTING DATA
        // --------------------------------------------------
        console.log('🧹 Clearing old data...');

        await Feedback.deleteMany({});
        await Subject.deleteMany({});
        await Student.deleteMany({});
        try {
            await Student.collection.dropIndexes();
            console.log('✔ Student indexes dropped');
        } catch (e) {
            console.log('ℹ No indexes to drop or error dropping indexes');
        }
        await Faculty.deleteMany({});
        await Admin.deleteMany({});

        console.log('✔ All collections cleared\n');

        // --------------------------------------------------
        // 2️⃣ CREATE ADMIN
        // --------------------------------------------------
        const admin = await Admin.create({
            name: 'Super Admin',
            email: 'admin@example.com',
            password: 'admin123'
        });

        console.log('✔ Admin Created (admin@example.com / admin123)');

        // --------------------------------------------------
        // 3️⃣ SEED FACULTY
        // --------------------------------------------------
        const faculties = await Faculty.insertMany([
            {
                name: 'Dr. John Smith',
                department: 'IT',
                designation: 'Professor',
                email: 'john.smith@university.edu',
                phone: '+1234567890'
            },
            {
                name: 'Prof. Sarah Johnson',
                department: 'IT',
                designation: 'Associate Professor',
                email: 'sarah.johnson@university.edu',
                phone: '+1234567891'
            },
            {
                name: 'Dr. Michael Brown',
                department: 'CSE',
                designation: 'Assistant Professor',
                email: 'michael.brown@university.edu',
                phone: '+1234567892'
            },
            {
                name: 'Prof. Emily Davis',
                department: 'ECE',
                designation: 'Professor',
                email: 'emily.davis@university.edu',
                phone: '+1234567893'
            },
            {
                name: 'Dr. Robert Wilson',
                department: 'ME',
                designation: 'Lecturer',
                email: 'robert.wilson@university.edu',
                phone: '+1234567894'
            }
        ]);

        console.log(`✔ ${faculties.length} Faculty members created\n`);

        // --------------------------------------------------
        // 4️⃣ SEED STUDENTS (FIXED — NO NULL FIELDS)
        // --------------------------------------------------
        const students = await Student.insertMany([
            {
                roll: "2300320130119",
                name: "Alice Johnson",
                email: "alice@example.com",
                password: "student123",
                department: "IT",
                year: 3
            },
            {
                roll: "2300320130120",
                name: "Bob Williams",
                email: "bob@example.com",
                password: "student123",
                department: "IT",
                year: 3
            },
            {
                roll: "2300320130121",
                name: "Charlie Brown",
                email: "charlie@example.com",
                password: "student123",
                department: "CSE",
                year: 2
            },
            {
                roll: "2300320130122",
                name: "Diana Prince",
                email: "diana@example.com",
                password: "student123",
                department: "ECE",
                year: 1
            }
        ]);

        console.log(`✔ ${students.length} Students created\n`);

        // --------------------------------------------------
        // 5️⃣ SUBJECTS ARE SEEDED SEPARATELY
        // --------------------------------------------------
        console.log("⚠ Subjects are NOT seeded here.");
        console.log("👉 Run this after master seed to insert subjects:");
        console.log("   npm run seed-subjects\n");

        console.log("🎉 Master seed completed successfully!");
        process.exit(0);

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        console.error(error.stack);
        process.exit(1);
    }
};

seedData();
