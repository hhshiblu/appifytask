const { createReplyQuery, getRepliesQuery } = require("../dbquery/replys");

const createReplyService = async (commentId, userId, content, image = null) => {
    return await createReplyQuery(commentId, userId, content, image);
};

const getRepliesService = async (commentId, userId, limit, offset) => {
    return await getRepliesQuery(commentId, userId, limit, offset);
};

module.exports = { createReplyService, getRepliesService };
