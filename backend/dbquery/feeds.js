const { connectDatabase } = require("../db/mysql");
const { v4: uuid } = require("uuid");

const createFeedQuery = async (userId, content, image, visibility) => {
    const db = await connectDatabase();
    const id = uuid();
    await db.query(
        "INSERT INTO posts (id, user_id, content, image, visibility) VALUES (?, ?, ?, ?, ?)",
        [id, userId, content, image || null, visibility || 'public']
    );
    return id;
};

const getFeedsQuery = async (userId, limit, offset) => {
  const db = await connectDatabase();

  const [posts] = await db.query(
    `SELECT 
        p.id,
        p.user_id,
        p.content,
        p.image,
        p.visibility,
        p.created_at,
        u.first_name,
        u.last_name,
        (
          (SELECT COUNT(*) FROM comments WHERE post_id = p.id) +
          (SELECT COUNT(*) FROM replies r
           INNER JOIN comments c ON r.comment_id = c.id
           WHERE c.post_id = p.id)
        ) AS comments_count,
        COUNT(DISTINCT l.id) AS reacts_count,
        MAX(CASE WHEN ul.user_id = ? THEN 1 ELSE 0 END) AS user_liked
     FROM posts p
     JOIN users u ON p.user_id = u.id
     LEFT JOIN likes l ON l.target_id = p.id AND l.target_type = 'post'
     LEFT JOIN likes ul ON ul.target_id = p.id AND ul.target_type = 'post' AND ul.user_id = ?
     WHERE p.visibility = 'public' OR p.user_id = ?
     GROUP BY p.id
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`,
    [userId, userId, userId, limit, offset]
  );

  return posts;
};

module.exports = { createFeedQuery, getFeedsQuery };
