const db = require("../connection");
const { convertTimestampToDate } = require("../seeds/utils");

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
      const insertArticles = articleData.map((article) => {
        const articleWithConvertedTimestamp = convertTimestampToDate(article);
        return db.query(
          `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7);`,
          [
            article.title,
            article.topic,
            article.author,
            article.body,
            articleWithConvertedTimestamp.created_at,
            article.votes,
            article.article_img_url,
          ]
        );
      });
      return Promise.all(insertArticles);
    })
    .then(() => {
      const insertComments = commentData.map((comment) => {
        const commentWithConvertedTimestamp = convertTimestampToDate(comment);

        return db.query(
          `INSERT INTO comments (author, article_id, votes, created_at, body)
           VALUES ($1, $2, $3, $4, $5);`,
          [
            comment.author,
            comment.article_id,
            comment.votes,
            commentWithConvertedTimestamp.created_at,
            comment.body,
          ]
        );
      });
      return Promise.all(insertComments);
    });
};

module.exports = seed;
