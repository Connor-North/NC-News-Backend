const express = require("express");
const app = express();
const db = require("./db/connection");
const {
  getTopics,
  getApi,
  getArticles,
} = require("./controllers/ncnews.controllers");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

module.exports = app;
