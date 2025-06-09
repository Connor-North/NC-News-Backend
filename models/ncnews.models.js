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

const fetchArticleById = (id) => {
  if (isNaN(id)) {
    return Promise.reject({ status: 400, msg: "Input must be a number" });
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
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
      console.log(rows);

      return rows;
    });
};

module.exports = {
  fetchTopics,
  fetchArticles,
  fetchUsers,
  fetchArticleById,
  fetchCommentsByArticleId,
};
