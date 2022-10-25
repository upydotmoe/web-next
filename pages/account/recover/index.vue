<template>
  <Layout 
    :with-footer="false" 
    :hide-side="true"
    :no-right-side="true"
  >
    <div class="w-1/3 mx-auto rounded p-2 pt-4">
      <AccountRecovery :direct-mode="true" />
    </div>
  </Layout>
</template>

<script setup>
// components
import Layout from '~/components/layouts/Layout.vue'
import AccountRecovery from '~/components/auth/forms/AccountRecovery.vue'

</script>

<style>

</style>
