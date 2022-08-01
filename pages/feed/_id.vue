<template>
  <Layout 
    :class-prop="'work-view'"
    :hide-side="false"
  >
    <FeedModalView
      :id="id"
    />
  </Layout>
</template>

<script setup>
import Layout from '~/components/layouts/Layout.vue'
import FeedModalView from '~/components/feeds/FeedModalView.vue'

const { route } = useContext()

const { id } = route.value.params
</script>
