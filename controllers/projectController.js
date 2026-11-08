
const Project = require("../models/Project");
const Proposal = require("../models/Proposal");

// CREATE PROJECT - CLIENT ONLY
const createProject = async (req, res) => {
    try {
        const {
            title,
            category,
            budget,
            description,
            required_skills,
            deadline,
            experience_level
        } = req.body;

        if (
            !title || !category || !budget ||
            !description || !deadline
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required project details"
            });
        }

        const project = await Project.create({
            client: req.user._id,
            title,
            category,
            budget,
            description,
            required_skills,
            deadline,
            experience_level
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            project
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL PROJECTS - SEARCH AND FILTER
const getProjects = async (req, res) => {
    try {
        const { search, category, status } = req.query;

        const filter = {};

        if (req.user.role === "client") {
            filter.client = req.user._id;
        } else {
            filter.status = "open";
        }

        if (status && req.user.role === "client") {
            filter.status = status.toLowerCase();
        }

        if (category) {
            filter.category = new RegExp(category, "i");
        }

        if (search) {
            filter.$or = [
                { title: new RegExp(search, "i") },
                { description: new RegExp(search, "i") }
            ];
        }

        const projects = await Project.find(filter)
            .populate("client", "name email")
            .populate("assigned_freelancer", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            projects
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET SINGLE PROJECT
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("client", "name email")
            .populate("assigned_freelancer", "name email");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        if (
            project.status !== "open" &&
            project.client._id.toString() !== req.user._id.toString() &&
            (!project.assigned_freelancer ||
            project.assigned_freelancer._id.toString() !== req.user._id.toString())
        ) {
            return res.status(403).json({
                success: false,
                message: "You cannot view this project"
            });
        }

        res.status(200).json({
            success: true,
            project
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE PROJECT
const updateProject = async (req, res) => {
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

        if (project.status !== "open") {
            return res.status(400).json({
                success: false,
                message: "Only open projects can be edited"
            });
        }

        const allowedFields = [
            "title",
            "category",
            "budget",
            "description",
            "required_skills",
            "deadline",
            "experience_level"
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                project[field] = req.body[field];
            }
        });

        await project.save();

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE PROJECT
const deleteProject = async (req, res) => {
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

        if (project.status !== "open") {
            return res.status(400).json({
                success: false,
                message: "Only open projects can be deleted"
            });
        }

        await Proposal.deleteMany({
            project: project._id
        });

        await project.deleteOne();

        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// CHANGE PROJECT STATUS
const updateProjectStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "in progress",
            "completed",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project status"
            });
        }

        const project = await Project.findOne({
            _id: req.params.id,
            client: req.user._id
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        if (
            status === "in progress" &&
            (!project.assigned_freelancer || project.status !== "open")
        ) {
            return res.status(400).json({
                success: false,
                message: "An accepted freelancer is required to start a project"
            });
        }

        if (
            status === "completed" &&
            project.status !== "in progress"
        ) {
            return res.status(400).json({
                success: false,
                message: "Only projects in progress can be completed"
            });
        }

        if (
            status === "cancelled" &&
            project.status !== "open"
        ) {
            return res.status(400).json({
                success: false,
                message: "Only open projects can be cancelled"
            });
        }

        project.status = status;

        await project.save();

        res.status(200).json({
            success: true,
            message: "Project status updated",
            project
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    updateProjectStatus
};
