<template>
  <Layout>
    <div class="flex h-[calc(100vh-100px)] mx-auto">
      <!-- Sidebar -->
      <aside class="w-64 bg-gray-100 border-r overflow-y-auto">
        <h2 class="text-xl font-semibold p-4 border-b">Users</h2>
        <ul>
          <li
            v-for="user in users"
            :key="user._id"
            @click="goToChat(user._id)"
            :class="[
              'cursor-pointer px-4 py-3 border-b hover:bg-gray-200',
              selectedUserId === user._id ? 'bg-blue-100' : '',
            ]"
          >
            <div
              class="font-medium text-gray-800 flex justify-between items-center"
            >
              <span>{{ user.username }}</span>
              <span
                v-if="unreadMap[user._id]"
                class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
              >
                {{ unreadMap[user._id] }}
              </span>
            </div>
            <div class="text-sm text-gray-500">{{ user.email }}</div>
          </li>
        </ul>
      </aside>

      <!-- Chat Area -->
      <section class="flex-1">
        <ChatBox v-if="selectedUserId" :receiver-id="selectedUserId" />
        <div
          v-else
          class="h-full flex items-center justify-center text-gray-500"
        >
          Select a user to start chatting
        </div>
      </section>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import ChatBox from "./ChatBox.vue";
import Layout from "../components/Layout.vue";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
const users = ref([]);
const route = useRoute();
const router = useRouter();
const unreadMap = ref({});
const currentUser = JSON.parse(localStorage.getItem("current-user"));

const selectedUserId = computed(() => route.query.user || null);

const goToChat = async (userId) => {
  router.push({ path: "/chat", query: { user: userId } });

  // Mark messages as read
  await axios.put(`http://localhost:5000/api/chats/mark-read`, {
    senderId: userId,
    receiverId: currentUser.id,
  });

  // Refresh unread map
  fetchUnreadCounts();
};

const fetchUsers = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/users");
    const currentUserId = JSON.parse(localStorage.getItem("current-user"))?.id;
    // Optional: Remove current user from list
    users.value = res.data.filter((u) => u._id !== currentUserId);
  } catch (err) {
    console.error("Failed to fetch users:", err);
  }
};

const fetchUnreadCounts = async () => {
  const res = await axios.get(
    `http://localhost:5000/api/chats/unread/${currentUser.id}`
  );
  console.log("unread res", res.data);
  const map = {};
  res.data.forEach((item) => {
    map[item._id] = item.count;
  });
  unreadMap.value = map;
  console.log("unread map", unreadMap.value);
};

socket.on("update-unread-count", ({ receiverId }) => {
  console.log("trigerred");
  console.log("receiverId", receiverId);
  // Fetch updated unread count from your API
  fetchUnreadCounts();
});

onMounted(() => {
  fetchUsers();
  fetchUnreadCounts();
  socket.emit("join", currentUser.id);
});
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
