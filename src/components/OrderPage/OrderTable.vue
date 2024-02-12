<script>
import { inject, ref } from "vue";
import axios from "axios";

export default {
  name: "OrderTable",
  setup() {
    const orderingMethod = ref("內用");
    const payment = ref("已付款");
    const isDescount = ref(false);

    const lists = inject("lists");

    const isEditingOrder = inject("isEditingOrder");

    const currentOrder = inject("currentOrder");

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
        isDescount.value = method;
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

      try {
        const response = await axios.post(
          "http://127.0.0.1:10000/order/add",
          {
            is_discount: isDescount.value,
            lists: JSON.stringify(lists.value),
            order_id: "o" + Date.now().toString(),
            ordering_method: orderingMethod.value,
            payment: payment.value,
            phone: "09-XXXXXXXX",
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
          // payment.value = "";
        }
      } catch (error) {
        console.error(error);
      }
      // console.log(lists.value);
    };

    //編輯訂單
    const editOrder = (id, name, price, quantity, markers) => {
      isEditingOrder.value = true;
      currentOrder.value.id = id;
      currentOrder.value.name = name;
      currentOrder.value.price = price;
      currentOrder.value.quantity = quantity;
      currentOrder.value.markers = markers;
      // console.log(markers);
    };

    //刪除訂單
    const delOrder = (id) => {
      const index = lists.value.findIndex((list) => list.id === id);
      lists.value.splice(index, 1);
    };

    const check = () => {
      const testData = {
        order_id: "o" + Date.now().toString(),
        ordering_method: orderingMethod.value,
        payment: payment.value,
        is_discount: isDescount.value,
        phone: "",
        lists: lists.value,
      };
      console.log(testData);
      console.log(lists.value);
    };

    return {
      orderingMethod,
      payment,
      isDescount,
      lists,
      selectMethod,
      send,
      editOrder,
      delOrder,
      check,
    };
  },
};
</script>

<template>
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
        <p>員 工 價 ：</p>
        <div class="buttons">
          <button
            @click="selectMethod(false)"
            :class="{ current: !isDescount }"
          >
            否
          </button>
          <button @click="selectMethod(true)" :class="{ current: isDescount }">
            是
          </button>
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
            <i
              class="material-icons edit"
              @click="
                editOrder(
                  list.id,
                  list.name,
                  list.price,
                  list.quantity,
                  list.markers
                )
              "
              >edit</i
            >
            <i class="material-icons delete" @click="delOrder(list.id)"
              >delete</i
            >
          </div>
          <p class="item-name">{{ list.name }}</p>
          <p class="item-price">{{ list.price * list.quantity }}</p>
          <p class="item-quantity">{{ list.quantity }}</p>
          <div class="markers">
            <p
              class="item-marker"
              v-for="marker in list.checkedMarkers"
              :key="marker.id"
            >
              {{ marker }}
              <span>, </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <button @click="send">送出</button>
      <!-- <button @click="check">檢查</button> -->
    </div>
  </div>
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
  height: 250px;
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

.col p {
  font-size: 28px;
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
  margin: 5px 10px;
  font-size: 28px;
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
  font-size: 26px;
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
  padding: 8px 0;
  font-size: 30px;
}

.bottom button:hover {
  background: var(--second-color);
  color: var(--font-color);
}
</style>
