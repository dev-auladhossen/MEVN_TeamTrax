// src/composables/auth.js
import { useRouter } from "vue-router";

export function useAuth() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("current-user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Redirect to login or home
    router.push("/login");
  };

  return { logout };
}
