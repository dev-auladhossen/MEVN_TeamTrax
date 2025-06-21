<template>
  <div
    :class="
      computedHeightClass + ' flex flex-col border rounded-md overflow-hidden'
    "
  >
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
        <!-- Attachment preview -->
        <div
          v-if="comment.attachments && comment.attachments.length"
          class="mt-2"
        >
          <div
            v-for="file in comment.attachments"
            :key="file"
            class="flex items-center gap-2"
          >
            <!-- Image Preview -->

            <img
              v-if="isImage(file)"
              :src="`http://localhost:5000/uploads/${file}`"
              alt="Image"
              class="w-16 h-12 object-cover rounded-md border cursor-pointer"
              @click="openImageModal(`http://localhost:5000/uploads/${file}`)"
            />

            <!-- PDF Icon -->
            <div
              v-else-if="isPdf(file)"
              class="flex items-center gap-1 text-sm"
            >
              <img alt="PDF" src="/src/assets/pdf-icon.webp" class="w-6 h-6" />
              <a
                :href="`http://localhost:5000/uploads/${file}`"
                target="_blank"
                class="text-blue-600 underline"
              >
                View PDF
              </a>
            </div>

            <!-- Other File Icon -->
            <div v-else class="flex items-center gap-1 text-sm">
              <img src="/src/assets/file-icon.png" alt="File" class="w-6 h-6" />
              <a
                :href="`http://localhost:5000/uploads/${file}`"
                target="_blank"
                class="text-blue-600 underline"
              >
                Download File
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Box (Fixed at Bottom) -->
    <div class="w-full border-t p-3 bg-white flex items-center gap-2">
      <!-- Attachment -->
      <label class="relative cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16.88 3.549a5.5 5.5 0 00-7.78 0L3.5 9.121a5.5 5.5 0 007.78 7.779L17 11.207a3 3 0 10-4.243-4.243L8.914 11.207"
          />
        </svg>
        <input
          type="file"
          @change="handleFileUpload"
          class="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>

      <!-- Input -->
      <input
        v-model="newComment"
        placeholder="Type your comment..."
        class="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <!-- Send -->
      <button
        @click="postComment"
        :disabled="!newComment.trim() && !selectedFile"
        class="p-2 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white transition"
        title="Send"
      >
        <!-- Heroicon: Arrow Up -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  </div>
  <!-- Image Modal -->
  <transition name="fade-zoom">
    <div
      v-if="showImageModal"
      class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
      @click.self="closeImageModal"
    >
      <img
        v-if="previewImageUrl"
        :src="previewImageUrl"
        class="max-w-[90%] max-h-[90%] rounded shadow-lg"
      />

      <button
        @click="closeImageModal"
        class="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded shadow"
      >
        ✕
      </button>
    </div>
  </transition>
</template>
<script setup>
import { ref, onMounted, nextTick, computed } from "vue";
import axios from "axios";
import { useToast } from "../Composables/useToast.js";

const props = defineProps({
  taskId: String,
  userId: String,
  height: {
    type: Number,
    default: 500,
  },
});

const computedHeightClass = computed(() => `h-[${props.height}px]`);

const { success, error } = useToast();
const users = ref([]);
const comments = ref([]);
const newComment = ref("");
const loading = ref(false);
const currentUser = JSON.parse(localStorage.getItem("current-user") || "{}");
const scrollContainer = ref(null); // for auto scroll

const showImageModal = ref(false);
const previewImageUrl = ref("");

const commentText = ref("");
const selectedFile = ref(null);

const openImageModal = (url) => {
  previewImageUrl.value = url;
  showImageModal.value = true;
};

const closeImageModal = () => {
  showImageModal.value = false;
  previewImageUrl.value = "";
};

// Utility to check file types
const isImage = (filename) => {
  return /\.(jpg|jpeg|png|gif)$/i.test(filename);
};

const isPdf = (filename) => {
  return /\.pdf$/i.test(filename);
};
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

const attachmentFile = ref(null);

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    attachmentFile.value = file;
  }
};

const sendComment = () => {
  if (!commentText.value.trim() && !selectedFile.value) return;

  const formData = new FormData();
  formData.append("text", commentText.value);
  formData.append("taskId", "your-task-id");
  formData.append("userId", "your-user-id");
  if (selectedFile.value) {
    formData.append("attachment", selectedFile.value);
  }

  // send API request here
  console.log("Sending comment...");

  commentText.value = "";
  selectedFile.value = null;
};
const postComment = async () => {
  if (!newComment.value.trim() && !attachmentFile.value) return;

  loading.value = true;
  const formData = new FormData();
  formData.append("taskId", props.taskId);
  formData.append("userId", props.userId);
  formData.append("text", newComment.value);
  if (attachmentFile.value) {
    formData.append("attachment", attachmentFile.value);
  }

  try {
    await axios.post("http://localhost:5000/api/comments", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    newComment.value = "";
    attachmentFile.value = null;
    refreshCommentList();
    scrollToBottom();
    success("Comment Added Successfully", { title: "Success" });
  } catch (err) {
    console.error("Error posting comment:", err);
    error("Failed to add comment");
  } finally {
    loading.value = false;
  }
};

// const postComment = async () => {
//   if (!newComment.value.trim()) return;
//   loading.value = true;
//   try {
//     const res = await axios.post("http://localhost:5000/api/comments", {
//       taskId: props.taskId,
//       userId: props.userId,
//       text: newComment.value,
//     });
//     refreshCommentList();
//     success("Comment Added Successfully", { title: "Success" });
//     newComment.value = "";
//     loading.value = false;
//     scrollToBottom();
//   } catch (err) {
//     console.error("Error posting comment:", err);
//   }
// };

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

.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
