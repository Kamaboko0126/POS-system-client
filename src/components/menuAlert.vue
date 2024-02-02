<script>
import { ref, inject } from "vue";
import axios from "axios";
export default {
  setup() {
    const showAlert = inject("showAlert");
    const isAdding = inject("isAdding");
    const name = inject("name");
    const id = inject("id");
    const isProcessing = ref(false);
    const inputText = ref(name ? name : "");
    const initialInputText = ref(inputText.value);

    const refresh = inject("refresh");

    const classNum = inject("classNum");

    const regex = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/;

    //按下確認鍵
    const confirm = () => {
      isProcessing.value = true;

      if (isAdding.value) {
        console.log("新增");
        if (!regex.test(inputText.value)) {
          console.log("格式錯誤");
          isProcessing.value = false;
          return;
        } else {
          addClass(inputText.value);
        }
      } else {
        console.log("修改");
        if (inputText.value === initialInputText.value) {
          console.log("未修改");
          isProcessing.value = false;
          return;
        } else {
          if (!regex.test(inputText.value)) {
            console.log("格式錯誤");
            isProcessing.value = false;
            return;
          } else {
            editClass(id.value, inputText.value);
          }
        }
      }
      isAdding.value = false;
      showAlert.value = false;
    };

    //按下取消&刪除鍵
    const del = () => {
      isProcessing.value = true;

      if (isAdding.value) {
        console.log("取消");
        isProcessing.value = false;
      } else {
        deleteClass(id.value);
        console.log("刪除");
      }
      isAdding.value = false;
      showAlert.value = false;
    };

    //新增類別
    const addClass = async (name) => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:10000/addmenuclass",
          {
            order_id: classNum.value + 1,
            menu_class: name,
            id: "t" + Date.now().toString(),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(response)
        if (response.data.message === "success") {
          console.log("新增成功");
          refresh();
          isProcessing.value = false;
        }
      } catch (error) {
        isProcessing.value = false;
        console.error(error);
      }
    };

    //刪除類別
    const deleteClass = async (id) => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:10000/delmenuclass",
          {
            id: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.message === "success") {
          isProcessing.value = false;
          refresh();
          console.log("刪除成功");
        }
      } catch (error) {
        isProcessing.value = false;
        console.error(error);
      }
    };

    //修改類別
    const editClass = async (id, name) => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:10000/editmenuclass",
          {
            menu_class: name,
            id: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.message === "success") {
          console.log("修改成功");
          refresh();
          isProcessing.value = false;
        }
      } catch (error) {
        isProcessing.value = false;
        console.error(error);
      }
    };

    // console.log(showAlert.value);

    return {
      showAlert,
      isAdding,
      confirm,
      del,
      inputText,
      isProcessing,
    };
  },
};
</script>

<template>
  <div class="body">
    <div class="content">
      <div>
        <div class="title">
          <h1>類別名稱：</h1>
          <i class="material-icons" @click="showAlert = !showAlert">close</i>
        </div>
        <input type="text" placeholder="請輸入類別名稱" v-model="inputText" />
      </div>
      <div class="buttons">
        <button class="del" @click="del" :disabled="isProcessing">
          {{ isAdding ? "取消" : "刪除" }}
        </button>
        <button class="confirm" @click="confirm" :disabled="isProcessing">
          {{ isAdding ? "新增" : "修改" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.body {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: start;
  justify-content: center;
}

.content {
  margin-top: calc(var(--header-height) + 6px);
  padding: 40px 60px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 8px 10px 3px #41546a53;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title i {
  font-size: 40px;
  position: relative;
  left: 30px;
  top: -15px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}

.title i:hover {
  transform: scale(1.1);
}

h1 {
  font-size: 30px;
  font-weight: bold;
}

input[type="text"] {
  border: 0;
  border-radius: 0;
  height: 36px;
  margin-top: 25px;
  padding: 7px 0;
  font-size: 28px;
  line-height: 1.42857;
  display: block;
  color: #555;
  padding-inline: 2px;
  background-image: linear-gradient(#9c27b0, #9c27b0),
    linear-gradient(#d2d2d2, #d2d2d2);
  background-size: 0 2px, 100% 1px;
  background-repeat: no-repeat;
  background-position: center bottom, center calc(100% - 1px);
  background-color: transparent;
  transition: background 0s ease-out;
  outline: none;
}

.buttons {
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
}

button {
  box-shadow: none;
  background: #5eab6d;
  color: #fff;
  border: none;
  border-radius: 3px;
  position: relative;
  padding: 8px 30px;
  margin: 25px 1px 0 20px;
  font-size: 25px;
  letter-spacing: 0;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

button:hover {
  background: #398439;
}

.del {
  background: rgba(244, 67, 54, 0.846);
}

.del:hover {
  background: #ac2925;
}
</style>
