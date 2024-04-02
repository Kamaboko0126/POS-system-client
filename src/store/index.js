import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    menuClasses: [],
    allItems: [],
    backendUrl: 'http://127.0.0.1:10000',
  },
  mutations: {
    getMenuClass(state, menuClasses) {
      state.menuClasses = menuClasses;
    },
    getMenuItem(state, allItems) {
      state.allItems = allItems;
    },
  },
  actions: {
    async fetchMenuClass({ state, commit }) {
      const response = await axios.get(`${state.backendUrl}/class/get`);
      // console.log('getClass')
      const menuClasses = response.data ? response.data.MenuClasses || [] : []; // 如果 response.data 是 null 或 MenuClasses 是 null，則設定為空陣列
      commit("getMenuClass", menuClasses);
    },
    async fetchMenuItem({ state, commit }) {
      const allItems = {};
      for (const menuClass of state.menuClasses) {
        const response = await axios.get(
          `${state.backendUrl}/item/get/${menuClass.id}`
        );
        allItems[menuClass.id] = response.data;
      }
      // console.log('getItem')
      commit("getMenuItem", allItems);
    },
  },
});
