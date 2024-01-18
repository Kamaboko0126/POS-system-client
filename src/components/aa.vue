<template>
  <LoginCheck />
  <AlertWarning
    v-if="showAlert"
    :message="alertMessage"
    :confirm="confirmAction"
    :cancel="cancelAction"
  />
  <section>
    <div class="edit-content">
      <h1>編輯菜單</h1>
      <p v-if="statusText != ''" class="status-text">{{ "*" + statusText }}</p>
      <h1 v-if="menuClass == ''">尚無內容，請輸入菜單名稱</h1>
      <div class="menu-items">
        <div v-for="(item, index) in menuClass" :key="index">
          <div class="menu-item">
            <div class="name">{{ item }}</div>
            <button @click="edit(item)" :disabled="isProcessing">編輯</button>
            <button class="del" @click="delet(item)" :disabled="isProcessing">
              刪除
            </button>
          </div>
        </div>
      </div>
      <div class="add-content">
        <div class="add-item">
          <input type="text" placeholder="請輸入菜單名稱" v-model="newItem" @keyup.enter="add"/>
          <button @click="add" :disabled="isProcessing">新增</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import LoginCheck from "../components/LoginCheck.vue";
import AlertWarning from "./AlertWarning.vue";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "EditMenu",
  components: {
    LoginCheck,
    AlertWarning,
  },
  setup() {
    const newItem = ref("");
    const router = useRouter();
    const menuClass = ref([]);
    const showAlert = ref(false);
    const alertMessage = ref("");
    const confirmAction = ref(() => {});
    const cancelAction = ref(() => {});
    const statusText = ref("");
    const isProcessing = ref(false);

    const getData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:10000/getmenuclass");
        menuClass.value = response.data.MenuClasses;
      } catch (error) {
        console.error(error);
      }
    };

    const edit = (id) => {
      isProcessing.value = true;
      console.log("編輯");
      showAlert.value = true;
      alertMessage.value = `確定前往編輯 ${id} 嗎？`;
      confirmAction.value = () => {
        router.push(`/editmenuitem?id=${id}`);
      };
      cancelAction.value = () => {
        showAlert.value = false;
        isProcessing.value = false;
      };
    };

    const add = async () => {
      isProcessing.value = true;
      if (newItem.value === "") {
        statusText.value = "請輸入菜單名稱";
        isProcessing.value = false;
        showAlert.value = false;
        return;
      }

      const regex = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/;
      if (!regex.test(newItem.value)) {
        statusText.value =
          "錯誤格式，含非法符號或數字為首";
        isProcessing.value = false;
        showAlert.value = false;
        return;
      }

      showAlert.value = true;
      alertMessage.value = `確定要新增 ${newItem.value} 嗎？`;
      confirmAction.value = async () => {
        // 原本的新增邏輯
        try {
          const response = await axios.post(
            "http://127.0.0.1:10000/addmenuclass",
            {
              MenuClass: newItem.value,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.message === "success") {
            statusText.value = "新增成功";
            isProcessing.value = false;
            showAlert.value = false;
          } else if (response.data.message === "already exists") {
            statusText.value = "名稱不能相同";
            isProcessing.value = false;
            showAlert.value = false;
          }
          getData();
          newItem.value = "";
        } catch (error) {
          isProcessing.value = false;
          showAlert.value = false;
          console.error(error);
        }
      };
      cancelAction.value = () => {
        isProcessing.value = false;
        showAlert.value = false;
      };
    };

    const delet = async (id) => {
      isProcessing.value = true;
      showAlert.value = true;
      alertMessage.value = `確定要刪除 ${id} 嗎？`;
      confirmAction.value = async () => {
        // 原本的刪除邏輯
        try {
          const response = await axios.post(
            "http://127.0.0.1:10000/delmenuclass",
            {
              MenuClass: id,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.message === "success") {
            isProcessing.value = false;
            statusText.value = "刪除成功";
          }
          getData();
          newItem.value = "";
          showAlert.value = false;
        } catch (error) {
          console.error(error);
          showAlert.value = false;
          isProcessing.value = false;
          statusText.value = "刪除失敗";
        }
      };
      cancelAction.value = () => {
        showAlert.value = false;
        isProcessing.value = false;
      };
    };

    onMounted(() => {
      getData();
    });

    return {
      menuClass,
      newItem,
      showAlert,
      alertMessage,
      confirmAction,
      cancelAction,
      statusText,
      isProcessing,
      edit,
      delet,
      add,
    };
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 15px;
}

.status-text {
  color: rgb(156, 24, 24);
  font-size: 20px;
  font-weight: bold;
}

.edit-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  margin-top: 20px;
  padding: 30px 50px;
}

.input-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 5%;
  border-radius: 5px;
}

.name {
  width: 175px;
  line-height: 50px;
  background: #f8d1bf;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 20px;
}

input[type="text"] {
  width: 295px;
  height: 50px;
  padding: 0 20px;
  font-size: 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 45px 0;
}

button {
  width: 100px;
  height: 50px;
  margin-left: 20px;
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

button.del {
  background-color: #e74c3c;
}

button.del:hover {
  background-color: #c0392b;
}

button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}
</style>
