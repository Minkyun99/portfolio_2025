<template>
  <div class="login_container">
    <div class="login_input">
      <input type="text" placeholder="id를 입력해주세요." v-model="id" />
      <input
        type="password"
        placeholder="pw를 입력해주세요."
        v-model="pw"
        @keyup.enter="login"
      />
    </div>
    <div class="login_button" @click="login">login</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomeView",
  data() {
    return {
      id: "", // 사용자 ID
      pw: "", // 사용자 PW
    };
  },
  methods: {
    async login() {
      // 입력값 확인
      if (this.id.trim().length === 0 || this.pw.trim().length === 0) {
        alert("ID와 PW를 입력해주세요.");
        return;
      }

      try {
        // Axios POST 요청
        const response = await axios.post("http://localhost:3000/login", {
          id: this.id,
          pw: this.pw,
        });

        // 응답 처리
        if (response.data.message === "Login successful, ID saved in cookie.") {
          alert("로그인 성공!");
          this.$router.push("/about"); // About 페이지로 이동
        } else {
          alert("로그인 실패: " + response.data.error);
        }
      } catch (error) {
        console.error("로그인 요청 중 오류:", error);
        alert("로그인 요청 중 오류가 발생했습니다.");
      }
    },
  },
};
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 50px;
}

.login_container {
  width: auto;
  height: 250px;
  justify-self: center;
}

.login_input {
  width: 200px;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
}

.login_input input {
  width: 200px;
  height: 25px;
  margin-top: 5px;
}

.login_button {
  width: 200px;
  height: 25px;
  margin-top: 5px;
  border-radius: 10px;
  background-color: #ccc;
  text-align: center;
  cursor: pointer;
}
</style>
