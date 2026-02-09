import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Layout from "../pages/Layout.vue";
import Dashboard from "../pages/Dashboard.vue";
import ResumeBuilder from "../pages/ResumeBuilder.vue";
import Preview from "../pages/Preview.vue";
import Login from "../pages/Login.vue";
import SignUp from "../pages/SignUp.vue";
import useAuth from "../../store/auth";
import getUserData from "../composables/useGetData";
import Interview from "../pages/Interview.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/app",
    component: Layout,
    meta: {
      requireLoggedIn: true,
    },
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
      {
        path: "interview/:resumeId",
        name: "Interview",
        component: Interview,
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
    beforeEnter: (to, from) => {
      if (localStorage.getItem("token")) {
        return {
          path: "/app",
        };
      }
    },
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignUp,
    beforeEnter: (to, from) => {
      if (localStorage.getItem("token")) {
        return {
          path: "/app",
        };
      }
    },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from) => {
  if (
    to.meta.requireLoggedIn &&
    !localStorage.getItem("token") &&
    !to.query.token
  ) {
    return {
      path: "/login",
    };
  }

  const authStore = useAuth();
  if (localStorage.getItem("token") && !authStore.user) {
    getUserData();
  }
});
export default router;
