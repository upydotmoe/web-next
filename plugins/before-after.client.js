import { ImgComparisonSlider } from '@img-comparison-slider/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('before-after', ImgComparisonSlider)
})