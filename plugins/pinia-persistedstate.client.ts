import { defineNuxtPlugin } from '#app'
import PiniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.$pinia.use(PiniaPluginPersistedstate)
})