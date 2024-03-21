import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/index.js";
import store from "./store"; // 引入你的 Vuex store
import draggable from 'vuedraggable'
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const app = createApp(App);
app.use(router);
app.use(store); // 使用你的 Vuex store

app.component('v-draggable', draggable)
app.component("VueDatePicker", VueDatePicker);

app.mount("#app");