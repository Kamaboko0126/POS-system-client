<script>
import { ref, toRefs, watch, toRaw, provide, inject } from "vue";
import { useStore } from "vuex";
import CardAlert from "./CardAlert.vue";
import axios from "axios";

export default {
  props: {
    mode: String,
  },
  setup(props) {
    const { mode } = toRefs(props);
    const currentMode = mode.value;
    const store = useStore();
    const allItems = ref(store.state.allItems);
    const currentItem = inject("currentItem");
    const showAlert = ref(false);
    provide("showAlert", showAlert);
    const isAdding = ref(false);
    provide("isAdding", isAdding);
    const itemName = ref("");
    provide("itemName", itemName);
    const itemId = ref("");
    provide("itemId", itemId);
    const itemPrice = ref("");
    provide("itemPrice", itemPrice);
    const arrayMarker = ref([]);
    provide("arrayMarker", arrayMarker);
    const itemNum = ref(currentItem.value.length);
    provide("itemNum", itemNum);
    const currentId = inject("currentId");

    const classNum = inject("classNum");

    // 監控 items 的變化
    watch(
      () => store.state.allItems,
      (newVal) => {
        allItems.value = newVal;
      }
    );

    //點擊card
    const selectItem = (id, name, price, marker) => {
      if (id === "add") {
        showAlert.value = true;
        isAdding.value = true;
        itemId.value = "";
        itemName.value = "";
        itemPrice.value = "";
        arrayMarker.value = [];
      } else {
        isAdding.value = false;
        itemId.value = id;
        itemPrice.value = price;
        itemName.value = name;
        // console.log(marker);
        if (marker == "") {
          arrayMarker.value = [];
        } else {
          try {
            // console.log(marker);
            // console.log(JSON.parse(marker));
            arrayMarker.value = JSON.parse(marker);
          } catch (e) {
            console.error("Invalid JSON string:", marker);
          }
        }

        showAlert.value = true;
      }
    };

    //重新排序cards
    const handleDragEnd = async () => {
      // 拖放操作結束，你可以在這裡保存新的順序
      // console.log(toRaw(currentItem.value));
      const rawItems = toRaw(currentItem.value);
      const data = [];
      for (let i = 0; i < rawItems.length; i++) {
        data.push({
          order_id: i + 1,
          id: rawItems[i].id,
        });
      }

      const jsonData = JSON.stringify(toRaw(data));
      try {
        const response = await axios.put(
          "http://127.0.0.1:10000/item/changeorder",
          {
            table_id: currentId.value,
            data: jsonData,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(response);
        if (response.data.message === "success") {
          console.log("排序成功");
        }
      } catch (error) {
        console.error(error);
      }
    };
    return {
      currentItem,
      showAlert,
      itemName,
      itemPrice,
      arrayMarker,
      itemId,
      classNum,
      currentMode,
      handleDragEnd,
      selectItem,
    };
  },
  components: { CardAlert },
};
</script>

<template>
  <CardAlert v-if="showAlert" />
  <div class="cards-content">
    <div class="card-body" v-if="classNum == 0">請先新增類別</div>
    <div
      class="card-body"
      @click="selectItem('add', '', '', '')"
      v-if="classNum != 0"
    >
      + 新增
      <i class="material-icons">edit</i>
    </div>
    <v-draggable
      v-model="currentItem"
      tag="ul"
      itemKey="id"
      @end="handleDragEnd"
    >
      <template #item="{ element: Item }">
        <div
          class="card-body"
          @click="selectItem(Item.id, Item.name, Item.price, Item.marker)"
        >
          <li>
            <p>{{ Item.name }}<i class="material-icons">edit</i></p>
            <p>{{ Item.price }}</p>
          </li>
        </div>
      </template>
    </v-draggable>
  </div>
</template>

<style scoped>
.cards-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  align-items: start;
}

ul {
  display: flex;
  flex-wrap: wrap;
}

.card-body {
  width: 300px;
  height: 135px;
  border-radius: 4px;
  font-size: 30px;
  color: #fff;
  margin: 15px;
  background: var(--second-color);
  box-shadow: 0 10px 20px -12px rgba(0, 0, 0, 0.42),
    0 3px 20px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(153, 153, 153, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.card-body:hover {
  background-color: var(--second-hover);
}

li {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  list-style-type: none;
}

i {
  transform: translateY(-13px) translateX(23px);
  background: var(--confirm-color);
  border-radius: 100px;
  font-size: 20px;
  padding: 2px;
  margin-left: -15px;
}

.editing {
  background: var(--confirm-color);
  transition: all 0.3s ease-in-out;
}

.editing:hover {
  background: var(--confirm-hover);
}
</style>
