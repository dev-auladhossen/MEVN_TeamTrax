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
        <button
          @click="toggleDropdown"
          class="rounded-full bg-blue-600 text-white w-10 h-10 flex items-center justify-center"
        >
          {{ initials }}
        </button>

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
              <button class="w-full px-4 py-2 text-left hover:bg-gray-100">
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
      </div>
    </nav>

    <div id="sideNav" class="side-nav-open">
      <div
        class="side-nav-top flex gap-2 justify-center p-2 mb-5 text-xl font-bold text-blue-600"
      >
        <span class="text-xl"> <font-awesome-icon icon="hexagon-nodes" /></span>
        <span class="">TeamTrax</span>
      </div>

      <router-link
        v-if="
          loggedUser.role == 'admin' || loggedUser.role == 'project manager'
        "
        to="/admindashboard"
        class="side-bar-item rounded-full"
        :class="isActive('/admindashboard')"
      >
        <span class="side-bar-item-icon">
          <font-awesome-icon
            class="text-sm"
            icon="laptop-code"
            :class="[
              'text-sm',
              route.path === '/admindashboard' ? 'animate-bounce' : '',
            ]"
          />
        </span>
        <span class="side-bar-item-caption">Dashboard</span>
      </router-link>
      <router-link
        to="/projects"
        class="side-bar-item rounded-full"
        :class="isActive('/projects')"
      >
        <span class="side-bar-item-icon"
          ><font-awesome-icon
            class="text-sm"
            icon="clipboard-check"
            :class="[
              'text-sm',
              route.path === '/projects' ? 'animate-bounce' : '',
            ]"
        /></span>
        <span class="side-bar-item-caption hover:text-blue-600">Projects</span>
      </router-link>

      <router-link
        to="/tasks"
        class="side-bar-item rounded-full"
        :class="isActive('/tasks')"
      >
        <span class="side-bar-item-icon"
          ><font-awesome-icon
            class="text-sm"
            icon="tasks"
            :class="[
              'text-sm',
              route.path === '/tasks' ? 'animate-bounce' : '',
            ]"
        /></span>
        <span class="side-bar-item-caption">All Tasks</span>
      </router-link>

      <router-link
        v-if="loggedUser.role == 'developer'"
        to="/dev-tasks"
        class="side-bar-item rounded-full"
        :class="isActive('/dev-tasks')"
      >
        <span class="side-bar-item-icon"
          ><font-awesome-icon
            class="text-sm"
            icon="tasks"
            :class="[
              'text-sm',
              route.path === '/dev-tasks' ? 'animate-bounce' : '',
            ]"
        /></span>
        <span class="side-bar-item-caption">My Tasks</span>
      </router-link>

      <router-link
        to="/completed"
        class="side-bar-item rounded-full"
        :class="isActive('/completed')"
      >
        <span class="side-bar-item-icon"
          ><font-awesome-icon
            icon="circle-check"
            :class="[
              'text-sm',
              route.path === '/completed' ? 'animate-bounce' : '',
            ]"
        /></span>
        <span class="side-bar-item-caption">Completed</span>
      </router-link>

      <router-link
        to="/inprogress"
        class="side-bar-item rounded-full"
        :class="isActive('/inprogress')"
      >
        <span class="side-bar-item-icon"
          ><font-awesome-icon
            icon="tasks-alt"
            :class="[
              'text-sm',
              route.path === '/inprogress' ? 'animate-bounce' : '',
            ]"
        /></span>
        <span class="side-bar-item-caption">In Progress</span>
      </router-link>

      <router-link
        v-if="
          loggedUser.role == 'admin' || loggedUser.role == 'project manager'
        "
        to="/add-user"
        class="side-bar-item rounded-full"
        :class="isActive('/add-user')"
      >
        <span class="side-bar-item-icon"
          ><font-awesome-icon
            icon="people-group"
            :class="[
              'text-sm',
              route.path === '/add-user' ? 'animate-bounce' : '',
            ]"
        /></span>
        <span class="side-bar-item-caption">Team</span>
      </router-link>

      <router-link
        v-if="
          loggedUser.role == 'admin' || loggedUser.role == 'project manager'
        "
        to="/settings"
        class="side-bar-item rounded-full"
        :class="isActive('/settings')"
      >
        <span class="side-bar-item-icon"
          ><font-awesome-icon
            icon="gear"
            :class="[
              'text-sm',
              route.path === '/settings' ? 'animate-bounce' : '',
            ]"
        /></span>
        <span class="side-bar-item-caption">Settings</span>
      </router-link>

      <router-link
        v-if="
          loggedUser.role == 'admin' || loggedUser.role == 'project manager'
        "
        to="/access-control"
        class="side-bar-item rounded-full"
        :class="isActive('/access-control')"
      >
        <span class="side-bar-item-icon"
          ><font-awesome-icon
            icon="gear"
            :class="[
              'text-sm',
              route.path === '/access-control' ? 'animate-bounce' : '',
            ]"
        /></span>
        <span class="side-bar-item-caption">Access Control</span>
      </router-link>
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
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
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
</style>
