<template>
  <div>是否登入：{{ isLogin == "true" ? "true" : "false" }}</div>
</template>

<script>
import { onMounted, ref } from "vue";

export default {
  name: "FooterItem",
  components: {},
  setup() {
    const isLogin = ref(false);
    onMounted(() => {
      console.log(sessionStorage.getItem("isLogin"));
      isLogin.value = sessionStorage.getItem("isLogin");
    });
    return {
        isLogin
    };
  },
};
</script>
