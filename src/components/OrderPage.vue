<template>
  <AlertWarning
    v-if="showAlert"
    :message="alertMessage"
    :confirm="confirmAction"
    :cancel="cancelAction"
  />
  <section>
    <div class="horizontal-menu-content">
      <div class="horizontal-menu">
        <div
          class="menu-item"
          v-if="menuClasses.length == 0"
          :style="[
            {
              background: menuClasses.length == 0 ? 'var(--second-color)' : '',
            },
            {
              color: menuClasses.length == 0 ? '#fff' : '',
            },
          ]"
        >
          請先新增內容
        </div>
      </div>
      <div
        class="horizontal-menu"
        v-for="(menuClass, id) in menuClasses"
        :key="id"
      >
        <div
          class="menu-item"
          @click="selectClass(menuClass.id)"
          :class="{ 'current-item': currentId === menuClass.id }"
        >
          {{ menuClass.menu_class }}
        </div>
      </div>
    </div>
    <div class="card-content">
      <div class="card" v-if="menuClasses.length == 0">
        <p>請先新增</p>
        <p>內容</p>
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

    const isLogin = sessionStorage.getItem("isLogin");
    const isProcessing = ref(false);
    const currentId = ref("");

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

    //點擊類別項目
    const selectClass = (id) => {
      console.log(id);
    };

    const getCurrentItems = (id) => {
      if (id === "refresh") {
        if (menuClasses.value.length == 0) {
          currentId.value = "";
          currentItems.value = [];
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
      showAlert,
      alertMessage,
      confirmAction,
      cancelAction,
      isProcessing,
      currentItems,
      currentId,
      selectClass,
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
  background: var(--background-color);
  display: flex;
  overflow: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.horizontal-menu-content::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
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

.current-item {
  background: var(--second-color);
  color: #fff;
}
</style>
