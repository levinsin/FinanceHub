import mongoose, { Schema} from "mongoose";

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isGlobal: {
            type: Boolean,
            default: false
        },
    },
    
    {
        timestamps: true
    }
);

// ensure a user cannot create duplicate category names
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model('Category', categorySchema);

