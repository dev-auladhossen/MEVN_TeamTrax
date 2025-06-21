// services/github.js
const axios = require("axios");
require("dotenv").config();

const GITHUB_API = "https://api.github.com";

const github = axios.create({
  baseURL: GITHUB_API,
  headers: {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
  },
});

const getRepoDetails = async (owner, repo) => {
  const [branches, commits] = await Promise.all([
    github.get(`/repos/${owner}/${repo}/branches`),
    github.get(`/repos/${owner}/${repo}/commits`),
  ]);
  return {
    branches: branches.data,
    commits: commits.data.slice(0, 5), // latest 5 commits
  };
};

module.exports = { getRepoDetails };
