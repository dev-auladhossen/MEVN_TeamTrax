<template>
  <div>
    <div
      v-if="projectRepoInfo"
      class="flex flex-col justify-between h-full space-y-6 bg-white"
    >
      <!-- Repo Create Section -->
      <div>
        <h3 class="text-xl font-semibold text-gray-800 mb-4">
          Create or Link Repository
        </h3>

        <form
          @submit.prevent="handleRepoCreate"
          class="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
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

          <div class="md:col-span-3">
            <button
              class="w-full md:w-auto bg-blue-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Create/Fetch Repo
            </button>
          </div>
        </form>

        <div v-if="repoUrl" class="mt-3 text-sm text-blue-600">
          Repo Created:
          <a
            :href="repoUrl"
            target="_blank"
            class="underline hover:text-blue-800 transition"
          >
            {{ repoUrl }}
          </a>
        </div>
      </div>

      <!-- Branch Create Section -->
      <div>
        <h3 class="text-xl font-semibold text-gray-800 mb-4">
          Create New Branch
        </h3>

        <form
          @submit.prevent="createBranch"
          class="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
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

          <div class="md:col-span-2">
            <button
              class="w-full md:w-auto bg-blue-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Create Branch
            </button>
          </div>
        </form>

        <div v-if="branchUrl" class="mt-3 text-sm text-blue-600">
          Branch Created:
          <a
            :href="branchUrl"
            target="_blank"
            class="underline hover:text-blue-800 transition"
          >
            {{ branchUrl }}
          </a>
        </div>
      </div>

      <!-- GitHub Tips / Footer Section -->
      <div class="pt-6 border-t border-gray-200 text-xs text-gray-500">
        <p class="mb-1">
          💡 Tip: Always create branches from the latest base to avoid merge
          conflicts.
        </p>
        <p>
          🔗 Need help? Visit the
          <a
            href="https://docs.github.com"
            target="_blank"
            class="underline hover:text-blue-700"
            >GitHub Docs</a
          >
        </p>
      </div>
    </div>
    <div v-else>
      <div>
        <h3 class="text-xl font-semibold text-gray-800 mb-4">
          Create or Link Repository
        </h3>

        <form
          @submit.prevent="handleRepoCreate"
          class="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
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

          <div class="md:col-span-3">
            <button
              class="w-full md:w-auto bg-blue-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Create/Fetch Repo
            </button>
          </div>
        </form>

        <div v-if="repoUrl" class="mt-3 text-sm text-blue-600">
          Repo Created:
          <a
            :href="repoUrl"
            target="_blank"
            class="underline hover:text-blue-800 transition"
          >
            {{ repoUrl }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useToast } from "../components/Composables/useToast.js";
import { useRoute } from "vue-router";
const route = useRoute();
const { success, error } = useToast();

const props = defineProps({
  projectRepoInfo: Object, // with githubRepo inside
});

const emit = defineEmits(["refreshRepoInfo"]);
const currentProjectId = route.params.id;
const githubUserName = ref("");
const repoName = ref("");
const description = ref("");

const repoUrl = ref("");
const branchUrl = ref("");
const fullName = ref("");
const branches = ref([]);
const commits = ref([]);

const newBranch = ref("");
const baseBranch = ref("main");

const branchSuccess = ref("");
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

// New Repo Creation
const handleRepoCreate = async () => {
  console.log("currentProjectId", currentProjectId);
  try {
    const { data } = await axios.post(
      `http://localhost:5000/api/github/create-or-fetch-repo/${currentProjectId}`,
      {
        githubUserName: githubUserName.value,
        repoName: repoName.value,
        description: description.value,
      }
    );
    console.log("data", data);

    repoUrl.value = data.repoUrl;
    fullName.value = data.repoFullName;
    success(`'${repoName.value}' ${data.message}`, { title: "Success" });
    emit("refreshRepoInfo");
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    error(err.response?.data.message, { title: "Error" });
  }
};

const fetchRepoData = async () => {
  // Delay 2 seconds before fetching repo info
  await delay(2000);

  // Fetch repo info
  const info = await axios.get(
    `http://localhost:5000/api/github/repo-info/${fullName.value}`
  );
  branches.value = info.data.branches;
  commits.value = info.data.commits;
  console.log(info);

  if (info.ok) {
    emit("refreshRepoInfo");
    success(data.message, { title: "Success" });
  } else {
    throw new Error(data.error || "Failed to create Repo");
  }
};

// New Branch Creation
async function createBranch() {
  const githubUserName = props.projectRepoInfo.githubRepo.owner;
  const repositoryName = props.projectRepoInfo.githubRepo.repo;
  const newBranchName = newBranch.value;

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

    if (response.ok) {
      emit("refreshRepoInfo");
      success(data.message, { title: "Success" });
    } else {
      error(data.error, { title: "Error" });
      throw new Error(data.error || "Failed to create branch");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Fetch github Settings
const fetchGithubSettings = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/user/github-settings",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    githubUserName.value = res.data.githubUsername;
    console.log("githubUserName.value", githubUserName.value);
  } catch (err) {
    console.error("Error fetching GitHub settings", err);
  }
};

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
  fetchGithubSettings();
});
// Fetch branches (optional)
// const fetchBranches = async () => {
//   console.log("fullName.value", fullName.value);
//   const { data } = await axios.get(
//     `http://localhost:5000/api/github/repo-info?fullName=${fullName.value}`
//   );
//   branches.value = data.branches;
//   console.log("branches.value", branches.value);
// };
</script>
