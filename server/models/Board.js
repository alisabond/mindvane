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
            title: { type: String, required: true, trim: true },
            description: { type: String, default: '' },
            column: { type: String, enum: ['todo', 'inprogress', 'done'], default: 'todo' },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Board', BoardSchema);
