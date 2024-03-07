<script>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const socket = ref(null);
    const message = ref("");
    const arrayOrder = ref([]);
    const isHistoryShow = ref(false);
    const historyList = ref();

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
        if (message.value === "Order added") {
          console.log("Order added");
          getOrderData();
          getHistoryOrder();
        }
      });
      getHistoryOrder();
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
      // console.log(response.data);
      for (let i = 0; i < response.data.length; i++) {
        response.data[i].lists = response.data[i].lists
          ? JSON.parse(response.data[i].lists)
          : [];
        for (let j = 0; j < response.data[i].lists.length; j++) {
          response.data[i].lists[j].markers = response.data[i].lists[j].markers
            ? JSON.parse(response.data[i].lists[j].markers)
            : [];
        }
      }
      arrayOrder.value = response.data;
    };

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
        historyList.value = response.data;
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
  <div class="body" v-if="isHistoryShow">
    <div class="content">
      <div class="close-content">
        <i class="material-icons" @click="isHistoryShow = !isHistoryShow"
          >close</i
        >
      </div>
      <div class="history-lists">
        <div class="history-list" v-for="data in historyList" :key="data.id">
          <div>
            <h2>訂單編號：{{ data.index_id }}</h2>
            <p>點餐時間：{{ data.order_time }}</p>
            <p>訂單：{{ data.is_finished == 0 ? "尚未完成" : "已完成" }}</p>
            <p>取餐方式：{{ data.ordering_method }}</p>
            <p>{{ data.payment }}</p>
            <!-- <p>{{ data.lists }}</p> -->
            <div v-for="list in data.lists" :key="list.id">
              <p>{{ list.id }}</p>
              <p>{{ list.name }}</p>
              <p>{{ list.pirce }}</p>
              <p>{{ list.quantity }}</p>
            </div>
            <!-- <p>{{ data.order_id }}</p> -->
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
          </div>
        </div>
      </div>
    </div>
  </div>
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
            <h3>{{ "訂購方式：" + order.ordering_method }}</h3>
            <h3>{{ "訂購時間：" + order.order_time }}</h3>
            <h3>
              {{
                "取餐時間：" +
                (order.pick_up_time == "" ? "無" : order.pick_up_time)
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
    <!-- <div class="card" v-for="order in arrayOrder" :key="order.id">
      <h3>{{ "訂單編號：" + order.index_id }}</h3>
      <h3>{{ order.is_discount ? "員工價：是" : "員工價：否" }}</h3>
      <h3>{{ "訂購方式：" + order.ordering_method }}</h3>
      <h3>{{ "訂購時間：none" }}</h3>
      <h3>{{ "付款狀態：" + order.payment }}</h3>
      <h3>{{ order.phone == "09-XXXXXXXX" ? "" : order.phone }}</h3>
      <h3>{{ order.is_finished ? "結單狀態：是" : "結單狀態：否" }}</h3>
      <div v-for="list in order.lists" :key="list.id">
        <h2>
          <span>{{ list.name }}</span
          ><span>{{ list.quantity }}</span>
        </h2>
        <h3>
          <span
            v-for="marker in list.markers.filter((marker) => marker.checked)"
            :key="marker.id"
          >
            {{ marker.value }}<span>,</span>
          </span>
        </h3>
      </div>
    </div> -->
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
  /* height: 300px; */
  background: #fff;
  box-shadow: 0 10px 20px -12px rgba(0, 0, 0, 0.42),
    0 3px 20px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(153, 153, 153, 0.3);
  margin: 15px;
  /* cursor: pointer; */
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

.close-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: -50px;
}

.close-content i {
  font-size: 50px;
  cursor: pointer;
}
</style>
