<template>
  <h1 v-if="isLogin == 'false'">請先登入</h1>
</template>

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
