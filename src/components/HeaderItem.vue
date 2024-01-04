<template>
  <div class="header-body">
    <div class="left">
      <router-link to="/"> 美食棧 </router-link>
    </div>
    <div class="right" v-if="route.name !== 'login'">
      <router-link to="/login" v-if="!isLogin">
        <div class="login">
          <i class="material-icons">person</i>
          <p>登入</p>
        </div>
      </router-link>
      <div class="menu" v-if="isLogin">
        <i class="material-icons" @click="openMenu">menu</i>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
export default {
  name: "HeaderItem",
  components: {},
  setup() {
    const openMenu = inject("openMenu");
    const route = useRoute();
    const isLogin = ref(true);

    console.log(isLogin.value);

    onMounted(() => {
      isLogin.value = sessionStorage.getItem("isLogin");
      console.log(sessionStorage.getItem("isLogin"));
    });

    return {
      openMenu,
      route,
      isLogin,
    };
  },
};
</script>

<style scoped>
.header-body {
  width: 100%;
  height: var(--header-height);
  padding: 0 50px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  font-size: 25px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.left a {
  color: var(--main-color);
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
  color: var(--main-color);
  cursor: pointer;
}

.right p {
  font-size: 20px;
  font-weight: bold;
  margin-left: 5px;
  cursor: pointer;
}
</style>
