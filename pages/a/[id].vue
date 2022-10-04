<template>
  <Layout
    :class-prop="'work-view'"
    :hide-side="isMobile() || loading ? true : false"
    :no-right-side="true"
    :with-footer="true"
  >
    <LoadingEmptyErrorMessage
      v-show="loading"
      :loading="loading"
    />
    
    <ModalView
      v-show="!loading"
      :id="id"
      @stopLoading="stopLoading"
    />
  </Layout>
</template>

<script setup>
import Layout from '~/components/layouts/Layout.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'

/**
 * @meta
 */
definePageMeta ({
  // keepalive: true
})

const loading = ref(true)
const stopLoading = () => {
  console.log('stopping loading..')
  loading.value = false
}

const { $router } = useNuxtApp()

const { id } = $router.currentRoute.value.params
</script>
