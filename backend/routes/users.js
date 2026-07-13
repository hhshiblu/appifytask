const router = require("express").Router();
const { getUser, loginUser,createUser,forgotPassword,changePassword,logoutUser } = require("../controllers/users");
const authMiddleware = require("../middleware/auth");

router.get("/me", authMiddleware, getUser);
router.post("/login", loginUser);
router.post("/signup", createUser);
router.post("/forgot-password", forgotPassword);
router.post("/change-password", changePassword);
router.post("/logout", logoutUser);

module.exports = router;