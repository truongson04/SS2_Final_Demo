import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Layout from "../pages/Layout.vue";
import Dashboard from "../pages/Dashboard.vue";
import ResumeBuilder from "../pages/ResumeBuilder.vue";
import Preview from "../pages/Preview.vue";
import Login from "../pages/Login.vue";
import SignUp from "../pages/SignUp.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/app",
    component: Layout,
    children: [
      {
        path: "",
        component: Dashboard,
      },
      {
        path: "builder/:resumeId",
        name: "ResumeBuilder",
        component: ResumeBuilder,
      },
    ],
  },
  {
    path: "/view/:resumeId",
    name: "Preview",
    component: Preview,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignUp,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
