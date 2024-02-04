<template>
  <div>已登出</div>
</template>

<script>
import { onMounted } from "vue";

export default {
  name: "LogoutPage",
  components: {},
  setup() {
    onMounted(() => {
      sessionStorage.setItem("isLogin", false);
      console.log("logout");
      console.log(sessionStorage.getItem("isLogin"));
      window.location.href = "/";
    });
    return {

    };
  },
};
</script>

<style scoped></style>
