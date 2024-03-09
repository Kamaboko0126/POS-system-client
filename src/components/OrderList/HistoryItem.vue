<script>
import { inject } from "vue";
import axios from "axios";

export default {
  name: "HistoryItem",
  setup() {
    const isHistoryShow = inject("isHistoryShow");
    const historyList = inject("historyList");
    const getOrderData = inject("getOrderData");

    const unfinished = async (id) => {
      console.log(id);
      try {
        const response = await axios.put(
          `http://127.0.0.1:10000/orderlist/unfinish/${id}`
        );
        if (response.data.message === "success") {
          getOrderData();
        }
      } catch (error) {
        console.error(error);
      }
    };

    return {
      isHistoryShow,
      historyList,
      unfinished,
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
        <div
          class="history-list"
          v-for="data in historyList
            ? historyList.filter((item) => item.is_finished != 0)
            : []"
          :key="data.id"
        >
          <div class="title">
            <p>單號：{{ data.index_id }}</p>
            <i class="material-icons" @click="unfinished(data.order_id)"
              >replay</i
            >
          </div>
          <!-- <p>{{ data.payment }}</p> -->
          <p>取餐方式：{{ data.ordering_method }}</p>
          <p>點餐時間：{{ data.order_time }}</p>
          <!-- <p>訂單：{{ data.is_finished == 0 ? "尚未完成" : "已完成" }}</p> -->
          <!-- <p>{{ data.lists }}</p> -->
          <div class="products">
            <div v-for="list in data.lists" :key="list.id">
              <!-- <p>{{ list.id }}</p> -->
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
  color: #fff;
  background: var(--main-color);
  box-shadow: 0 10px 20px -12px rgba(0, 0, 0, 0.42),
    0 3px 20px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(153, 153, 153, 0.3);
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
