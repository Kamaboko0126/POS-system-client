<script>
import { inject, ref, watch } from "vue";
import axios from "axios";

export default {
  setup() {
    const isEditing = inject("isCardEditing");
    const showAlert = inject("showAlert");
    const currentId = inject("currentId");
    const isProcessing = ref(false);
    const regex = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/;
    const refresh = inject("refresh");

    watch(
      () => currentId.value,
      (newVal) => {
        console.log("currentId changed", newVal);
      }
    );

    const inputName = ref("");
    const inputPrice = ref("");

    const del = () => {
      showAlert.value = false;
    };

    const confirm = () => {
      isProcessing.value = true;
      console.log("click");
      if (inputName.value === "" || inputPrice.value === "") {
        alert("請輸入完整資料");
        isProcessing.value = false;
        return;
      } else {
        if (!regex.test(inputName.value)) {
          alert("品項名稱格式錯誤");
          isProcessing.value = false;
          return;
        } else if (inputPrice.value <= 0) {
          alert("價格不得小於0");
          isProcessing.value = false;
          return;
        } else {
          addItem();
        }
      }
    };

    //新增品項
    const addItem = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:10000/additem",
          {
            table_id: currentId.value,
            id: "t" + Date.now().toString(),
            name: inputName.value,
            price: inputPrice.value,
            marker: "",
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
          refresh("refresh");
          showAlert.value = false;
          isProcessing.value = false;
        }
      } catch (error) {
        isProcessing.value = false;
        console.error(error);
      }
    };

    return {
      isEditing,
      del,
      confirm,
      inputName,
      inputPrice,
      isProcessing,
    };
  },
};
</script>

<template>
  <div class="main">
    <div class="content">
      <h1>新增品項</h1>
      <div class="middle">
        <div class="left">
          <input type="text" v-model="inputName" placeholder="品項名稱" />
          <input type="number" v-model="inputPrice" placeholder="價格" />
        </div>
        <div class="right">
          <button class="addMarker" :disabled="isProcessing">新增備註</button>
          <!-- <v-draggable
            v-model="markers"
            tag="ul"
            :disabled="editingMarkers"
            itemKey="id"
          >
            <template #item="{ element: marker }">
              <li>{{ marker }}</li>
            </template>
          </v-draggable> -->
        </div>
      </div>
      <div class="buttons">
        <button class="del" @click="del" :disabled="isProcessing">取消</button>
        <button class="confirm" @click="confirm" :disabled="isProcessing">
          確定
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: start;
  justify-content: center;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.05);
}
.content {
  background: #fff;
  margin-top: calc(var(--header-height) + 6px);
  box-shadow: 0px 8px 10px 3px #41546a53;
  border-radius: 5px;
  padding: 40px 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  max-width: 90%;
  max-height: 90vh;
  overflow: auto;
}

input[type="text"],
input[type="number"] {
  border: 0;
  border-radius: 0;
  height: 36px;
  width: 200px;
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

h1 {
  font-size: 30px;
}

.middle {
  display: flex;
  align-items: start;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
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

.addMarker {
  background: var(--second-color);
}

.addMarker:hover {
  background: var(--hover-color);
}

.del {
  background: rgba(244, 67, 54, 0.846);
}

.del:hover {
  background: #ac2925;
}

button:disabled,
button:disabled:hover {
  background: #d0d8db;
  cursor: not-allowed;
}
</style>
