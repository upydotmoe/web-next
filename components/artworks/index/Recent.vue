<template>
  <List 
    :section="'recent'"
    :title="$t('artworks.latestArtworks')"
    :pagination-prop="{
      perPage: pagination.perPage,
      maxLoadMore: pagination.maxLoadMore
    }"
    :discover-route="'/works/recent'"
  />
</template>

<script setup>
// components
import List from '~/components/artworks/index/components/List.vue'

const pagination = {
  perPage: 20,
  maxLoadMore: 4
}
</script>
