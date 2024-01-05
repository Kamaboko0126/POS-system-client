import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path:"/",
      name:"home",
      component: () => import("@/components/HomePage.vue"),
    },
    {
      path: "/order",
      name: "order",
      component: () => import("@/components/OrderPage.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/components/LoginPage.vue"),
    },
    {
      path: "/editadmin",
      name: "editadmin",
      component: () => import("@/components/EditAdmin.vue"),
    },
    {
      path: "/editmenuclass",
      name: "editmenuclass",
      component: () => import("@/components/EditMenuClass.vue"),
    },
    {
      path: "/editmenuitem",
      name: "editmenuitem",
      component: () => import("@/components/EditMenuItem.vue"),
    },
    {
      path: "/logout",
      name: "logout",
      component: () => import("@/components/LogoutPage.vue"),
    },
    {
      path: "/revenue",
      name: "revenue",
      component: () => import("@/components/RevenuePage.vue"),
    },
  ],
});

export default router;
