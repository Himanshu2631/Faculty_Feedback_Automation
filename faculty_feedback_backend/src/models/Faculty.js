import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Faculty name is required'],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    designation: {
        type: String,
        required: [true, 'Designation is required'],
        trim: true,
        enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Other']
    },
    phone: {
        type: String,
        trim: true
    }
}, { timestamps: true });

export default mongoose.model('Faculty', facultySchema);
