<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

const props = defineProps({
  project: Object, // with githubRepo inside
});

const branches = ref([]);
const commits = ref([]);

onMounted(async () => {
  if (props.project.githubRepo) {
    const { owner, repo } = props.project.githubRepo;
    const res = await axios.get(
      `http://localhost:5000/api/github/${owner}/${repo}`
    );
    branches.value = res.data.branches;
    commits.value = res.data.commits;
    console.log("github res", res.data);
  }
});
</script>

<template>
  <div v-if="branches.length">
    <h2 class="text-xl font-bold">
      Repository:
      <a
        :href="`https://github.com/${project.githubRepo.owner}/${project.githubRepo.repo}`"
        target="_blank"
        class="text-blue-600 underline"
        >{{ project.githubRepo.repo }}</a
      >
    </h2>
    <h3 class="font-semibold mt-4">Branches</h3>
    <ul class="list-disc pl-6">
      <li v-for="b in branches" :key="b.name">{{ b.name }}</li>
    </ul>

    <h3 class="font-semibold mt-4">Recent Commits</h3>
    <ul class="pl-6">
      <li v-for="c in commits" :key="c.sha">
        <span class="font-medium">{{ c.commit.message }}</span> -
        <small>{{ c.commit.author.name }}</small>
      </li>
    </ul>
  </div>
</template>
