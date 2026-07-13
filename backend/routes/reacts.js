const router = require("express").Router()
const { toggleReactController, getReactsController } = require("../controllers/reacts")
const authMiddleware = require("../middleware/auth")

router.get("/:targetType/:targetId", authMiddleware, getReactsController)
router.post("/", authMiddleware, toggleReactController)

module.exports = router