<template>
  <div>
    <nav
      id="topNav"
      class="navbar top-navbar fixed flex justify-between top-0 left-0 right-0 z-50 px-4 py-3 items-center"
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
            class="absolute right-0 mt-2 w-52 borderrounded-md bg-white shadow-2xl transform opacity-100 scale-100"
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
      <div class="side-nav-top flex justify-center mb-10">
        <img alt="" class="side-nav-logo" src="../assets/logo.JPG" />
      </div>

      <router-link to="/admindashboard" class="side-bar-item">
        <span class="side-bar-item-icon">
          <font-awesome-icon class="text-black" icon="house-laptop"
        /></span>
        <span class="side-bar-item-caption">Dashboard</span>
      </router-link>

      <router-link to="/projects" class="side-bar-item">
        <span class="side-bar-item-icon"
          ><font-awesome-icon class="text-black" icon="project-diagram"
        /></span>
        <span class="side-bar-item-caption hover:text-blue-600">Projects</span>
      </router-link>

      <router-link to="/tasks" class="side-bar-item">
        <span class="side-bar-item-icon"
          ><font-awesome-icon class="text-black" icon="tasks"
        /></span>
        <span class="side-bar-item-caption">Tasks</span>
      </router-link>

      <router-link to="/completed" class="side-bar-item">
        <span class="side-bar-item-icon"
          ><font-awesome-icon class="text-black" icon="circle-check"
        /></span>
        <span class="side-bar-item-caption">Completed</span>
      </router-link>

      <router-link to="/inprogress" class="side-bar-item">
        <span class="side-bar-item-icon"
          ><font-awesome-icon class="text-black" icon="note-sticky"
        /></span>
        <span class="side-bar-item-caption">In Progress</span>
      </router-link>

      <router-link to="/add-user" class="side-bar-item">
        <span class="side-bar-item-icon"
          ><font-awesome-icon class="text-black" icon="circle-user"
        /></span>
        <span class="side-bar-item-caption">Add User</span>
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
import { ref, onMounted, onBeforeUnmount } from "vue";

const { logout } = useAuth();

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

console.log("nameParts", nameParts);

const initials =
  nameParts.length === 1
    ? nameParts[0][0].toUpperCase()
    : nameParts[0][0].toUpperCase() +
      nameParts[nameParts.length - 1][0].toUpperCase();
</script>
<style scoped></style>
