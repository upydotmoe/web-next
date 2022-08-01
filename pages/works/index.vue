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

const { route } = useContext()

const { id } = route.value.params
</script>
