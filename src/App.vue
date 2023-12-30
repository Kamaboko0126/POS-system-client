<template>
  <header-item></header-item>
  <div class="content">
    <router-view />
    <menu-item :class="{ 'shadow': isShowMenu }"></menu-item>
  </div>
  <footer-item></footer-item>
</template>

<script>
import HeaderItem from "./components/HeaderItem.vue";
import FooterItem from "./components/FooterItem.vue";
import MenuItem from "./components/MenuItem.vue";
import { ref, provide } from "vue";
export default {
  name: "App",
  components: {
    HeaderItem,
    FooterItem,
    MenuItem,
  },
  setup() {
    const isShowMenu = ref(false);

    const changeMenuWidth = () => {
      console.log("click");
      if (!isShowMenu.value) {
        isShowMenu.value = true;
        document.documentElement.style.setProperty("--menu-width", "300px");
      } else {
        isShowMenu.value = false;
        document.documentElement.style.setProperty("--menu-width", "0px");
      }
    };

    provide("changeMenuWidth", changeMenuWidth);

    return {
      isShowMenu,
    };
  },
};
</script>

<style>
:root {
  --header-height: 50px;
  --menu-width: 0px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

section {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  width: 100%;
  height: calc(100vh - var(--header-height));
  display: flex;
  align-items: center;
  justify-content: center;
}

.shadow{
  box-shadow: -2px 3px 5px 0 rgba(0, 0, 0, 0.2);
}
</style>
