const { connectDatabase } = require("../db/mysql");
const { v4: uuid } = require("uuid");

const toggleReactQuery = async (userId, targetId, targetType) => {
    const db = await connectDatabase();
    const [existing] = await db.query(
        "SELECT id FROM likes WHERE user_id = ? AND target_id = ? AND target_type = ?",
        [userId, targetId, targetType]
    );

    if (existing.length > 0) {
        await db.query("DELETE FROM likes WHERE id = ?", [existing[0].id]);
        return { action: "unliked" };
    } else {
        const id = uuid();
        await db.query(
            "INSERT INTO likes (id, user_id, target_id, target_type) VALUES (?, ?, ?, ?)",
            [id, userId, targetId, targetType]
        );
        return { action: "liked" };
    }
};

const getReactsQuery = async (targetId, targetType) => {
    const db = await connectDatabase();
    const [reacts] = await db.query(
        `SELECT l.*, u.first_name, u.last_name 
         FROM likes l 
         JOIN users u ON l.user_id = u.id 
         WHERE l.target_id = ? AND l.target_type = ?`,
        [targetId, targetType]
    );
    return reacts;
};

module.exports = { toggleReactQuery, getReactsQuery };
