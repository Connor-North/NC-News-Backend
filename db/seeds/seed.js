const db = require("../connection");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS topics;`).then(() => {
    db.query(`CREATE TABLE topics(
    slug VARCHAR(40) PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    img_url VARCHAR(1000));
    `);
  });
};
module.exports = seed;
