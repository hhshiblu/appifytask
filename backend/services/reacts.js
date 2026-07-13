const { toggleReactQuery, getReactsQuery } = require("../dbquery/reacts");

const toggleReactService = async (userId, targetId, targetType) => {
    return await toggleReactQuery(userId, targetId, targetType);
};

const getReactsService = async (targetId, targetType) => {
    return await getReactsQuery(targetId, targetType);
};

module.exports = { toggleReactService, getReactsService };
