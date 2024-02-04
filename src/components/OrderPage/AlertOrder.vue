<script>
import { inject, watch } from "vue";
export default {
  name: "AlertOrder",
  setup() {
    const showAlert = inject("showAlert");
    const currentOrder = inject("currentOrder");
    const arrayMarker = inject("arrayMarker");

    watch(
      () => currentOrder,
      (newVal) => {
        console.log(newVal);
      }
    );

    return {
      showAlert,
      currentOrder,
      arrayMarker,
    };
  },
};
</script>

<template>
  <div class="body" v-if="showAlert">
    <div class="content">
      <div class="close-content">
        <i class="material-icons" @click="showAlert = !showAlert">close</i>
      </div>
      <h1>品名：{{ currentOrder.name }}</h1>
      <h1>價格：{{ currentOrder.price }}</h1>
      <h1>數量：</h1>
      <h1>
        備註：
        <p v-for="marker in arrayMarker" :key="marker.id">{{ marker.value }}</p>
      </h1>
    </div>
  </div>
</template>

<style scoped>
.body {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background: #00000029;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  max-height: 90%;
  overflow: auto;
  width: 500px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  box-shadow: 0 10px 20px -12px rgba(0, 0, 0, 0.42),
    0 3px 20px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(153, 153, 153, 0.3);
  border-radius: 6px;
  padding: 30px 40px;
}

h1 {
  font-size: 30px;
}
h1:not(:first-child) {
  margin-top: 20px;
}

.close-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: -50px;
}

i {
  font-size: 40px;
  cursor: pointer;
}
</style>
