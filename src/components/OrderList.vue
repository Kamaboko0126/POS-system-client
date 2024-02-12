<script>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const socket = ref(null);
    const message = ref("");
    const arrayOrder = ref([]);

    onMounted(() => {
      getOrderData();
      socket.value = new WebSocket("ws://127.0.0.1:10000/ws");
      socket.value.addEventListener("message", (event) => {
        message.value = event.data;
        if (message.value === "Order added") {
          console.log("Order added");
          getOrderData();
        }
      });
    });

    onUnmounted(() => {
      if (socket.value) {
        socket.value.close();
      }
    });

    const getOrderData = async () => {
      console.log("get data");
      let date = new Date();
      let day = String(date.getDate()).padStart(2, "0");
      let month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
      let year = date.getFullYear();

      let today = "d" + year + month + day;
      const response = await axios.get(
        `http://127.0.0.1:10000/orderlist/get/${today}`
      );
      console.log(response.data);
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

    return {
      arrayOrder,
    };
  },
};
</script>

<template>
  <div class="cards">
    <div class="card" v-for="order in arrayOrder" :key="order.id">
      <h3>{{ "訂單編號：" + order.index_id }}</h3>
      <h3>{{ order.is_discount ? "員工價：是" : "員工價：否" }}</h3>
      <h3>{{ "訂購方式：" + order.ordering_method }}</h3>
      <h3>{{ "訂購時間：none" }}</h3>
      <h3>{{ "付款狀態：" + order.payment }}</h3>
      <h3>{{ order.phone == "09-XXXXXXXX" ? "" : order.phone }}</h3>
      <h3>{{ order.is_finished ? "結單狀態：是" : "結單狀態：否" }}</h3>
      <div v-for="list in order.lists" :key="list.id">
        <h2><span>{{ list.name }}</span><span>{{ list.quantity }}</span></h2>
        <h3>
          <span v-for="marker in list.markers.filter(marker => marker.checked)" :key="marker.id">
            {{ marker.value }}<span>,</span>
          </span>
        </h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .cards{
    display: flex;
    flex-wrap: wrap;
  }
</style>
