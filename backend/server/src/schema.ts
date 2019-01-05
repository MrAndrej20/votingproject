import mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
    pollName: {
        type: String,
        required: true
    },
    subjectName: {
        type: String,
        required: true
    },
    voteCount: {
        type: Number,
        required: true,
        default: 0
    }
});
export interface Poll {
    pollName: string;
    subjectName: string;
    voteCount: number;
}

export const Poll = mongoose.model('Poll', PollSchema);

