import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Dashboard from "../pages/Dashboard.vue";
import CreateEvent from "../pages/CreateEvent.vue";
const EditEvent = () => import("../pages/EditEvent.vue");
const MyEvents = () => import("../pages/MyEvents.vue");

const routes = [
  { path: "/", name: "dashboard", component: Dashboard },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
  {
    path: "/create",
    name: "create",
    component: CreateEvent,
    meta: { requiresAuth: true, roles: ["ADMIN", "ORGANIZER"] }
  },
  {
  path: "/events/:id/edit",
  name: "edit-event",
  component: EditEvent,
  meta: { requiresAuth: true, roles: ["ADMIN", "ORGANIZER"] }
  },
  {
  path: "/profile",
  name: "profile",
  component: () => import("../pages/Profile.vue"),
  meta: { requiresAuth: true }
  },
  {
  path: "/my-events",
  name: "my-events",
  component: MyEvents,
  meta: { requiresAuth: true }
}
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta?.requiresAuth && !auth.isLogged) return { name: "login" };
  if (to.meta?.roles && !to.meta.roles.includes(auth.role)) return { name: "dashboard" };
});

export default router;
