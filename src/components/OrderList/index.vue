<script>
import { ref, onMounted, onUnmounted, provide } from "vue";
import axios from "axios";
import HistoryItem from "./HistoryItem.vue";

export default {
  name: "OrderList",
  components: {
    HistoryItem,
  },
  setup() {
    const socket = ref(null);
    const message = ref("");
    const arrayOrder = ref([]);
    const isHistoryShow = ref(false);
    provide("isHistoryShow", isHistoryShow);
    const historyList = ref();
    provide("historyList", historyList);

    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    const today = "d" + year + month + day;

    onMounted(() => {
      getOrderData();
      socket.value = new WebSocket("ws://127.0.0.1:10000/ws");
      socket.value.addEventListener("message", (event) => {
        message.value = event.data;
        if (message.value === "Order Status Changed") {
          console.log("Order Status Changed");
          getOrderData();
          // getHistoryOrder();
        }
      });
      // getHistoryOrder();
    });

    onUnmounted(() => {
      if (socket.value) {
        socket.value.close();
      }
    });

    const getOrderData = async () => {
      // console.log("get data");
      const response = await axios.get(
        `http://127.0.0.1:10000/orderlist/get/${today}`
      );
      console.log(response.data);
      for (let i = 0; i < response.data.length; i++) {
        response.data[i].lists = response.data[i].lists
          ? JSON.parse(response.data[i].lists)
          : [];
      }
      arrayOrder.value = response.data;
      getHistoryOrder();
    };

    provide("getOrderData", getOrderData);

    const finished = async (id) => {
      console.log(id);
      try {
        const response = await axios.put(
          `http://127.0.0.1:10000/orderlist/finish/${id}`
        );
        // console.log(response)
        if (response.data.message === "success") {
          // console.log("success");
          getOrderData();
        }
      } catch (error) {
        console.error(error);
      }
    };

    const getHistoryOrder = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:10000/orderlist/history/${today}`
        );
        console.log(response.data);
        historyList.value = response.data.map((item) => ({
          ...item,
          lists: JSON.parse(item.lists).map((listItem) => ({
            ...listItem,
            // markers: JSON.parse(listItem.markers),
          })),
        }));
        console.log(historyList.value);
      } catch (error) {
        console.error(error);
      }
    };

    return {
      arrayOrder,
      isHistoryShow,
      historyList,
      finished,
    };
  },
};
</script>

<template>
  <div class="history">
    <i class="material-icons" @click="isHistoryShow = !isHistoryShow"
      >history</i
    >
  </div>
  <HistoryItem />
  <div class="cards">
    <v-draggable v-model="arrayOrder" tag="ul" :disabled="false" itemKey="id">
      <template #item="{ element: order }">
        <div class="card" v-if="!order.is_finished">
          <div class="card-top">
            <div class="number">{{ order.index_id + " 號" }}</div>
            <i class="material-icons" @click="finished(order.order_id)"
              >close</i
            >
          </div>
          <div class="infos">
            <!-- <h3>{{ order.is_discount ? "員工價：是" : "員工價：否" }}</h3> -->
            <h3>{{ "取餐方式：" + order.ordering_method }}</h3>
            <h3>{{ "點餐時間：" + order.order_time }}</h3>
            <h3>
              {{
                "取餐時間：" +
                (order.pick_up_time == "" ? "立即" : order.pick_up_time)
              }}
            </h3>
            <!-- <h3>{{ "付款狀態：" + order.payment }}</h3> -->
            <!-- <h3>{{ order.phone == "09-XXXXXXXX" ? "" : order.phone }}</h3> -->
            <!-- <h3>{{ order.is_finished ? "結單狀態：是" : "結單狀態：否" }}</h3> -->
          </div>

          <div class="products">
            <v-draggable
              v-model="order.lists"
              tag="ul"
              :disabled="false"
              itemKey="id"
            >
              <template #item="{ element: list }">
                <div class="list">
                  <div class="product">
                    <div>{{ list.name }}</div>
                    <div>{{ list.quantity }}</div>
                  </div>

                  <div class="markers">
                    <div
                      v-for="marker in list.markers.filter(
                        (marker) => marker.checked
                      )"
                      :key="marker.id"
                      class="marker"
                    >
                      {{ marker.value }},
                    </div>
                  </div>
                </div>
              </template>
            </v-draggable>
          </div>
        </div>
      </template>
    </v-draggable>
  </div>
</template>

<style scoped>
.cards {
  height: calc(100vh - var(--header-height));
  width: 100%;
  padding: 10px 20px;
  display: flex;
  align-items: start;
  justify-content: start;
  flex-wrap: wrap;
  overflow: auto;
}

.cards ul {
  display: flex;
  flex-wrap: wrap;
}

.card {
  width: 300px;
  background: #fff;
  box-shadow: 0 10px 20px -12px rgba(0, 0, 0, 0.42),
    0 3px 20px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(153, 153, 153, 0.3);
  margin: 15px;
}

.card-top {
  border-radius: 4px 4px 0 0;
  background: var(--header-color);
  color: #ffffff;
  padding: 10px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-top i {
  font-size: 30px;
  padding: 1.5px;
  cursor: pointer;
  background: var(--cancel-color);
  border-radius: 50px;
}

.number {
  font-size: 23px;
}

.infos {
  padding: 5px 15px;
  border-bottom: 1px solid var(--header-color);
}

.products {
  padding: 5px 15px;
  width: 100%;
}

/* lists */
.products ul {
  flex-wrap: nowrap;
  flex-direction: column;
  padding-bottom: 10px;
}

.list {
  display: flex;
  flex-direction: column;
  padding: 7px 10px 7px 0;
  font-size: 28px;
  /* cursor: pointer; */
}

.product {
  display: flex;
  justify-content: space-between;
  font-size: 25px;
}

.markers {
  width: 100%;
  display: flex;
}

.marker {
  font-size: 20px;
  margin: 0 7px 0 0;
  padding: 0;
}

.history i {
  position: fixed;
  right: 30px;
  top: calc(var(--header-height) + 30px);
  font-size: 50px;
  background: var(--header-color);
  color: #ffffff;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  border-radius: 50%;
  padding: 5px;
}
</style>
