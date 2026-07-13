const router = require("express").Router();
const users = require("../routes/users");
const tables = require("../routes/tables");
const feeds = require("../routes/feeds");
const comments = require("../routes/comments");
const replys = require("../routes/replys");
const reacts = require("../routes/reacts");

router.use("/api/users", users)
router.use("/api/tables", tables)
router.use("/api/feeds", feeds)
router.use("/api/comments", comments)
router.use("/api/replys", replys)
router.use("/api/reacts", reacts)

module.exports = router;