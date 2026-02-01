import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        date: {
            type: Date,
            default: Date.now
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Category',
            default: null
        },
        costType: {
            type: String,
            required: true,
            enum: ['fixed', 'variable'],
            default: null
        },
        notes: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
);

// Indexes to speed up common queries (per user, by date, by category)
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

export default mongoose.model('Expense', expenseSchema);