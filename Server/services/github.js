// services/github.js
const axios = require("axios");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

const GITHUB_USERNAME = "your-username";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

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

// Create GitHub repo and save to DB
router.post("/create-repo/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const { repoName, description } = req.body;

  try {
    // 1. Create GitHub repo
    const response = await axios.post(
      "https://api.github.com/user/repos",
      {
        name: repoName,
        description,
        private: false,
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    const repoUrl = response.data.html_url;

    // 2. Update Project with repo link
    await Project.findByIdAndUpdate(projectId, { repoUrl });

    res.status(201).json({ message: "Repository created and linked!", repoUrl });
  } catch (err) {
    console.error("GitHub repo creation error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to create GitHub repo" });
  }
});

module.exports = { getRepoDetails };
