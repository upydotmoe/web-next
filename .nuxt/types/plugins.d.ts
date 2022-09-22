// Generated by Nuxt'
import type { Plugin } from '#app'

type Decorate<T extends Record<string, any>> = { [K in keyof T as K extends string ? `$${K}` : never]: T[K] }

type InjectionType<A extends Plugin> = A extends Plugin<infer T> ? Decorate<T> : unknown

type NuxtAppInjections = 
  InjectionType<typeof import("../components.plugin").default> &
  InjectionType<typeof import("../../node_modules/nuxt/dist/head/runtime/lib/vueuse-head.plugin").default> &
  InjectionType<typeof import("../../node_modules/nuxt/dist/head/runtime/plugin").default> &
  InjectionType<typeof import("../../node_modules/nuxt/dist/pages/runtime/router").default> &
  InjectionType<typeof import("../../node_modules/@nuxt/image-edge/dist/runtime/plugin").default> &
  InjectionType<typeof import("../color-mode-script").default> &
  InjectionType<typeof import("../../node_modules/@nuxtjs/color-mode/dist/runtime/plugin.server").default> &
  InjectionType<typeof import("../../node_modules/@nuxtjs/color-mode/dist/runtime/plugin.client").default> &
  InjectionType<typeof import("../unocss").default> &
  InjectionType<typeof import("../../node_modules/@pinia/nuxt/dist/runtime/plugin.vue3").default> &
  InjectionType<typeof import("../plugin").default> &
  InjectionType<typeof import("../../plugins/pinia-persistedstate.client").default> &
  InjectionType<typeof import("../../plugins/mixins").default> &
  InjectionType<typeof import("../../plugins/v-img").default> &
  InjectionType<typeof import("../../plugins/auth-modal.client").default> &
  InjectionType<typeof import("../../plugins/work-modal.client").default> &
  InjectionType<typeof import("../../plugins/image-viewer.client").default> &
  InjectionType<typeof import("../../plugins/auto-animate").default> &
  InjectionType<typeof import("../../plugins/tag-input.client").default>

declare module '#app' {
  interface NuxtApp extends NuxtAppInjections { }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends NuxtAppInjections { }
}

export { }
