<template>
  <div>
    <div class="w-full modal-layer xl:w-1/4 lg:w-2/5">
      <!-- title -->
      <span class="title">{{ $t('feeds.share.artwork.title') }}</span>

      <!-- form -->
      <div class="mt-2">
        <div v-show="posted" class="alert-success">
          <span class="italic">{{ $t('feeds.share.artwork.success') }}</span>
        </div>

        <div v-show="posting" class="flex flex-row p-2 mb-2 text-white rounded-md button-color">
          <Spinner class="mr-2" />
          {{ $t('feeds.form.postingYourUpdate') }}
        </div>

        <div v-show="isError" class="alert-danger">
          {{ $t('feeds.form.postFailure') }}
        </div>

        <textarea
          v-model="feedInput"
          class="input form-input textarea"
          :placeholder="$t('typeSomething')"
          cols="30"
          rows="2"
          data-gramm="false"
          maxlength="2000"
        />

        <div class="flex float-right flex-row gap-2">
          <button class="cancel-button" @click="cancel()">
            {{ $t('cancel') }}
          </button>
          <button
            :class="[
              feedInput !== '' ? 'primary-button' : 'disabled-button'
            ]"
            @click="shareToFeed()"
          >
            {{ $t('share') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// components
import Spinner from '~/components/globals/Spinner.vue'

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const feedApi = useFeed(oApiConfiguration, fetchOptions())

const props = defineProps ({
  postId: {
    type: Number,
    default: 0
  }
})

const clear = () => {
  feedInput.value = ''
}

const cancel = () => {
  isError.value = false
  posting.value = false
  posted.value = false

  useModal().closeModal('share-to-feed-modal')
  clear()
}

const feedInput = ref('')
const isError = ref(false)
const posting = ref(false)
const posted = ref(false)
const shareToFeed = async () => {
  isError.value = false
  posting.value = true
  posted.value = false

  const [success, data, error] = await feedApi.shareArtworkToFeed({
    text: feedInput.value,
    workId: props.postId
  })

  if (success) {
    posted.value = true

    setTimeout(() => {
      // clear input and close the modal
      cancel()
    }, 500)
  } else {
    isError.value = true
  }

  posting.value = false
}
</script>