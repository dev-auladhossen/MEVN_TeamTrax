<template>
  <div
    v-if="githubRepoData"
    class="bg-white p-6 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-6"
  >
    <!-- Left: Repository Info -->
    <GithubRepoInfo
      :projectRepoInfo="githubRepoData"
      :refreshTrigger="refreshKey"
    />

    <!-- Right: Create Repository / Branch -->
    <GithubRepoCreate
      :projectRepoInfo="githubRepoData"
      @refreshRepo="handleRefresh"
    />
  </div>

  <div v-else class="text-center py-8">
    <span class="text-gray-500">Loading project data...</span>
  </div>
</template>

<script setup>
import { ref } from "vue";
import GithubRepoInfo from "../GithubRepoInfo.vue";
import GithubRepoCreate from "../GithubRepoCreate.vue";

const props = defineProps({
  githubRepoData: Object,
});

// Used to trigger refetch in child when value changes
const refreshKey = ref(0);

function handleRefresh() {
  refreshKey.value++; // simple counter to force reactivity
}
</script>
