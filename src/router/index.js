import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Dashboard from "../views/Dashboard.vue";
import Users from "../views/User.vue";
import ProfileUser from "../views/Profile.vue";
import Services from "../views/Services.vue";
import CreateService from "../pages/CreateService.vue";
import EditService from "../pages/EditService.vue";
import TypeServices from "../views/TypeServices.vue";
import CreateTypeService from "../pages/TypeServicesCreate.vue";
import Salon from "../views/salon/Salon.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
    roles: ["admin"],
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/users",
    component: Users,
    meta: { requiresAuth: true, roles: ["admin"] }, // Hanya admin yang boleh akses
  },
  {
    path: "/profile",
    component: ProfileUser,
    meta: { requiresAuth: true },
  },
  {
    path: "/services",
    component: Services,
    meta: { requiresAuth: true },
  },
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

  //frontend salon
  {
    path: "/salon",
    name: "Salon",
    component: Salon,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Di router.beforeEach
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole"); // Asumsi peran disimpan di localStorage

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    next("/dashboard"); // Arahkan ke halaman "Akses Ditolak"
  } else {
    next();
  }
});

export default router;
