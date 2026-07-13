const router = require("express").Router()
const { createTablesController } = require("../controllers/tables")

router.post("/create-tables", createTablesController)

module.exports = router
