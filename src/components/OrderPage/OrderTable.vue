<script>
import { inject, provide, ref } from "vue";
import axios from "axios";
import PickUpTimer from "./PickUpTimer.vue";
import HistoryList from "./HistoryItem.vue";

export default {
  name: "OrderTable",
  components: {
    PickUpTimer,
    HistoryList,
  },
  setup() {
    const payment = inject("payment");
    const isDiscount = inject("isDiscount");
    const lists = inject("lists");
    const pickUpTime = inject("pickUpTime");
    const orderingMethod = inject("orderingMethod");

    const currentOrder = inject("currentOrder");

    const showTimer = ref(false);
    provide("showTimer", showTimer);

    const isEditingOrder = inject("isEditingOrder");
    const showAlert = inject("showAlert");

    const isHistoryShow = ref(false);
    provide("isHistoryShow", isHistoryShow);

    const editingHistory = inject("editingHistory");
    const historyOrderId = inject("historyOrderId");

    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // 確保月份和日期都是兩位數
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;

    //上方選擇訂購方式、付款狀態、員工價
    const selectMethod = (method) => {
      if (method === "已付款" || method === "未付款") {
        payment.value = method;
      } else if (
        method === "電話" ||
        method === "外帶" ||
        method === "內用" ||
        method === "門口"
      ) {
        if (method === "電話") {
          console.log("電話");
        }
        orderingMethod.value = method;
      } else if (method == true || method == false) {
        isDiscount.value = method;
      }
    };

    //送出訂單
    const send = async () => {
      lists.value.forEach((item) => {
        delete item.checkedMarkers;
      });
      //訂單為null
      if (lists.value.length === 0) {
        alert("請選擇商品");
        return;
      } else if (payment.value === "") {
        alert("請選擇訂購方式");
        return;
      }
      if (!editingHistory.value) {
        try {
          const response = await axios.post(
            "http://127.0.0.1:10000/order/add",
            {
              is_discount: isDiscount.value,
              lists: JSON.stringify(lists.value),
              order_id: "o" + Date.now().toString(),
              ordering_method: orderingMethod.value,
              payment: payment.value,
              phone: "09-XXXXXXXX",
              date: "d" + year + month + day,
              pick_up_time: pickUpTime.value,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.message === "success") {
            console.log("新增成功");
            lists.value = [];
            pickUpTime.value = "";
            orderingMethod.value = "內用";
            isDiscount.value = false;
            payment.value = "";
          }
        } catch (error) {
          console.error(error);
        }
      } else if(editingHistory.value) {
        console.log("編輯歷史訂單");
        try {
          const response = await axios.put(
            "http://127.0.0.1:10000/order/edit",
            {
              history_order_id: historyOrderId.value,
              is_discount: isDiscount.value,
              lists: JSON.stringify(lists.value),
              ordering_method: orderingMethod.value,
              payment: payment.value,
              phone: "09-XXXXXXXX",
              date: "d" + year + month + day,
              pick_up_time: pickUpTime.value,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.message === "success") {
            console.log("新增成功");
            editingHistory.value = false;
            lists.value = [];
            pickUpTime.value = "";
            orderingMethod.value = "內用";
            isDiscount.value = false;
            payment.value = "";
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    //編輯訂單
    const editProduct = (list) => {
      isEditingOrder.value = true;
      currentOrder.value = list;
      showAlert.value = true;
    };

    //刪除訂單
    const delProduct = (id) => {
      const index = lists.value.findIndex((list) => list.id === id);
      lists.value.splice(index, 1);
    };

    // const check = () => {
    //   const testData = {
    //     order_id: "o" + Date.now().toString(),
    //     ordering_method: orderingMethod.value,
    //     payment: payment.value,
    //     is_discount: isDiscount.value,
    //     phone: "",
    //     lists: lists.value,
    //   };
    //   // console.log(testData);
    //   // console.log(lists.value);
    // };

    return {
      orderingMethod,
      payment,
      isDiscount,
      lists,
      selectMethod,
      send,
      editProduct,
      delProduct,
      // check,
      pickUpTime,
      showTimer,
      showAlert,
      isHistoryShow,
      editingHistory,
    };
  },
};
</script>

<template>
  <PickUpTimer />
  <div class="order-content">
    <div class="top">
      <div class="col">
        <p>訂購方式：</p>
        <div class="buttons">
          <button
            @click="selectMethod('內用')"
            :class="{ current: orderingMethod == '內用' }"
          >
            內用
          </button>
          <button
            @click="selectMethod('外帶')"
            :class="{ current: orderingMethod == '外帶' }"
          >
            外帶
          </button>
          <button
            @click="selectMethod('電話')"
            :class="{ current: orderingMethod == '電話' }"
          >
            電話
          </button>
          <button
            @click="selectMethod('門口')"
            :class="{ current: orderingMethod == '門口' }"
          >
            門口
          </button>
        </div>
      </div>
      <div class="col">
        <p>取餐時間：</p>
        <div class="buttons">
          <button
            @click="showTimer = true"
            :class="{ pickup: pickUpTime != '' }"
          >
            {{ pickUpTime == "" ? "立即" : pickUpTime }}
          </button>
        </div>
      </div>
      <div class="col">
        <p>付款狀態：</p>
        <div class="buttons">
          <button
            @click="selectMethod('已付款')"
            :class="{ current: payment == '已付款' }"
          >
            已付款
          </button>
          <button
            @click="selectMethod('未付款')"
            :class="{ current: payment == '未付款' }"
          >
            未付款
          </button>
        </div>
      </div>
      <div class="col">
        <div class="left">
          <p>員 工 價 ：</p>
          <div class="buttons">
            <button
              @click="selectMethod(false)"
              :class="{ current: !isDiscount }"
            >
              否
            </button>
            <button
              @click="selectMethod(true)"
              :class="{ current: isDiscount }"
            >
              是
            </button>
          </div>
        </div>
        <div class="right">
          <button @click="isHistoryShow = !isHistoryShow">歷史訂單</button>
        </div>
      </div>
    </div>
    <div class="middle">
      <div class="order-list">
        <div class="list-body">
          <div class="item-icon"></div>
          <p class="item-name">品名</p>
          <p class="item-price">價格</p>
          <p class="item-quantity">數量</p>
          <p class="item-marker">備註</p>
        </div>
        <div class="list-body" v-for="list in lists" :key="list.id">
          <div class="item-icon">
            <i class="material-icons edit" @click="editProduct(list)">edit</i>
            <i class="material-icons delete" @click="delProduct(list.id)"
              >delete</i
            >
          </div>
          <p class="item-name">{{ list.name }}</p>
          <p class="item-price">{{ list.price * list.quantity }}</p>
          <p class="item-quantity">{{ list.quantity }}</p>
          <div class="markers">
            <p
              class="item-marker"
              v-for="marker in list.markers.filter((marker) => marker.checked)"
              :key="marker.id"
            >
              {{ marker.value }}
              <span>, </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <button @click="send">{{ editingHistory ? "修改" : "送出" }}</button>
      <!-- <button @click="check">檢查</button> -->
    </div>
  </div>
  <HistoryList />
</template>

<style scoped>
.item-icon {
  width: 110px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 5px;
}

.item-icon i {
  font-size: 32px;
  cursor: pointer;
}

.edit {
  color: var(--confirm-color);
}

.delete {
  color: var(--cancel-color);
}

.order-content {
  width: 100%;
  height: calc(100vh - var(--header-height));
  background: var(--main-color);
  display: flex;
  align-items: start;
  justify-content: start;
  flex-direction: column;
  padding: 0 30px;
  overflow: auto;
}

.top {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  height: 285px;
  width: 100%;
  overflow: auto;
  flex-shrink: 0;
}

.middle {
  width: 100%;
  min-height: 500px;
  height: 56%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.col {
  display: flex;
  align-items: center;
  justify-content: start;
  width: 590px;
  margin-top: 8px;
  flex-shrink: 0;
}

.col:last-child {
  justify-content: space-between;
}

.col .left {
  display: flex;
  align-items: center;
  justify-content: start;
}

.col p {
  font-size: var(--main-font-size);
  color: var(--font-color);
  flex-shrink: 0;
}

.buttons {
  display: flex;
  flex-shrink: 0;
}

button {
  box-shadow: none;
  background: var(--font-color);
  color: var(--header-color);
  border: none;
  border-radius: 3px;
  position: relative;
  padding: 8px 26px;
  font-size: var(--main-font-size);
  margin: 5px 10px;
  letter-spacing: 0;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.current {
  background: var(--second-color);
  color: var(--font-color);
}

.order-list {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 4px;
  overflow: auto;
}

.list-body {
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 11px 25px 11px 0px;
}

.list-body:first-child {
  border-bottom: 1px solid rgba(153, 153, 153, 0.3);
}

.list-body p {
  font-size: var(--main-font-size);
  flex-shrink: 0;
}

.item-name {
  width: 160px;
  text-align: start;
}

.item-marker {
  text-align: start;
}

.item-price,
.item-quantity {
  width: 110px;
  text-align: center;
}

.markers {
  display: flex;
  flex-shrink: 0;
}

.markers .item-marker:last-child span {
  display: none;
}
.bottom {
  width: 100%;
}

.bottom button {
  width: 100%;
  margin: 20px 0 0 0;
  font-size: var(--main-font-size);
  padding: 8px 0;
}

.bottom button:hover {
  background: var(--second-color);
  color: var(--font-color);
}

.pickup {
  background: var(--second-color);
  color: var(--font-color);
}
</style>
