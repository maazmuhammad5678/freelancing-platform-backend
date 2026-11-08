
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String,
        required: true
    },
    required_skills: {
        type: [String],
        default: []
    },
    deadline: {
        type: Date,
        required: true
    },
    experience_level: {
        type: String,
        enum: ["beginner", "intermediate", "expert"],
        default: "beginner"
    },
    status: {
        type: String,
        enum: ["open", "in progress", "completed", "cancelled"],
        default: "open"
    },
    assigned_freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Project", projectSchema);
