<template>
  <section>
    <LoginCheck />
  </section>
</template>

<script>
import LoginCheck from "../components/UserStatus/LoginCheck.vue";
export default {
  name: "HomePage",
  components: {
    LoginCheck,
  },
  setup() {
    return {};
  },
};
</script>

<style scoped>
section {
  /* background: #232323; */
  height: 100%;
}
</style>
