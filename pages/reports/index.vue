<template>
  <Layout
    :hide-side="true"
    :no-right-side="true"
  >
    <div class="reports">
      <div class="reports__title">
        {{ auth.user.is_admin || auth.user.is_moderator ? $t('reports.reports') : $t('reports.yourReports') }}
      </div>

      <!-- filter -->
      <div class="reports__filters">
        <!--  -->
      </div>

      <!-- list -->
      <div class="reports__list">
        <div v-show="!config.loading && !isEmpty && !isError">
          <!-- report data -->
          <!-- on desktop: show table view -->
          <div class="hidden-md-flex">
            <table
              class="reports__table"
              cellspacing="0"
              cellpadding="0"
            >
              <thead>
                <tr>
                  <th>
                    <div class="rounded-l-md">
                      {{ $t('reports.reportId') }}
                    </div>
                  </th>
                  <th><div>{{ $t('reports.reportDate') }}</div></th>
                  <th v-show="auth.user.is_moderator && auth.user.is_admin">
                    <div>{{ $t('reports.user') }}</div>
                  </th>
                  <th><div>{{ $t('reports.post') }}</div></th>
                  <th><div>{{ $t('reports.description') }}</div></th>
                  <th><div>{{ $t('reports.status') }}</div></th>
                  <th><div>{{ $t('reports.decision') }}</div></th>
                  <th>
                    <div class="rounded-r-md">
&nbsp;
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="report in reports"
                  :key="report.id"
                >
                  <td>
                    <div class="rounded-l-md">
                      <a
                        class="font-bold hover:underline href"
                        @click.prevent="viewReportDetail(report.id)"
                      >
                        #{{ report.id }}
                      </a>
                    </div>
                  </td>
                  <td>
                    <div>{{ formatDate(report.created_at) }}</div>
                  </td>
                  <td v-show="auth.user.is_moderator && auth.user.is_admin">
                    <div>
                      <a
                        :href="'/u/' + report.user_reported.username"
                        target="blank"
                        class="font-bold href"
                      >
                        {{ report.user_reported.username }}
                      </a>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span
                        v-show="report.is_removed"
                        class="italic"
                      >{{ $t('reports.postRemoved') }}</span>
                      <a
                        v-show="!report.is_removed"
                        :href="(report.type === POST_TYPES.ARTWORK ? '/a/' : '/feed/') + report.post_id"
                        target="blank"
                        class="href"
                      >
                        {{ $t('reports.viewPost') }}
                      </a>
                    </div>
                  </td>
                  <td>
                    <div>{{ report.description.length > 300 ? `${report.description.slice(0, 300)}...` : report.description }}</div>
                  </td>
                  <td class="font-bold uppercase">
                    <div>
                      <span
                        :class="[
                          'text-white uppercase badge text-xxs',
                          report.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        ]"
                      >
                        {{ report.status }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div
                      class="font-bold uppercase"
                    >
                      <span v-show="report.status === 'pending'">-</span>
                      <span
                        v-show="report.status === 'closed'"
                        :class="[
                          'text-white uppercase badge text-xxs',
                          report.response ? 'bg-green-500' : 'bg-red-500'
                        ]"
                      >
                        {{ report.response ? 'Removed' : 'Not removed' }}
                      </span>
                    </div>
                  </td>
                  <td class="rounded-r-md">
                    <div>
                      <a
                        class="underline href"
                        @click.prevent="viewReportDetail(report.id)"
                      >
                        {{ $t('reports.moreInfo') }}
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- on mobile or smaller device: show card view -->
          <div
            v-for="report in reports"
            :key="report.id"
            class="reports__cards"
          >
            <div>
              <label>{{ $t('reports.user') }}</label>
              <div>
                <a
                  :href="'/u/' + report.user_reported.username"
                  target="blank"
                  class="font-bold href"
                >
                  {{ report.user_reported.username }}
                </a>
              </div>
            </div>

            <div>
              <label>{{ $t('reports.description') }}</label>
              <div class="text-right md:text-left">
                {{ report.description }}
              </div>
            </div>

            <div>
              <label>{{ $t('reports.reportDate') }}</label>
              <div>
                {{ formatDate(report.created_at) }}
              </div>
            </div>

            <div>
              <label>{{ $t('reports.status') }}</label>
              <div class="font-bold uppercase">
                <div
                  :class="[
                    'text-white uppercase badge text-xxs',
                    report.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  ]"
                >
                  {{ report.status }}
                </div>
              </div>
            </div>

            <div>
              <label>{{ $t('reports.decision') }}</label>
              <div class="font-bold uppercase">
                <span
                  :class="[
                    'text-white uppercase badge text-xxs',
                    report.response ? 'bg-green-500' : 'bg-red-500'
                  ]"
                >
                  {{ report.response ? 'Removed' : 'Not removed' }}
                </span>
              </div>
            </div>

            <div>
              <label>&nbsp;</label>
              <div>
                <span
                  v-show="report.is_removed"
                  class="mr-2 italic"
                >{{ $t('reports.postRemoved') }}</span>
                <a
                  v-show="!report.is_removed"
                  :href="(report.type === POST_TYPES.ARTWORK ? '/a/' : '/feed/') + report.post_id"
                  target="blank"
                  class="mr-2 underline href"
                >
                  {{ $t('reports.viewReportedPost') }}
                </a>
                <div
                  class="underline href"
                  @click="viewReportDetail(report.id)"
                >
                  {{ $t('reports.moreInfo') }}
                </div>
              </div>
            </div>
          </div>

          <!-- pagination controller -->
          <div
            v-show="reportPagination.total_page > 0"
            class="reports__pagination"
          >
            <button
              :class="reportPagination.next_previous && reportPagination.next_previous.prev_page !== null ? 'primary-button' : 'disabled-button'"
              @click="nextPrev('prev')"
            >
              {{ $t('pagination.previous') }}
            </button>
            <button
              :class="reportPagination.next_previous && reportPagination.next_previous.next_page !== null ? 'primary-button' : 'disabled-button'"
              @click="nextPrev('next')"
            >
              {{ $t('pagination.next') }}
            </button>
          </div>
        </div>

        <!-- On loading, empty or error-->
        <LoadingEmptyErrorMessage
          :loading="config.loading"
          :empty="isEmpty"
          :error="isError"
          :fetch="fetch"
        />
      </div>
    </div>

    <!-- Single report detail modal -->
    <ReportDetailModal
      v-if="!config.loading"
      id="report-detail-modal"
      ref="reportDetailModalRef"
      class="modal"
      @refresh="fetch()"
    />
  </Layout>
</template>

<script setup>
import { POST_TYPES } from '~/utils/constants'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Layout from '~/components/layouts/Layout.vue'
import LoadingEmptyErrorMessage from '~/components/globals/LoadingEmptyErrorMessage.vue'
import ReportDetailModal from '~/components/reports/ReportDetailModal.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const reportApi = useReport(oApiConfiguration, fetchOptions())

/**
 * @meta
 */
useHead({
  title: auth.user.is_admin || auth.user.is_moderator ? useI18n().tl('reports.reports') : useI18n().tl('reports.yourReports')
})

const { $router } = useNuxtApp()

onMounted(async () => {
  if (!auth.loggedIn) {
    $router.push('/')
  } else {
    await fetch()
  }
})

/**
 * @list
 */
const config = ref({
  loading: false,
  pagination: {
    page: 0,
    perPage: 10
  }
})

const filters = ref({
  status: 'all',
  filterDateFrom: undefined,
  filterDateTo: undefined,
  userId: computed(() => {
    if (auth.loggedIn && !auth.user.is_admin && !auth.user.is_moderator) {
      return auth.user.id
    } else {
      return undefined
    }
  }),
  selectedReasons: undefined
})

const reports = ref([])
const reportPagination = ref({})
const fetch = async () => {
  reset()
  config.value.loading = true

  const [data, pagination, error] = await reportApi.getReports({
    status: filters.value.status,
    createdAtFrom: filters.value.filterDateFrom,
    createdAtTo: filters.value.filterDateTo,
    userId: filters.value.userId,
    reasons: filters.value.selectedReasons,
    pagination: {
      page: config.value.pagination.page,
      perPage: config.value.pagination.perPage
    }
  })

  if (error) {
    showError()
  } else {
    if (pagination.record_total <= 0) {
      showEmpty()
    }

    reports.value = data
    reportPagination.value = pagination
  }

  config.value.loading = false
}

const nextPrev = async (mode) => {
  if (mode === 'next') {
    config.value.pagination.page++
  } else {
    config.value.pagination.page--
  }

  await fetch()
}

const reset = () => {
  isEmpty.value = false
  isError.value = false
}

const isEmpty = ref(false)
const showEmpty = () => {
  isEmpty.value = true
}

const isError = ref(false)
const showError = () => {
  isError.value = true
}
/**
 * @list
 */

/**
 * @modal
 */
const reportDetailModalRef = ref(null)
const viewReportDetail = (reportId) => {
  reportDetailModalRef.value.view(reportId)
  useModal().openModal('report-detail-modal')
}
/**
 * @modal
 */
</script>

<style lang="scss" scoped>
// @import '~/assets/css/tailwind.scss';

.reports {
  @apply w-full;

  .reports__title {
    @apply section-title;
  }

  .reports__filters {
    @apply flex flex-row justify-between mb-4;
  }

  .reports__list {
    .reports__table {
      @apply w-full border-none border-collapse border-0;
      border-spacing: 0;
      border-collapse: collapse;

      thead {
        tr {
          @apply py-6 px-4;

          th {
            @apply pb-2 uppercase;

            div {
              @apply font-bold py-4 px-4 text-left m-0 theme-color border-b-4 border-color-primary;
            }
          }
        }
      }

      tbody {
        tr {
          @apply rounded-lg py-6 px-4 gap-2;

          td {
            @apply pb-2;

            div {
              @apply theme-color py-4 px-4;
            }
          }
        }
      }
    }

    .reports__cards {
      @apply flex-md-hidden flex-col gap-2 rounded-md theme-color p-4 w-full mb-2;

      div {
        @apply flex flex-row justify-between;

        label {
          @apply font-bold text-color-dimmed;
        }
      }
    }
  }

  .reports__pagination {
    @apply flex flex-row justify-between md:justify-end gap-2;
  }
}
</style>
