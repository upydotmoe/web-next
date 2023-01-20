<template>
  <List 
    :section="'popular'"
    :title="$t('artworks.dailyPopular')"
    :pagination-prop="{
      perPage: pagination.perPage,
      maxLoadMore: pagination.maxLoadMore
    }"
    :discover-route="'/artworks/popular'"
    @view="view"
  />

  <div 
    id="popular-modal"
    class="modal work-view" 
  >
    <ModalView
      v-if="!loading"
      ref="popularModalViewRef"
      section="popular"
    />
  </div>
</template>

<script setup>
// components
import List from '~/components/artworks/index/components/List.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'

const pagination = {
  perPage: 10,
  maxLoadMore: 4
}

const popularModalViewRef = ref(null)
const view = (workId) => {
  popularModalViewRef.value.view(workId)
  useModal().openModal('popular-modal')
}
</script>
