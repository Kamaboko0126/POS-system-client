<template>
  <form @submit.prevent="send">
    <div class="input-content">
      <h1>管理者登入</h1>
      <p class="warningText">{{ warningText }}</p>
      <input
        type="text"
        name="account"
        v-model="inputAccount"
        placeholder="Account"
      />
      <input
        type="password"
        name="password"
        v-model="inputPassword"
        id="password"
        placeholder="Password"
      />
      <div class="button-content">
        <button type="submit" :disabled="isProcessing">登入</button>
      </div>
    </div>
  </form>
</template>

<script>
import { onMounted, ref } from "vue";
import axios from "axios";
export default {
  name: "LoginPage",
  components: {},
  setup() {
    const inputAccount = ref("");
    const inputPassword = ref("");
    const warningText = ref("");
    const isProcessing = ref(false);
    const isLogin = ref(sessionStorage.getItem("isLogin"));

    const statusCheck = () => {
      console.log("statusCheck");
      if (inputAccount.value == "") {
        warningText.value = "*請輸入帳號";
        isProcessing.value = false;
        return;
      } else if (inputPassword.value == "") {
        warningText.value = "*請輸入密碼";
        isProcessing.value = false;
        return;
      } else {
        warningText.value = "";
      }
    };

    const send = async () => {
      isProcessing.value = true;
      statusCheck();
      if (warningText.value != "") return;
      try {
        const response = await axios.post("http://127.0.0.1:10000/login", {
          Account: inputAccount.value,
          Password: inputPassword.value,
        });
        if (response.data.message === "success") {
          console.log("登入成功");
          warningText.value = "登入成功";
          sessionStorage.setItem("isLogin", true);
          setTimeout(() => {
            window.location.href = "/order";
          }, 1000);
        } else {
          console.log("登入失敗");
          warningText.value = "登入失敗";
          isProcessing.value = false;
        }
      } catch (error) {
        warningText.value = "登入失敗";
        isProcessing.value = false;
        console.error(error);
      }
    };

    onMounted(() => {
      console.log(isLogin.value);
      if (isLogin.value == "true") {
        console.log("已登入");
        window.location.href = "/order";
      } else {
        console.log("未登入");
      }
    });

    return {
      send,
      inputAccount,
      inputPassword,
      warningText,
      isProcessing,
    };
  },
};
</script>

<style>
form {
  width: 100%;
  height: calc(90vh - var(--header-height));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.warningText {
  color: rgb(156, 24, 24);
}

.input-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 5%;
  border-radius: 5px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
}

input[type="text"],
input[type="password"] {
  width: 300px;
  height: 50px;
  margin: 15px 0;
  border: 1px solid #000;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 20px;
}

.button-content {
  width: 100%;
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

button {
  width: 100px;
  height: 50px;
  border: none;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 20px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2980b9;
}

button:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}

button:disabled {
  background-color: #bdc3c7;
  color: #7f8c8d;
  cursor: not-allowed;
}
</style>
