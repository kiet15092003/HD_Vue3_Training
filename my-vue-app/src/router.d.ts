import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    layout?: "AuthLayout" | "CustomerLayout" | "AdminLayout"; 
  }
}
