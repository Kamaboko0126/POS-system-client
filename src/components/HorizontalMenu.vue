<script>
import { ref, watch, toRaw, provide } from "vue";
import { useStore } from "vuex";
import MenuAlert from "./menuAlert.vue";
import axios from "axios";
export default {
  components: {
    MenuAlert,
  },
  setup() {
    const store = useStore();
    const isEditing = ref(false);
    const isAdding = ref(false);
    const showAlert = ref(false);
    const name = ref("");
    const id = ref("");
    provide("showAlert", showAlert);
    provide("isAdding", isAdding);
    provide("name", name);
    provide("id", id);

    // 使用 ref 來創建一個響應式變量
    const menuClasses = ref(store.state.menuClasses);
    const classNum = ref(menuClasses.value.length);
    provide("classNum", classNum);

    // 監控 menuClasses 的變化
    watch(
      () => store.state.menuClasses,
      (newVal) => {
        menuClasses.value = newVal;
        classNum.value = menuClasses.value.length;
      }
    );

    //選取類別
    const selectItem = (itemName, itemId) => {
      if (isEditing.value) {
        name.value = itemName;
        id.value = itemId;
        console.log(name, id);
        showAlert.value = true;
      } else {
        getCurrentItem(itemId);
      }
    };

    //新增類別
    const add = () => {
      showAlert.value = true;
      isAdding.value = true;
      name.value = "";
      id.value = "";
    };

    const handleDragEnd = async () => {
      // 拖放操作結束，你可以在這裡保存新的順序
      const rawMenuClasses = toRaw(menuClasses.value);
      const data = [];
      for (let i = 0; i < rawMenuClasses.length; i++) {
        data.push({
          order_id: i + 1,
          id: rawMenuClasses[i].id,
        });
      }
      console.log(data);
      const jsonData = JSON.stringify(toRaw(data));
      try {
        const response = await axios.post(
          "http://127.0.0.1:10000/changeclassorder",
          {
            data: jsonData,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        if (response.data.message === "success") {
          console.log("排序成功");
          refresh();
        }
      } catch (error) {
        console.error(error);
      }
    };

    const refresh = () => {
      store.dispatch("fetchMenuClass").then(() => {
        console.log("fresh");
      });
    };

    const getCurrentItem = (itemId) => {
      store.dispatch("fetchCurrentItem", itemId).then(() => {
        console.log("fetchCurrentItem");
      });
    };

    provide("refresh", refresh);

    return {
      menuClasses,
      isEditing,
      showAlert,
      name,
      id,
      refresh,
      selectItem,
      add,
      handleDragEnd,
    };
  },
};
</script>

<template>
  <MenuAlert v-if="showAlert" :refresh="refresh" />
  <div
    class="horizontal-menu-content"
    :class="{ 'hide-scrollbar': !isEditing }"
  >
    <div class="button-content">
      <div
        class="edit-btn"
        @click="isEditing = !isEditing"
        :class="{ editing: isEditing }"
      >
        編輯
      </div>
    </div>
    <div class="add-btn horizontal-menu" v-if="isEditing" @click="add">
      + 新增<span class="material-icons" v-if="isEditing">edit</span>
    </div>
    <v-draggable
      v-model="menuClasses"
      tag="ul"
      :disabled="!isEditing"
      itemKey="id"
      @end="handleDragEnd"
    >
      <template #item="{ element: menuClass }">
        <li
          @click="selectItem(menuClass.menu_class, menuClass.id)"
          class="horizontal-menu"
        >
          {{ menuClass.menu_class
          }}<span class="material-icons" v-if="isEditing">edit</span>
        </li>
      </template>
    </v-draggable>
  </div>
</template>

<style scoped>
.horizontal-menu-content {
  position: sticky;
  top: 0;
  width: 100%;
  height: calc(var(--horizontal-menu-height) + 20px);
  display: flex;
  overflow: auto;
  overflow-y: hidden;
  background: var(--background-color);
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
  padding-left: 155px;
}

.hide-scrollbar {
  height: var(--horizontal-menu-height);
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.button-content {
  position: absolute;
  left: 0;
  height: var(--horizontal-menu-height);
  display: flex;
  align-items: center;
  justify-content: center;
}

.horizontal-menu {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.edit-btn {
  width: 150px;
  height: var(--horizontal-menu-height);
  background: var(--second-color);
  color: var(--second-font-color);
  font-size: 30px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.add-btn {
  width: 150px;
  height: var(--horizontal-menu-height);
  background: var(--second-color);
  color: var(--second-font-color);
  font-size: 30px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

ul {
  align-items: center;
  display: flex;
  list-style-type: none;
}

li {
  background: var(--second-color);
  padding: 20px 25px;
  border-radius: 5px;
  font-size: 30px;
  font-weight: bold;
  color: var(--second-font-color);
  cursor: pointer;
  margin: 0 10px;
  transition: all 0.3s ease-in-out;
  list-style-type: none;
}

li span,
.add-btn span {
  transform: translateY(-17px) translateX(19px);
  background: #5eab6d;
  border-radius: 100px;
  font-size: 18px;
  padding: 2px;
  margin-left: -15px;
}

.edit-btn:hover,
.add-btn:hover,
li:hover {
  background: #95abb9;
}

.current-item {
  background: var(--second-color);
  color: #fff;
}

.editing {
  background: #5eab6d;
  transition: all 0.3s ease-in-out;
}

.editing:hover {
  background: #69bb7a;
}
</style>
