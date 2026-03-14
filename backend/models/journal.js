import mongoose from 'mongoose';

const journalSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    },
    ambience: {
        type: String,
        required: true,
        enum: {
            values: ['forest', 'ocean', 'mountain'],
            message: 'Ambience must be forest, ocean or mountain'
        }
    },
    text: {
        type: String,
        required: true
    },
    emotion: {
        type: String,
        default: null
    },
    keywords: {
        type: [String],
        default: []
    },
    summary: {
        type: String,
        default: null
    }
}, {timestamps: true});

export default mongoose.model('Journal', journalSchema);