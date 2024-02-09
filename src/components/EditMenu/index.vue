<template>
  <section>
    <HorizontalMenu :mode="'edit'" />
    <CardModal :mode="'edit'" />
  </section>
</template>

<script>
import { ref, provide } from "vue";
import HorizontalMenu from "./HorizontalMenu.vue";
import CardModal from "./CardModal.vue";

export default {
  name: "EditMenu",
  components: {
    HorizontalMenu,
    CardModal,
  },
  setup() {
    const currentId = ref("");
    provide("currentId", currentId);

    const isClassEditing = ref(false);
    provide("isClassEditing", isClassEditing);

    const isCardEditing = ref(true);
    provide("isCardEditing", isCardEditing);

    const currentItem = ref([]);
    provide("currentItem", currentItem);

    const classNum = ref(0);
    provide("classNum", classNum);

    const isItemFreshing = ref(false);
    provide("isItemFreshing", isItemFreshing);

    return {};
  },
};
</script>

<style scoped>
section {
  width: 100%;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
}
</style>
