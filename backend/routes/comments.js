const router = require("express").Router()
const { getCommentsController, createCommentController } = require("../controllers/comments")
const authMiddleware = require("../middleware/auth")
const { uploadComment } = require("../middleware/upload")

router.get("/:postId", authMiddleware, getCommentsController)
router.post("/", authMiddleware, uploadComment.single("image"), createCommentController)

module.exports = router
