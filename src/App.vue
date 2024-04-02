<script>
import HeaderItem from "./components/HeaderItem.vue";
// import FooterItem from "./components/FooterItem.vue";
import MenuItem from "./components/MenuItem.vue";
import { ref, provide } from "vue";
export default {
  name: "App",
  components: {
    HeaderItem,
    // FooterItem,
    MenuItem,
  },
  setup() {
    //設定menu是否顯示
    const isMenuShow = ref(false);
    const openMenu = () => {
      isMenuShow.value = !isMenuShow.value;
    };
    const backendUrl = "http://127.0.0.1:10000";
    provide("backendUrl", backendUrl);

    /*點擊Header icon，觸發openMenu，切換isMenuShow，顯示Menu*/
    //提供openMenu給HeaderItem使用
    provide("openMenu", openMenu);
    //提供isMenuShow給MenuItem使用
    provide("isMenuShow", isMenuShow);

    const systemDate = ref(new Date());
    provide("systemDate", systemDate);

    const closedTimePicker = ref(false);
    provide("closedTimePicker", closedTimePicker);

    const editingHistory = ref(false);
    provide("editingHistory", editingHistory);

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
  <!-- <FooterItem hidden /> -->
</template>

<style>
:root {
  --header-height: 55px;
  --header-color: #41546a;
  --second-header-color: #866069;
  --horizontal-menu-height: 80px;
  --main-color: #89a1b1;
  --main-hover: #95abb9;
  --second-color: #bf8291;
  --second-hover: rgb(199, 145, 157);
  --font-color: #fff;
  --confirm-color: #5eab6d;
  --confirm-hover: #69bb7a;
  --cancel-color: #e13c30;
  --cancel-hover: #f85a4c;
  --disabled-color: #bdc3c7;
  --main-font-size: 25px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-weight: 400;
}

button:disabled,
button:disabled:hover {
  background: var(--disabled-color);
  color: #7f8c8d;
  cursor: not-allowed;
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
