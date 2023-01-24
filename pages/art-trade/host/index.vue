<template>
  <Layout
    :with-footer="true"
    :hide-side="false"
  >
    <div>
      <form
        :id="formId"
        @submit.prevent="createNewTradeRoom()"
      >
        <ErrorMessage
          :is-error="options.isError"
          :error-message="options.message"
        />

        <n-validate
          for="title"
          :name="$t('artTrades.form.title')"
        >
          <input 
            v-model="inputData.title"
            type="text"
            rules="required|min:5|max:100"
            :placeholder="$t('artTrades.form.title')"
          >
        </n-validate>

        <section
          v-if="!artworkData.show"
          id="artwork"
          class="mt-4"
        >
          <h2 class="title-tiny">
            {{ $t('artTrades.form.artwork.title') }}
          </h2>
          
          <div class="flex flex-col p-4 rounded-md theme-color-secondary">
            <div class="flex flex-row gap-2 justify-between mb-4 w-full">
              <button
                :class="[
                  'py-4 w-full rounded-md theme-color hover:theme-colored cursor-pointer text-center font-semibold text-xs',
                  { 'theme-colored': options.currentActiveArtworkSelector === 'new' }
                ]"
                @click.prevent="options.currentActiveArtworkSelector = 'new'"
              >
                {{ $t('artTrades.form.artwork.new') }}
              </button>
              <button
                :class="[
                  'py-4 w-full rounded-md theme-color hover:theme-colored cursor-pointer text-center font-semibold text-xs',
                  { 'theme-colored': options.currentActiveArtworkSelector === 'existing' }
                ]"
                @click.prevent="options.currentActiveArtworkSelector = 'existing'"
              >
                {{ $t('artTrades.form.artwork.existing') }}
              </button>
            </div>

            <!-- artwork selector -->
            <section>
              <!-- pick from gallery -->
              <ArtistWorks
                v-if="options.currentActiveArtworkSelector === 'existing'"
                :with-title="false"
                class="mb-6 hidden-md-flex"
                :artwork-detail="{ users: { id: auth.user.id } }"
                :pagination-per-page="isModal ? 4 : 4"
                :is-picker-mode="true"
                @pickerModeChangeSelected="changeSelected"
              />

              <!-- upload new artwork -->
              <ArtworkForm
                v-if="options.currentActiveArtworkSelector === 'new' && !selectedArtwork"
                :is-art-trade="true"
                @sendUploadedWorkId="acceptUploadedWorkId"
              />
            </section>
          </div>
        </section>

        <!-- selected artwork detail -->
        <div
          v-if="artworkData.show"
          class="mt-2"
        >
          <h2 class="mb-2 title">
            {{ $t('artTrades.form.selectedWork') }}
          </h2>

          <MiniArtworkPreview
            :data="artworkData.data"
          />
        </div>

        <div class="buttons">
          <button
            :class="[
              'submit',
              { 'pointer-events-none cursor-not-allowed': options.submitting || options.submitted }, 
              { '!disabled-button': !inputData.title && !inputData.workId },
              { '!success-button': options.submitted }
            ]"
          >
            <div class="flex flex-row">
              <Spinner
                v-if="options.submitting"
                class="mr-2"
              />
              {{
                !options.submitted ?
                  (options.submitting ? $t('artTrades.form.hosting') : $t('artTrades.form.host')) :
                  $('artTrades.form.submitted')
              }}
            </div>
          </button>
        </div>
      </form>
    </div>
  </Layout>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Layout from '~/components/layouts/Layout.vue'
import ArtworkForm from '~/components/artworks/forms/ArtworkForm.vue'
import ArtistWorks from '~/components/artworks/views/ArtistWorks.vue'
import MiniArtworkPreview from '~/components/artworks/views/MiniArtworkPreview.vue'
import Spinner from '~/components/globals/Spinner.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())
const tradeApi = useArtTrade(oApiConfiguration, fetchOptions())

const router = useRouter()
const { t } = useI18n()

onMounted(() => {
  if (!auth.loggedIn) {
    router.push('/')
  }
})

const options = ref<{
  isError: boolean,
  isEmpty: boolean,
  currentActiveArtworkSelector: 'new' | 'existing',
  submitting: boolean,
  submitted: boolean
}>({
  isError: false,
  isEmpty: false,
  currentActiveArtworkSelector: 'new',
  submitting: false,
  submitted: false
})

const inputData = ref<{
  title: string,
  workId: number
}>({
  title: '',
  workId: 0
})

const formId = 'art-trade-form'
const createNewTradeRoom = async () => {
  useValidator().validate(formId, t)

  options.value.submitting = true
  options.value.submitted = false

  inputData.value.workId = selectedArtworkId.value

  const [success, tradeData, error] = await tradeApi.host({
    title: inputData.value.title,
    workId: inputData.value.workId
  })

  if (error) {
    options.value.isError = true
  } else {
    options.value.submitting = false
    options.value.submitted = true

    setTimeout(() => {
      router.push('/art-trade/view/' + tradeData.id)
    }, 1000)
  }

  options.value.submitting = false
}

// upload new artwork listener
const selectedArtworkId = ref<number>(0)
const acceptUploadedWorkId = async (workId: number) => {
  selectedArtworkId.value = workId

  await fetchUploadedArtworkInfo()
}

const artworkData = ref<{
  show: boolean,
  data: unknown,
  isError: boolean
}>({
  show: false,
  data: {},
  isError: false
})
const fetchUploadedArtworkInfo = async () => {
  // reset state
  artworkData.value.show = false
  artworkData.value.isError = false

  const [artwork, error] = await artworkApi.getWorkById(selectedArtworkId.value)

  artworkData.value.show = true
  
  if (error) {
    artworkData.value.isError = true
  } else {
    artworkData.value.data = artwork
  }
}

// artwork picker
const changeSelected = async (workId: number) => {
  selectedArtworkId.value = workId

  await fetchUploadedArtworkInfo()
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
</style>