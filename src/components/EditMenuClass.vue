<template>
  <LoginCheck />
  <section>
    <div class="edit-content">
      <h1>編輯菜單</h1>
      <h1 v-if="menuClass == ''">尚無內容，請輸入菜單名稱</h1>
      <div class="menu-items">
        <div v-for="(item, index) in menuClass" :key="index">
          <div class="menu-item">
            <div class="name">{{ item }}</div>
            <button @click="edit(item)">編輯</button>
            <button class="del" @click="delet">刪除</button>
          </div>
        </div>
      </div>
      <div class="add-content">
        <div class="add-item">
          <input type="text" placeholder="請輸入菜單名稱" v-model="newItem" />
          <button @click="add">新增</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import LoginCheck from "../components/LoginCheck.vue";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "EditMenu",
  components: {
    LoginCheck,
  },
  setup() {
    const newItem = ref("");
    const router = useRouter();
    const menuClass = ref([]);

    const getData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:10000/getmenuclass");
        menuClass.value = response.data.MenuClasses;
      } catch (error) {
        console.error(error);
      }
    };

    const edit = (id) => {
      router.push(`/editmenuitem?id=${id}`);
    };

    const add = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:10000/addmenuclass",
          {
            MenuClass: newItem.value,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        getData();
        newItem.value = "";
      } catch (error) {
        console.error(error);
      }
    };

    const delet = () => {};

    onMounted(() => {
      getData();
    });

    return {
      menuClass,
      edit,
      delet,
      newItem,
      add,
    };
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 15px;
}
.edit-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  margin-top: 20px;
  padding: 30px 50px;
}

.input-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 5%;
  border-radius: 5px;
}

.name {
  width: 175px;
  line-height: 50px;
  background: #f8d1bf;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 20px;
}

input[type="text"] {
  width: 295px;
  height: 50px;
  padding: 0 20px;
  font-size: 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 45px 0;
}

button {
  width: 100px;
  height: 50px;
  margin-left: 20px;
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

button.del {
  background-color: #e74c3c;
}

button.del:hover {
  background-color: #c0392b;
}
</style>
