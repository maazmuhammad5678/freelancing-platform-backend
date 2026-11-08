
const Project = require("../models/Project");
const Proposal = require("../models/Proposal");

// CLIENT DASHBOARD
const clientDashboard = async (req, res) => {
    try {
        const clientId = req.user._id;

        const totalProjects = await Project.countDocuments({
            client: clientId
        });

        const activeProjects = await Project.countDocuments({
            client: clientId,
            status: "in progress"
        });

        const completedProjects = await Project.countDocuments({
            client: clientId,
            status: "completed"
        });

        const projectIds = await Project.find({
            client: clientId
        }).distinct("_id");

        const totalProposals = await Proposal.countDocuments({
            project: { $in: projectIds }
        });

        res.status(200).json({
            success: true,
            dashboard: {
                totalProjects,
                activeProjects,
                completedProjects,
                totalProposals
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// FREELANCER DASHBOARD
const freelancerDashboard = async (req, res) => {
    try {
        const freelancerId = req.user._id;

        const appliedProjects = await Proposal.countDocuments({
            freelancer: freelancerId
        });

        const acceptedProposals = await Proposal.countDocuments({
            freelancer: freelancerId,
            status: "accepted"
        });

        const activeProjects = await Project.countDocuments({
            assigned_freelancer: freelancerId,
            status: "in progress"
        });

        const completedProjects = await Project.countDocuments({
            assigned_freelancer: freelancerId,
            status: "completed"
        });

        res.status(200).json({
            success: true,
            dashboard: {
                appliedProjects,
                activeProjects,
                completedProjects,
                acceptedProposals
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    clientDashboard,
    freelancerDashboard
};
