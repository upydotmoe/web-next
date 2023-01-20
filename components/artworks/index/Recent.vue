<template>
  <List 
    :section="'recent'"
    :title="$t('artworks.latestArtworks')"
    :pagination-prop="{
      perPage: pagination.perPage,
      maxLoadMore: pagination.maxLoadMore
    }"
    :discover-route="'/artworks/recent'"
    @view="view"
  />

  <div 
    id="recent-modal"
    class="modal work-view" 
  >
    <ModalView
      v-if="!loading"
      ref="recentModalViewRef"
      section="recent"
    />
  </div>
</template>

<script setup>
// components
import List from '~/components/artworks/index/components/List.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'

const pagination = {
  perPage: 30,
  maxLoadMore: 2
}

const recentModalViewRef = ref(null)
const view = (workId) => {
  recentModalViewRef.value.view(workId)
  useModal().openModal('recent-modal')
}
</script>
