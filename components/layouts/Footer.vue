<template>
  <footer
    v-show="withFooter"
    class="hidden p-3 mt-10 leading-8 text-center md:block theme-text-color"
  >
    <div class="mx-auto w-10 h-10">
      <img :src="$colorMode.preference == 'dark' ? logoWhite : logo">
    </div>
    <!-- <span class="mx-3 hover:underline">
      <nuxt-link :to="'/terms'">{{ $t('terms') }}</nuxt-link>
    </span>
    <span class="mx-3 hover:underline">
      <nuxt-link :to="'/privacy'">{{ $t('privacy') }}</nuxt-link>
    </span>
    <span class="mx-3 hover:underline">
      <nuxt-link :to="'/docs'">{{ $t('docs') }}</nuxt-link>
    </span> -->
    <br>
    <span class="mx-3 hover:underline">
      <a
        target="_blank"
        href="https://github.com/upydotmoe"
      >Github</a>
    </span>
    <span class="mx-3 hover:underline">
      <a
        target="_blank"
        href="https://instagram.com/upy.moe"
      >Instagram</a>
    </span>
    <span class="mx-3 hover:underline">
      <a
        target="_blank"
        href="https://twitter.com/messages/compose?recipient_id=xxx"
      >Contact Us</a>
    </span>
    <span class="mx-3 hover:underline">
      <nuxt-link :to="'/support-us'">{{ $t('supportUs') }}</nuxt-link>
    </span>
    <br>
    <span class="mx-3 text-gray-400">&copy; 2021 - {{ currentDate() }} Upy</span>
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
