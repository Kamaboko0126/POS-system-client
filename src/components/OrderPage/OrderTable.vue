<script>
import { inject, ref } from "vue";

export default {
  name: "OrderTable",
  setup() {
    const currentOrder = inject("currentOrder");
    const orderingMethod = ref("內用");
    const payment = ref("");
    const isDescount = ref("否");

    const lists = inject("lists");

    const isEditingOrder = inject("isEditingOrder");

    const editOrderId = inject("editOrderId");

    const editOrderQuantity = inject("editOrderQuantity");

    const selectMethod = (method) => {
      if (method === "已付款" || method === "未付款") {
        payment.value = method;
      } else if (method === "電話" || method === "外帶" || method === "內用" || method === "門口") {
        if (method === "電話") {
          console.log("電話");
        }
        orderingMethod.value = method;
      } else if (method === "是" || method === "否") {
        isDescount.value = method;
      }
    };

    const send = () => {
      console.log(orderingMethod.value);
      console.log(payment.value);
      console.log(isDescount.value);
      console.log(lists.value);
      const order = {
        orderingMethod: orderingMethod.value,
        payment: payment.value,
        isDescount: isDescount.value,
        lists: lists.value,
      };
      console.log(order);
      console.log(lists.value);
    };

    const editOrder = (id,quantity) => {
      isEditingOrder.value = true;
      editOrderId.value = id;
      editOrderQuantity.value = quantity;
    };

    const delOrder = (id) => {
      const index = lists.value.findIndex((list) => list.id === id);
      lists.value.splice(index, 1);
    };

    return {
      currentOrder,
      orderingMethod,
      payment,
      isDescount,
      lists,
      selectMethod,
      send,
      editOrder,
      delOrder,
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
            @click="selectMethod('否')"
            :class="{ current: isDescount == '否' }"
          >
            否
          </button>
          <button
            @click="selectMethod('是')"
            :class="{ current: isDescount == '是' }"
          >
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
            <i class="material-icons edit" @click="editOrder(list.id,list.quantity)">edit</i>
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
              v-for="marker in list.markers"
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

.buttons{
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
