import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/index.js";
import store from "./store"; // 引入你的 Vuex store
import draggable from 'vuedraggable'

const app = createApp(App);
app.use(router);
app.use(store); // 使用你的 Vuex store
app.component('v-draggable', draggable)
app.mount("#app");