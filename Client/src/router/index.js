import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import AdminDashboard from "../pages/AdminDashboard.vue";
import UserDashboard from "../pages/UserDashboard.vue";
import AddNewUser from "../pages/AddNewUser.vue";
import Layout from "../components/Layout.vue";
import ToastContainer from "../components/Task/ToastContainer.vue";
import Projects from "../pages/Projects.vue";

const routes = [
  { path: "/home", component: Home },
  {
    path: "/login",
    component: Login,
    name: "Login",
    meta: { hideLayout: true },
  },
  {
    path: "/layout",
    component: Layout,
    name: "layout",
    meta: { hideLayout: true },
  },
  {
    path: "/admindashboard",
    name: "AdminDashboard",
    component: AdminDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/userdashboard",
    name: "UserDashboard",
    component: UserDashboard,
    meta: { hideLayout: true },
  },
  {
    path: "/add-user",
    name: "AddUser",
    component: AddNewUser,
    meta: { requiresAuth: true },
  },
  {
    path: "/projects",
    name: "projects",
    component: Projects,
    meta: { hideLayout: true },
  },
  {
    path: "/tasks",
    name: "tasks",
    component: ToastContainer,
    meta: { hideLayout: true },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  console.log("token", token);

  if (to.meta.requiresAuth && !token) {
    next({ name: "Login" }); // Redirect to login if not authenticated
  } else {
    next(); // Proceed to the route
  }
});

export default router;
