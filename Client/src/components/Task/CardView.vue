<template>
  <div
    @click="goToDetails"
    class="bg-white p-3 rounded-lg shadow hover:shadow-md transition"
  >
    <div class="flex justify-between">
      <h4 class="text-md font-semibold mb-2">{{ item.name }}</h4>
    </div>
    <div class="text-xs flex justify-between gap-2 my-2">
      <span>{{ item.startDate }}</span>
      <span>{{ item.endDate }}</span>
    </div>
    <p class="text-sm text-gray-600">
      {{ truncate(item.description, 50) }}
    </p>
    <div class="flex gap-1 items-center my-2">
      <button
        @click=""
        class="rounded-full bg-blue-600 text-white w-6 h-6 text-sm flex items-center justify-center"
      >
        {{ getInitials(item.createdBy) }}
      </button>
      <span>{{ getFirstName(item.createdBy) }}</span>
    </div>
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
console.log("props", props.item);

const router = useRouter();

const goToDetails = () => {
  router.push(`/project-details/${props.item._id}`);
};
const truncate = (text, length = 20) => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};
const getFirstName = (fullName) => {
  if (!fullName) return "";
  return fullName.trim().split(" ")[0];
};

const getInitials = (fullName) => {
  const nameParts = fullName.trim().split(" ");
  const initials =
    nameParts.length === 1
      ? nameParts[0][0].toUpperCase()
      : nameParts[0][0].toUpperCase() +
        nameParts[nameParts.length - 1][0].toUpperCase();
  return initials;
};
</script>
