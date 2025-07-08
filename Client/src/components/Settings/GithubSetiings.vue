<template>
  <Layout>
    <div
      class="max-w-md mx-auto mt-8 p-6 mt-6 bg-white shadow-lg rounded-lg border border-gray-200 sm:p-8"
    >
      <h2 class="text-2xl font-semibold mb-6 text-gray-800 text-center">
        GitHub Account Settings
      </h2>
      <form @submit.prevent="saveGithubSettings" class="space-y-5">
        <input
          v-model="username"
          placeholder="GitHub Username"
          class="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          autocomplete="username"
          required
        />
        <input
          v-model="token"
          placeholder="Personal Access Token"
          type="password"
          class="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          autocomplete="current-password"
          required
        />
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow-md transition"
        >
          Save Settings
        </button>
      </form>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Layout from "../Layout.vue";
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
