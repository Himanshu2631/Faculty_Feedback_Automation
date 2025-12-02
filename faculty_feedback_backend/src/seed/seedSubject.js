import dotenv from "dotenv";
import mongoose from "mongoose";
import Subject from "../models/Subject.js";
import Faculty from "../models/Faculty.js";

dotenv.config();

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const faculty = await Faculty.findOne();

        if (!faculty) {
            console.log("❌ No faculty found! Please add at least one faculty first.");
            process.exit();
        }

        const subjects = [
            {
                name: "Design & Analysis of Algorithms",
                code: "BCS201",
                department: "IT",
                semester: 5,
                faculty: faculty._id,
                credits: 4
            },
            {
                name: "Database Management Systems",
                code: "BCS303",
                department: "IT",
                semester: 5,
                faculty: faculty._id,
                credits: 4
            },
            {
                name: "Object Oriented System Analysis and Design",
                code: "BCS305",
                department: "IT",
                semester: 5,
                faculty: faculty._id,
                credits: 3
            },
            {
                name: "Web Technology",
                code: "BCS307",
                department: "IT",
                semester: 5,
                faculty: faculty._id,
                credits: 4
            },
            {
                name: "Machine Learning Technology",
                code: "BCS309",
                department: "IT",
                semester: 5,
                faculty: faculty._id,
                credits: 3
            }
        ];

        await Subject.insertMany(subjects);

        console.log("✔ Subjects Inserted Successfully!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
