import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
    },

    {
        timestamps: true
    }

);

budgetSchema.index({ userId: 1, category: 1 });

export default mongoose.model('Budget', budgetSchema);