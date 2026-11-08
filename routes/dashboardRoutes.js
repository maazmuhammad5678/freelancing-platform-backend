
const express = require("express");
const router = express.Router();

const {
    clientDashboard,
    freelancerDashboard
} = require("../controllers/dashboardController");

const {
    checkAuthentication
} = require("../middlewares/authMiddleware");

const allowRoles = require("../middlewares/roleMiddleware");

router.get(
    "/client/dashboard",
    checkAuthentication,
    allowRoles("client"),
    clientDashboard
);

router.get(
    "/freelancer/dashboard",
    checkAuthentication,
    allowRoles("freelancer"),
    freelancerDashboard
);

module.exports = router;
