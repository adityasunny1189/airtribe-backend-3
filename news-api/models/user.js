const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "fullname not provided "]
    },
    email: {
        type: String,
        unique: [true, "email already taken "],
        lowercase: true,
        trim: true,
        required: [true, "please enter email "],
        validator: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: `{v} is not a valid email`
        }
    },
    password: {
        type: String,
        required: true
    },
    preferences: {
        type: [String],
        default: ['general'],
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema);
