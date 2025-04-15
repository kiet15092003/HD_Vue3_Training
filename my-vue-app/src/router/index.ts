import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import authMiddleware from "../middlewares/authMiddleware";

// Import components directly (no lazy loading)
import LoginPage from "../components/LoginPage.vue";
import ForbiddenPage from "../components/ForbiddenPage.vue";
import UnauthorizedPage from "../components/UnauthorizedPage.vue";
import Counter from "../components/Customer/Counter.vue";
import PostList from '../components/Admin/post/List.vue';
import UserList from '../components/Admin/user/List.vue';
import CustomerPostList from '../components/Customer/Post/List.vue';

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: LoginPage,
    meta: { layout: "AuthLayout" },
  },
  { 
    path: "/403", 
    component: ForbiddenPage, 
    meta: { layout: "AuthLayout" } 
  },
  { 
    path: "/401", 
    component: UnauthorizedPage, 
    meta: { layout: "AuthLayout" } 
  },
  {
    path: "/counter",
    name: "Counter",
    component: Counter,
    meta: { requiresAuth: true, role: "Customer", layout: "CustomerLayout" },
  },
  {
    path: "/posts",
    name: "CustomerPosts",
    component: CustomerPostList,
    meta: { requiresAuth: true, role: "Customer", layout: "CustomerLayout" },
  },
  {
    path: '/admin/posts',
    name: 'AdminPosts',
    component: PostList,
    meta: {
      requiresAuth: true,
      layout: 'AdminLayout',
      roles: ['admin']
    }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: UserList,
    meta: {
      requiresAuth: true,
      layout: 'AdminLayout',
      roles: ['admin']
    }
  },
  // Redirect root to customer posts for logged-in users
  {
    path: '/',
    redirect: '/posts',
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authMiddleware);

export default router;
