<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="px-4 py-3 border-b bg-white shadow-sm">
      <h2 class="text-lg font-semibold">
        Chatting with: {{ otherUser?.username || "..." }}
      </h2>
    </div>

    <!-- Messages -->
    <div
      ref="messageContainer"
      class="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-gray-50"
    >
      <div
        v-for="msg in messages"
        :key="msg._id"
        :class="msg.senderId === currentUser.id ? 'text-right' : 'text-left'"
      >
        <div
          :class="[
            'inline-block px-4 py-2 rounded-lg max-w-xs',
            msg.senderId === currentUser.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800',
          ]"
        >
          {{ msg.message }}
          <div class="text-xs mt-1">
            {{ formatTime(msg.timestamp) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <form
      @submit.prevent="sendMessage"
      class="p-4 border-t bg-white flex gap-2"
    >
      <input
        v-model="newMessage"
        type="text"
        placeholder="Type your message..."
        class="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring"
      />
      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
      >
        Send
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");
const route = useRoute();

const receiverId = ref(route.query.user);
const currentUser = JSON.parse(localStorage.getItem("current-user"));
const newMessage = ref("");
const messages = ref([]);
const otherUser = ref(null);
const messageContainer = ref(null);

const scrollToBottom = () => {
  console.log("scrollHeight", messageContainer.value.scrollHeight);
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short", // "Jun"
    day: "2-digit", // "27"
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // 12-hour format with AM/PM
  });
};

const fetchChatHistory = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/chats/between/${currentUser.id}/${receiverId.value}`
    );
    messages.value = res.data;
  } catch (err) {
    console.error("Failed to fetch chat history", err);
  }
};

const fetchOtherUser = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/users");
    const found = res.data.find((u) => u._id === receiverId.value);
    otherUser.value = found;
  } catch (err) {
    console.error("Failed to load other user", err);
  }
};

const sendMessage = () => {
  if (newMessage.value.trim()) {
    const message = {
      senderId: currentUser.id,
      receiverId: receiverId.value,
      message: newMessage.value,
    };

    socket.emit("send-message", message);
    newMessage.value = "";
    socket.emit("join", userId);
  }
};

socket.on("receive-message", (msg) => {
  if (
    (msg.senderId === currentUser.id && msg.receiverId === receiverId.value) ||
    (msg.receiverId === currentUser.id && msg.senderId === receiverId.value)
  ) {
    messages.value.push(msg);
  }
});

const markMessagesAsRead = async () => {
  await axios.put("http://localhost:5000/api/chats/mark-read", {
    senderId: receiverId.value,
    receiverId: currentUser.id,
  });
};

onMounted(async () => {
  await fetchOtherUser();
  await fetchChatHistory();
  await markMessagesAsRead();
  scrollToBottom();
});

watch(
  () => route.query.user,
  (newVal) => {
    receiverId.value = newVal;
    fetchOtherUser();
    fetchChatHistory();
    markMessagesAsRead();
  }
);

watchEffect(() => {
  messages.value.length;
  nextTick(() => {
    scrollToBottom();
  });
});
</script>
