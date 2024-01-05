<template>
  <section>
      <LoginCheck />
  </section>
</template>

<script>
import LoginCheck from "../components/LoginCheck.vue";
export default {
  name: "HomePage",
  components: {
    LoginCheck,
  },
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
