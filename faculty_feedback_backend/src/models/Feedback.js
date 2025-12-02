import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    },
    ratings: {
        q1: { type: Number, required: true, min: 1, max: 5 },
        q2: { type: Number, required: true, min: 1, max: 5 },
        q3: { type: Number, required: true, min: 1, max: 5 },
        q4: { type: Number, required: true, min: 1, max: 5 },
        q5: { type: Number, required: true, min: 1, max: 5 }
    },
    comments: {
        type: String,
        trim: true,
        maxlength: 500
    },
    averageRating: {
        type: Number,
        default: function () {
            const ratings = this.ratings;
            return ((ratings.q1 + ratings.q2 + ratings.q3 + ratings.q4 + ratings.q5) / 5).toFixed(2);
        }
    }
}, { timestamps: true });

// Index for faster queries
feedbackSchema.index({ student: 1, subject: 1 }, { unique: true });
feedbackSchema.index({ faculty: 1 });
feedbackSchema.index({ subject: 1 });

export default mongoose.model('Feedback', feedbackSchema);
