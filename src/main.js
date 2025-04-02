import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import "./assets/styles/tailwind.css"; // Sesuaikan dengan path file kamu

axios.defaults.baseURL = "http://127.0.0.1:8000/api";
axios.defaults.withCredentials = true; // Biar bisa pakai Laravel Sanctum

const app = createApp(App);
app.use(router);
app.mount("#app");
