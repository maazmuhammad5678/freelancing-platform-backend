
const express = require("express");
const router = express.Router();

const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    updateProjectStatus
} = require("../controllers/projectController");

const {
    checkAuthentication
} = require("../middlewares/authMiddleware");

const allowRoles = require("../middlewares/roleMiddleware");

router.use(checkAuthentication);

router.post("/", allowRoles("client"), createProject);

router.get("/", getProjects);

router.get("/:id", getProjectById);

router.put("/:id", allowRoles("client"), updateProject);

router.delete("/:id", allowRoles("client"), deleteProject);

router.put(
    "/:id/status",
    allowRoles("client"),
    updateProjectStatus
);

module.exports = router;
