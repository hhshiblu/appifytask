const { connectDatabase } = require("../db/mysql")

const columnExists = async (db, tableName, columnName) => {
  try {
    const [rows] = await db.query(
      `
      SELECT COUNT(*) as count
      FROM information_schema.columns
      WHERE table_schema = DATABASE()
      AND table_name = ?
      AND column_name = ?
    `,
      [tableName, columnName],
    );
    return rows[0].count > 0;
  } catch (err) {
    return false;
  }
};

const indexExists = async (db, tableName, indexName) => {
  try {
    const [rows] = await db.query(
      `
      SELECT COUNT(*) as count
      FROM information_schema.statistics
      WHERE table_schema = DATABASE()
      AND table_name = ?
      AND index_name = ?
    `,
      [tableName, indexName],
    );

    return rows[0].count > 0;
  } catch (err) {
    return false;
  }
};

const createTables = async () => {
  try {
    const db = await connectDatabase()
    await db.query(
      `CREATE TABLE IF NOT EXISTS users (
                id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );`
    )

    await db.query(
      `CREATE TABLE IF NOT EXISTS posts (
                id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
                user_id CHAR(36) NOT NULL,
                content TEXT,
                image VARCHAR(500),
                visibility ENUM('public', 'private') DEFAULT 'public',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );`
    )

    await db.query(
      `CREATE TABLE IF NOT EXISTS comments (
                id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
                post_id CHAR(36) NOT NULL,
                user_id CHAR(36) NOT NULL,
                content TEXT NOT NULL,
                image VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );`
    )

    await db.query(
      `CREATE TABLE IF NOT EXISTS replies (
                id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
                comment_id CHAR(36) NOT NULL,
                user_id CHAR(36) NOT NULL,
                content TEXT NOT NULL,
                image VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                                );`
    )

    await db.query(
      `CREATE TABLE IF NOT EXISTS likes (
                id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
                user_id CHAR(36) NOT NULL,
                target_id CHAR(36) NOT NULL,
                target_type ENUM('post', 'comment', 'reply') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_target (target_id, target_type),
                UNIQUE KEY unique_like (user_id, target_id, target_type),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );`
    )
    const indexes = [
      {
        table: "users",
        name: "idx_users_email",
        sql: "CREATE INDEX idx_users_email ON users (email)",
      },
      {
        table: "posts",
        name: "idx_posts_user_id",
        sql: "CREATE INDEX idx_posts_user_id ON posts (user_id)",
      },
      {
        table: "comments",
        name: "idx_comments_post_id",
        sql: "CREATE INDEX idx_comments_post_id ON comments (post_id)",
      },
      {
        table: "replies",
        name: "idx_replies_comment_id",
        sql: "CREATE INDEX idx_replies_comment_id ON replies (comment_id)",
      },
      {
        table: "likes",
        name: "idx_likes_target_id",
        sql: "CREATE INDEX idx_likes_target_id ON likes (target_id)",
      },
    ]
    for (const index of indexes) {
      const exists = await indexExists(db, index.table, index.name);
      if (!exists) {
        try {
          await db.query(index.sql);
          console.log(`Index ${index.name} created successfully`);
        } catch (indexErr) {
          console.log(`Index ${index.name} creation failed: ${indexErr.message}`);
        }
      }
    }

    const migrations = [
      { table: "comments", column: "image", sql: "ALTER TABLE comments ADD COLUMN image VARCHAR(500) NULL" },
      { table: "replies", column: "image", sql: "ALTER TABLE replies ADD COLUMN image VARCHAR(500) NULL" },
    ];

    for (const migration of migrations) {
      const exists = await columnExists(db, migration.table, migration.column);
      if (!exists) {
        try {
          await db.query(migration.sql);
          console.log(`Column ${migration.table}.${migration.column} added successfully`);
        } catch (migrationErr) {
          console.log(`Column ${migration.table}.${migration.column} migration failed: ${migrationErr.message}`);
        }
      }
    }

    return { message: "tables created successfully" }
  } catch (error) {
    throw new Error(`Failed to create tables: ${error.message}`)
  }
}

module.exports = { createTables }
