import mxGlobal from '~/mixins/global'
import mxImage from '~/mixins/image'
import mxModal from '~/mixins/modal'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.mixin(mxGlobal)
  nuxtApp.vueApp.mixin(mxImage)
  nuxtApp.vueApp.mixin(mxModal)
})
