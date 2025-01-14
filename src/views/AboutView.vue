<template>
  <div class="container">
    <div class="chat_container">
      <div class="chat_screen">
        <ul>
          <!-- 모든 메시지를 화면에 표시 -->
          <li
            v-for="(msg, index) in response_message"
            :key="index"
            class="chat_li"
          >
            {{ msg.message }}
          </li>
        </ul>
      </div>
      <div class="message_input_box">
        <input
          type="text"
          class="input_message"
          v-model="send_message"
          placeholder="메시지를 입력해주세요."
          @keyup.enter="send"
        />
        <button class="send_message_button" type="submit" @click="send">
          전송
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      send_message: "", // 전송할 메시지
      response_message: [], // 수신한 메시지
      screen_message: "", // 화면에 표시할 메시지
    };
  },
  mounted() {
    // 서버로부터 chat_response 이벤트 수신
    this.$socket.on("chat_response", (chat_response) => {
      // 중복 메시지 확인 후 추가

      this.response_message.push(chat_response);

      // 화면에 마지막 메시지 표시
      this.screen_message = chat_response.message;
      console.log(this.response_message);
    });
  },
  methods: {
    send() {
      if (this.send_message.trim()) {
        // 서버로 메시지 전송
        this.$socket.emit("chat_message", { message: this.send_message });
        console.log("Sent message:", this.send_message);

        // 입력 필드 초기화
        this.send_message = "";
      } else {
        alert("메시지를 입력해주세요."); // 빈 메시지 확인
      }
    },
  },
};
</script>

<style scoped>
li {
  list-style: none;
}

ul {
  padding: 0px;
}

.container {
  width: 0px auto;
  max-width: 1200px;
  height: 100%;
  justify-self: center;
}

.chat_container {
  width: auto;
  height: 500px;
}

.chat_screen {
  width: auto;
  max-width: 800px;
  height: 100%;
  overflow-y: scroll;
  background-color: #ccc;
}

.message_input_box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  width: 500px;
}

.input_message {
  flex: 1;
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
  height: 50px;
}

.send_message_button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.send_message_button:hover {
  background-color: #0056b3;
}
</style>
