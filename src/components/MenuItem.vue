<script>
import { inject, ref } from "vue";
export default {
  name: "MenuItem",
  components: {},
  setup() {
    const menuItems = ref([
      {
        name: "新增訂單",
        path: "/order",
      },
      {
        name: "查看訂單",
        path: "/orderlist",
      },
      {
        name: "編輯菜單",
        path: "/editmenu",
      },

      {
        name: "查看營收",
        path: "/revenue",
      },
      // {
      //   name: "編輯管理者帳密",
      //   path: "/editadmin",
      // },
      // {
      //   name: "登出",
      //   path: "/logout",
      // },
    ]);
    const isMenuShow = inject("isMenuShow");

    return {
      menuItems,
      isMenuShow,
    };
  },
};
</script>

<template>
  <div class="menu-content" :class="{ show: isMenuShow }">
    <div class="menu-items" @click="isMenuShow = false">
      <router-link
        v-for="(item, index) in menuItems"
        :key="index"
        :to="item.path"
        class="menu-item"
      >
        {{ item.name }}
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.menu-content {
  width: 300px;
  height: 100%;
  transition: transform 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  position: fixed;
  top: calc(var(--header-height) + 1px);
  right: 0;
  transform: translate(105%);
  box-shadow: -2px 3px 5px 0 rgba(0, 0, 0, 0.2);
  background: #fff;
}

.show {
  transform: translateX(0);
}

.menu-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.menu-item {
  width: 90%;
  padding: 20px 0;
  margin: 7px 0;
  border-radius: 5px;
  text-align: center;
  font-size: 25px;
  transition: all 0.2s ease;
  color: var(--header-color);
  /* background: var(--main-color); */
}

.menu-item:hover {
  background: #c0ddf965;
}
</style>
