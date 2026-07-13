const router = require("express").Router()
const { getRepliesController, createReplyController } = require("../controllers/replys")
const authMiddleware = require("../middleware/auth")
const { uploadReply } = require("../middleware/upload")

router.get("/:commentId", authMiddleware, getRepliesController)
router.post("/", authMiddleware, uploadReply.single("image"), createReplyController)

module.exports = router
