<template>
  <div>
    <div class="hidden" @click="init()" />

    <div class="w-full modal-layer xl:w-3/12 lg:w-2/5">
      <div>
        <h1 class="mb-2 text-sm">{{ $t('pickUpToTags') }}</h1>

        <div class="input-block">
          <!-- <tags-input 
            v-model="tags"
            :placeholder="$t('tagsInputPlaceholder')"
            :typeahead="true"
            :limit="10"
            :hide-input-on-limit="true"
            :only-existing-tags="true"
            :typeahead-style="'dropdown'"
            :typeahead-activation-threshold="1"
            :typeahead-show-on-focus="true"
            :typeahead-hide-discard="true"
            :typeahead-url="''"
            :add-tags-on-comma="true"
          /> -->
          <vue-tags-input
            v-model="tag"
            :tags="tags"
            :autocomplete-items="availableTags"
            :add-only-from-autocomplete="true"
            @tags-changed="updateTags"
          />
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
import VueTagsInput from '@sipec/vue3-tags-input'
import axios from 'axios';

const emits = defineEmits (['apply'])

const rConfig = useRuntimeConfig()
const apiUrl = rConfig.public.apiUrl

/**
 * @tags
 */
const tag = ref('')
const tags = ref([])
const availableTags = ref([])

watch (tag, () => {
  initAvailableTags()
})

let debounce = ref(null)
const initAvailableTags = () => {

  if (tag.value.length >= 2) {
    const tagListUrl = apiUrl+'/artworks/tags/search?keyword=' + tag.value

    clearTimeout(debounce)

    debounce.value = setTimeout(() => {
      axios.get(tagListUrl)
        .then(response => {
          availableTags.value = response.data.map(aItem => {
            return {
              key: aItem.key,
              text: aItem.value
            }
          })
        })
        .catch(() => {
          // todo: handle tag fetch error
        })
    }, 500)
  } else {
    return
  }
}

const init = (previousSelectedTags) => {
  tags.value = []
  if (previousSelectedTags) {
    previousSelectedTags.forEach((tag) => {
      // tags.value = tag.text
    })
  }
}

const updateTags = (newTags) => {
  availableTags.value = []
  tags.value = newTags
}

const applyTags = () => {
  const selectedTags = []
  tags.value.forEach((tag) => {
    selectedTags.push(tag.text)
  })
  emits('apply', tags.value, selectedTags.join(','))
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
