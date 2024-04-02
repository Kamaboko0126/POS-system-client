<script>
import { inject, ref, onMounted, watch } from "vue";
import axios from "axios";

export default {
  name: "HistoryItem",
  setup() {
    const backendUrl = inject("backendUrl");

    const socket = ref(null);
    const message = ref("");
    const lists = inject("lists");
    const editingHistory = inject("editingHistory");

    const isHistoryShow = inject("isHistoryShow");
    const historyList = ref();

    const historyOrderId = inject("historyOrderId");

    const isDiscount = inject("isDiscount");
    const payment = inject("payment");
    const orderingMethod = inject("orderingMethod");
    const pickUpTime = inject("pickUpTime");

    const systemDate = inject("systemDate");

    const closedTimePicker = inject("closedTimePicker");

    watch(closedTimePicker, () => {
      if (closedTimePicker.value === true) {
        getHistoryOrder();
        closedTimePicker.value = false;
        console.log("closedTimePick is true");
      } else {
        console.log("closedTimePick is false");
      }
    });

    const editHistoryData = (data) => {
      lists.value = JSON.parse(JSON.stringify(data.lists));
      isHistoryShow.value = false;
      editingHistory.value = true;
      historyOrderId.value = data.order_id;
      isDiscount.value = data.is_discount;
      payment.value = data.payment;
      orderingMethod.value = data.ordering_method;
      pickUpTime.value = data.pick_up_time;
    };

    const getHistoryOrder = async () => {
      historyList.value = [];
      try {
        const response = await axios.get(
          backendUrl +
            `/orderlist/history/${
              "d" +
              new Intl.DateTimeFormat("zh-TW", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
                .format(new Date(systemDate.value))
                .replace(/\//g, "")
            }`
        );
        historyList.value = response.data.map((item) => ({
          ...item,
          lists: JSON.parse(item.lists).map((listItem) => ({
            ...listItem,
          })),
        }));

      } catch (error) {
        console.error(error);
      }
    };

    onMounted(() => {
      getHistoryOrder();
      socket.value = new WebSocket("ws://127.0.0.1:10000/ws");
      socket.value.addEventListener("message", (event) => {
        message.value = event.data;
        if (message.value === "Order Status Changed") {
          getHistoryOrder();
        }
      });
    });

    return {
      isHistoryShow,
      historyList,
      editHistoryData,
    };
  },
};
</script>

<template>
  <div class="body" v-if="isHistoryShow">
    <div class="content">
      <div class="close-content">
        <i class="material-icons" @click="isHistoryShow = !isHistoryShow"
          >close</i
        >
      </div>
      <div class="history-lists">
        <div class="history-list" v-for="data in historyList" :key="data.id">
          <div class="title">
            <p>單號：{{ data.index_id }}</p>
            <i class="material-icons" @click="editHistoryData(data)">edit</i>
          </div>
          <p>取餐方式：{{ data.ordering_method }}</p>
          <p>點餐時間：{{ data.order_time }}</p>
          <p>訂單：{{ data.is_finished == 0 ? "尚未完成" : "已完成" }}</p>
          <p>付款狀態：{{ data.payment }}</p>
          <p>
            {{
              data.pick_up_time == ""
                ? ""
                : "預定取餐時間：" + data.pick_up_time
            }}
          </p>
          <p>
            {{ data.phone == "09-XXXXXXXX" ? "" : "訂餐電話：" + data.phone }}
          </p>
          <p>{{ data.is_discount == 0 ? "" : "*員工價" }}</p>
          <div class="products">
            <div v-for="list in data.lists" :key="list.id">
              <p>
                {{ list.name + " " + list.quantity + "份 " }}
              </p>
              <div class="history-markers">
                <span
                  v-for="marker in list.markers.filter(
                    (marker) => marker.checked
                  )"
                  :key="marker.id"
                >
                  {{ marker.value }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  align-items: flex-start;
  justify-content: center;
}

.content {
  max-height: 90%;
  margin-top: calc(var(--header-height) + 20px);
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
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.history-lists {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
}

.history-list {
  border-radius: 4px;
  width: 100%;
  padding: 15px 30px;
  margin: 15px 0;
  font-size: var(--main-font-size);
  color: #232323;
  box-shadow: 0 10px 20px -12px rgba(0, 0, 0, 0.42),
    0 3px 20px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(153, 153, 153, 0.3);
  display: flex;
  flex-direction: column;
}

.products {
  border-top: #fff 2px solid;
  margin-top: 8px;
  padding-top: 5px;
}

.close-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /* margin-bottom: -50px; */
}

.close-content i {
  position: relative;
  font-size: 50px;
  cursor: pointer;
}

.title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title i {
  cursor: pointer;
  font-size: calc(var(--main-font-size) + 10px);
}

.history-markers {
  font-size: calc(var(--main-font-size) - 5px);
}

.history-markers span:not(:last-child)::after {
  content: ", ";
}
</style>
