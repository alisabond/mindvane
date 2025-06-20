const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    tasks: [
        {
            title: { type: String, required: true },
            description: String,
            boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
            estimates: String,
            count: Number,
            createdAt: { type: Date, default: Date.now },
            priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
            status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
            // image: String
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Board', BoardSchema);
