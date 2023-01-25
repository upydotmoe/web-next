<template>
  <section
    id="host-submission"
    class="submission"
  >
    <div class="flex flex-col gap-2 p-4 my-2 rounded-md theme-color">
      <div class="inline-flex flex-row gap-2">
        <h2 class="mb-2 title">
          {{ trade.host.name }}'s Submission
        </h2>

        <span class="badge text-xxs button-color h-fit">
          {{ $t('artTrades.participantHost') }}
        </span>
      </div>

      <nuxt-img
        preload
        loading="lazy"
        class="w-full rounded-md"
        :src="trade.hostSubmissionSource"
        @error="imageLoadError"
      />

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
</template>

<script setup>
// components
import Icon from '~/components/globals/Icon.vue'

defineProps({
  trade: {
    type: Object,
    default: () => {}
  }
})
</script>

<style lang="scss" scoped>
.submission {
  @apply w-full;
  aspect-ratio: 1/1;
}
</style>