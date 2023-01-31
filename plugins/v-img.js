import VueLazyLoad from 'vue-lazyload'
// import loadingImage from '~/static/loading/ripple.gif'
import errorImage from '~/static/blank.png'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueLazyLoad, {
    // preLoad: 1.7,
    // loading: loadingImage,
    error: errorImage,
    attempt: 3
  })
})
