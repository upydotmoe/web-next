import { defineNuxtConfig } from 'nuxt'
import { resolve } from 'path'
import { createCommonJS } from 'mlly'
const { __dirname } = createCommonJS(import.meta.url)
import presetIcons from '@unocss/preset-icons'

export default defineNuxtConfig({
  ssr: false,
  dev: process.env.NODE_ENV === 'development',
  components: true,
  loading: {
    color: '#a855f7',
    height: '5px',
    continuous: true,
    throttle: 0
  },
  runtimeConfig: {
    public: {
      dev: process.env.NODE_ENV === 'development' ? true : false,
      apiUrl: process.env.API_URL,
      appUrl: process.env.APP_URL,
      activeCdn: process.env.ACTIVE_CDN,
      cloudflareUrl: process.env.CLOUDFLARE_CDN_URL,
      bunnyUrl: process.env.BUNNY_CDN_URL,
      staticallyCdn: process.env.STATICALLY_CDN_URL
    },
    app: {}
  },
  server: {
    host: process.env.HOST,
    port: process.env.PORT
  },
  head: {
    htmlAttrs: {
      lang: 'en-US'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Online community platform for artists, post your work and chat with other artists around the world.' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/logo/logo.ico' },
      { rel: 'dns-prefetch', href: `//${process.env.BUNNY_CDN_URL}` },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.9/themes/airbnb.min.css' }
    ],
    script: [
      {
        type: 'module',
        src: 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js',
        body: true
      },
      { 
        src: 'https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.9/flatpickr.min.js',
        body: true
      },
      {
        src: 'https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.js'
      },
      {
        src: 'https://umami.upy.moe/umami.js',
        asyns: true,
        'data-website-id': 'a41fcb1f-d44e-447a-abcc-33468b840da8'
      }
    ]
  },

  css: [
    '~/assets/css/main.css',
    '~/assets/css/vue-tagsinput/style.css'
  ],

  // extend routes
  hooks: {
    'pages:extend' (routes) {
      routes.push(
        {
          name: 'verify-email-account',
          path: '/user/registration/verify/email/:iv/:content',
          file: resolve(__dirname, 'components/user/account/AccountVerification.vue')
        },
        {
          name: 'recover-user-password',
          path: '/user/password/recover/:iv/:content',
          file: resolve(__dirname, 'components/user/account/RecoverPassword.vue')
        }
      )
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@intlify/nuxt3',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/image-edge'
  ],

  plugins: [
    '~/plugins/pinia-persistedstate.client.ts',
    '~/plugins/mixins.js',
    '~/plugins/v-img.js',
    '~/plugins/auth-modal.client.js',
    '~/plugins/work-modal.client.js',
    '~/plugins/image-viewer.client.js'
  ],

  build: {
    transpile: [
      'ion-icon'
    ]
  },

  vue: {
    compilerOptions: {
      isCustomElement: tag => ['ion-icon', 'n-validate'].includes(tag)
    }
  },

  // config for '@nuxtjs/tailwindcss'
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.scss'
  },

  // config for '@nuxtjs/google-fonts'
  googleFonts: {
    families: {
      Poppins: true,
      Quicksand: true,
      Nunito: true,
      Inter: true,
      Rubik: true,
      Lato: true,
      'Readex Pro': true
    },
    display: 'swap',
    prefetch: true,
    preconnect: true,
    preload: true
  },

  // config for '@intlify/nuxt3'
  intlify: {
    localeDir: 'locales',
    vueI18n: {
      locale: 'en-US',
      fallbackLocale: 'en-US',
      availableLocales: ['en-US', 'id-ID'],
      sync: true
    }
  },

  // config for '@unocss/nuxt'
  unocss: {
    uno: false,
    preflight: false,
    icons: true,
    presets: [
      presetIcons({
        // scale: 1.2,
        extraProperties: {
          'display': 'inline-block',
          // 'vertical-align': 'middle',
        }
      })
    ],
    safelist: [
      'i-twemoji-flag-us-outlying-islands',
      'i-twemoji-flag-indonesia',
      'i-fluent-arrow-enter-20-filled',
      'i-ci-external-link',
      'i-akar-icons-flag',
      'i-icon-park-outline-copy',
    ]
  },

  // config for '@nuxtjs/color-mode'
  colorMode: {
    preference: 'system',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '-mode',
    storageKey: 'nuxt-color-mode'
  },

  // config for '@nuxt/image'
  image: {
    domains: [
      'http://localhost:3000',
      'https://upy.moe'
    ]
  }
})