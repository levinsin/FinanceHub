import mongoose, { Schema } from "mongoose";

const settingsSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: 'User'
        },

        currency: {
            type: String,
            required: true,
            enum: ['USD', 'EUR', 'GBP'],
            default: 'EUR',
            trim: true
        }
    },
    { timestamps: true }
)

settingsSchema.index({ userId: 1 }, { unique: true });

export default mongoose.model('Settings', settingsSchema);
