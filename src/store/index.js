import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    menuClasses: [],
    allItems: [],
  },
  mutations: {
    setMenuClass(state, menuClasses) {
      state.menuClasses = menuClasses;
    },
    setMenuItem(state, allItems) {
      state.allItems = allItems;
    },
  },
  actions: {
    async fetchMenuClass({ commit }) {
      const response = await axios.get("http://127.0.0.1:10000/getmenuclass");
      commit("setMenuClass", response.data.MenuClasses);
    },
    async fetchMenuItem({ state, commit }) {
      const allItems = {};
      for (const menuClass of state.menuClasses) {
        const response = await axios.get(
          `http://127.0.0.1:10000/getitems/${menuClass.id}`
        );
        allItems[menuClass.id] = response.data;
        
      }
      commit("setMenuItem", allItems);
    },
  },
});
