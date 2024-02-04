<template>
  <section>
    <div class="left">
      <HorizontalMenu />
      <CardModal />
    </div>
    <div class="right">
      <OrderTable />
    </div>
  </section>
</template>

<script>
import { ref, provide } from "vue";
import HorizontalMenu from "../OrderPage/HorizontalMenu.vue";
import CardModal from "../OrderPage/CardModal.vue";
import OrderTable from "../OrderPage/OrderTable.vue";

export default {
  name: "EditMenu",
  components: {
    HorizontalMenu,
    CardModal,
    OrderTable,
  },
  setup() {
    const currentId = ref("");
    provide("currentId", currentId);

    const currentItem = ref([]);
    provide("currentItem", currentItem);

    const classNum = ref(0);
    provide("classNum", classNum);

    const currentOrder = ref({});
    provide("currentOrder", currentOrder);

    return {};
  },
};
</script>

<style scoped>
section {
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  display: flex;
}

.left {
  width: 60%;
}

.right {
  width: 40%;
  height: 100%;
}
</style>
