import useAuth from "../../store/auth";
import clientApi from "../configs/api/clientApi";
const getUserData = async () => {
  const authStore = useAuth();
  authStore.loading = true;
  const token = localStorage.getItem("token");
  try {
    if (token) {
      const { data } = await clientApi.get("/api/users/data", {
        headers: { Authorization: token },
      });
      if (data.user) {
        authStore.login(token, data.user);
      }
    } else {
      authStore.loading = false;
    }
  } catch (error) {
    console.log(error);
  } finally {
    authStore.loading = false;
  }
};
export default getUserData;
