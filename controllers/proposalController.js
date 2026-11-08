
const Proposal = require("../models/Proposal");
const Project = require("../models/Project");

// SUBMIT PROPOSAL - FREELANCER ONLY
const submitProposal = async (req, res) => {
    try {
        const {
            bid_amount,
            cover_letter,
            delivery_time
        } = req.body;

        if (!bid_amount || !cover_letter || !delivery_time) {
            return res.status(400).json({
                success: false,
                message: "All proposal fields are required"
            });
        }

        if (bid_amount <= 0 || delivery_time <= 0) {
            return res.status(400).json({
                success: false,
                message: "Bid amount and delivery time must be positive"
            });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        if (project.status !== "open") {
            return res.status(400).json({
                success: false,
                message: "This project is not accepting proposals"
            });
        }

        if (project.client.toString() === req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You cannot bid on your own project"
            });
        }

        const existingProposal = await Proposal.findOne({
            project: project._id,
            freelancer: req.user._id
        });

        if (existingProposal) {
            return res.status(409).json({
                success: false,
                message: "You have already submitted a proposal"
            });
        }

        const proposal = await Proposal.create({
            project: project._id,
            freelancer: req.user._id,
            bid_amount,
            cover_letter,
            delivery_time
        });

        res.status(201).json({
            success: true,
            message: "Proposal submitted successfully",
            proposal
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "You have already submitted a proposal"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// VIEW MY PROPOSALS - FREELANCER
const getMyProposals = async (req, res) => {
    try {
        const proposals = await Proposal.find({
            freelancer: req.user._id
        })
            .populate({
                path: "project",
                select: "title category budget status"
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: proposals.length,
            proposals
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// VIEW RECEIVED PROPOSALS - CLIENT
const getProjectProposals = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            client: req.user._id
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found or not owned by you"
            });
        }

        const proposals = await Proposal.find({
            project: project._id
        })
            .populate("freelancer", "name email bio skills")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: proposals.length,
            proposals
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ACCEPT PROPOSAL - CLIENT
const acceptProposal = async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id)
            .populate("project");

        if (!proposal) {
            return res.status(404).json({
                success: false,
                message: "Proposal not found"
            });
        }

        const project = proposal.project;

        if (project.client.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You do not own this project"
            });
        }

        if (project.status !== "open") {
            return res.status(400).json({
                success: false,
                message: "This project is no longer open"
            });
        }

        if (proposal.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "This proposal is no longer pending"
            });
        }

        // Accept selected proposal
        proposal.status = "accepted";
        await proposal.save();

        // Assign freelancer to project
        project.assigned_freelancer = proposal.freelancer;
        project.status = "in progress";
        await project.save();

        // Reject all other pending proposals
        await Proposal.updateMany(
            {
                project: project._id,
                _id: { $ne: proposal._id },
                status: "pending"
            },
            {
                $set: { status: "rejected" }
            }
        );

        res.status(200).json({
            success: true,
            message: "Proposal accepted and freelancer assigned",
            proposal,
            project
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// REJECT PROPOSAL - CLIENT
const rejectProposal = async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id)
            .populate("project");

        if (!proposal) {
            return res.status(404).json({
                success: false,
                message: "Proposal not found"
            });
        }

        if (
            proposal.project.client.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You do not own this project"
            });
        }

        if (proposal.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending proposals can be rejected"
            });
        }

        proposal.status = "rejected";
        await proposal.save();

        res.status(200).json({
            success: true,
            message: "Proposal rejected",
            proposal
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// WITHDRAW PROPOSAL - FREELANCER
const withdrawProposal = async (req, res) => {
    try {
        const proposal = await Proposal.findOne({
            _id: req.params.id,
            freelancer: req.user._id
        });

        if (!proposal) {
            return res.status(404).json({
                success: false,
                message: "Proposal not found"
            });
        }

        if (proposal.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending proposals can be withdrawn"
            });
        }

        proposal.status = "withdrawn";
        await proposal.save();

        res.status(200).json({
            success: true,
            message: "Proposal withdrawn successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    submitProposal,
    getMyProposals,
    getProjectProposals,
    acceptProposal,
    rejectProposal,
    withdrawProposal
};
