const express = require("express");
const app = express();
const db = require("./db/connection");
const {
  getTopics,
  getApi,
  getArticles,
  getUsers,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./controllers/ncnews.controllers");
const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
