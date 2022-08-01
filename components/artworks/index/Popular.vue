<template>
  <List 
    :section="'popular'"
    :title="$t('artworks.dailyPopular')"
    :pagination-prop="{
      perPage: pagination.perPage,
      maxLoadMore: pagination.maxLoadMore
    }"
    :discover-route="'/works/popular'"
  />
</template>

<script setup>
// components
import List from '~/components/artworks/index/components/List.vue'

const pagination = {
  perPage: 12,
  maxLoadMore: 4
}
</script>
