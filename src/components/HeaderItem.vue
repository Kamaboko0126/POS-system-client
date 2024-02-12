<script>
import { inject } from "vue";
import { useRoute } from "vue-router";
export default {
  name: "HeaderItem",
  components: {},
  setup() {
    const openMenu = inject("openMenu");
    const route = useRoute();
    // const isLogin = ref(JSON.parse(sessionStorage.getItem("isLogin")));

    // const updateIcon = () => {
    //   isLogin.value = JSON.parse(sessionStorage.getItem("isLogin"));
    // };

    // onMounted(() => {
    //   updateIcon();
    // });

    return {
      openMenu,
      route,
      // isLogin,
      // updateIcon,
    };
  },
};
</script>

<template>
  <div
    class="header-body"
    :style="{
      background:
        route.name == 'editmenu'
          ? 'var(--second-header-color)'
          : 'var(--header-color)',
    }"
  >
    <div class="left">
      <router-link to="/"> 美食棧 </router-link>
    </div>
    <div class="right">
      <!-- <router-link to="/login" v-if="!isLogin">
        <div class="login">
          <i class="material-icons">person</i>
          <p>登入</p>
        </div>
      </router-link> -->
      <div class="menu">
        <i class="material-icons" @click="openMenu">menu</i>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-body {
  width: 100%;
  height: var(--header-height);
  background: var(--header-color);
  padding: 0 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

a,
p,
i {
  color: var(--font-color);
}

.left {
  font-size: 30px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login,
.menu {
  display: flex;
  align-items: center;
  justify-content: center;
}

.right i {
  font-size: 30px;
  cursor: pointer;
}

.right p {
  font-size: 20px;
  font-weight: bold;
  margin-left: 5px;
  cursor: pointer;
}
</style>
