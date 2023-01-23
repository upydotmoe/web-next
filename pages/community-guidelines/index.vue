<template>
  <Layout
    :with-footer="true"
  >
    <div
      class="guidelines"
      v-html="$t('guidelines.content')"
    />
  </Layout>
</template>

<script setup>
import Layout from '~/components/layouts/Layout.vue'
</script>