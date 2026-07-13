const { createCommentQuery, getCommentsQuery, getCommentsCountQuery } = require("../dbquery/comments");

const createCommentService = async (postId, userId, content, image = null) => {
    return await createCommentQuery(postId, userId, content, image);
};

const getCommentsService = async (postId, userId, limit, offset) => {
    return await getCommentsQuery(postId, userId, limit, offset);
};

const getCommentsCountService = async (postId) => {
    return await getCommentsCountQuery(postId);
};

module.exports = {
    createCommentService,
    getCommentsService,
    getCommentsCountService,
};
