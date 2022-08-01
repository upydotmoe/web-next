<template>
  <footer v-show="withFooter" class="hidden p-3 mt-10 text-center md:block theme-text-color leading-8">
    <!-- <span class="mx-3 hover:underline">
      <nuxt-link :to="localePath('/terms')">{{ $t('terms') }}</nuxt-link>
    </span>
    <span class="mx-3 hover:underline">
      <nuxt-link :to="localePath('/privacy')">{{ $t('privacy') }}</nuxt-link>
    </span>
    <span class="mx-3 hover:underline">
      <nuxt-link :to="localePath('/docs')">{{ $t('docs') }}</nuxt-link>
    </span> -->
    <br>
    <span class="mx-3 hover:underline">
      <a target="_blank" href="https://github.com/upydotmoe">Github</a>
    </span>
    <span class="mx-3 hover:underline">
      <a target="_blank" href="https://instagram.com/upy.moe">Instagram</a>
    </span>
    <span class="mx-3 hover:underline">
      <a target="_blank" href="https://twitter.com/messages/compose?recipient_id=xxx">Contact Us</a>
    </span>
    <span class="mx-3 hover:underline">
      <nuxt-link :to="'/support-us'">{{ $t('supportUs') }}</nuxt-link>
    </span>
    <br>
    <span class="mx-3 text-gray-400">&copy; 2021 - {{ currentDate() }} Upy</span>
  </footer>
</template>

<script setup>
defineProps({
  withFooter: {
    type: Boolean,
    default: false
  }
})

const currentDate = () => new Date().getFullYear()
</script>
