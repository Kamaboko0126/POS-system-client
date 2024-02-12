<script>
import { inject, ref } from "vue";
import axios from "axios";

export default {
  setup() {
    const isEditing = inject("isCardEditing");
    const showAlert = inject("showAlert");
    const table_id = inject("currentId");
    const isProcessing = ref(false);
    const regex = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/;
    const itemId = inject("itemId");
    const itemName = inject("itemName");
    const itemPrice = inject("itemPrice");
    const arrayMarker = inject("arrayMarker");
    const isAdding = inject("isAdding");
    const isItemFreshing = inject("isItemFreshing");
    const isAddingMarker = ref(false);
    const inputMarker = ref("");
    const inputEditMarker = ref("");
    const editingMarker = ref("");
    const itemNum = inject("itemNum");
    // watch(
    //   () => table_id.value,
    //   (newVal) => {
    // console.log("table_id changed", newVal);
    //   }
    // );

    //點擊確認&修改鍵
    const confirm = () => {
      isProcessing.value = true;
      // console.log("click");
      if (isAdding.value) {
        if (itemName.value === "" || itemPrice.value === "") {
          alert("請輸入完整資料");
          isProcessing.value = false;
          return;
        } else {
          if (!regex.test(itemName.value)) {
            alert("品項名稱格式錯誤");
            isProcessing.value = false;
            return;
          } else if (itemPrice.value <= 0) {
            alert("價格不得小於0");
            isProcessing.value = false;
            return;
          } else {
            addItem();
          }
        }
      } else {
        console.log("修改");
        if (itemName.value === "" || itemPrice.value === "") {
          alert("請輸入完整資料");
          isProcessing.value = false;
          return;
        } else {
          if (!regex.test(itemName.value)) {
            alert("品項名稱格式錯誤");
            isProcessing.value = false;
            return;
          } else if (itemPrice.value <= 0) {
            alert("價格不得小於0");
            isProcessing.value = false;
            return;
          } else {
            editItem();
          }
        }
      }
    };

    //編輯品項
    const editItem = async () => {
      try {
        const response = await axios.put(
          "http://127.0.0.1:10000/item/edit",
          {
            table_id: table_id.value,
            id: itemId.value,
            name: itemName.value,
            price: itemPrice.value,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(response)
        if (response.data.message === "success") {
          isItemFreshing.value = true;
          showAlert.value = false;
          isProcessing.value = false;
        }
      } catch (error) {
        isProcessing.value = false;
        console.error(error);
      }
    };

    //新增品項
    const addItem = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:10000/item/add",
          {
            table_id: table_id.value,
            id: "i" + Date.now().toString(),
            name: itemName.value,
            price: itemPrice.value,
            marker: "",
            order_id: itemNum.value + 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(response)
        if (response.data.message === "success") {
          isItemFreshing.value = true;
          showAlert.value = false;
          isProcessing.value = false;
        }
      } catch (error) {
        isProcessing.value = false;
        console.error(error);
      }
    };

    //刪除品項
    const delItem = async () => {
      try {
        const response = await axios.delete("http://127.0.0.1:10000/item/del", {
          table_id: table_id.value,
          id: itemId.value,
        });
        if (response.data.message === "success") {
          isProcessing.value = false;
          console.log("刪除成功");
          isItemFreshing.value = true;
          showAlert.value = false;
        }
      } catch (error) {
        isProcessing.value = false;
        console.error(error);
      }
    };

    //點擊取消鍵
    const cancel = () => {
      showAlert.value = false;
      arrayMarker.value = [];
    };

    //新增marker
    const addMarker = async () => {
      if (inputMarker.value === "") {
        alert("請輸入備註");
        return;
      }
      if (!isAdding.value) {
        arrayMarker.value.push({
          id: "m" + Date.now().toString(),
          value: inputMarker.value,
        });
        const string = JSON.stringify(arrayMarker.value);
        try {
          const response = await axios.post(
            "http://127.0.0.1:10000/marker/add",
            {
              table_id: table_id.value,
              item_id: itemId.value,
              marker: string,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          // console.log(response)
          if (response.data.message === "success") {
            isProcessing.value = false;
            isItemFreshing.value = true;
            inputMarker.value = "";
          }
        } catch (error) {
          isProcessing.value = false;
          console.error(error);
        }
      }
    };

    //刪除marker
    const delMarker = async (id) => {
      // console.log(arrayMarker.value);
      if (editingMarker.value === "") {
        const index = arrayMarker.value.findIndex((item) => item.id === id);

        if (index !== -1) {
          arrayMarker.value.splice(index, 1);
        }

        const string = JSON.stringify(arrayMarker.value);

        try {
          const response = await axios.post(
            "http://127.0.0.1:10000/marker/add",
            {
              table_id: table_id.value,
              item_id: itemId.value,
              marker: string,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          // console.log(response)
          if (response.data.message === "success") {
            isProcessing.value = false;
            isItemFreshing.value = true;
          }
        } catch (error) {
          isProcessing.value = false;
          console.error(error);
        }
      } else {
        editingMarker.value = "";
      }
    };

    //編輯marker
    const editMarker = async (id, value) => {
      // console.log(id, value);
      if (editingMarker.value == "") {
        editingMarker.value = id;
        inputEditMarker.value = value;
      } else {
        if (inputEditMarker.value === "") {
          alert("請輸入備註");
          return;
        } else if (inputEditMarker.value === value) {
          editingMarker.value = "";
          console.log("一樣");
          return;
        } else {
          // console.log(arrayMarker.value[0].id == id);
          const index = arrayMarker.value.findIndex((item) => item.id === id);
          // console.log(index);
          if (index !== null) {
            arrayMarker.value[index].value = inputEditMarker.value;
            // console.log(arrayMarker.value);
          }

          const string = JSON.stringify(arrayMarker.value);
          // console.log(string);

          try {
            const response = await axios.post(
              "http://127.0.0.1:10000/marker/add",
              {
                table_id: table_id.value,
                item_id: itemId.value,
                marker: string,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            // console.log(response)
            if (response.data.message === "success") {
              isProcessing.value = false;
              editingMarker.value = "";
              isItemFreshing.value = true;
            }
          } catch (error) {
            isProcessing.value = false;
            console.error(error);
          }
        }
      }
    };

    //重新排序marker
    const handleDragEnd = async () => {
      const string = JSON.stringify(arrayMarker.value);
      try {
        const response = await axios.post(
          "http://127.0.0.1:10000/marker/add",
          {
            table_id: table_id.value,
            item_id: itemId.value,
            marker: string,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(response)
        if (response.data.message === "success") {
          isProcessing.value = false;
          isItemFreshing.value = true;
        }
      } catch (error) {
        isProcessing.value = false;
        console.error(error);
      }
    };

    return {
      isEditing,
      confirm,
      delItem,
      isProcessing,
      isAdding,
      itemName,
      itemPrice,
      itemId,
      showAlert,
      isAddingMarker,
      inputMarker,
      addMarker,
      delMarker,
      editMarker,
      cancel,
      handleDragEnd,
      inputEditMarker,
      editingMarker,
      arrayMarker,
    };
  },
};
</script>

<template>
  <div class="main">
    <div class="content">
      <div class="top">
        <i class="material-icons" @click="delItem" v-if="!isAdding"
          >delete_forever</i
        >
      </div>
      <h1>{{ isAdding ? "新增品項" : "編輯品項" }}</h1>
      <div class="middle">
        <div class="left">
          <input
            type="text"
            v-model="itemName"
            placeholder="品項名稱"
            @keypress.enter="confirm"
          />
          <input
            type="number"
            v-model="itemPrice"
            placeholder="價格"
            @keypress.enter="confirm"
          />
        </div>
        <div class="right" v-if="!isAdding">
          <button
            class="add-marker-btn"
            @click="isAddingMarker = !isAddingMarker"
            :disabled="isProcessing"
          >
            新增備註
          </button>
          <div class="add-marker-text" v-if="isAddingMarker">
            <input
              type="text"
              v-model="inputMarker"
              @keypress.enter="addMarker"
            />
            <button @click="addMarker">新增</button>
          </div>
          <v-draggable
            v-model="arrayMarker"
            tag="ul"
            itemKey="id"
            :disabled="editingMarker !== ''"
            @end="handleDragEnd"
          >
            <template #item="{ element: marker }">
              <div class="marker-content">
                <input
                  type="text"
                  v-model="inputEditMarker"
                  v-if="editingMarker == marker.id"
                  @keypress.enter="editMarker(marker.id, marker.value)"
                />
                <li v-if="editingMarker !== marker.id">{{ marker.value }}</li>
                <div class="marker-content-btns">
                  <i
                    class="material-icons edit"
                    @click="editMarker(marker.id, marker.value)"
                    >{{ editingMarker == marker.id ? "done" : "edit" }}</i
                  >
                  <i class="material-icons" @click="delMarker(marker.id)">{{
                    editingMarker == marker.id ? "close" : "delete_forever"
                  }}</i>
                </div>
              </div>
            </template>
          </v-draggable>
        </div>
      </div>
      <div class="buttons">
        <button class="cancel" @click="cancel" :disabled="isProcessing">
          取消
        </button>
        <button class="confirm" @click="confirm" :disabled="isProcessing">
          {{ isAdding ? "確定" : "修改" }}
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

.buttons {
  margin-top: 30px;
}

button {
  box-shadow: none;
  background: var(--confirm-color);
  color: var(--font-color);
  border: none;
  border-radius: 3px;
  position: relative;
  padding: 8px 30px;
  margin: 0px 10px 0 10px;
  font-size: 25px;
  letter-spacing: 0;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

button:hover {
  background: var(--confirm-hover);
}

.add-marker-btn {
  background: var(--main-color);
  margin: 0;
}

.add-marker-btn:hover {
  background: var(--main-hover);
}

.cancel {
  background: var(--cancel-color);
}

.cancel:hover {
  background: var(--cancel-hover);
}

.top {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: -35px;
}

i {
  font-size: 45px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  color: var(--cancel-color);
}

i:hover {
  color: var(--cancel-hover);
}

.edit {
  color: var(--confirm-color);
}

.edit:hover {
  color: var(--confirm-hover);
}
.right {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  margin-left: 30px;
  max-height: 55vh;
  overflow: auto;
}

.add-marker-text {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.add-marker-text input[type="text"] {
  width: 150px;
  height: 30px;
}

.add-marker-text button,
.add-marker-btn {
  padding: 6px 15px;
  font-size: 23px;
}

ul {
  list-style-type: none;
  font-size: 23px;
  width: 100%;
}

li {
  font-size: 27px;
}

.marker-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
  cursor: pointer;
}

.marker-content input[type="text"] {
  height: 30px;
  width: 150px;
  margin-top: 0;
}
</style>
