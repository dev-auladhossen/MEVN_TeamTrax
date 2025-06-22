// routes/github.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
const Project = require("../models/Project");

const GITHUB_USERNAME = process.env.GITHUB_USERNAME; //  Replace with your GitHub username
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; //  Use dotenv in real apps

const githubAPI = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
  },
});

// Create repo or get info if already exists
router.post("/create-or-fetch-repo/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const { githubUserName, repoName, description } = req.body;

  try {
    // Check if repo exists
    let repoInfo;
    try {
      const existingRepo = await githubAPI.get(
        `/repos/${githubUserName}/${repoName}`
      );
      repoInfo = existingRepo.data;
    } catch (err) {
      // If not found, create repo
      if (err.response && err.response.status === 404) {
        const created = await githubAPI.post("/user/repos", {
          name: repoName,
          description,
          private: false,
        });
        repoInfo = created.data;
        // Add initial commit with a README.md file
        await githubAPI.put(
          `/repos/${githubUserName}/${repoName}/contents/README.md`,
          {
            message: "Initial commit with README",
            content: Buffer.from(
              `# ${repoName}\n\nThis repo was created via API.`
            ).toString("base64"),
          }
        );
      } else {
        throw err;
      }
    }

    // Save repo link to project
    const repoUrl = repoInfo.html_url;
    const repoFullName = repoInfo.full_name;
    await Project.findByIdAndUpdate(projectId, {
      repoUrl,
      githubRepo: repoFullName,
    });

    res.status(200).json({ message: "Repo is ready", repoUrl, repoFullName });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ message: "Failed to create or fetch repo" });
  }
});

// Fetch branches and commits of the repo
router.get("/repo-info", async (req, res) => {
  const { fullName } = req.query;

  try {
    const [branches, commits] = await Promise.all([
      githubAPI.get(`/repos/${fullName}/branches`),
      githubAPI.get(`/repos/${fullName}/commits`),
    ]);

    res.json({
      branches: branches.data,
      commits: commits.data.slice(0, 5), // last 5 commits
    });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ message: "Error fetching repo data" });
  }
});

// Create branch route
router.post("/create-branch", async (req, res) => {
  const { githubUserName, repositoryName, newBranchName } = req.body;
  try {
    // Get SHA of main branch
    const mainRef = await axios.get(
      `https://api.github.com/repos/${githubUserName}/${repositoryName}/git/ref/heads/main`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    const mainSha = mainRef.data.object.sha;

    // Create new branch from main
    const newBranchRes = await axios.post(
      `https://api.github.com/repos/${githubUserName}/${repositoryName}/git/refs`,
      {
        ref: `refs/heads/${newBranchName}`,
        sha: mainSha,
      },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    res.json({
      message: `Branch '${newBranchName}' created from 'main'`,
      branchUrl: newBranchRes.data.url,
    });
  } catch (err) {
    console.error("GitHub API Error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to create branch",
      details: err.response?.data || err.message,
    });
  }
});

module.exports = router;
