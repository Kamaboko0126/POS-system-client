<template>
  <section>
    <div class="horizontal-menu-content">
      <div class="horizontal-menu" v-for="(item, index) in items" :key="index">
        <div class="menu-item" @click="selectItem(item.name)">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="card-content">
      <div class="card" v-for="(card, index) in cards" :key="index" @click="selectCard(card.name)">
        <div>
          <p>品名：{{ card.name }}</p>
          <p>價格：{{ card.price }}</p>
        </div>
      </div>
    </div>
    <h1 v-if="isLogin == 'false'">請先登入</h1>
  </section>
</template>

<script>
import { ref } from "vue";

export default {
  name: "OderPage",
  components: {},
  setup() {
    const isLogin = sessionStorage.getItem("isLogin");
    const items = ref([
      {
        name: "第一項",
      },
      {
        name: "第二項",
      },
      {
        name: "第三項",
      },
      {
        name: "第四項",
      },
      {
        name: "第五項",
      },
      {
        name: "第六項",
      },
      {
        name: "第七項",
      },
      {
        name: "第八項",
      },
      {
        name: "第九項",
      },
    ]);
    const cards = ref([
      {
        name: "第一項",
        price: 100,
      },
      {
        name: "第二項",
        price: 100,
      },
      {
        name: "第三項",
        price: 100,
      },
      {
        name: "第四項",
        price: 100,
      },
      {
        name: "第五項",
        price: 100,
      },
      {
        name: "第六項",
        price: 100,
      },
      {
        name: "第七項",
        price: 100,
      },
      {
        name: "第八項",
        price: 100,
      },
      {
        name: "第九項",
        price: 100,
      },
      {
        name: "第九項",
        price: 100,
      },
      {
        name: "第九項",
        price: 100,
      },
    ]);

    const selectItem = (name) => {
      console.log(name);
    };

    const selectCard = (name) => {
      console.log(name);
    };

    return {
      isLogin,
      items,
      selectItem,
      selectCard,
      cards,
    };
  },
};
</script>

<style scoped>
.horizontal-menu-content {
  position: sticky;
  top: 0;
  width: 100%;
  height: 70px;
  background: #f8d1bf;
  display: flex;
  overflow: auto;
}

.horizontal-menu {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 10px 25px;
  margin: 0 10px;
  border-radius: 15px;
  font-size: 20px;
  font-weight: bold;
  color: var(--main-color);
  cursor: pointer;
}

section {
  width: 100%;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
}
.card-content {
  width: calc(100% - 20px);
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.card {
  width: 20%;
  height: 20vw;
  background: #fff;
  margin: 2.5%;
  border-radius: 15px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
}
.card p {
  font-size: 20px;
  font-weight: bold;
  margin: 0 10px;
  line-height: 200%;
}
</style>
