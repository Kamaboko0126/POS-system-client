<script>
export default {
  name: "OderPage",
  components: {},
  setup() {
    const isLogin = sessionStorage.getItem("isLogin");

    return {
      isLogin,
    };
  },
};
</script>

<template>
  <div class="content-body" v-if="isLogin != 'true'">
    <h1 >請先登入</h1>
  </div>
</template>

<style scoped>
.content-body {
  width: 100%;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
