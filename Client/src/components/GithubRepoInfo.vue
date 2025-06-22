<template>
  <div class="relative" v-if="projectRepoInfo.branches.length">
    <div
      v-if="loading"
      class="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10"
    >
      <span
        class="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"
      ></span>
    </div>
    <h2 class="text-lg font-semibold text-gray-800 mb-2">
      Repository:
      <font-awesome-icon class="text-gray-500 text-sm mx-2" icon="code" />
      <a
        :href="`https://github.com/${projectRepoInfo.githubRepo.owner}/${projectRepoInfo.githubRepo.repo}`"
        target="_blank"
        class="text-blue-600 hover:underline"
      >
        {{ projectRepoInfo.githubRepo.repo }}
      </a>
    </h2>

    <div class="mt-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Branches:</h3>
      <p class="text-sm text-gray-500 mb-1">
        Total branches: {{ projectRepoInfo.branches.length }}
      </p>
      <div
        class="bg-white border rounded-lg shadow-sm p-4 max-h-40 overflow-auto space-y-2"
      >
        <div
          v-for="b in projectRepoInfo.branches"
          :key="b.name"
          class="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-2 py-1 rounded cursor-default"
        >
          <font-awesome-icon class="text-gray-500" icon="code-branch" />
          <span
            @click="copyToClipboard(b.name)"
            class="truncate cursor-pointer hover:text-indigo-600"
            >{{ b.name }}</span
          >
        </div>
      </div>
    </div>

    <div class="mt-8">
      <h3
        class="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2"
      >
        <font-awesome-icon class="text-gray-500" icon="code-commit" />
        Recent Commits
      </h3>

      <ul class="space-y-2 overflow-auto pb-2">
        <li
          v-for="c in projectRepoInfo.commits"
          :key="c.sha"
          class="bg-white p-2 rounded-lg shadow-sm border hover:shadow-md transition"
        >
          <div class="flex justify-between items-center">
            <h4
              class="text-xs font-medium text-gray-800 truncate"
              :title="c.commit.message"
            >
              {{ c.commit.message }}
            </h4>
            <span class="text-xs text-gray-400">{{
              new Date(c.commit.author.date).toLocaleString()
            }}</span>
          </div>
          <div class="text-xs text-gray-600">
            by
            <span class="font-medium text-blue-600">{{
              c.commit.author.name
            }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { useToast } from "../components/Composables/useToast.js";

const { success, error, info } = useToast();

const props = defineProps({
  projectRepoInfo: Object,
  loading: Boolean,
});

const branches = ref([]);
const commits = ref([]);

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    info("Branch name copied to clipboard!", { title: "Successfully Copied!" });
  } catch (err) {
    info("Failed to copy!", { title: "Error to Copy" });
  }
};
watch(
  () => props.projectRepoInfo,
  async (newVal) => {
    if (!newVal?.githubRepo?.owner || !newVal.githubRepo.repo) return;
    const fullName = `${newVal.githubRepo.owner}/${newVal.githubRepo.repo}`;
    // try {
    //   const res = await fetch(
    //     `http://localhost:5000/api/github/repo-info?fullName=${fullName}`
    //   );
    //   const data = await res.json();
    //   branches.value = data.branches;
    //   commits.value = data.commits;
    // } catch (err) {
    //   console.error("Error fetching repo info", err);
    // }
  },
  { immediate: true, deep: true }
);
</script>
<style scoped>
::-webkit-scrollbar {
  width: 5px;
  height: 6px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background-color: #e4e4e4;
  border-radius: 0px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background-color: #b1b1b1;
}

/* Track */
::-webkit-scrollbar-track {
  background: transparent;
}
</style>
