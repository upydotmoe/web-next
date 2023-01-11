import { TagsInput } from 'n-vue-tagsinput'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('tags-input', TagsInput)
})
