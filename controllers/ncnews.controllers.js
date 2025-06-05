const { fetchTopics, fetchArticles } = require("../models/ncnews.models");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");
const { response } = require("../app");

const getApi = (request, response) => {
  response.status(200).send({ endpoints });
};

const getTopics = (request, response) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

const getArticles = (request, response) => {
  fetchArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};

module.exports = { getTopics, getApi, getArticles };
