import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import AdminDashboard from "../pages/AdminDashboard.vue";
import UserDashboard from "../pages/UserDashboard.vue";
import AddNewUser from "../pages/AddNewUser.vue";
import Layout from "../components/Layout.vue";
import ToastContainer from "../components/Task/ToastContainer.vue";
import Projects from "../pages/Projects.vue";
import CardViewBoard from "../components/Task/CardViewBoard.vue";
import ProjectDetails from "../components/ProjectDetails.vue";
import TaskDetails from "../components/TaskDetails/TaskDetails.vue";
import Settings from "../pages/Settings.vue";
import Tasks from "../pages/Tasks.vue";
import DevTasks from "../pages/DevTasks.vue";
import AccessControlPage from "../pages/AccessControlPage.vue";

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
    path: "/project-details/:id",
    name: "projectDetails",
    component: ProjectDetails,
    meta: { hideLayout: true },
  },
  {
    path: "/task-details/:id",
    name: "taskDetails",
    component: TaskDetails,
    meta: { hideLayout: true },
  },
  {
    path: "/tasks",
    name: "tasks",
    component: Tasks,
    meta: { hideLayout: true },
  },
  {
    path: "/dev-tasks",
    name: "dev-tasks",
    component: DevTasks,
    meta: { hideLayout: true },
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings,
    meta: { hideLayout: true },
  },
  {
    path: "/access-control",
    name: "access-control",
    component: AccessControlPage,
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
