<template>
  <div
    @click="goToDetails"
    class="bg-white p-3 rounded-lg shadow hover:shadow-md transition"
  >
    <h4 class="text-md font-semibold mb-2">{{ item.name }}</h4>
    <p class="text-sm text-gray-600">{{ item.description }}</p>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const goToDetails = () => {
  router.push(`/project-details/${props.item._id}`);
};
</script>
