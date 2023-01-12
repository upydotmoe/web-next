<template>
  <section>
    <h2 class="title">
      {{ $t('feeds.form.title') }}
    </h2>

    <form
      :id="formId"
      @submit.prevent="post()"
    >
      <ErrorMessage
        v-if="state.isPosting | state.isError | state.isPosted"
        :is-loading="state.isPosting"
        :loading-message="$t('feeds.form.postingYourUpdate')"
        :is-success="state.isPosted"
        :success-message="`${$t('feeds.form.posted')} ${$t('feeds.form.successRedirect')}`"
        :is-error="state.isError"
        :error-message="$t('feeds.form.postFailure')"
      />

      <n-validate
        for="text"
        :name="$t('feeds.form.feed')"
      >
        <VueEditor
          v-model="feedInput"
          :editor-toolbar="quillOptions"
          :placeholder="$t('typeSomething')"
          v-on:ready="quill => editorQuill = quill"
        />
      </n-validate>

      <div class="relative">
        <div class="text-left-counter">
          {{ feedInputCharLeft }}
        </div>
      </div>

      <div class="buttons">
        <button
          type="reset"
          class="reset"
          @click.prevent="feedInput = ''"
        >
          {{ $t('reset') }}
        </button>
        <button
          :class="[
            'submit',
            { '!disabled-button': !feedInput }
          ]"
          @click.prevent="feedInput !== '' ? post() : null"
        >
          <Spinner v-if="posting" />
          <span>{{ posting ? $t('posting') : $t('post').toUpperCase() }}</span>
        </button>
      </div>
    </form>
  </section>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { VueEditor } from 'vue3-editor'
import { quillOptions } from '~/utils/constants/text-editor'

// components
import Spinner from '~/components/globals/Spinner.vue'
import ErrorMessage from '~/components/auth/forms/ErrorMessage.vue';

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const feedApi = useFeed(oApiConfiguration, fetchOptions())

let feedInputEditor: HTMLElement | null
onMounted(() => {
  feedInputEditor = document.getElementById(formId)?.getElementsByClassName('ql-editor')[0] as HTMLElement | null
})

const router = useRouter()
const { t } = useI18n()

const formId = 'feed-form'
const editorQuill = ref(null)

const feedInput = ref<string>('')
const feedMaxLength = 2000
const feedInputLength = ref(1)
const feedInputCharLeft = computed(() => {
  if (editorQuill) {
    // const feedInputLength = feedInput.value.replace(/<[^>]*>?/gm, '').length
    return feedMaxLength-(feedInputLength.value-1)
  }
})
watch(() => feedInput.value, (_, currentValue) => {
  feedInputLength.value = editorQuill.value.getLength()
  if (editorQuill.value.getLength() > feedMaxLength) {
    editorQuill.value.deleteText(feedMaxLength, editorQuill.value.getLength())
  }
})

const state = ref({
  isPosting: false,
  isPosted: false,
  isError: false
})
const post = async () => {
  useValidator().validate(formId, t)

  state.value.isPosting = true

  const [success, data, error] = await feedApi.postFeed({
    text: feedInput.value,
    visibility: 'public',
    whoCanReply: 'public'
  })

  if (error) {
    state.value.isError = true
  } else {
    state.value = {
      isPosting: false,
      isPosted: true,
      isError: false
    }
    
    const feedId = data.id
    setTimeout(() => {
      router.push(`/feed/${feedId}`)
    }, 1000)
  }

  state.value.isPosting = false
}
</script>