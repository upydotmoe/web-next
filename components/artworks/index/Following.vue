<template>
  <List 
    :section="'following'"
    :title="$t('followings.followings')"
    :pagination-prop="{
      perPage: pagination.perPage,
      maxLoadMore: pagination.maxLoadMore
    }"
    :discover-route="'/artworks/following'"
    :custom-empty-message="$t('explores.noFollowing')"
  />
</template>

<script setup>
// components
import List from '~/components/artworks/index/components/List.vue'

const pagination = {
  perPage: 10,
  maxLoadMore: 4
}
</script>
