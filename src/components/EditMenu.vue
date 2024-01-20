<template>
  <AlertWarning
    v-if="showAlert"
    :message="alertMessage"
    :confirm="confirmAction"
    :cancel="cancelAction"
    :checkOnly="checkOnly"
  />
  <section>
    <div class="horizontal-menu-content">
      <div class="class-button-content">
        <div
          class="class-button add-subtract"
          @click="addOrSubtract"
          :class="{ 'current-mode': isAddOrSubtractClass }"
        >
          增 減
        </div>
        <div
          class="class-button edit"
          @click="editClass"
          :class="{ 'current-mode': isEditingClass }"
        >
          編 輯
        </div>
      </div>
      <div class="horizontal-menu" v-if="isAddOrSubtractClass">
        <div class="menu-item">
          <input type="text" v-model="inputClass" @keyup.enter="addMenuClass" />
          <button @click="addMenuClass" :disabled="isProcessing">新增</button>
        </div>
      </div>
      <div
        class="horizontal-menu"
        v-for="(menuClass, id) in menuClasses"
        :key="id"
      >
        <div
          class="menu-item"
          @click="selectClass(menuClass.id, menuClass.menu_class)"
          :class="{ 'current-item': currentId === menuClass.id }"
        >
          {{ menuClass.menu_class }}
          <i class="material-icons" v-if="isAddOrSubtractClass"
            >delete_forever</i
          >
          <i class="material-icons" v-if="isEditingClass">edit</i>
        </div>
      </div>
    </div>
    <div class="card-content">
      <div
        class="card"
        @click="isEditingItem = !isEditingItem"
        v-if="menuClasses.length !== 0"
      >
        <p>增減</p>
      </div>
      <div class="card" v-if="isEditingItem">
        <input
          type="text"
          v-model="inputName"
          @keyup.enter="addItem"
          placeholder="品項"
        />
        <input
          type="text"
          v-model.number="inputPrice"
          @keyup.enter="addItem"
          placeholder="定價"
        />
        <button @click="addItem" :disabled="isProcessing">新增</button>
      </div>
      <div
        class="card"
        v-for="(currentItem, index) in currentItems"
        :key="index"
        @click="selectCard(currentItem.id)"
      >
        <p>{{ currentItem.name }}</p>
        <p>{{ currentItem.price }}</p>
      </div>
    </div>
    <LoginCheck />
  </section>
</template>

<script>
import { ref, watch, toRaw, onMounted } from "vue";
import AlertWarning from "./AlertWarning.vue";
import { useStore } from "vuex";
import LoginCheck from "../components/LoginCheck.vue";
import axios from "axios";

export default {
  name: "EditMenu",
  components: {
    LoginCheck,
    AlertWarning,
  },
  setup() {
    const store = useStore();
    const showAlert = ref(false);
    const alertMessage = ref("");
    const confirmAction = ref(() => {});
    const cancelAction = ref(() => {});
    const checkOnly = ref(false);

    const isLogin = sessionStorage.getItem("isLogin");
    const isAddOrSubtractClass = ref(false);
    const isEditingClass = ref(false);
    const isAddOrSubtractItem = ref(false);
    const isEditingItem = ref(false);
    const isProcessing = ref(false);
    const inputClass = ref("");
    const inputName = ref("");
    const inputPrice = ref("");
    const currentId = ref("");

    const regex = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/;

    // 使用 ref 來創建一個響應式變量
    const menuClasses = ref(store.state.menuClasses);
    const allItems = ref(store.state.allItems);
    const currentItems = ref([]);

    // 監控 menuClasses 的變化
    watch(
      () => store.state.menuClasses,
      (newVal) => {
        menuClasses.value = newVal;
      }
    );

    // 監控 menuItems 的變化
    watch(
      () => store.state.allItems,
      (newVal) => {
        allItems.value = newVal;
      }
    );

    //增減模式(類別)
    const addOrSubtract = () => {
      if (isEditingClass.value) {
        isEditingClass.value = false;
      }
      isAddOrSubtractClass.value = !isAddOrSubtractClass.value;
    };

    //編輯模式(類別)
    const editClass = () => {
      if (isAddOrSubtractClass.value) {
        isAddOrSubtractClass.value = false;
      }
      isEditingClass.value = !isEditingClass.value;
    };

    //新增類別
    const addMenuClass = async () => {
      isProcessing.value = true;
      if (inputClass.value == "") {
        checkAlert("請輸入菜單名稱");
        return;
      }

      if (!regex.test(inputClass.value)) {
        checkAlert("錯誤格式，含非法符號或數字為首");
        // alert("錯誤格式，含非法符號或數字為首");
        isProcessing.value = false;
        return;
      }

      showAlert.value = true;
      alertMessage.value = `確定要新增 ${inputClass.value} 嗎？`;
      confirmAction.value = async () => {
        try {
          const response = await axios.post(
            "http://127.0.0.1:10000/addmenuclass",
            {
              menu_class: inputClass.value,
              id: "t" + Date.now().toString(),
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.message === "success") {
            // console.log("新增成功");
            store.dispatch("fetchMenuClass").then(() => {
              store.dispatch("fetchMenuItem");
              getCurrentItems("refresh");
              showAlert.value = false;
              alertMessage.value = "";
            });
            isEditingClass.value = false;
            isProcessing.value = false;
          } else if (response.data.message === "already exists") {
            // console.log("名稱不能相同");
            isProcessing.value = false;
          }
          inputClass.value = "";
        } catch (error) {
          isProcessing.value = false;
          console.error(error);
        }
      };
      cancelAction.value = () => {
        isProcessing.value = false;
        showAlert.value = false;
      };
    };

    //點擊類別項目
    const selectClass = (id, name) => {
      if (isAddOrSubtractClass.value) {
        deleteMenuClass(id, name);
      } else {
        getCurrentItems(id);
      }
    };

    //刪除類別
    const deleteMenuClass = async (id, name) => {
      showAlert.value = true;
      alertMessage.value = `確定要刪除 ${name} 嗎？`;
      confirmAction.value = async () => {
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
            store.dispatch("fetchMenuClass").then(() => {
              store.dispatch("fetchMenuItem");
              getCurrentItems("refresh");
              showAlert.value = false;
              alertMessage.value = "";
            });
            isEditingClass.value = false;
          }
        } catch (error) {
          console.error(error);
          isProcessing.value = false;
          // console.log("刪除失敗");
        }
      };
      cancelAction.value = () => {
        isProcessing.value = false;
        showAlert.value = false;
      };
    };

    const getCurrentItems = (id) => {
      if (id === "refresh") {
        if (menuClasses.value.length == 0) {
          currentId.value = "";
          currentItems.value = [];
          isEditingItem.value = false;
          return;
        } else {
          currentId.value = menuClasses.value[0].id;
          currentItems.value = toRaw(allItems.value[menuClasses.value[0].id]);
          return;
        }
      } else {
        currentId.value = id;
        currentItems.value = toRaw(allItems.value[id]);
      }
    };

    //新增品項
    const addItem = async () => {
      if (inputName.value == "") {
        isProcessing.value = false;
        return;
      }

      showAlert.value = true;
      alertMessage.value = `確定要新增 ${inputName.value} 嗎？`;
      confirmAction.value = async () => {
        console.log("add", currentId.value, inputName.value, inputPrice.value);
        try {
          const response = await axios.post(
            "http://127.0.0.1:10000/additem",
            {
              table_id: currentId.value,
              id: "i" + Date.now().toString(),
              name: inputName.value,
              price: inputPrice.value,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.message === "success") {
            console.log("新增成功");
            store.dispatch("fetchMenuItem").then(() => {
              getCurrentItems(currentId.value);
              showAlert.value = false;
              alertMessage.value = "";
            });
            isProcessing.value = false;
            inputName.value = "";
            inputPrice.value = "";
          }
        } catch (error) {
          isProcessing.value = false;
          console.error(error);
        }
      };
      cancelAction.value = () => {
        isProcessing.value = false;
        showAlert.value = false;
      };
    };

    const checkAlert = (text) => {
      isProcessing.value = true;
      showAlert.value = true;
      alertMessage.value = text;
      checkOnly.value = true;
      confirmAction.value = () => {
        showAlert.value = false;
        checkOnly.value = false;
        isProcessing.value = false;
      };
    };

    onMounted(() => {
      store.dispatch("fetchMenuClass").then(() => {
        store.dispatch("fetchMenuItem");
        getCurrentItems("refresh");
      });
    });

    return {
      isLogin,
      menuClasses,
      allItems,
      isAddOrSubtractClass,
      isEditingClass,
      isAddOrSubtractItem,
      isEditingItem,
      showAlert,
      alertMessage,
      confirmAction,
      cancelAction,
      checkOnly,
      isProcessing,
      inputClass,
      inputName,
      inputPrice,
      currentItems,
      currentId,
      selectClass,
      addMenuClass,
      addItem,
      addOrSubtract,
      editClass,
    };
  },
};
</script>

<style scoped>
.horizontal-menu-content {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100px;
  display: flex;
  overflow: auto;
  background: var(--background-color);
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  padding-left: 150px;
}

.horizontal-menu-content::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}

.class-button-content {
  width: 150px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  left: 0;
  background: var(--third-color);
}

.class-button {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.15s ease;
}

.class-button:hover {
  background: var(--second-color);
  color: #fff;
}

.horizontal-menu {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 10px 25px;
  margin: 0 10px;
  border-radius: 15px;
  font-size: 30px;
  font-weight: bold;
  color: var(--main-color);
  cursor: pointer;
}

.menu-item i {
  font-size: 35px;
  color: var(--warning-color);
  cursor: pointer;
}

section {
  width: 100%;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
}

.card-content {
  width: calc(100% - 20px);
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 20px;
}

.card {
  width: 240px;
  height: 130px;
  background: #fff;
  margin: 20px;
  border-radius: 15px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
}

.card p {
  font-size: 35px;
  font-weight: bolder;
  margin: 0 10px;
  line-height: 150%;
  text-align: center;
}

input[type="text"] {
  width: 150px;
  font-size: 35px;
  font-weight: bold;
  text-align: center;
  background: #fff;
  border-radius: 5px;
}

button {
  width: 85px;
  height: 43px;
  margin-left: 10px;
  border: none;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 28px;
  background-color: var(--second-color);
  color: white;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  color: #fff;
  cursor: not-allowed;
}

.card input[type="text"] {
  width: 150px;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  background: #fff;
  border-radius: 5px;
  margin: 2px 0;
}

.card button {
  width: 75px;
  height: 35px;
  margin-left: 0;
  border: none;
  border-radius: 5px;
  font-size: 24px;
  background-color: var(--second-color);
  color: white;
  cursor: pointer;
}

.current-mode {
  background: var(--second-color);
  color: #fff;
}

.current-item {
  background: var(--second-color);
  color: #fff;
}

.current-item i {
  color: #fff;
}
</style>
