import type { NavigationGuardWithThis, RouteLocationNormalized } from "vue-router";
import Cookies from "js-cookie";
import router from "../router/index";

const authMiddleware: NavigationGuardWithThis<undefined> = async (
  to: RouteLocationNormalized
) => {
  const token = Cookies.get("auth_token");
  const userRole = Cookies.get("user_role") || "Customer"; 

  if (to.meta.requiresAuth && !token) {
    return router.replace("/login");
  }

  // Check singular role
  if (to.meta.role && userRole !== to.meta.role) {
    return router.replace("/403");
  }

  // Check roles array
  if (to.meta.roles && Array.isArray(to.meta.roles) && !to.meta.roles.includes(userRole.toLowerCase())) {
    return router.replace("/403");
  }

  if (to.path === "/admin" && userRole === "Admin") {
    return router.replace("/admin/posts");
  }

  return true;
};

export default authMiddleware;
