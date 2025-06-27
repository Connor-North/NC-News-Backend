const db = require("../db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const fetchArticles = () => {
  return db
    .query(
      `SELECT 
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

const fetchUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};

const fetchArticleById = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Input must be a number" });
  }

  return db
    .query(
      `SELECT 
      articles.author,
      articles.title,
      articles.article_id,
      articles.body,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      }
      return rows[0];
    });
};

const fetchCommentsByArticleId = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Input must be a number" });
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      }

      return db.query(
        `SELECT comment_id, votes, created_at, author, body, article_id
         FROM comments
         WHERE article_id = $1
         ORDER BY created_at DESC`,
        [article_id]
      );
    })
    .then(({ rows }) => {
      return rows;
    });
};

const addCommentByArticleId = (article_id, { username, body }) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid article_id" });
  }

  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Missing required fields" });
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }

      return db.query(
        `INSERT INTO comments (author, body, article_id)
         VALUES ($1, $2, $3)
         RETURNING comment_id, votes, created_at, author, body, article_id`,
        [username, body, article_id]
      );
    })
    .then(({ rows }) => rows[0]);
};

const updateArticleVotes = (article_id, inc_votes) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid article ID" });
  }

  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "inc_votes must be a number" });
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }

      return db.query(
        `UPDATE articles 
         SET votes = votes + $1 
         WHERE article_id = $2 
         RETURNING *`,
        [inc_votes, article_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

const fetchTopicBySlug = (slug) => {
  return db
    .query("SELECT * FROM topics WHERE slug = $1", [slug])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Topic not found" });
      }
      return rows[0];
    });
};

module.exports = {
  fetchTopics,
  fetchArticles,
  fetchUsers,
  fetchArticleById,
  fetchCommentsByArticleId,
  addCommentByArticleId,
  updateArticleVotes,
  fetchTopicBySlug,
};
