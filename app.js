const express = require("express");
const app = express();
const db = require("./db/connection");
const { getTopics, getApi } = require("./controllers/ncnews.controllers");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

module.exports = app;
