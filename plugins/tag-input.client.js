import VTagsInput from '@james090500/vue-tagsinput'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.component('tags-input', VTagsInput)
})