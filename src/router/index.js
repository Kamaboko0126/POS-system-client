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
      path: "/oder",
      name: "oder",
      component: () => import("@/components/OderPage.vue"),
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
      path: "/editmenu",
      name: "editmenu",
      component: () => import("@/components/EditMenu.vue"),
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
