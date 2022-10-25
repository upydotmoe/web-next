<template>
  <div>
    <div class="opt-modal modal-layer">
      <!-- title -->
      <div class="opt-modal__title">
        <h1>{{ reportSubmitted ? $t('reports.reportSubmitted') : reportStatus.id ? $t('reports.alreadyReported') : $t('reports.title') }}</h1>

        <!-- close modal button -->
        <div class="flex float-right flex-row gap-2 mb-2 cursor-pointer">
          <div class="modal-close" @click="close()">
            <Icon :name="'i-ion-close'" class="text-2xl" />
          </div>
        </div>
      </div>

      <!-- content -->
      <div class="opt-modal__content">
        <div v-show="!reportSubmitted && !reportStatus.id" class="report">
          <!-- report reason options -->
          <div class="report__reason_opt">
            <div class="report__title">{{ $t('reports.selectReasons') }}</div>
            <span
              v-for="reason in reasonList"
              :key="reason"
              :class="[input.selectedReasons.includes(reason) ? 'button-color' : 'theme-color-secondary']"
              @click="toggleSelectedReason(reason)"
            >
              <div>
                <Icon v-show="!input.selectedReasons.includes(reason)" :name="'i-ion-square-outline'" class="text-color-secondary" />
                <Icon v-show="input.selectedReasons.includes(reason)" :name="'i-ion-checkbox-outline'" class="text-green-300" />
              </div>

              <div class="reason" :class="[input.selectedReasons.includes(reason) ? 'text-white' : 'text-color-secondary']">
                {{ $t('reports.reasons.'+reason) }}
              </div>
            </span>
          </div>

          <!-- report reason -->
          <div>
            <div class="report__title">{{ $t('reports.describeReason') }}</div>
            <textarea 
              v-model="input.reasonDescription"
              class="report__reason_description"
              :placeholder="$t('reports.describeText')"
              cols="5" 
              rows="5"
            />
          </div>

          <!-- buttons -->
          <div class="report__buttons">
            <button class="cancel-button" @click="close()">
              {{ $t('cancel') }}
            </button>
            <button 
              :class="input.enableSubmit ? 'primary-button' : 'disabled-button'" 
              @click="input.enableSubmit ? submitReport() : null"
            >
              {{ $t('report') }}
            </button>
          </div>
        </div>

        <!-- On report submitted -->
        <div v-show="reportSubmitted">
          <div class="text-justify">
            {{ $t('reports.reportSubmittedMessage') }}
          </div>
          <div class="mt-2">
            <div>
              <i>Your report ID:</i>&nbsp;
              <b>#{{ reportedData.id }}</b>
            </div>
            <div>
              <i>Report date:</i>&nbsp;
              <b>{{ formatDate(reportedData.created_at) }}</b>
            </div>
          </div>
        </div>

        <!-- if post already reported -->
        <div v-show="reportStatus.id">
          {{ $t('reports.alreadyReportedDescription') }}
          <nuxt-link class="underline href" :to="'/reports'">{{ $t('reports.reportStatus') }}</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// components
import Icon from '~/components/globals/Icon.vue'

// composable
const { oApiConfiguration, fetchOptions } = useApiFetch()
const reportApi = useReport(oApiConfiguration, fetchOptions())

/**
 * @props
 */
const props = defineProps ({
  type: {
    type: String,
    default: ''
  },
  postId: {
    type: Number,
    default: 0
  },
  reportStatus: {
    type: Object,
    default: () => {}
  }
})

/**
 * @input
 */
/**
 * Input refs
 */
const reasonList = ref([
  'stolen',
  'spam',
  'hateSpeech',
  'harassment',
  'falseInfo',
  'suicide',
  'graphic',
  'terrorism',
  'aiGeneratedArt',
  'somethingElse'
])

const input = ref({
  selectedReasons: [],
  reasonDescription: '',
  enableSubmit: computed(() => {
    if (input.value.selectedReasons.length > 0 && input.value.reasonDescription !== '') {
      return true
    } else {
      return false
    }
  })
})
/**
 * @input
 */

/**
 * @reportAction
 */
/**
 * Toggle select and unselect report reason
 */
const toggleSelectedReason = (reason) => {
  if (!input.value.selectedReasons.includes(reason)) {
    input.value.selectedReasons.push(reason)
  } else {
    const indexOfUnselectedReason = input.value.selectedReasons.indexOf(reason)
    input.value.selectedReasons.splice(indexOfUnselectedReason, 1)
  }
}

/**
 * Submit selected reasons and filled description to moderator
 */
const reportSubmitted = ref(false)
const reportedData = ref({})
const submitReport = async () => {
  reportSubmitted.value = false
  reportedData.value = {}

  const [success, data, error] = await reportApi.createNewReport({
    type: props.type,
    postId: props.postId,
    reasons: input.value.selectedReasons.join(','),
    description: input.value.reasonDescription
  })

  if (error && !success) {
    // todo: handle error
  } else {
    reportSubmitted.value = true
    reportedData.value = data
  }
}
/**
 * @reportAction
 */

/**
 * @modalClose
 */
const close = () => {
  useModal().closeModal('report-modal')
  
  // reset form on modal closed
  reset()
}

const reset = () => {
  input.value.selectedReasons = []
  input.value.reasonDescription = ''
  reportSubmitted.value = false
}
/**
 * @modalClose
 */
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.opt-modal {
  @apply w-full xl:w-3/12 lg:w-2/5;

  .opt-modal__title {
    @apply flex flex-row justify-between mb-4 text-tiny;
  }

  .opt-modal__content {
    // 
  }
}

.report {
  @apply gap-2;

  .report__title {
    @apply italic mb-1;
  }

  .report__reason_opt {
    @apply flex flex-col mb-2;

    span {
      @apply pt-2 pb-1 px-3 cursor-pointer rounded-md mb-2 flex flex-row w-full align-middle;

      .icon {
        @apply mr-2;
      }

      .reason {
      }
    }
  }

  .report__reason_description {
    @apply form-input input textarea;
  }

  .report__buttons {
    @apply flex flex-row justify-between md:justify-end gap-2;

    button {
      @apply w-full md:w-auto;
    }
  }
}
</style>
