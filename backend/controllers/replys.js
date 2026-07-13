const { createReplyService, getRepliesService } = require("../services/replys");

const createReplyController = async (req, res) => {
    try {
        const { commentId, content } = req.body;
        if (!content?.trim() && !req.file) {
            return res.status(400).json({ success: false, message: "Reply cannot be empty" });
        }
        const userId = req.user.id;
        const image = req.file ? `replies/${req.file.filename}` : null;
        const result = await createReplyService(commentId, userId, content?.trim() || '', image);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getRepliesController = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const offset = (page - 1) * limit;
        const replies = await getRepliesService(commentId, userId, limit, offset);
        res.status(200).json({ success: true, data: replies });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createReplyController, getRepliesController };
