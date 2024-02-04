import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/components/HomePage.vue"),
    },
    {
      path: "/order",
      name: "order",
      component: () => import("@/components/OrderPage/"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/components/UserStatus/"),
    },
    {
      path: "/editadmin",
      name: "editadmin",
      component: () => import("@/components/UserStatus/EditAdmin.vue"),
    },
    {
      path: "/editmenu",
      name: "editmenu",
      component: () => import("@/components/EditMenu/"),
    },
    {
      path: "/logout",
      name: "logout",
      component: () => import("@/components/UserStatus/LogoutPage.vue"),
    },
    {
      path: "/revenue",
      name: "revenue",
      component: () => import("@/components/RevenuePage.vue"),
    },
  ],
});

export default router;
