const db = require("../connection");
const { convertTimestampToDate, createLookup } = require("../seeds/utils");
const format = require("pg-format");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments, articles, users, topics;`)
    .then(() => {
      return db.query(`CREATE TABLE topics (
        slug VARCHAR(40) PRIMARY KEY,
        description VARCHAR(255) NOT NULL,
        img_url VARCHAR(1000)
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
        username VARCHAR(50) PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        avatar_url VARCHAR(1000)
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        topic VARCHAR REFERENCES topics(slug),
        author VARCHAR REFERENCES users(username),
        body TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000)
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id),
        body TEXT,
        votes INT DEFAULT 0,
        author VARCHAR REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`);
    })
    .then(() => {
      const insertTopics = topicData.map((topic) => {
        return db.query(
          `INSERT INTO topics (slug, description, img_url)
           VALUES ($1, $2, $3);`,
          [topic.slug, topic.description, topic.img_url]
        );
      });
      return Promise.all(insertTopics);
    })
    .then(() => {
      const insertUsers = userData.map((user) => {
        return db.query(
          `INSERT INTO users (username, name, avatar_url)
           VALUES ($1, $2, $3);`,
          [user.username, user.name, user.avatar_url]
        );
      });
      return Promise.all(insertUsers);
    })
    .then(() => {
      const formattedArticles = articleData.map((article) => {
        const articleWithConvertedTimestamp = convertTimestampToDate(article);
        return [
          article.title,
          article.topic,
          article.author,
          article.body,
          articleWithConvertedTimestamp.created_at,
          article.votes,
          article.article_img_url,
        ];
      });
      const sqlString = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        formattedArticles
      );
      return db.query(sqlString);
    })
    .then(({ rows }) => {
      const articlesLookup = createLookup(rows, "title", "article_id");

      const formattedComments = commentData.map((comment) => {
        const commentWithConvertedTimestamp = convertTimestampToDate(comment);

        return [
          articlesLookup[commentWithConvertedTimestamp.article_title],
          comment.body,
          comment.votes,
          comment.author,
          commentWithConvertedTimestamp.created_at,
        ];
      });
      const sqlString = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L`,
        formattedComments
      );

      return db.query(sqlString);
    });
};

module.exports = seed;
