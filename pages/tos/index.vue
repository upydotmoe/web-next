<template>
  <Layout
    :with-footer="true"
  >
    <div>
      <div class="mt-10 mb-10">
        <h1 class="text-lg font-bold">
          {{ $t('terms') }}
        </h1>

        {{ $t('lastUpdated') }}: <i>Feb 23, 2023</i>
      </div>

      <!-- tos content -->
      <p v-html="$t('tosContent')" />
    </div>
  </Layout>
</template>

<script setup>
import Layout from '~/components/layouts/Layout.vue'
</script>

<style scoped>
h2 {
  @apply text-lg font-bold mb-4;
}
</style>