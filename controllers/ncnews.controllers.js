const {
  fetchTopics,
  fetchArticles,
  fetchUsers,
  fetchArticleById,
  fetchCommentsByArticleId,
  addCommentByArticleId,
  updateArticleVotes,
  fetchTopicBySlug,
} = require("../models/ncnews.models");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");
const { response } = require("../app");

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

const getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;

  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const postCommentByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const commentData = request.body;

  addCommentByArticleId(article_id, commentData)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticleById = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      response.status(200).send({ article: updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

const getTopicBySlug = (request, response, next) => {
  const { slug } = request.params;
  fetchTopicBySlug(slug)
    .then((topic) => {
      response.status(200).send({ topic });
    })
    .catch(next);
};

module.exports = {
  getTopics,
  getArticles,
  getUsers,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  getTopicBySlug,
};
