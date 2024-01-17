<template>
  <div class="content-body" ref="alertDiv" @keyup.enter="confirm">
    <div class="alert-body">
      <p>{{ message }}</p>
      <div class="button-content">
        <button @click="confirm">確認</button>
        <button @click="cancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ["message", "confirm", "cancel"],
  mounted() {
    this.$refs.alertDiv.focus();
  },
};
</script>

<style scoped>
.content-body {
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.alert-body {
  background: #fff;
  border-radius: 5px;
  padding: 60px 70px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  margin-top: calc(var(--header-height) + 20px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.alert-body p {
  font-size: 25px;
  font-weight: bold;
}

.button-content{
    margin-top: 25px;
}

button {
  width: 100px;
  height: 50px;
  border: none;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 20px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2980b9;
}

button:last-child {
  margin-left: 40px;
  background: #e74c3c;
}

button:last-child:hover {
  background-color: #c0392b;
}
</style>
