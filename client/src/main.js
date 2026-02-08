import { createApp } from "vue";
import Vue3Toastify, { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./routes";
const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: toast.POSITION.TOP_RIGHT,
  theme: "auto",
  clearOnUrlChange: false,
});
app.mount("#app");
