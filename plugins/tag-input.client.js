import { TagsInput } from '@nor1c/vue-tagsinput'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.component('tags-input', TagsInput)
})