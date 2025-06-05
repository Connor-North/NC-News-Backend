const express = require("express");
const app = express();
const db = require("./db/connection");
const endpoints = require("./endpoints.json");

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", (req, res) => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    res.status(200).send({ topics: rows });
  });
});

module.exports = app;
