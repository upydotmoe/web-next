<template>
  <section
    v-if="show"
    id="explicit-and-gore-alert-section"
    :class="[
      'flex flex-row justify-between p-3 align-middle rounded',
      isGore ? 'bg-red-500 text-white' : 'bg-yellow-300 text-black'
    ]"
  >
    <p
      v-if="isExplicit && !isGore"
      class="mr-4"
    >
      {{ auth.loggedIn ? $t('explicitContentAlert') : $t('explicitContentAlertForGuest') }}
    </p>
    <p
      v-if="isGore"
      class="mr-4"
    >
      {{ auth.loggedIn ? $t('goreContentAlert') : $t('goreContentAlertForGuest') }}
    </p>

    <button
      class="primary-button"
      @click.prevent="$emit('removeFilter')"
    >
      {{ $t('show') }}
    </button>
  </section>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// stores
const auth = useAuthStore()

defineEmits(['removeFilter'])
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  isExplicit: {
    type: Boolean,
    default: false
  },
  isGore: {
    type: Boolean,
    default: false
  }
})
</script>