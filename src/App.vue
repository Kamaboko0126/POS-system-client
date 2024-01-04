<template>
  <header-item></header-item>
  <div class="content">
    <router-view />
    <menu-item></menu-item>
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
    const isMenuShow = ref(false);
    const openMenu = () => {
      isMenuShow.value = !isMenuShow.value;
    };

    provide("openMenu", openMenu);
    provide("isMenuShow", isMenuShow);

    return {
      isMenuShow,
    };
  },
};
</script>

<style>
:root {
  --header-height: 50px;
  --menu-width: 0px;
  --main-color:#491f0c;
  --second-color:#ffe9df;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

section {
  width: calc(100% - var(--menu-width));
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

a{
  text-decoration: none;
  color: black;
}
</style>
