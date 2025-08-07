<template>
  <div class="max-w-md mx-auto p-6 shadow rounded bg-white mt-10">
    <h2 class="text-2xl font-bold mb-4">Client Login</h2>
    <form @submit.prevent="handleLogin">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="input mb-2"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="input mb-4"
        required
      />
      <button type="submit" class="btn">Login</button>
    </form>
    <p class="text-red-500 mt-2" v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import clientAuth from "../components/Stores/clientAuth";

const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");

const handleLogin = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/client/login", {
      email: email.value,
      password: password.value,
    });
    clientAuth.login(res.data.token);
    router.push("/client/dashboard");
  } catch (err) {
    error.value = err.response?.data?.message || "Login failed";
  }
};
</script>

<style scoped>
.input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.btn {
  padding: 10px 16px;
  background-color: #4f46e5;
  color: white;
  border-radius: 8px;
  width: 100%;
}
</style>
