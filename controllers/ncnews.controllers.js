const {
  fetchTopics,
  fetchArticles,
  fetchUsers,
  fetchArticleById,
} = require("../models/ncnews.models");
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

const getUsers = (request, response) => {
  fetchUsers().then((users) => {
    response.status(200).send({ users });
  });
};

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics, getApi, getArticles, getUsers, getArticleById };
