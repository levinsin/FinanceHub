import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
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
        source: {
            type: String,
            required: true,
            trim: true
        },
    },

    {
        timestamps: true
    }
);

incomeSchema.index({ userId: 1, source: 1 }, { unique: true });

export default mongoose.model('Income', incomeSchema);