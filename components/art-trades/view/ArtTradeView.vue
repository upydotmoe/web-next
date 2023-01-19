<template>
  <div
    v-show="!loading"
    :class="[
      'work-container work-view',
      { '2xl:w-4/6 2xl:mx-auto p-2 md:p-6 overflow-y-scroll theme-color': isModal }
    ]"
  >
    <!--  -->
  </div>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artTradeApi = useArtTrade(oApiConfiguration, fetchOptions())

const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
})

const isModal = computed(() => props.id)

onMounted(() => {
  if (props.id) {
    view()
  }
})

const view = () => {
  // const { data } = await artTradeApi.
}
</script>