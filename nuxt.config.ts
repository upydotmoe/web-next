import { createCommonJS } from 'mlly'
import { resolve } from 'path'

import presetIcons from '@unocss/preset-icons'

const { __dirname } = createCommonJS(import.meta.url)

export default defineNuxtConfig({
  ssr: false,
  dev: process.env.NODE_ENV === 'development',
  components: true,
  app: {
    keepalive: true,
    head: {
      htmlAttrs: {
        lang: 'en-US'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Social creative platform for Artists!' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'dns-prefetch', href: `//${process.env.BUNNY_CDN_URL}` },
        { rel: 'dns-prefetch', href: `//${process.env.CDN_DOMAIN}` },
        // { rel: "stylesheet", href: "https://unpkg.com/flowbite@1.4.5/dist/flowbite.min.css" }
      ],
      script: [
        {
          type: 'module',
          src: 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js',
          body: true
        },
        {
          src: 'https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.js'
        },
        {
          src: 'https://analytics.umami.is/script.js',
          async: 'true',
          'data-website-id': '21a8fc7f-ef65-4bce-a18b-0045df800e75'
        },
        // { src: 'https://unpkg.com/flowbite@1.4.5/dist/flowbite.js' }
      ]
    },
  },
  runtimeConfig: {
    public: {
      dev: process.env.NODE_ENV === 'development' ? true : false,
      apiUrl: process.env.API_URL,
      appUrl: process.env.APP_URL,
      activeCdn: process.env.ACTIVE_CDN,
      cloudflareUrl: process.env.CLOUDFLARE_CDN_URL,
      bunnyUrl: process.env.BUNNY_CDN_URL,
      cdnUrl: process.env.CDN_DOMAIN,
      staticallyCdn: process.env.STATICALLY_CDN_URL
    },
    app: {}
  },

  serverHandlers: [
    // {
    //   route: '',
    //   handler: '~/middleware/heap.js',
    // }
  ],

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
    '@nuxt/image-edge',
    '@nuxtjs/critters',
    // 'nuxt-security' // temporary disabled due to cors issue with image CDN
  ],

  plugins: [
    '~/plugins/pinia-persistedstate.client.ts',
    '~/plugins/mixins.js',
    '~/plugins/v-img.js',
    '~/plugins/auth-modal.client.js',
    '~/plugins/work-modal.client.js',
    '~/plugins/image-viewer.client.js',
    '~/plugins/auto-animate.js'
  ],

  build: {
    transpile: [
      'ion-icon'
    ]
  },

  vue: {
    compilerOptions: {
      isCustomElement: tag => ['ion-icon', 'n-validate', 'title'].includes(tag)
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
      Inter: true,
      // Quicksand: true,
      // Nunito: true,
      // Rubik: true,
      // Lato: true,
      // 'Readex Pro': true
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
      'i-ph-user-plus',
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
  },

  // config for 'nuxt-security'
  // https://nuxt-security.vercel.app/getting-started/configuration
  // temporary disabled due to cors issue with image CDN
  // security: {
  //   hidePoweredBy: false,
  //   headers: {
  //     xFrameOptions: {
  //       value: "*",
  //       route: "/**"
  //     }
  //   }
  // }
})