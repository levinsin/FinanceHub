import mongoose from "mongoose";

const savingsGoalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        targetAmount: {
            type: Number,
            required: true,
            min: 0
        },
        deadline: {
            type: Date,
            required: true,
            enum: ['monthly', 'yearly', 'one-time']
        }
    },

    {
        timestamps: true
    }
);

// ensure a user cannot create duplicate savings goal names
savingsGoalSchema.index({ userId: 1, deadline: 1 }, { unique: true });

export default mongoose.model('SavingsGoal', savingsGoalSchema);