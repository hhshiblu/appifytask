const { createFeedService, getFeedsService } = require("../services/feeds");

const createFeedController = async (req, res) => {
    try {
        const { content, visibility } = req.body;
        const image = req.file ? req.file.filename : null;
        const userId = req.user.id;
        const id = await createFeedService(userId, content, image, visibility);
        res.status(201).json({ success: true, data: { id } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getFeedController = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const offset = (page - 1) * limit;
        const feeds = await getFeedsService(userId, limit, offset);
        res.status(200).json({ success: true, data: feeds, page, limit, hasMore: feeds.length === limit });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createFeedController, getFeedController };
