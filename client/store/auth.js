import { defineStore } from "pinia";
import { ref } from "vue";

const useAuth = defineStore("auth", () => {
  const token = ref(null);
  const user = ref(null);
  const loading = ref(true);
  const login = (newToken, newUser) => {
    token.value = newToken;
    user.value = newUser;
  };
  const logout = () => {
    token.value = "";
    user.value = null;
    localStorage.removeItem("token");
  };
  return{token, user, login, logout,loading}
});
export default useAuth
