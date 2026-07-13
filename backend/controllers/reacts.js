const { toggleReactService, getReactsService } = require("../services/reacts");

const toggleReactController = async (req, res) => {
    try {
        const { targetId, targetType } = req.body;
        const userId = req.user.id;
        const result = await toggleReactService(userId, targetId, targetType);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getReactsController = async (req, res) => {
    try {
        const { targetId, targetType } = req.params;
        const reacts = await getReactsService(targetId, targetType);
        res.status(200).json({ success: true, data: reacts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { toggleReactController, getReactsController };
