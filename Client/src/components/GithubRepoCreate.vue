<template>
  <div class="space-y-6">
    <!-- Repo Create -->
    <div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">
        Create or Link Repository
      </h3>
      <form @submit.prevent="handleRepoCreate" class="space-y-3">
        <div class="flex flex-col md:flex-row md:space-x-2">
          <input
            v-model="githubUserName"
            placeholder="GitHub Username"
            class="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          />
          <input
            v-model="repoName"
            placeholder="Repository Name"
            class="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          />
          <input
            v-model="description"
            placeholder="Description"
            class="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          />
        </div>
        <button
          class="bg-blue-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition w-full md:w-auto"
        >
          Create/Fetch Repo
        </button>
      </form>

      <div v-if="repoUrl" class="text-blue-600 mt-2">
        Repo Created:
        <a :href="repoUrl" target="_blank" class="underline">{{ repoUrl }}</a>
      </div>
    </div>

    <!-- Branch Create -->
    <div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">
        Create New Branch
      </h3>
      <form @submit.prevent="createBranch" class="space-y-2">
        <div class="flex flex-col md:flex-row md:space-x-2">
          <input
            v-model="newBranch"
            placeholder="New Branch Name"
            class="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          />
          <select
            v-model="baseBranch"
            class="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
          >
            <option disabled value="">Select base branch</option>
            <option v-for="b in branches" :key="b.name" :value="b.name">
              {{ b.name }}
            </option>
          </select>
        </div>
        <button
          class="bg-blue-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition w-full md:w-auto"
        >
          Create Branch
        </button>
      </form>
      <div v-if="branchUrl" class="text-blue-600 mt-2">
        Branch Created:
        <a :href="branchUrl" target="_blank" class="underline">{{
          branchUrl
        }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useToast } from "../components/Composables/useToast.js";

const { success, error } = useToast();

const props = defineProps({
  projectRepoInfo: Object, // with githubRepo inside
});

const emit = defineEmits(["refreshRepoInfo"]);

const projectId = props.projectRepoInfo._id; // Replace dynamically
const githubUserName = ref("");
const repoName = ref("");
const description = ref("");

const repoUrl = ref("");
const branchUrl = ref("");
const fullName = ref("");
const branches = ref([]);
const commits = ref([]);

const fullNameForCreate = ref("dev-auladhossen/new-one"); // Replace with your dynamic repo name
const newBranch = ref("");
const baseBranch = ref("main");

const branchSuccess = ref("");

const handleRepoCreate = async () => {
  console.log("projectId", projectId);
  console.log("props.project._id", props.projectRepoInfo._id);
  try {
    const { data } = await axios.post(
      `http://localhost:5000/api/github/create-or-fetch-repo/${props.projectRepoInfo._id}`,
      {
        githubUserName: githubUserName.value,
        repoName: repoName.value,
        description: description.value,
      }
    );

    repoUrl.value = data.repoUrl;
    fullName.value = data.repoFullName;
    success("Repository Created Successfully!", { title: "Success" });

    emit("refreshRepoInfo");

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
  console.log("fullName.value", fullName.value);
  const { data } = await axios.get(
    `http://localhost:5000/api/github/repo-info?fullName=${fullName.value}`
  );
  branches.value = data.branches;
  console.log("branches.value", branches.value);
};

async function createBranch() {
  const githubUserName = props.projectRepoInfo.githubRepo.owner;
  const repositoryName = props.projectRepoInfo.githubRepo.repo;
  const newBranchName = newBranch.value;
  console.log("repoName", repoName.value);
  console.log("desc", description.value);
  console.log("all three info", githubUserName, repositoryName, newBranchName);
  console.log(props.projectRepoInfo);
  try {
    const response = await fetch(
      "http://localhost:5000/api/github/create-branch",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ githubUserName, repositoryName, newBranchName }),
      }
    );

    const data = await response.json();
    console.log("branch data", data);
    branchUrl.value = data.branchUrl;
    success("Branch Created Successfully!", { title: "Success" });
    emit("refreshRepoInfo");

    if (!response.ok) throw new Error(data.error || "Failed to create branch");

    console.log(data.message);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

watch(
  () => props.projectRepoInfo,
  async (newVal) => {
    if (newVal?.githubRepo?.owner && newVal.githubRepo.repo) {
      const fullName = `${newVal.githubRepo.owner}/${newVal.githubRepo.repo}`;
      console.log("fullName from watch", fullName);
      try {
        const res = await fetch(
          `http://localhost:5000/api/github/repo-info?fullName=${fullName}`
        );
        const data = await res.json();
        branches.value = data.branches;
        commits.value = data.commits;
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  fetchBranches();
});
</script>
