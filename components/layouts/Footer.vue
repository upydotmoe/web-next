<template>
  <footer
    v-show="withFooter"
    class="hidden p-3 mt-10 leading-8 text-center md:block theme-text-color"
  >
    <div class="mx-auto w-10 h-10">
      <img :src="$colorMode.preference == 'dark' ? logoWhite : logo">
    </div>
    <!-- <span class="mx-3 hover:underline">
      <nuxt-link :to="'/privacy'">{{ $t('privacy') }}</nuxt-link>
    </span> -->
    <br>

    <nuxt-link
      class="mx-3 hover:underline"
      to="/tos"
    >
      {{ $t('terms') }}
    </nuxt-link>

    <nuxt-link
      class="mx-3 hover:underline"
      to="/community-guidelines"
    >
      {{ $t('guidelines.title') }}
    </nuxt-link>

    <span class="mx-3 hover:underline">
      <a
        target="_blank"
        href="https://twitter.com/upydotmoe"
      >
        {{ $t('contactUs') }}
      </a>
    </span>

    <span class="mx-3 hover:underline">
      <a
        target="_blank"
        href="https://github.com/sponsors/upydotmoe"
      >
        {{ $t('sponsorUs') }}
      </a>
    </span>

    <span class="mx-3 hover:underline">
      <nuxt-link :to="'/support-us'">{{ $t('supportUs') }}</nuxt-link>
    </span>

    <span class="mx-3 hover:underline">
      <a
        target="_blank"
        href="https://github.com/upydotmoe"
      >Github</a>
    </span>

    <br>
    <span class="mx-3 text-gray-400">&copy; 2023 - {{ currentDate() }} Upy</span>
  </footer>
</template>

<script setup>
// assets
import logo from '~/static/logo/logo.png'
import logoWhite from '~/static/logo/logo-white.png'

defineProps({
  withFooter: {
    type: Boolean,
    default: false
  }
})

const currentDate = () => new Date().getFullYear()
</script>
