const { connectDatabase } = require("../db/mysql");

const createReplyQuery = async (commentId, userId, content, image = null) => {
    const db = await connectDatabase();
    await db.query(
        "INSERT INTO replies (comment_id, user_id, content, image) VALUES (?, ?, ?, ?)",
        [commentId, userId, content, image]
    );
    return {
      success: true,
      message: 'Reply created successfully',
    };
};

const getRepliesQuery = async (commentId, userId, limit, offset) => {
    const db = await connectDatabase();
    const [replies] = await db.query(
        `SELECT r.*, u.first_name, u.last_name,
                COUNT(DISTINCT lk.id) AS reacts_count,
                MAX(CASE WHEN ul.user_id = ? THEN 1 ELSE 0 END) AS user_liked
         FROM replies r
         JOIN users u ON r.user_id = u.id
         LEFT JOIN likes lk ON lk.target_id = r.id AND lk.target_type = 'reply'
         LEFT JOIN likes ul ON ul.target_id = r.id AND ul.target_type = 'reply' AND ul.user_id = ?
         WHERE r.comment_id = ?
         GROUP BY r.id
         ORDER BY r.created_at DESC
         LIMIT ? OFFSET ?`,
        [userId, userId, commentId, limit, offset]
    );
    return replies;
};

module.exports = { createReplyQuery, getRepliesQuery };
