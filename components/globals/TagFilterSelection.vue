<template>
  <div>
    <div class="hidden" @click="init()" />

    <div class="w-full modal-layer xl:w-3/12 lg:w-2/5">
      <div>
        <h1 class="mb-2 text-sm">{{ $t('pickUpToTags') }}</h1>

        <div class="input-block">
          <tags-input 
            v-model:value="tags"
            :placeholder="$t('tags')"
            :typeahead="true"
            :limit="10"
            :hide-input-on-limit="true"
            :only-existing-tags="true"
            :typeahead-style="'dropdown'"
            :typeahead-activation-threshold="1"
            :typeahead-show-on-focus="true"
            :typeahead-hide-discard="true"
            :typeahead-url="apiUrl+'/artworks/tags/search?keyword=:search'"
            :add-tags-on-comma="true"
          />
          {{ tags }}
        </div>
        
        <div class="flex float-right flex-row gap-2 mt-4">
          <button class="cancel-button" @click="closeModal('tag-filter-selection-modal')">
            {{ $t('cancel') }}
          </button>
          <button class="cancel-button" @click="clearSelectedTags()">
            {{ $t('clear') }}
          </button>
          <button class="primary-button" @click="applyTags()">
            {{ $t('apply') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['apply'])

const rConfig = useRuntimeConfig()
const apiUrl = rConfig.public.apiUrl

/**
 * @tags
 */
const tags = ref([])

const init = (previousSelectedTags) => {
  tags.value = []
  if (previousSelectedTags) {
    previousSelectedTags.forEach((tag) => {
      tags.value.push({
        key: tag.key,
        value: tag.value
      })
    })
  }
}

const applyTags = () => {
  const selectedTags = []
  tags.value.forEach((tag) => {
    selectedTags.push(tag.value)
  })
  emit('apply', tags.value, selectedTags.join(','))
}

const clearSelectedTags = () => {
  tags.value = []
}
/**
 * @tags
 */

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';
</style>
