import { defineStore } from "pinia";
import { ref } from "vue";
import router from "../routes";
import { toast } from "vue3-toastify";

const useAuth = defineStore("auth", () => {
  const token = ref(null);
  const user = ref(null);
  const loading = ref(true);
  const login = (newToken, newUser, shouldRedirect = true) => {
    token.value = newToken;
    if (Array.isArray(newUser)) {
      user.value = newUser[0];
    } else {
      user.value = newUser;
    }

    localStorage.setItem("token", newToken);
    const role = (user.value.role || "").toLowerCase();
    localStorage.setItem("role", role);

    if (shouldRedirect) {
      if (role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/app");
      }
    }
  };
  const logout = () => {
    token.value = "";
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.replace("/");
    toast.success("Logout successfully !");
  };
  return { token, user, login, logout, loading };
});
export default useAuth;
