<template>
  <section>
      <h1 v-if="isLogin == 'false'">請先登入</h1>
  </section>
</template>

<script>
export default {
  name: "HomePage",
  components: {},
  setup() {
    const isLogin = sessionStorage.getItem("isLogin");

    return {
      isLogin,
    };
  },
};
</script>

<style scoped>
section {
  /* background: #232323; */
  height: 100%;
}

</style>
