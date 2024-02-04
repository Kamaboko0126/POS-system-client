<script>
import { ref, toRefs, watch, toRaw, provide, inject, onMounted } from "vue";
import { useStore } from "vuex";
import MenuAlert from "./MenuAlert.vue";
import axios from "axios";
export default {
  components: {
    MenuAlert,
  },
  props: {
    mode: String,
  },
  setup(props) {
    const { mode } = toRefs(props);
    const currentMode = mode.value;
    const store = useStore();
    const isAdding = ref(false);
    const showAlert = ref(false);
    const name = ref("");
    const id = ref("");
    const firstClass = ref("");
    const isEditing = inject("isClassEditing");
    const isCardEditing = inject("isCardEditing");
    const allItems = ref(store.state.allItems);
    const currentId = inject("currentId");
    const currentItem = inject("currentItem");

    provide("firstClass", firstClass);

    provide("showAlert", showAlert);
    provide("isAdding", isAdding);
    provide("name", name);
    provide("id", id);

    // 使用 ref 來創建一個響應式變量
    const menuClasses = ref(store.state.menuClasses);
    const classNum = inject("classNum");
    classNum.value = menuClasses.value.length;

    // 監控 menuClasses 的變化
    watch(
      () => store.state.menuClasses,
      (newVal) => {
        menuClasses.value = newVal;
        classNum.value = menuClasses.value.length;
      }
    );

    //監控 allItems的變化
    watch(
      () => store.state.allItems,
      (newVal) => {
        allItems.value = newVal;
      }
    );

    // watch(
    //   () => currentId.value,
    //   (newVal, oldVal) => {
    //     console.log(`currentId changed from ${oldVal} to ${newVal}`);
    //   }
    // );

    //點擊編輯

    const editing = () => {
      if (isEditing.value) {
        isEditing.value = false;
      } else {
        isEditing.value = true;
        isCardEditing.value = false;
      }
    };

    //選取類別
    const selectItem = (itemName, itemId) => {
      if (isEditing.value) {
        name.value = itemName;
        id.value = itemId;
        // console.log(name, id);
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

    //重新排序類別
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
      // console.log(data);
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
        // console.log(response);
        if (response.data.message === "success") {
          console.log("排序成功");
          refresh();
        }
      } catch (error) {
        console.error(error);
      }
    };

    const isItemFreshing = inject("isItemFreshing");

    watch(
      () => isItemFreshing.value,
      (newVal) => {
        if (newVal) {
          store.dispatch("fetchMenuItem").then(() => {
            currentItem.value = toRaw(allItems.value[currentId.value]);
            return;
          });
          isItemFreshing.value = false;
        }
      }
    );

    //更新類別資料
    const refresh = () => {
      // console.log("fetchMenuClass");
      store.dispatch("fetchMenuClass").then(() => {
        // console.log("fresh");
        getCurrentItem("refresh");
      });
    };

    //取得當前類別
    const getCurrentItem = async (id) => {
      if (id === "refresh") {
        if (menuClasses.value.length > 0) {
          // console.log("fetchMenuItem");
          store.dispatch("fetchMenuItem").then(() => {
            currentId.value = menuClasses.value[0].id;
            currentItem.value = toRaw(allItems.value[menuClasses.value[0].id]);
            return;
          });
          return;
        } else {
          currentId.value = "";
          currentItem.value = [];
          return;
        }
      } else {
        currentId.value = id;
        // console.log("currentId", currentId.value);
        currentItem.value = toRaw(allItems.value[id]);
      }
    };

    provide("refresh", refresh);

    onMounted(() => {
      refresh();
    });

    return {
      menuClasses,
      isEditing,
      showAlert,
      name,
      currentId,
      id,
      currentMode,
      refresh,
      selectItem,
      add,
      handleDragEnd,
      editing,
    };
  },
};
</script>

<template>
  <MenuAlert v-if="showAlert" />
  <div
    class="horizontal-menu-content"
    :class="{ 'hide-scrollbar': !isEditing }"
    :style="{paddingLeft: currentMode === 'edit' ? '155px' : '20px'}"
  >
    <div class="button-content" v-if="currentMode == 'edit'">
      <div class="edit-btn" @click="editing" :class="{ editing: isEditing }">
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
          :class="{ 'current-item': currentId == menuClass.id }"
        >
          {{ menuClass.menu_class }}
          <span class="material-icons" v-if="isEditing">edit</span>
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
  background: var(--second-color);
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
  color: var(--font-color);
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
  color: var(--font-color);
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
  color: var(--font-color);
  cursor: pointer;
  margin: 0 10px;
  transition: all 0.3s ease-in-out;
  list-style-type: none;
}

li span,
.add-btn span {
  transform: translateY(-17px) translateX(19px);
  background: var(--confirm-color);
  border-radius: 100px;
  font-size: 18px;
  padding: 2px;
  margin-left: -15px;
}

.edit-btn:hover,
.add-btn:hover,
li:hover {
  background: var(--second-hover);
}

.current-item {
  background: var(--second-hover);
  color: #fff;
}

.editing {
  background: var(--confirm-color);
  transition: all 0.3s ease-in-out;
}

.editing:hover {
  background: var(--confirm-hover);
}
</style>
