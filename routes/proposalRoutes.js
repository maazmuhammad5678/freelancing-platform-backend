
const express = require("express");
const router = express.Router();

const {
    submitProposal,
    getMyProposals,
    getProjectProposals,
    acceptProposal,
    rejectProposal,
    withdrawProposal
} = require("../controllers/proposalController");

const {
    checkAuthentication
} = require("../middlewares/authMiddleware");

const allowRoles = require("../middlewares/roleMiddleware");

router.use(checkAuthentication);

router.post(
    "/projects/:id/proposal",
    allowRoles("freelancer"),
    submitProposal
);

router.get(
    "/my-proposals",
    allowRoles("freelancer"),
    getMyProposals
);

router.get(
    "/projects/:id/proposals",
    allowRoles("client"),
    getProjectProposals
);

router.put(
    "/proposal/:id/accept",
    allowRoles("client"),
    acceptProposal
);

router.put(
    "/proposal/:id/reject",
    allowRoles("client"),
    rejectProposal
);

router.delete(
    "/proposal/:id",
    allowRoles("freelancer"),
    withdrawProposal
);

module.exports = router;
