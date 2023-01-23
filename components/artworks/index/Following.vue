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
    @view="view"
  />

  <div 
    id="following-modal"
    class="modal work-view" 
  >
    <ModalView
      ref="followingModalViewRef"
      section="following"
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

const followingModalViewRef = ref(null)
const view = (workId) => {
  followingModalViewRef.value.view(workId)
  useModal().openModal('following-modal')
}
</script>
