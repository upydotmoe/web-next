<template>
  <!-- :hide-side="isMobile() || loading || error || empty ? true : false"
  :no-right-side="true" -->
  <Layout
    :class-prop="'work-view'"
    :with-footer="true"
    :hide-side="true"
    :no-right-side="true"
    :center-class="'mx-0 xl:mx-12'"
  >
    <LoadingEmptyErrorMessage
      v-show="loading || empty || error"
      :loading="loading"
      :empty="empty"
      :empty-message="$t('artworks.notFound')"
      :error="error"
    />

    <ModalView
      v-show="!loading && !empty && !error"
      :id="id"
      @setMeta="setMeta"
      @stopLoading="stopLoading"
      @showEmpty="showEmpty"
      @showError="showError"
    />
  </Layout>
</template>

<script setup>
import Layout from '~/components/layouts/Layout.vue'
import ModalView from '~/components/artworks/views/ModalView.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'

const setMeta = (meta) => {
  useHead({
    title: meta.title
  })
}

const route = useRoute()

const { id } = route.params

const loading = ref(true)
const stopLoading = () => {
  loading.value = false
}

const error = ref(false)
const showError = () => {
  error.value = true
}

const empty = ref(false)
const showEmpty = () => {
  empty.value = true
}
</script>
