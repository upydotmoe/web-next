<template>
  <Layout 
    :with-footer="true" 
    :hide-side="isMobile() ? true : false"
    :no-right-side="true" 
    :class-prop="'work-view'"
  >
    <ModalView
      :id="id"
    />
  </Layout>
</template>

<script setup>
import Layout from '~/components/layouts/Layout.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'

const { $router } = useNuxtApp()

const { id } = $router.currentRoute.value.params
</script>
