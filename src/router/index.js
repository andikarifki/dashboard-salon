import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Dashboard from "../views/Dashboard.vue";
import User from "../views/User.vue";
import Services from "../views/Services.vue";
import CreateService from "../pages/CreateService.vue";
import EditService from "../pages/EditService.vue";
import TypeServices from "../views/TypeServices.vue";
import CreateTypeService from "../pages/TypeServicesCreate.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/register", component: Register },
  { path: "/user", component: User },
  { path: "/services", component: Services },
  {
    path: "/type-services",
    name: "TypeServices",
    component: TypeServices,
    meta: { requiresAuth: true },
  },
  {
    path: "/type-services/create",
    name: "CreateTypeService",
    component: CreateTypeService,
    meta: { requiresAuth: true },
  },
  {
    path: "/services/create",
    name: "CreateService",
    component: CreateService, // Tambahkan route untuk CreateService
    meta: { requiresAuth: true },
  },
  {
    path: "/services/edit/:id", // Tambahkan route dengan parameter ID
    name: "EditService",
    component: EditService,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token");
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (!to.meta.requiresAuth && isAuthenticated && to.name === "Login") {
    next("/services");
  } else {
    next();
  }
});

export default router;
