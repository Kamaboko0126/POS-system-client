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
import { ref, provide, watch } from "vue";
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
    //for AlertOrder, CardModal, OrderTable
    const showAlert = ref(false);
    provide("showAlert", showAlert);

    //for OrderTable, AlertOrder
    const isEditingOrder = ref(false);
    provide("isEditingOrder", isEditingOrder);

    //for HorziontalMenu, CardModal
    const currentItem = ref([]);
    provide("currentItem", currentItem);

    //for HorziontalMenu, CardModal
    const classNum = ref(0);
    provide("classNum", classNum);

    //for CardModal, AlertOrder
    const currentOrder = ref({});
    provide("currentOrder", currentOrder);

    //for OrderTable, AlertOrder
    const lists = ref([]);
    provide("lists", lists);

    const editingHistory = ref(false);
    provide("editingHistory", editingHistory);

    const historyOrderId = ref("");
    provide("historyOrderId", historyOrderId);

    const payment = ref("");
    provide("payment", payment);

    const isDiscount = ref(false);
    provide("isDiscount", isDiscount);

    const pickUpTime = ref("");
    provide("pickUpTime", pickUpTime);

    const orderingMethod = ref("內用");
    provide("orderingMethod", orderingMethod);

    // const phone = ref("09-XXXX-XXXX");
    // provide("phone", phone);

    watch(
      () => lists.value,
      (newVal) => {
        console.log(newVal);
      }
    );

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
