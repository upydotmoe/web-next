import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = "heap"
declare module "F:/codes/rkgk/web-next/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}