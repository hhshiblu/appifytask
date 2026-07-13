const { createTables } = require("../dbquery/tables");

const createTablesController = async (req, res, next) => {
    try {
        const result = await createTables()
        res.status(200).json({
            result
        })
    } catch (error) {
        throw new Error(error.message)
    }
}
module.exports = {
    createTablesController
}