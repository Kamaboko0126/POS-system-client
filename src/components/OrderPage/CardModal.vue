<script>
import { ref, watch, inject } from "vue";
import { useStore } from "vuex";
import AlertOrder from "../OrderPage/AlertOrder.vue";

export default {
  name: "CardModal",
  components: {
    AlertOrder,
  },
  setup() {
    const store = useStore();
    const allItems = ref(store.state.allItems);
    const currentItem = inject("currentItem");
    const showAlert = inject('showAlert');
    const classNum = inject("classNum");
    const currentOrder = inject("currentOrder");

    // 監控 items 的變化
    watch(
      () => store.state.allItems,
      (newVal) => {
        allItems.value = newVal;
      }
    );
    //點擊card
    const selectItem = (id, name, price, markers) => {
      showAlert.value = true;
      currentOrder.value = { id, name, price, markers };
    };

    return {
      currentItem,
      classNum,
      selectItem,
    };
  },
};
</script>

<template>
  <AlertOrder />
  <div class="cards-content">
    <div class="card-body" v-if="classNum == 0">請先前往編輯頁面</div>
    <div class="card-body" v-if="classNum != 0 && currentItem.length == 0">
      無
    </div>

    <v-draggable v-model="currentItem" tag="ul" :disabled="true" itemKey="id">
      <template #item="{ element: Item }">
        <div
          class="card-body"
          @click="selectItem(Item.id, Item.name, Item.price, Item.marker)"
        >
          <li>
            <p>{{ Item.name }}</p>
            <p>{{ Item.price }}</p>
          </li>
        </div>
      </template>
    </v-draggable>
  </div>
</template>

<style scoped>
.cards-content {
  height: calc(100vh - var(--header-height) - var(--horizontal-menu-height));
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  align-items: start;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.card-content::-webkit-scrollbar {
  width: 0;
  height: 0;
}

ul {
  display: flex;
  flex-wrap: wrap;
}

.card-body {
  width: 300px;
  height: 135px;
  border-radius: 4px;
  font-size: 30px;
  color: #fff;
  margin: 15px;
  background: var(--main-color);
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
  background-color: var(--main-hover);
}

li {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  list-style-type: none;
}
</style>
