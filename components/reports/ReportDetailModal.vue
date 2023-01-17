<template>
  <div>
    <button
      class="hidden"
      @click="view()"
    />
    
    <div class="w-full modal-layer xl:w-3/12 lg:w-2/5">
      <div class="flex flex-row justify-between w-full">
        <span class="title">{{ $t('reports.reportDetail') }}</span>
        
        <CloseModalButton @close="closeModal('report-detail-modal')" />
      </div>

      <LoadingEmptyErrorMessage 
        :loading="loading"
        :error="isError"
      />

      <div
        v-show="!loading"
        class="report_detail"
      >
        <div class="report_detail__badge">
          <span
            :class="reportDetail.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'"
          >
            {{ reportDetail.status }}
          </span>
        </div>

        <div class="report_detail__info">
          <section>
            <div>
              <label>{{ $t('reports.reportId') }}</label>
              <div>
                #{{ reportDetail.id }}
              </div>
            </div>
            
            <div>
              <label>{{ $t('reports.reportDate') }}</label>
              <div>
                {{ formatDate(reportDetail.created_at) }}
              </div>
            </div>
            
            <div v-if="reportDetail.user_reported">
              <label>{{ $t('reports.userReporting') }}</label>
              <div>
                {{ reportDetail.user_reported.username }}
              </div>
            </div>
            
            <div>
              <label>{{ $t('reports.reportedPost') }}</label>
              <div>
                <span
                  v-show="reportDetail.is_removed"
                  class="italic"
                >{{ $t('reports.postRemoved') }}</span>
                <a 
                  v-show="!reportDetail.is_removed" 
                  :href="(reportDetail.type === POST_TYPES.ARTWORK ? '/a/' : '/feed/') + reportDetail.post_id" 
                  target="blank" 
                  class="href"
                >
                  {{ $t('reports.viewPost') }}
                </a>
              </div>
            </div>
            
            <div>
              <label>{{ $t('reports.reportDescription') }}</label>
              <div>
                {{ reportDetail.description }}
              </div>
            </div>
            
            <div>
              <label>{{ $t('reports.selectedReasons') }}</label>
              <div class="tags">
                <span
                  v-for="reason in selectedReasons"
                  class="tag"
                >
                  {{ $t('reports.reasons.' + reason) }}
                </span>
              </div>
            </div>
          </section>

          <div 
            v-show="((auth.user.is_admin || auth.user.is_moderator) && reportDetail.status === 'pending') || reportDetail.status === 'closed'" 
            class="my-4 custom-divider"
          />

          <!-- response form (only show to admin and moderator) -->
          <section v-show="(auth.user.is_admin || auth.user.is_moderator) && reportDetail.status === 'pending'">
            <div class="flex flex-row gap-2 justify-between">
              <span 
                class="flex flex-row justify-center p-2 w-full rounded-md border-2 border-green-500 cursor-pointer" 
                :class="{ 'bg-green-500 text-white': decisionInputs.response === 0 }"
                @click="decisionInputs.response = 0"
              >
                <Icon
                  v-show="decisionInputs.response === 0"
                  :name="'i-ion-checkmark-outline'"
                  class="mr-2 font-bold text-white"
                />
                {{ $t('reports.decisions.doNotRemove') }}
              </span>
              <span 
                class="flex flex-row justify-center p-2 w-full rounded-md border-2 border-red-500 cursor-pointer" 
                :class="{ 'bg-red-500 text-white': decisionInputs.response === 1 }"
                @click="decisionInputs.response = 1"
              >
                <Icon
                  v-show="decisionInputs.response === 1"
                  :name="'i-ion-checkmark-outline'"
                  class="mr-2 font-bold text-white"
                />
                {{ $t('reports.decisions.remove') }}
              </span>
            </div>

            <div>
              <textarea
                v-model="decisionInputs.description"
                class="form-input input textarea"
                rows="5" 
                cols="0"
                :placeholder="$t('description')"
                data-gramm="false"
              />
            </div>

            <button
              :class="decisionInputs.description ? 'primary-button' : 'disabled-button'" 
              @click="submitDecision()"
            >
              {{ $t('reports.submitReviewAndClose') }}
            </button>
          </section>

          <!-- admin/moderator response -->
          <section v-show="reportDetail.status === 'closed'">
            <div>
              <label>{{ $t('reports.decision') }}</label>
              <div>
                <span
                  class="font-bold uppercase"
                  :class="reportDetail.response ? 'text-green-500' : 'text-red-500'"
                >
                  {{ reportDetail.response ? 'Removed' : 'Not removed' }}
                </span>
              </div>
            </div>

            <div>
              <label>{{ $t('description') }}</label>
              <div>
                {{ reportDetail.response_description }}
              </div>
            </div>

            <div>
              <label>{{ $t('reports.decisionMadeAt') }}</label>
              <div>
                {{ formatDate(reportDetail.responded_at) }}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { POST_TYPES } from '~/utils/constants'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'
import CloseModalButton from '~/components/globals/CloseModalButton.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const reportApi = useReport(oApiConfiguration, fetchOptions())

const emit = defineEmits(['refresh'])

/**
 * @detail
 */
const loading = ref(true)
const isError = ref(false)

const reportDetail = ref({})
const selectedReasons = ref([])
const view = async (reportId) => {
  loading.value = true
  isError.value = false

  const [report, error] = await reportApi.getReportById({
    reportId
  })

  if (error) {
    isError.value = true
  } else {
    reportDetail.value = report
    selectedReasons.value = report.reasons.split(',')
  }

  loading.value = false
}
/**
 * @detail
 */

/**
 * @decisionForm
 */
const decisionInputs = ref({
  response: 0,
  description: ''
})

const submitDecision = async () => {
  const [success, error] = await reportApi.reviewReport({
    reportId: reportDetail.value.id,
    response: decisionInputs.value.response,
    responseDescription: decisionInputs.value.description
  })

  if (error) {
    // todo: handle error
  } else {
    await view(reportDetail.value.id)
    useModal().closeModal('report-detail-modal')
    emit('refresh')
  }
}
/**
 * @decisionForm
 */

// expose functions
defineExpose({
  view
})
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.report_detail {
  .report_detail__badge {
    @apply mb-4;

    span {
      @apply text-white uppercase badge text-xxs;
    }
  }

  .report_detail__info {
    section {
      @apply flex flex-col gap-3;

      div {
        label {
          @apply font-bold text-color-dimmed uppercase;
        }
      }
    }
  }
}

.tags {
  @apply flex flex-wrap mb-4;

  .tag {
    @apply py-1 mr-1 mt-1 rounded badge button-color text-white text-xxs;
  }
}
</style>
