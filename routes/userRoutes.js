
const express = require("express");
const router = express.Router();

const {
    signup,
    login,
    getProfile
} = require("../controllers/userController");

const {
    checkAuthentication
} = require("../middlewares/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", checkAuthentication, getProfile);

module.exports = router;
