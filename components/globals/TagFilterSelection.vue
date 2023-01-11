<template>
  <div>
    <div
      class="hidden"
      @click="init()"
    />

    <div class="w-full modal-layer xl:w-3/12 lg:w-2/5">
      <div>
        <h1 class="mb-2 text-sm">
          {{ $t('pickUpToTags') }}
        </h1>

        <div class="input-block">
          <client-only>
            <tags-input 
              :key="tagKey"
              v-model="tags"
              :placeholder="$t('tagsInputPlaceholder')"
              :typeahead="true"
              :limit="10"
              :hide-input-on-limit="true"
              :typeahead-style="'dropdown'"
              :typeahead-activation-threshold="3"
              :typeahead-show-on-focus="true"
              :typeahead-hide-discard="true"
              :typeahead-url="apiUrl+'/artworks/tags/search?keyword=:search'"
              :add-tags-on-comma="true"
              :initial-value="tags"
            />
          </client-only>
        </div>
        
        <div class="flex float-right flex-row gap-2 mt-4">
          <button
            class="cancel-button"
            @click="closeModal('tag-filter-selection-modal')"
          >
            {{ $t('cancel') }}
          </button>
          <!-- <button class="cancel-button" @click="clearSelectedTags()">
            {{ $t('clear') }}
          </button> -->
          <button
            class="primary-button"
            @click="applyTags()"
          >
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
const tagKey = ref(1)
const tags = ref([])

const init = (previousSelectedTags) => {
  tags.value = previousSelectedTags
  tagKey.value++
}

const selectedTags = ref([])
const applyTags = () => {
  selectedTags.value = tags.value
  tags.value = []

  const tagsString = []
  toRaw(selectedTags.value).forEach(tag => {
    tagsString.push(tag.value)
  })

  emit('apply', toRaw(selectedTags.value), tagsString.join(','))
}

const clearSelectedTags = () => {
  init([])
}
/**
 * @tags
 */

defineExpose({
  init
})
</script>
