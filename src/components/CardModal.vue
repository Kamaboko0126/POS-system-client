<script>
import { ref, watch, toRaw, provide, inject } from "vue";
import { useStore } from "vuex";
import CardAlert from "./CardAlert.vue";
export default {
  setup() {
    const store = useStore();
    const allItems = ref(store.state.allItems);
    const currentItem = inject('currentItem');
    const isEditing = inject("isCardEditing");
    const isClassEditing = inject("isClassEditing");
    const showAlert = ref(false);
    provide("showAlert", showAlert);
    provide("isCardEditing", isEditing);
    // 監控 items 的變化
    watch(
      () => store.state.allItems,
      (newVal) => {
        allItems.value = newVal;
      }
    );

    const editing = () => {
      if (isEditing.value) {
        isEditing.value = false;
      } else {
        isEditing.value = true;
        isClassEditing.value = false;
      }
    };
    const handleDragEnd = () => {
      // 拖放操作結束，你可以在這裡保存新的順序
      const currentItem = toRaw(currentItem.value);
    };
    return {
      currentItem,
      isEditing,
      showAlert,
      handleDragEnd,
      editing,
    };
  },
  components: { CardAlert },
};
</script>

<template>
  <CardAlert v-if="showAlert"/>
  <div class="cards-content">
    <div class="card-body" @click="editing" :class="{ editing: isEditing }">
      編輯
    </div>
    <div class="card-body" v-if="isEditing" @click="showAlert = true">+ 新增</div>
    <v-draggable
      v-model="currentItem"
      tag="ul"
      :disabled="isEditing"
      itemKey="id"
      @end="handleDragEnd"
    >
      <template #item="{ element: Item }">
        <div class="card-body">
          <li>
            {{ Item.name }}
            {{ Item.price }}
          </li>
        </div>
      </template>
    </v-draggable>
  </div>
</template>

<style scoped>
.cards-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.card-body {
  width: 300px;
  height: 135px;
  border-radius: 4px;
  font-size: 30px;
  color: #fff;
  margin: 15px;
  background: var(--second-color);
  box-shadow: 0 10px 20px -12px rgba(0, 0, 0, 0.42),
    0 3px 20px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(153, 153, 153, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.card-body:hover {
  background-color: #95abb9;
}

.editing {
  background: #5eab6d;
  transition: all 0.3s ease-in-out;
}

.editing:hover {
  background: #69bb7a;
}
</style>
