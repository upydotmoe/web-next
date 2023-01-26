<template>
  <Layout
    :with-footer="true"
    :hide-side="true"
    :no-right-side="true"
  >
    <div class="px-2">
      <LoginMessage v-if="!auth.loggedIn" />

      <div v-else>
        <div class="flex flex-row justify-between">
          <h2 class="mt-2 title">
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
      </div>
    </div>
  </Layout>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Layout from '~/components/layouts/Layout.vue'
import LatestTrades from '~/components/art-trades/list/LatestTrades.vue'
import Icon from '~/components/globals/Icon.vue'
import LoginMessage from '~~/components/globals/LoginMessage.vue'

// stores
const auth = useAuthStore()

// compositions
const { oApiConfiguration, fetchOptions } = useApiFetch()
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
</style>