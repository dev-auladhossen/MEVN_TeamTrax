<template>
  <div v-if="branches.length">
    <h2 class="text-xl font-semibold text-gray-800 mb-2">
      Repository:
      <a
        :href="`https://github.com/${projectRepoInfo.githubRepo.owner}/${projectRepoInfo.githubRepo.repo}`"
        target="_blank"
        class="text-blue-600 hover:underline"
      >
        {{ projectRepoInfo.githubRepo.repo }}
      </a>
    </h2>

    <div class="mt-4">
      <h3 class="text-lg font-medium text-gray-700">Branches</h3>
      <ul
        class="list-disc list-inside text-gray-600 mt-2 h-max-[100px] overflow-auto"
      >
        <li v-for="b in branches" :key="b.name">{{ b.name }}</li>
      </ul>
    </div>

    <div class="mt-6">
      <h3 class="text-lg font-medium text-gray-700">Recent Commits</h3>
      <ul class="list-disc list-inside text-gray-600 mt-2">
        <li v-for="c in commits" :key="c.sha">
          <span class="font-semibold">{{ c.commit.message }}</span> —
          <small class="text-sm text-gray-500">{{
            c.commit.author.name
          }}</small>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { useToast } from "../components/Composables/useToast.js";

const { success, error } = useToast();

const props = defineProps({
  projectRepoInfo: Object, // with githubRepo inside
});

const branches = ref([]);
const commits = ref([]);

onMounted(async () => {
  if (props.projectRepoInfo.githubRepo) {
    console.log(
      "props.projectRepoInfo.githubRepo",
      props.projectRepoInfo.githubRepo
    );
    const { owner, repo } = props.projectRepoInfo.githubRepo;
    console.log("owner", owner);
    console.log("repo", repo);
    console.log(
      "props.projectRepoInfo.githubRepo",
      props.projectRepoInfo.githubRepo
    );
    const res = await axios.get(
      `http://localhost:5000/api/github/${owner}/${repo}`
    );
    branches.value = res.data.branches;
    commits.value = res.data.commits;
    console.log("github res", res.data);
  }
});
watch(
  () => props.projectRepoInfo,
  async (newVal) => {
    if (!newVal?.githubRepo?.owner || !newVal.githubRepo.repo) return;

    const fullName = `${newVal.githubRepo.owner}/${newVal.githubRepo.repo}`;
    console.log("👀 Watching projectRepoInfo:", fullName);

    try {
      const res = await fetch(
        `http://localhost:5000/api/github/repo-info?fullName=${fullName}`
      );
      const data = await res.json();
      branches.value = data.branches;
      commits.value = data.commits;
    } catch (err) {
      console.error("Error fetching repo info", err);
    }
  },
  { immediate: true, deep: true }
);
</script>
