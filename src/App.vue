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
    //設定menu是否顯示
    const isMenuShow = ref(false);
    const openMenu = () => {
      isMenuShow.value = !isMenuShow.value;
    };

    /*點擊Header icon，觸發openMenu，切換isMenuShow，顯示Menu*/
    //提供openMenu給HeaderItem使用
    provide("openMenu", openMenu);
    //提供isMenuShow給MenuItem使用
    provide("isMenuShow", isMenuShow);

    return {
      isMenuShow,
    };
  },
};
</script>


<template>
  <HeaderItem />
  <div class="content">
    <router-view></router-view>
    <MenuItem />
  </div>
  <FooterItem hidden/>
</template>

<style>
:root {
  --header-height: 65px;
  --header-color: #41546a;
  --horizontal-menu-height: 95px;
  --main-color: #000;
  --second-font-color: #fff;
  --second-color: #89a1b1;
  --third-color: #d0d8db;
  --warning-color: #a82e19;
  --background-color: #89a1b1;
  --hover-color: #95abb9;
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
