<template>
  <div class="header-body">
    <div class="left">美食棧</div>
    <div class="right">
      <div class="login" v-if="!isLogin">
        <i class="material-icons">person</i>
        <p>登入</p>
      </div>
      <div class="menu" v-if="isLogin">
        <i class="material-icons" @click="clickMenuBtn">menu</i>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, ref } from "vue";
export default {
  name: "HeaderItem",
  components: {},
  setup() {
    const isLogin = ref(true);
    const changeMenuWidth = inject("changeMenuWidth");
    const clickMenuBtn = () => {
      changeMenuWidth();
    };
    
    return {
      isLogin,
      clickMenuBtn,
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
  color: #000;
  cursor: pointer;
}

.right p {
  font-size: 20px;
  font-weight: bold;
  margin-left: 5px;
  cursor: pointer;
}
</style>
