<template>
  <Layout
    :with-footer="false"
    :hide-side="true"
    class="theme-color h-full"
  >
    <div class="h-full">
      <Notifications />
    </div>
  </Layout>
</template>

<script setup>
import Layout from '~/components/layouts/Layout.vue'
import Notifications from '~/components/notifications/Notifications.vue'
</script>
