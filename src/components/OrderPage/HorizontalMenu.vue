<script>
import { ref, watch, toRaw, inject, onMounted } from "vue";
import { useStore } from "vuex";
export default {
  components: {},
  setup() {
    const store = useStore();
    const allItems = ref(store.state.allItems);
    const currentId = ref("");
    const currentItem = inject("currentItem");

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

    //選取類別
    const selectItem = (itemId) => {
      getCurrentItem(itemId);
    };

    //更新類別資料
    const refresh = () => {
      store.dispatch("fetchMenuClass").then(() => {
        getCurrentItem("refresh");
      });
    };

    //取得當前類別
    const getCurrentItem = async (id) => {
      if (id === "refresh") {
        if (menuClasses.value.length > 0) {
          store.dispatch("fetchMenuItem").then(() => {
            currentId.value = menuClasses.value[0].id;
            currentItem.value = toRaw(allItems.value[menuClasses.value[0].id]);
            return;
          });
        }
      } else {
        currentId.value = id;
        currentItem.value = toRaw(allItems.value[id]);
      }
    };

    onMounted(() => {
      refresh();
    });

    return {
      menuClasses,
      currentId,
      refresh,
      selectItem,
    };
  },
};
</script>

<template>
  <div
    class="horizontal-menu-content"
  >
    <v-draggable
      v-model="menuClasses"
      tag="ul"
      itemKey="id"
      :disabled="true"
    >
      <template #item="{ element: menuClass }">
        <li
          @click="selectItem(menuClass.id)"
          class="horizontal-menu"
          :class="{ 'current-item': currentId == menuClass.id }"
        >
          {{ menuClass.menu_class }}
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
  display: flex;
  overflow: auto;
  overflow-y: hidden;
  background: var(--main-color);
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
  padding: 0px 20px;
  height: var(--horizontal-menu-height);
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.horizontal-menu-content::-webkit-scrollbar {
  width: 0;
  height: 0;
}


.horizontal-menu {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}


ul {
  align-items: center;
  display: flex;
  list-style-type: none;
}

li {
  background: var(--main-color);
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

.current-item {
  background: var(--main-hover);
  color: #fff;
}

</style>
