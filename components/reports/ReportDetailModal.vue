<template>
  <div>
    <button class="hidden" @click="view()" />
    
    <div class="w-full modal-layer xl:w-3/12 lg:w-2/5">
      <div class="flex flex-row justify-between w-full">
        <span class="title">{{ $t('reports.reportDetail') }}</span>
        
        <CloseModalButton @close="closeModal('report-detail-modal')" />
      </div>

      <div class="report_detail">
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
                <span v-show="reportDetail.is_removed" class="italic">{{ $t('reports.postRemoved') }}</span>
                <a 
                  v-show="!reportDetail.is_removed" 
                  :href="(reportDetail.type === 'artwork' ? '/work/' : '/feed/') + reportDetail.post_id" 
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
                :class="{ 'bg-green-500 text-white': decisionInputs.response === false }"
                @click="decisionInputs.response = false"
              >
                <Icon v-show="decisionInputs.response === false" :name="'checkmark-outline'" class="mr-2 text-white" />
                {{ $t('reports.decisions.remove') }}
              </span>
              <span 
                class="flex flex-row justify-center p-2 w-full rounded-md border-2 border-red-500 cursor-pointer" 
                :class="{ 'bg-red-500 text-white': decisionInputs.response === true }"
                @click="decisionInputs.response = true"
              >
                <Icon v-show="decisionInputs.response === true" :name="'checkmark-outline'" class="mr-2 text-white" />
                {{ $t('reports.decisions.doNotRemove') }}
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
                <span class="font-bold uppercase" :class="reportDetail.response ? 'text-green-500' : 'text-red-500'">
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
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'
import CloseModalButton from '~/components/globals/CloseModalButton.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const reportApi = useReport(oApiConfiguration, fetchOptions())

const emits = defineEmits (['refresh'])

/**
 * @detail
 */
const reportDetail = ref({})
const view = async (reportId) => {
  const [report, error] = await reportApi.getReportById({
    reportId
  })

  if (error) {
    // todo: handle error
  } else {
    reportDetail.value = report
  }
}
/**
 * @detail
 */

/**
 * @decisionForm
 */
const decisionInputs = ref({
  response: false,
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
    emits('refresh')
  }
}
/**
 * @decisionForm
 */

/**
 * @expose
 */
defineExpose ({
  view
})
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

.report_detail {
  .report_detail__badge {
    @apply mb-4;

    span {
      @apply text-white uppercase badge;
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
</style>
