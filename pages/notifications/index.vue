<template>
  <Layout
    :with-footer="false"
    :hide-side="true"
    class="theme-color"
  >
    <div class="h-screen">
      <Notifications />
    </div>
  </Layout>
</template>

<script setup>
import Layout from '~/components/layouts/Layout.vue'
import Notifications from '~/components/notifications/Notifications.vue'
</script>
