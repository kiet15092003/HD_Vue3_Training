<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
import GlobalAlert from "@/components/GlobalAlert.vue";
import GlobalSpinner from "@/components/GlobalSpinner.vue";

const layouts = {
  AuthLayout: defineAsyncComponent(() => import("@/layouts/AuthLayout.vue")),
  CustomerLayout: defineAsyncComponent(() => import("@/layouts/CustomerLayout.vue")),
  AdminLayout: defineAsyncComponent(() => import("@/layouts/AdminLayout.vue")),
};

const route = useRoute();

const LayoutComponent = computed(() => {
  return layouts[route.meta.layout as keyof typeof layouts] || layouts.CustomerLayout;
});

</script>

<template>
  <GlobalAlert/>
  <GlobalSpinner/>
  <component :is="LayoutComponent">
    <router-view />
  </component>
</template>
