<template>
  <header-item></header-item>
  <div class="content">
    <router-view></router-view>
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
  --main-color: #3D3930;
  --second-color: #59a8d9;
  --third-color: #D0D8DB;
  --warning-color: #a82e19;
  --background-color: #EEF0F4;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.shadow {
  box-shadow: -2px 3px 5px 0 rgba(0, 0, 0, 0.2);
}

a {
  text-decoration: none;
  color: black;
}
</style>
