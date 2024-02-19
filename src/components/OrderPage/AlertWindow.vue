<script>
import { inject } from "vue";

export default {
  setup() {
    const pickUpTime = inject('pickUpTime');
    const showAlert = inject("showAlert");

    const setPickUpTime = () => {};

    const clickNumber = (int) => {
      console.log(int);
    };

    return {
      pickUpTime,
      setPickUpTime,
      clickNumber,
      showAlert,
    };
  },
};
</script>

<template>
  <div class="body" v-if="showAlert">
    <div class="content">
      <div>
        <div class="title">
          <h1>取餐時間：</h1>
          <i class="material-icons" @click="showAlert = !showAlert">close</i>
        </div>
        <div class="time-content">
          <div class="time-number">{{ pickUpTime }}</div>
          <div class="time-number">{{ pickUpTime }}</div>
          <span>：</span>
          <div class="time-number">{{ pickUpTime }}</div>
          <div class="time-number">{{ pickUpTime }}</div>
        </div>
      </div>
      <div class="keyboard">
        <div class="numbers">
          <div class="number" @click="clickNumber(7)">7</div>
          <div class="number" @click="clickNumber(8)">8</div>
          <div class="number" @click="clickNumber(9)">9</div>
          <div class="number" @click="clickNumber(4)">4</div>
          <div class="number" @click="clickNumber(5)">5</div>
          <div class="number" @click="clickNumber(6)">6</div>
          <div class="number" @click="clickNumber(1)">1</div>
          <div class="number" @click="clickNumber(2)">2</div>
          <div class="number" @click="clickNumber(3)">3</div>
          <div class="number del" @click="clickNumber('Del')">Del</div>
          <div class="number" @click="clickNumber(0)">0</div>
          <div class="number confirm" @click="setPickUpTime">Enter</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.body {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: start;
  justify-content: center;
}

.content {
  margin-top: calc(var(--header-height) + 6px);
  padding: 40px 60px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 8px 10px 3px #41546a53;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title i {
  font-size: 40px;
  position: relative;
  left: 30px;
  top: -15px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}

.title i:hover {
  transform: scale(1.1);
}

h1 {
  font-size: 30px;
  font-weight: bold;
}

input[type="text"] {
  border: 0;
  border-radius: 0;
  height: 36px;
  margin-top: 25px;
  padding: 7px 0;
  font-size: 28px;
  line-height: 1.42857;
  display: block;
  color: #555;
  padding-inline: 2px;
  background-image: linear-gradient(#9c27b0, #9c27b0),
    linear-gradient(#d2d2d2, #d2d2d2);
  background-size: 0 2px, 100% 1px;
  background-repeat: no-repeat;
  background-position: center bottom, center calc(100% - 1px);
  background-color: transparent;
  transition: background 0s ease-out;
  outline: none;
}

.keyboard {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.numbers {
  font-size: var(--main-font-size);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 300px;
}

.number {
  width: 75px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--main-color);
  color: var(--font-color);
  border-radius: 4px;
  margin: 5px;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}

.number:hover {
  background: var(--main-hover);
}

.del {
  background: var(--cancel-color);
}

.del:hover {
  background: var(--cancel-hover);
}

.confirm {
  background: var(--confirm-color);
}

.confirm:hover {
  background: var(--confirm-hover);
}
</style>
