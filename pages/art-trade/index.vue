<template>
  <Layout
    :with-footer="true"
    :hide-side="true"
    :no-right-side="true"
  >
    <div class="flex flex-row justify-between">
      <h2 class="title">
        {{ $t('artTrades.artTrade') }}
      </h2>

      <nuxt-link
        :to="'/art-trade/host'"
        class="flex flex-row primary-button"
      >
        <Icon :name="'i-ion-add'" />
        {{ $t('artTrades.host') }}
      </nuxt-link>
    </div>

    <LatestTrades />
  </Layout>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Layout from '~/components/layouts/Layout.vue'
import LatestTrades from '~/components/art-trades/list/LatestTrades.vue'
import Icon from '~/components/globals/Icon.vue'

// stores
const auth = useAuthStore()

// compositions
const { oApiConfiguration, fetchOptions } = useApiFetch()
</script>