const { connectDatabase } = require("../db/mysql");

const createCommentQuery = async (postId, userId, content, image = null) => {
    const db = await connectDatabase();
    await db.query(
        "INSERT INTO comments (post_id, user_id, content, image) VALUES (?, ?, ?, ?)",
        [postId, userId, content, image]
    );
    return {
      success: true,
      message: 'Comment created successfully',
    };
};

const getCommentsCountQuery = async (postId) => {
    const db = await connectDatabase();
    const [rows] = await db.query(
        "SELECT COUNT(*) AS total FROM comments WHERE post_id = ?",
        [postId]
    );
    return rows[0]?.total || 0;
};

const getCommentsQuery = async (postId, userId, limit, offset) => {
    const db = await connectDatabase();
    const [comments] = await db.query(
        `SELECT c.*, u.first_name, u.last_name,
                COUNT(DISTINCT lk.id) AS reacts_count,
                MAX(CASE WHEN ul.user_id = ? THEN 1 ELSE 0 END) AS user_liked,
                (SELECT COUNT(*) FROM replies r WHERE r.comment_id = c.id) AS replies_count
         FROM comments c
         JOIN users u ON c.user_id = u.id
         LEFT JOIN likes lk ON lk.target_id = c.id AND lk.target_type = 'comment'
         LEFT JOIN likes ul ON ul.target_id = c.id AND ul.target_type = 'comment' AND ul.user_id = ?
         WHERE c.post_id = ?
         GROUP BY c.id
         ORDER BY c.created_at DESC
         LIMIT ? OFFSET ?`,
        [userId, userId, postId, limit, offset]
    );
    return comments;
};

module.exports = {
    createCommentQuery,
    getCommentsQuery,
    getCommentsCountQuery,
};
