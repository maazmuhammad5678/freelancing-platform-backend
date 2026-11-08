
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ["client", "freelancer"],
        required: true
    },
    bio: {
        type: String,
        default: ""
    },
    skills: {
        type: [String],
        default: []
    },
    profile_image: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
