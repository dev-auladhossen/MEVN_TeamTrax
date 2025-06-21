<template>
  <div class="space-y-4 mt-4">
    <form
      @submit.prevent="
        createBranch('dev-auladhossen', 'new-one', 'feature-from-ui')
      "
      class="mt-6 space-x-2"
    >
      <input
        v-model="newBranch"
        placeholder="New branch name"
        class="border px-2 py-1"
      />
      <select v-model="baseBranch" class="border px-2 py-1">
        <option disabled value="">Select base branch</option>
        <option v-for="b in branches" :key="b.name" :value="b.name">
          {{ b.name }}
        </option>
      </select>
      <button class="bg-green-600 text-white px-3 py-1">Create Branch</button>
    </form>

    <div v-if="branchSuccess" class="text-green-700 mt-2">
      {{ branchSuccess }}
    </div>
    <form @submit.prevent="handleRepoCreate">
      <input
        v-model="githubUserName"
        placeholder="Github User Name"
        class="border px-2 py-1"
      />
      <input
        v-model="repoName"
        placeholder="Repo Name"
        class="border px-2 py-1"
      />
      <input
        v-model="description"
        placeholder="Description"
        class="border px-2 py-1 ml-2"
      />
      <button class="bg-blue-500 text-white px-3 py-1 ml-2">
        Create/Fetch Repo {{ project._id }}
      </button>
    </form>

    <div v-if="repoUrl" class="mt-3 text-green-600">
      ✅ Repo Created:
      <a :href="repoUrl" target="_blank" class="underline">{{ repoUrl }}</a>
    </div>

    <div v-if="branches.length" class="mt-4">
      <h3 class="font-bold">Branches:</h3>
      <ul class="list-disc ml-5">
        <li v-for="branch in branches" :key="branch.name">{{ branch.name }}</li>
      </ul>
    </div>

    <div v-if="commits.length" class="mt-4">
      <h3 class="font-bold">Recent Commits:</h3>
      <ul class="list-disc ml-5">
        <li v-for="commit in commits" :key="commit.sha">
          {{ commit.commit.message }} - {{ commit.commit.author.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  project: Object, // with githubRepo inside
});

const projectId = props.project._id; // Replace dynamically
const githubUserName = ref("");
const repoName = ref("");
const description = ref("");

const repoUrl = ref("");
const fullName = ref("");
const branches = ref([]);
const commits = ref([]);

const fullNameForCreate = ref("dev-auladhossen/new-one"); // Replace with your dynamic repo name
const newBranch = ref("");
const baseBranch = ref("main");

const branchSuccess = ref("");

const handleRepoCreate = async () => {
  console.log("projectId", projectId);
  console.log("props.project._id", props.project._id);
  try {
    const { data } = await axios.post(
      `http://localhost:5000/api/github/create-or-fetch-repo/${props.project._id}`,
      {
        githubUserName: githubUserName.value,
        repoName: repoName.value,
        description: description.value,
      }
    );

    repoUrl.value = data.repoUrl;
    fullName.value = data.repoFullName;

    // Fetch repo info
    const info = await axios.get(
      `http://localhost:5000/api/github/repo-info/${fullName.value}`
    );
    branches.value = info.data.branches;
    commits.value = info.data.commits;
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
};

// Fetch branches (optional)
const fetchBranches = async () => {
  const { data } = await axios.get(
    `http://localhost:5000/api/github/repo-info?fullName=${fullName.value}`
  );
  branches.value = data.branches;
  console.log("branches.value", branches.value);
};

async function createBranch(githubUserName, repositoryName, newBranchName) {
  console.log("repoName", repoName.value);
  console.log("desc", description.value);
  console.log(props.project);
  //   try {
  //     const response = await fetch(
  //       "http://localhost:5000/api/github/create-branch",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ githubUserName, repoName, newBranchName }),
  //       }
  //     );

  //     const data = await response.json();

  //     if (!response.ok) throw new Error(data.error || "Failed to create branch");

  //     console.log("✅ Branch created:", data.branch.ref);
  //   } catch (error) {
  //     console.error("❌ Error:", error.message);
  //   }
}

onMounted(() => {
  fetchBranches();
});
</script>
