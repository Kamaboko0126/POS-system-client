<script>
import { ref, watch, toRaw } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const allItems = ref(store.state.allItems);
    const currentItems = ref([]);
    const isEditing = ref(false);

    // 監控 items 的變化
    watch(
      () => store.state.allItems,
      (newVal) => {
        allItems.value = newVal;
      }
    );

    const handleDragEnd = () => {
      // 拖放操作結束，你可以在這裡保存新的順序
      const currentItems = toRaw(currentItems.value);
      console.log(currentItems);
    };

    return {
      currentItems,
      isEditing,
      handleDragEnd,
    };
  },
};
</script>

<template>
  <div class="cards-content">
    <div class="add-card"></div>
    <v-draggable
      v-model="currentItems"
      tag="ul"
      :disabled="isEditing"
      itemKey="id"
      @end="handleDragEnd"
    >
      <template #item="{ element: currentItem }">
        <li>
          {{ currentItem.name }}
          {{ currentItem.price }}
        </li>
      </template>
    </v-draggable>
  </div>
</template>

<style scoped></style>
