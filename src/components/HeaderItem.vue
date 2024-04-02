<script>
import { inject, ref } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "HeaderItem",
  components: {},
  setup() {
    const openMenu = inject("openMenu");
    const route = useRoute();
    const showTimer = ref(false);
    const systemDate = inject("systemDate");
    const closedTimePicker = inject("closedTimePicker");
    const editingHistory = inject("editingHistory");

    return {
      openMenu,
      route,
      systemDate,
      showTimer,
      closedTimePicker,
      editingHistory,
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
        <VueDatePicker
          v-model="systemDate"
          :enable-time-picker="false"
          @closed="closedTimePicker = true"
          :disabled="editingHistory"
        >
          <template #trigger>
            <p>
              {{
                new Intl.DateTimeFormat("zh-TW", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }).format(new Date(systemDate))
              }}
            </p>
          </template>
        </VueDatePicker>
      </div>
    </div>
    <div class="right">
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
