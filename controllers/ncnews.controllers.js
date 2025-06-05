const { fetchTopics } = require("../models/ncnews.models");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");

const getApi = (request, response) => {
  response.status(200).send({ endpoints });
};

const getTopics = (request, response) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

module.exports = { getTopics, getApi };
