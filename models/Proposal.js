
const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bid_amount: {
        type: Number,
        required: true,
        min: 1
    },
    cover_letter: {
        type: String,
        required: true
    },
    delivery_time: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "withdrawn"],
        default: "pending"
    }
}, {
    timestamps: true
});

proposalSchema.index(
    { project: 1, freelancer: 1 },
    { unique: true }
);

module.exports = mongoose.model("Proposal", proposalSchema);
