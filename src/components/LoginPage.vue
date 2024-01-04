<template>
  <form @submit.prevent="send">
    <div class="input-content">
      <h1>管理者登入</h1>
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
        <button type="submit">登入</button>
      </div>
    </div>
  </form>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
export default {
  name: "LoginPage",
  components: {},
  setup() {
    const inputAccount = ref("");
    const inputPassword = ref("");
    const send = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:10000/login", {
          Account: inputAccount.value,
          Password: inputPassword.value,
        });
        if (response.data.message === "success") {
          alert("登入成功");
          sessionStorage.setItem("isLogin", true);
          window.location.href = "/";
        } else {
          alert("登入失敗");
        }
      } catch (error) {
        console.error(error);
      }
    };

    return {
      send,
      inputAccount,
      inputPassword,
    };
  },
};
</script>

<style>
form {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
</style>
