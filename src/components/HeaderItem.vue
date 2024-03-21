<script>
import { inject, ref, watch } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "HeaderItem",
  components: {},
  setup() {
    const openMenu = inject("openMenu");
    const route = useRoute();
    const showTimer = ref(false);
    // const isLogin = ref(JSON.parse(sessionStorage.getItem("isLogin")));

    // const updateIcon = () => {
    //   isLogin.value = JSON.parse(sessionStorage.getItem("isLogin"));
    // };

    // onMounted(() => {
    //   updateIcon();
    // });
    const systemDate = inject("systemDate");

    watch(systemDate, (newDate, oldDate) => {
      console.log("New date:", newDate);
      console.log("Old date:", oldDate);
    });

    return {
      openMenu,
      route,
      systemDate,
      showTimer,
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
      <div class="time-picker">
        <div class="system-time">
          <p @click="showTimer = !showTimer">
            {{
              systemDate.toLocaleDateString("zh-TW", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            }}
          </p>
        </div>
        <div class="timer" v-if="showTimer">
          <VueDatePicker
            v-model="systemDate"
            format="yyyy/MM/dd"
            :enable-time-picker="false"
            inline
            auto-apply
            @change="showTimer = false"
          ></VueDatePicker>
        </div>
      </div>
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
}

.time-picker p {
  cursor: pointer;
  margin-left: 20px;
}

.timer {
  position: absolute;
  top: var(--header-height);
  z-index: 9999;
}
</style>
