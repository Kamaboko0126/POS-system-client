<script>
import { inject, watch, computed, ref } from "vue";
export default {
  name: "AlertOrder",
  setup() {
    const showAlert = inject("showAlert");
    const currentOrder = inject("currentOrder");
    const quantity = ref(1);
    const lists = inject("lists");
    const isEditingOrder = inject("isEditingOrder");
    // const editOrderId = inject("editOrderId");
    const arrayMarker = ref([]);

    const checkedMarkers = computed(() => {
      return arrayMarker.value.filter((marker) => marker.checked);
    });

    watch(
      () => currentOrder.value,
      () => {
        quantity.value = currentOrder.quantity ? currentOrder.quantity : 1;
        // console.log(currentOrder.value);
        arrayMarker.value = currentOrder.value.markers
          ? JSON.parse(currentOrder.value.markers)
          : [];
      }
    );

    watch(
      () => isEditingOrder.value,
      (newVal) => {
        if (newVal) {
          showAlert.value = true;
          quantity.value = currentOrder.value.quantity;
          arrayMarker.value = currentOrder.value.markers
            ? JSON.parse(currentOrder.value.markers)
            : [];
        }
      }
    );

    const close = () => {
      showAlert.value = false;
      if (isEditingOrder.value) {
        isEditingOrder.value = false;
        // console.log(lists.value);
      }
    };

    //送出
    const send = () => {
      //新訂單
      if (!isEditingOrder.value) {
        const checkedData = [];
        for (let i = 0; i < checkedMarkers.value.length; i++) {
          checkedData.push(checkedMarkers.value[i].value);
        }

        const listData = {
          id: "l" + Date.now().toString(),
          name: currentOrder.value.name,
          price: currentOrder.value.price,
          quantity: quantity.value,
          markers: JSON.stringify(arrayMarker.value),
          checkedMarkers: checkedData,
        };

        //尋找lists中是否有相同名稱&&marker的品項
        const existingItem = lists.value.find(
          (item) =>
            item.name === listData.name &&
            JSON.stringify(item.checkedMarkers) === 
              JSON.stringify(listData.checkedMarkers)
        );

        //若有則數量增加
        if (existingItem) {
          existingItem.quantity += listData.quantity;
          //沒有就新增
        } else {
          lists.value.push(listData);
        }

        showAlert.value = false;
      } else {
        //編輯原有訂單
        const itemToEdit = lists.value.find(
          (item) => item.id === currentOrder.value.id
        );
        if (itemToEdit) {
          itemToEdit.quantity = quantity.value;
          const checked_markers = [];
          for (let i = 0; i < checkedMarkers.value.length; i++) {
            checked_markers.push(checkedMarkers.value[i].value);
          }
          itemToEdit.checkedMarkers = checked_markers;
          itemToEdit.markers = JSON.stringify(arrayMarker.value);
          showAlert.value = false;
          isEditingOrder.value = false;
        } else {
          console.log("找不到要編輯的項目");
        }
      }
    };

    return {
      showAlert,
      currentOrder,
      arrayMarker,
      checkedMarkers,
      quantity,
      send,
      close,
    };
  },
};
</script>

<template>
  <div class="body" v-if="showAlert">
    <div class="content">
      <div class="close-content">
        <i class="material-icons" @click="close">close</i>
      </div>
      <h1>品名：{{ currentOrder.name }}</h1>
      <h1>價格：{{ currentOrder.price }}</h1>
      <h1 class="quantity">
        數量：<i class="material-icons" @click="quantity > 1 ? quantity-- : 1"
          >indeterminate_check_box</i
        >{{ quantity }}<i class="material-icons" @click="quantity++">add_box</i>
      </h1>
      <div>
        <h1>備註：</h1>
        <div v-for="marker in arrayMarker" :key="marker.id">
          <div class="marker-list" @click="marker.checked = !marker.checked">
            <i
              class="material-icons"
              v-text="marker.checked ? 'check_box' : 'check_box_outline_blank'"
            ></i>
            <h1>{{ marker.value }}</h1>
          </div>
        </div>
      </div>
      <button @click="send">送出</button>
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
  width: 600px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  box-shadow: 0 10px 20px -12px rgba(0, 0, 0, 0.42),
    0 3px 20px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(153, 153, 153, 0.3);
  border-radius: 6px;
  padding: 30px 90px 50px 90px;
}

h1 {
  font-size: 30px;
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.close-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: -50px;
}

i {
  font-size: 50px;
  cursor: pointer;
}

.quantity i {
  margin: 0 15px;
}

.marker-list i {
  margin-right: 20px;
}

.marker-list {
  display: flex;
  align-items: center;
  justify-content: start;
  cursor: pointer;
  padding: 10px 0;
}

button {
  box-shadow: none;
  width: 100%;
  background: var(--confirm-color);
  color: var(--font-color);
  border: none;
  border-radius: 3px;
  position: relative;
  padding: 10px 0;
  font-size: 30px;
  letter-spacing: 0;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  margin-top: 30px;
}

button:hover {
  background: var(--confirm-hover);
}
</style>
