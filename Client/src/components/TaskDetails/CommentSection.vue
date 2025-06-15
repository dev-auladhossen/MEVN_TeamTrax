<template>
  <div class="h-[500px] flex flex-col border rounded-md overflow-hidden">
    <!-- Scrollable Comment Area -->
    <div
      ref="scrollContainer"
      class="flex-1 overflow-y-auto flex flex-col-reverse gap-2 p-4 bg-gray-100"
    >
      <div
        v-for="comment in comments"
        :key="comment._id"
        :class="[
          'max-w-[75%] p-3 rounded-xl shadow-sm relative',
          comment.userId._id === currentUser.id
            ? 'ml-[40%] bg-blue-500 text-white rounded-br-none'
            : 'mr-[40%] bg-white text-gray-800 rounded-bl-none',
        ]"
      >
        <p class="text-sm font-medium">
          {{ getCommenterName(comment.userId._id) }}
        </p>
        <p class="text-sm mt-1 whitespace-pre-wrap">{{ comment.text }}</p>
        <p class="text-[10px] text-gray-300 absolute bottom-1 right-2">
          {{ formatDate(comment.createdAt) }}
        </p>
      </div>
    </div>

    <!-- Input Box (Fixed at Bottom) -->
    <div class="p-3 border-t bg-white flex gap-2">
      <textarea
        v-model="newComment"
        placeholder="Write a message..."
        class="flex-1 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        rows="2"
      ></textarea>
      <button
        @click="postComment"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Send
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from "vue";
import axios from "axios";
import { useToast } from "../Composables/useToast.js";

const props = defineProps({
  taskId: String,
  userId: String,
});
const { success, error } = useToast();
const users = ref([]);
const comments = ref([]);
const newComment = ref("");
const loading = ref(false);
const currentUser = JSON.parse(localStorage.getItem("current-user") || "{}");
const scrollContainer = ref(null); // for auto scroll

const fetchComments = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/comments/${props.taskId}`
    );
    // Load with newest at bottom
    comments.value = res.data.reverse();
    scrollToBottom();
  } catch (err) {
    console.error("Error fetching comments:", err);
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = 0; // reverse scroll container
    }
  });
};

const postComment = async () => {
  if (!newComment.value.trim()) return;
  loading.value = true;
  try {
    const res = await axios.post("http://localhost:5000/api/comments", {
      taskId: props.taskId,
      userId: props.userId,
      text: newComment.value,
    });
    refreshCommentList();
    success("Comment Added Successfully", { title: "Success" });
    newComment.value = "";
    loading.value = false;
    scrollToBottom();
  } catch (err) {
    console.error("Error posting comment:", err);
  }
};

const refreshCommentList = () => {
  fetchComments();
};

const formatDate = (date) => new Date(date).toLocaleString();

const getCommenterName = (commenterId) => {
  if (commenterId === currentUser.id) return "You";
  const user = users.value.find((u) => u._id === commenterId);
  return user ? user.username : "Unknown";
};

const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    users.value = res.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};

onMounted(() => {
  fetchUsers();
  fetchComments();
});
</script>

<style scoped>
textarea:focus {
  outline: none;
  border-color: #3182ce;
}
</style>
