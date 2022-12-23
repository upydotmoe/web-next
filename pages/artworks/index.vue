<template>
  <div>
    {{ id }}
    <ModalView
      :id="id"
    />
  </div>
</template>

<script setup>
import ModalView from '~/components/artworks/views/ModalView.vue'

const { $router } = useNuxtApp()

const { id } = $router.currentRoute.value.params.path
</script>
