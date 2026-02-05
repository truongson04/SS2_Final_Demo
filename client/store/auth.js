import { defineStore } from "pinia";
import { ref } from "vue";

const useAuth = defineStore("auth", () => {
  const token = ref(null);
  const user = ref(null);
  const loading = ref(true);
  const login = (token, user) => {
    token.value = token;
    user.value = user;
  };
  const logout = () => {
    token.value = "";
    user.value = null;
    localStorage.removeItem("token");
  };
});
