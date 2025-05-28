<template>
  <div
    class="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6] dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#302943] via-slate-900 to-black"
  >
    <div
      class="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center"
    >
      <div
        class="h-full w-full lg:w-2/3 flex flex-col items-center justify-center"
      >
        <div
          class="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20"
        >
          <span
            class="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base dark:border-gray-700 dark:text-blue-400 border-gray-300 text-gray-600"
          >
            Manage all your project in one place!
          </span>
          <p
            class="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center dark:text-gray-400 text-blue-700"
          >
            <span>Cloud-based </span>
            <span>Project Tracker</span>
          </p>

          <div class="cell">
            <div class="circle rotate-in-up-left"></div>
          </div>
        </div>
      </div>
      <div
        class="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center"
      >
        <form
          class="form-container w-full md:w-[360px] flex flex-col gap-y-6 bg-white dark:bg-slate-900 p-10"
          action="#"
          @submit.prevent="login"
        >
          <div>
            <p class="text-blue-600 text-3xl font-bold text-center">
              Welcome back!
            </p>
            <p class="text-center text-base text-gray-700 dark:text-gray-500">
              Keep all your credentials safe!
            </p>
          </div>

          <div class="flex flex-col gap-y-5">
            <div class="w-full flex flex-col gap-1">
              <label for="email" class="text-slate-900 dark:text-gray-500"
                >Email Address</label
              >
              <input
                v-model="username"
                type="text"
                name="email"
                id="email"
                class="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-white outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                placeholder="you@example.com"
                required=""
              />
            </div>
            <div class="w-full flex flex-col gap-1">
              <label for="password" class="text-slate-900 dark:text-gray-500"
                >Password</label
              >
              <input
                v-model="password"
                type="password"
                name="password"
                id="password"
                placeholder="password"
                class="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-white outline-none text-base focus:ring-2 ring-blue-300 w-full rounded-full"
                required=""
              />
            </div>
          </div>
          <div class="flex items-center justify-between">
            <a
              href="#"
              class="text-sm text-gray-600 hover:underline cursor-pointer"
              >Forgot password?</a
            >
          </div>
          <div v-if="isLoading">
            <Loading />
          </div>
          <button
            v-else
            type="submit"
            class="w-full h-10 bg-blue-700 text-white rounded-full outline-none text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import Loading from "../components/Loading.vue";
import { ref } from "vue";
import axios from "axios";
import { useToast } from "../components/Composables/useToast.js";

const { success, error, warning, info, showToast, clear } = useToast();
const router = useRouter();

const username = ref("Himel");
const password = ref("1234");
const errorMessage = ref("");
const isLoading = ref(false);
// Email: testuser@codewave.com
// Password: testuser@codewave.com

const login = async () => {
  try {
    isLoading.value = true;
    const response = await axios.post("http://localhost:5000/api/login", {
      username: username.value,
      password: password.value,
    });

    console.log("Logged in:", response.data);
    const { token, role, id, name, email, firstname, lastname, color } =
      response.data;

    const userData = {
      id: id,
      role: role,
      name: name,
      email: email,
      color: color,
      token: token,
    };

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("current-user", JSON.stringify(userData));

    isLoading.value = false;
    success("Loged In Successfully!", { title: "Welcome!" });

    // Redirect based on role
    if (role === "admin" || "manager") {
      router.push("/admindashboard");
    } else if (role === "user") {
      router.push("/userdashboard");
    } else {
      router.push("/");
    }
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    errorMessage.value = `Login failed. Please check your credentials.`;
    error(errorMessage.value, { title: "Error" });
    isLoading.value = false;
  }
};
</script>
<style scoped>
.cell {
  display: inline-block;
  width: 49%;
  text-align: center;
}

.circle {
  display: inline-block;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(203, 37, 156, 0.671);
  box-shadow: 4px -40px 60px 5px rgb(40, 37, 203) inset;
}

.rotate-in-up-left {
  animation: rotate-in-up-left 2s ease infinite;
}

@keyframes rotate-in-up-left {
  0% {
    transform-origin: left bottom;
    transform: rotate(90deg);
    opacity: 0;
  }
  100% {
    transform-origin: left bottom;
    transform: rotate(0);
    opacity: 1;
  }
}

.form-container {
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 10px;
  box-sizing: border-box;
}
</style>
