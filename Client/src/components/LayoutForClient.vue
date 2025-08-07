<template>
  <div>
    <nav
      id="topNav"
      class="navbar top-navbar fixed flex justify-between top-0 left-0 right-0 z-40 px-4 py-3 items-center"
    >
      <div class="container-fluid">
        <a
          id="MenuBar"
          @click="NavOpenClose"
          class="icon-nav cursor-pointer text-xl mx-0 my-1 h5"
        >
          <i class="fa text-black-600 fa-bars"></i>
        </a>
      </div>

      <div class="relative" ref="dropdownRef">
        <div class="flex items-center gap-4">
          <button @click="toggleNotificationDropdown" class="relative">
            <font-awesome-icon
              icon="bell"
              class="text-xl text-gray-600 hover:text-black"
            />
            <span
              v-if="unreadCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ unreadCount }}
            </span>
          </button>

          <button
            @click="toggleDropdown"
            class="rounded-full bg-blue-600 text-white w-10 h-10 flex items-center justify-center"
          >
            {{ initials }}
          </button>
        </div>

        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="dropdownOpen"
            class="absolute right-0 mt-2 w-52 border rounded-md bg-white shadow-2xl transform opacity-100 scale-100"
          >
            <div class="p-4">
              <button
                @click="showLoggedUserProfile"
                class="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                <font-awesome-icon class="text-black mr-2" icon="user" />
                Profile
              </button>
              <button class="w-full px-4 py-2 text-left hover:bg-gray-100">
                <font-awesome-icon class="text-black mr-2" icon="key" /> Change
                Password
              </button>
              <button
                @click="logout"
                class="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
              >
                <font-awesome-icon
                  class="text-black mr-2"
                  icon="right-from-bracket"
                />
                Logout
              </button>
            </div>
          </div>
        </transition>

        <!-- Notification Dropdown -->
        <div
          v-if="showDropdown"
          class="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-auto"
        >
          <div class="p-3 border-b font-semibold">Notifications</div>
          <ul>
            <li
              v-for="(notification, index) in notifications"
              :key="index"
              class="px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
            >
              <div class="text-sm">{{ notification.message }}</div>
              <div class="text-xs text-gray-500">{{ notification.time }}</div>
            </li>
          </ul>
          <div
            v-if="notifications.length === 0"
            class="p-4 text-center text-gray-500 text-sm"
          >
            No new notifications.
          </div>
        </div>

        <!-- Profile Dialog -->
        <UserProfileDialog
          :visible="showProfile"
          :user="loggedUser"
          @close="showProfile = false"
        />
      </div>
    </nav>

    <div id="sideNav" class="side-nav-open">
      <div
        class="side-nav-top flex gap-2 justify-center p-2 mb-3 text-xl font-bold text-blue-600"
      >
        <span class="text-xl"> <font-awesome-icon icon="hexagon-nodes" /></span>
        <span class="">TeamTrax</span>
      </div>
      <div>
        <button
          @click="logout"
          class="side-bar-item rounded-full"
          :class="isActive('/admindashboard')"
        >
          <span class="side-bar-item-icon">
            <font-awesome-icon
              class="text-sm"
              icon="right-from-bracket"
              :class="[
                'text-sm',
                route.path === '/admindashboard' ? 'animate-bounce' : '',
              ]"
            />
          </span>
          <span class="side-bar-item-caption">Logout</span>
        </button>
      </div>
    </div>

    <div id="content" class="content">
      <div class="container-fluid">
        <main>
          <slot></slot>
        </main>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useAuth } from "../utils/auth";
import { ref, reactive, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute } from "vue-router";
import UserProfileDialog from "./Task/UserProfileDialog.vue";
const showDropdown = ref(false);
const showProfile = ref(false);

// Dummy data
const notifications = ref([
  { message: "Task #123 has been updated", seen: false, time: "2 minutes ago" },
  {
    message: "New comment on Project Alpha",
    seen: false,
    time: "10 minutes ago",
  },
  { message: "User John joined your team", seen: false, time: "1 hour ago" },
]);

const dummyUser = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  role: "Project Manager",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
};

const unreadCount = computed(
  () => notifications.value.filter((n) => !n.seen).length
);

const toggleNotificationDropdown = () => {
  showDropdown.value = !showDropdown.value;

  // Mark all as seen
  if (showDropdown.value) {
    notifications.value = notifications.value.map((n) => ({
      ...n,
      seen: true,
    }));
  }
};
const route = useRoute();
const { logout } = useAuth();
const loggedUser = JSON.parse(localStorage.getItem("current-user"));
console.log("current role", loggedUser.role);

// const show = (...roles) => {
//   console.log("roles", ...roles);
//   console.log("true or false", roles.includes(loggedUser.role));
//   if (roles.includes("all")) return true;
//   return roles.includes(loggedUser.role);
// };

const showLoggedUserProfile = () => {
  showProfile.value = !showProfile.value;
};

const isActive = (path) =>
  route.path === path ? "bg-blue-500 text-white" : "";

const getIconAttrs = (path) => {
  return route.path === path ? { bounce: "" } : {};
};

const dropdownRef = ref(null);
const dropdownOpen = ref(false);
const toggleDropdown = () => (dropdownOpen.value = !dropdownOpen.value);

const NavOpenClose = () => {
  let sideNav = document.getElementById("sideNav");
  let content = document.getElementById("content");
  let topNav = document.getElementById("topNav");
  if (sideNav.classList.contains("side-nav-open")) {
    sideNav.classList.add("side-nav-close");
    sideNav.classList.remove("side-nav-open");
    content.classList.add("content-expand");
    content.classList.remove("content");
    topNav.classList.add("top-navbar-expand");
    topNav.classList.remove("top-navbar");
  } else {
    sideNav.classList.remove("side-nav-close");
    sideNav.classList.add("side-nav-open");
    content.classList.remove("content-expand");
    content.classList.add("content");
    topNav.classList.remove("top-navbar-expand");
    topNav.classList.add("top-navbar");
  }
};
// Close dropdown if clicked outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Logged in User Details
const user = JSON.parse(localStorage.getItem("current-user"));
const fullName = user.name;
const nameParts = fullName.trim().split(" ");

const initials =
  nameParts.length === 1
    ? nameParts[0][0].toUpperCase()
    : nameParts[0][0].toUpperCase() +
      nameParts[nameParts.length - 1][0].toUpperCase();
</script>
<style scoped>
.side-nav-open {
  padding: 10px;
}
.side-nav-close {
  padding: 0px;
}

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
