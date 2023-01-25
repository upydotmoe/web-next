<template>
  <Layout
    :with-footer="false"
    :hide-side="true"
    :no-right-side="true"
  >
    <div class="flex flex-row justify-center mx-auto w-full">
      <LoadingEmptyErrorMessage
        :loading="options.isLoading"
        :error="options.isError"
      />

      <section
        v-if="!options.isError && !options.isLoading"
        id="trade-detail-section"
        class="w-full"
      >
        <div class="flex flex-row justify-between mb-6 w-full">
          <nuxt-link
            :to="'/art-trade'"
            class="light-bordered-button"
          >
            <Icon
              :name="'i-typcn-arrow-back'"
              class="text-lg text-white lg:mr-2 hover:text-white"
            />

            <span class="hidden-lg-flex">{{ $t('back') }}</span>
          </nuxt-link>
          
          <div />
        </div>

        <div class="flex flex-row justify-between w-full">
          <h2 class="title">
            {{ trade.title }}
          </h2>

          <button
            v-if="auth.user.id === trade.host.id"
            class="danger-button"
            @click="null"
          >
            <Icon :name="'i-akar-icons-trash-bin'" />
            Cancel Trade & Delete This Room
          </button>
        </div>

        <div class="flex flex-row gap-6 w-full h-fit">
          <!-- host submission -->
          <section
            id="host-submission"
            class="w-full"
          >
            <div class="flex flex-col gap-2 p-4 my-2 rounded-md theme-color">
              <div class="flex flex-row justify-between">
                <div class="inline-flex flex-row gap-2">
                  <h2 class="mb-2 title">
                    {{ trade.host.name }}'s Submission
                    <nuxt-link :to="'/profile/' + trade.host.username">
                      @{{ trade.host.username }}
                    </nuxt-link>
                  </h2>

                  <span class="badge text-xxs button-color h-fit">
                    {{ $t('artTrades.participantHost') }}
                  </span>
                </div>

                <span class="italic">{{ formatDate(trade.created_at) }}</span>
              </div>

              <div class="flex flex-col justify-center submission">
                <nuxt-img
                  preload
                  loading="lazy"
                  class="w-full rounded-md"
                  :src="trade.hostSubmissionSource"
                  @error="imageLoadError"
                />
              </div>

              <div class="flex flex-row justify-end">
                <a
                  :href="'/a/'+trade.host_submission.id"
                  target="_blank"
                  class="text-right light-bordered-button w-fit"
                >
                  <Icon :name="'i-ci-external-link'" />
                  {{ $t('artTrades.viewDetail') }}
                </a>
              </div>
            </div>
          </section>

          <!-- participant submission -->
          <section
            v-if="trade.participant_submission"
            id="participant-submission"
            class="w-full"
          >
            <div class="flex flex-col gap-2 p-4 my-2 rounded-md theme-color">
              <div class="flex flex-row justify-between">
                <div class="inline-flex flex-row gap-2">
                  <h2 class="mb-2 title">
                    <!-- profile detail -->
                    <section class="flex flex-row gap-2">
                      <nuxt-link
                        class="feeds__artist__avatar"
                        :to="'/u/' + trade.host.username"
                      >
                        <img
                          :src="avatarCoverUrl(trade.host.avatar_bucket, trade.host.avatar_filename)"
                          @error="defaultCoverImage"
                        >
                      </nuxt-link>

                      <div class="feeds__artist__name-username">
                        <nuxt-link
                          :to="'/u/' + trade.host.username"
                          class="name"
                        >
                          {{ trade.host.name }}
                        </nuxt-link>
      
                        <br>

                        <nuxt-link
                          :to="'/u/' + trade.host.username"
                          class="username"
                        >
                          @{{ trade.host.username }}
                        </nuxt-link>
                      </div>
                    </section>
                  </h2>
                </div>

                <span class="italic">{{ formatDate(trade.updated_at) }}</span>
              </div>

              <div class="flex flex-col justify-center submission">
                <nuxt-img
                  preload
                  loading="lazy"
                  class="w-full rounded-md"
                  :src="trade.participantSubmissionSource"
                  @error="imageLoadError"
                />
              </div>

              <div class="flex flex-row justify-end">
                <a
                  :href="'/a/'+trade.participant_submission.id"
                  target="_blank"
                  class="text-right light-bordered-button w-fit"
                >
                  <Icon :name="'i-ci-external-link'" />
                  {{ $t('artTrades.viewDetail') }}
                </a>
              </div>
            </div>
          </section>

          <!-- if participant haven't submitted their submission yet, show this -->
          <section
            v-if="!trade.participant && auth.user.id === trade.host.id"
            id="participant-submission-empty"
            class="submission"
          >
            <div
              v-if="trade.participant_id === null"
              class="p-4 my-2 text-center align-middle rounded-md theme-color"
            >
              <span class="text-sm">
                {{ $t('artTrades.notSubmittedYet') }}
              </span>
              <div class="mt-4">
                <span>{{ $t('artTrades.notSubmittedDesc') }}</span>

                <!-- copy sharable link -->
                <div class="flex flex-row justify-between mt-2">
                  <input
                    readonly
                    :value="runtimeConfig.public.appUrl + '/art-trade/view/' + id"
                    class="p-3 w-full rounded-md theme-color-secondary"
                  >

                  <button
                    class="icon-button"
                    @click="copyLink(runtimeConfig.public.appUrl + '/art-trade/view/' + id)"
                  >
                    <Icon :name="'i-icon-park-outline-copy'" />
                  </button>
                </div>
                <p class="mt-2 text-left">
                  <b class="text-red-500">!</b> this is a public link, so make sure the participant of this trade submits their submission as soon as possible
                </p>
              </div>
            </div>
          </section>

          <!-- for participant: submit trade submission -->
          <section
            v-if="!trade.participant && auth.user.id !== trade.host.id"
            id="participate-section"
            class="submission"
          >
            <!-- upload or pick from gallery -->
            <section
              v-if="!artworkData.show"
              id="participate-picker-section"
              class="p-4 my-2 align-middle rounded-md theme-color"
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
                    :pagination-per-page="4"
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
              class="p-4 my-2 rounded-md theme-color"
            >
              <h2 class="mb-2 title">
                {{ $t('artTrades.form.selectedWork') }}
              </h2>

              <MiniArtworkPreview
                :data="artworkData.data"
              />
            </div>

            <div
              class="flex flex-row justify-end"
              @click="participate()"
            >
              <button class="primary-button">
                Submit Your Submission
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
    
    <!-- Link copied notification -->
    <SplashAlert 
      v-show="copied"
      id="copy-alert"
      :text="$t('linkCopied')"
      :icon="'i-bi-check-all'"
    />
  </Layout>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Layout from '~/components/layouts/Layout.vue'
import Icon from '~~/components/globals/Icon.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'
import SplashAlert from '~~/components/globals/SplashAlert.vue'
import ArtistWorks from '~~/components/artworks/views/ArtistWorks.vue'
import ArtworkForm from '~~/components/artworks/forms/ArtworkForm.vue'
import MiniArtworkPreview from '~~/components/artworks/views/MiniArtworkPreview.vue'

// stores
const auth = useAuthStore()

// composables
const { generateSemiCompressedArtworkUrl } = useUpyImage()

// components
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())
const tradeApi = useArtTrade(oApiConfiguration, fetchOptions())

const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const { id } = route.params

onMounted(() => {
  fetchTradeInfo()
})

const options = ref({
  isError: false,
  isLoading: true,
  currentActiveArtworkSelector: 'new'
})
const trade = ref({})

const fetchTradeInfo = async () => {
  // reset state
  options.value.isLoading = true
  options.value.isError = false

  const [success, tradeData, error] = await tradeApi.getTradeById(id)

  if (error) {
    options.value.isError = true
  } else {
    trade.value = tradeData

    if (tradeData.host_submission) {
      trade.value.hostSubmissionSource = generateSemiCompressedArtworkUrl(tradeData.host_submission.artwork_assets[0].bucket, tradeData.host_submission.artwork_assets[0].filename, true)
    }

    if (tradeData.participant_submission) {
      trade.value.participantSubmissionSource = generateSemiCompressedArtworkUrl(tradeData.participant_submission.artwork_assets[0].bucket, tradeData.participant_submission.artwork_assets[0].filename, true)
    }
  }
  
  options.value.isLoading = false
}

// copy sharable link
const copied = ref(false)
let splashInterval
const copyLink = (link) => {
  const source = ref(link)
  const { copy } = useClipboard({ source })
  copy()

  // show splash notification
  useSplash().splash(splashInterval, copied, 'copy-alert')
}

/**
 * Participant
 */
// upload new artwork listener
const selectedArtworkId = ref(0)
const acceptUploadedWorkId = async (workId) => {
  selectedArtworkId.value = workId

  await fetchUploadedArtworkInfo()
}

const artworkData = ref({
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
const changeSelected = async (workId) => {
  selectedArtworkId.value = workId

  await fetchUploadedArtworkInfo()
}

const participate = async () => {
  const [success, error] = await tradeApi.participate({
    roomId: Number(id),
    workId: selectedArtworkId.value
  })

  if (error) {
    // todo
  } else {
    window.location.reload(true)
  }
}
</script>

<style lang="scss" scoped>
.submission {
  @apply w-full;
  aspect-ratio: 1/1;
}
</style>