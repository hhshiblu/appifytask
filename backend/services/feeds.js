const { createFeedQuery, getFeedsQuery } = require("../dbquery/feeds");

const createFeedService = async (userId, content, image, visibility) => {
    return await createFeedQuery(userId, content, image, visibility);
};

const getFeedsService = async (userId, limit, offset) => {
    return await getFeedsQuery(userId, limit, offset);
};

module.exports = { createFeedService, getFeedsService };
