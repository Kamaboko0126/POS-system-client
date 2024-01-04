<template>
  <div class="menu-content" :class="{ show: isMenuShow }">
    <div class="menu-items">
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

<script>
import { inject, ref } from "vue";
export default {
  name: "MenuItem",
  components: {},
  setup() {
    const menuItems = ref([
      {
        name: "編輯菜單",
        path: "/editmenu",
      },
      {
        name: "查看營收",
        path: "/revenue",
      },
      {
        name: "編輯管理者帳密",
        path: "/editadmin",
      },
      {
        name: "登出",
        path: "/logout",
      },
    ]);
    const isMenuShow = inject("isMenuShow");

    return {
      menuItems,
      isMenuShow,
    };
  },
};
</script>

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
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid #ccc;
  text-align: center;
  font-size: 20px;
  transition: background-color 0.5s ease;
  color: var(--main-color);
  font-weight: 500;
}

.menu-item:hover {
  background-color: var(--second-color);
}
</style>
