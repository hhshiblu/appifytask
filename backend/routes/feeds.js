const router = require("express").Router()
const { getFeedController, createFeedController } = require("../controllers/feeds")
const authMiddleware = require("../middleware/auth")
const { upload } = require("../middleware/upload")

router.get("/", authMiddleware, getFeedController)
router.post("/", authMiddleware, upload.single('image'), createFeedController)

module.exports = router
