<template>
  <Layout
    :class-prop="'work-view'"
    :hide-side="!empty && !error ? false : true"
    :no-right-side="!empty && !error ? false : true"
    :with-footer="true"
  >
    <div class="mx-auto w-full">
      <LoadingEmptyErrorMessage
        v-show="empty || error"
        :empty="empty"
        :empty-message="$t('feeds.notFound')"
        :error="error"
      />

      <FeedModalView
        v-show="!empty && !error"
        :id="id"
        @show-empty="showEmpty"
        @show-error="showError"
        @set-meta="setMeta"
      />
    </div>
  </Layout>
</template>

<script setup>
import Layout from '~/components/layouts/Layout.vue'
import FeedModalView from '~/components/feeds/FeedModalView.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'

const metaTitle = ref('')
useHead({
  title: computed(() => useFunction().cutText(useFunction().removeHtmlTags(metaTitle.value), 15))
})

const { $router } = useNuxtApp()

const { id } = $router.currentRoute.value.params

const error = ref(false)
const showError = () => {
  error.value = true
}

const empty = ref(false)
const showEmpty = () => {
  empty.value = true
}

const setMeta = (meta) => {
  metaTitle.value = meta.title
}
</script>
