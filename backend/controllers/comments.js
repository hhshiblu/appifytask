const { createCommentService, getCommentsService, getCommentsCountService } = require("../services/comments");

const createCommentController = async (req, res) => {
    try {
        const { postId, content } = req.body;
        if (!content?.trim() && !req.file) {
            return res.status(400).json({ success: false, message: "Comment cannot be empty" });
        }
        const userId = req.user.id;
        const image = req.file ? `comments/${req.file.filename}` : null;
        const id = await createCommentService(postId, userId, content?.trim() || '', image);
        res.status(201).json({ success: true, data: { id }, message: "Comment created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCommentsController = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const offset = req.query.offset !== undefined ? parseInt(req.query.offset) : (page - 1) * limit;
        const comments = await getCommentsService(postId, userId, limit, offset);
        const total = await getCommentsCountService(postId);
        res.status(200).json({
            success: true,
            data: comments,
            total,
            page,
            limit,
            hasMore: offset + comments.length < total,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createCommentController, getCommentsController };
