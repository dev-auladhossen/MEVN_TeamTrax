<template>
  <div class="max-w-md mx-auto mt-8 p-4 bg-white shadow rounded">
    <h2 class="text-xl font-bold mb-4">GitHub Account Settings</h2>
    <form @submit.prevent="saveGithubSettings" class="space-y-3">
      <input
        v-model="username"
        placeholder="GitHub Username"
        class="w-full border rounded px-3 py-2"
      />
      <input
        v-model="token"
        placeholder="Personal Access Token"
        class="w-full border rounded px-3 py-2"
        type="password"
      />
      <button class="bg-blue-600 text-white px-4 py-2 rounded">
        Save Settings
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
const loggedInToken = localStorage.getItem("token");
const username = ref("");
const token = ref("");

onMounted(async () => {
  getGithubSettingsData();
});

const getGithubSettingsData = async () => {
  const { data } = await axios.get(
    "http://localhost:5000/api/user/github-settings",
    {
      headers: {
        Authorization: `Bearer ${loggedInToken}`,
      },
    }
  );
  username.value = data.githubUsername;
  console.log("username.value", username.value);
};

const saveGithubSettings = async () => {
  await axios.post(
    "/api/user/github-settings",
    {
      githubUsername: username.value,
      githubToken: token.value,
    },
    {
      headers: {
        Authorization: `Bearer ${loggedInToken}`,
      },
    }
  );
  alert("Saved!");
};
</script>
