import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { io } from "socket.io-client";

// Socket.IO 클라이언트 생성
const socket = io("http://localhost:3000");

// Vue 애플리케이션 생성
const app = createApp(App);

// Socket.IO를 전역 속성으로 추가
app.config.globalProperties.$socket = socket;

app.use(router).mount("#app");
