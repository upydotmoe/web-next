<template>
  <div>
    <div class="w-full modal-layer xl:w-3/12 lg:w-2/5">
      <div class="flex flex-row justify-between w-full">
        <div class="title">{{ $t('artworks.usersShared') }}</div>
          
        <div class="flex float-right flex-row gap-2 mb-2 cursor-pointer">
          <div class="modal-close" @click="close()">
            <Icon :name="'i-majesticons-close'" class="text-2xl" />
          </div>
        </div>
      </div>

      <div class="grid overflow-y-scroll gap-2 pr-2 max-h-96 grid-cols">
        <nuxt-link
          v-for="(user, userIdx) in userShared"
          :key="user.id"
          :to="'/u/' + user.users.username"
          class="flex flex-row gap-2 p-2 rounded-md theme-color-secondary hover:button-color hover:text-white img-hover"
        >
          <!-- avatar -->
          <!-- test --> <nuxt-img
            preload
            loading="lazy"
            class="w-10 h-10 avatar"
            :src="avatarCoverUrl(user.users.avatar_bucket, user.users.avatar_filename)" 
            @error="imageLoadError"
          />

          <span
            :to="'/u/' + user.users.username"
            class="font-bold leading-10"
          >
            {{ user.users.name }}
          </span>
        </nuxt-link>

        <!-- infinite loading config -->
        <client-only>
          <InfiniteLoading 
            :load="fetch"
          >
            <template #loading>
              <div class="mx-auto text-center">
                <Icon :name="'i-line-md-loading-twotone-loop'" class="text-3xl" />
              </div>
            </template>

            <template #no-results>
              <div class="mx-auto text-center">
                {{ $t('users.nothingToShow') }}
              </div>
            </template>

            <template #no-more>
              <div class="mx-auto text-center">
                {{ $t('youHaveReachedTheEnd') }}
              </div>
            </template>
          </InfiniteLoading>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script setup>
import { VueEternalLoading as InfiniteLoading } from '@ts-pro/vue-eternal-loading'

// components
import Icon from '~/components/globals/Icon.vue'

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const artworkApi = useArtwork(oApiConfiguration, fetchOptions())

/**
 * @props
 */
const props = defineProps ({
  modalId: {
    type: String,
    default: 'user-shared-modal'
  },
  workId: {
    type: Number,
    default: 0
  }
})

/**
 * fetch users shared the artwork
 */
const options = ref({
  pagination: {
    page: 0,
    perPage: 10
  }
})
const userShared = ref([])
const fetch = async ({ loaded }) => {
  const [users, error] = await artworkApi.viewWhoSharedTheArtwork({
    workId: props.workId,
    pagination: {
      page: options.value.pagination.page,
      perPage: options.value.pagination.perPage
    }
  })

  if (error) {
    // todo: handle error
  } else {
    options.value.pagination.page += 1

    for (let userIdx = 0; userIdx < users.length; userIdx++) {
      const user = users[userIdx]
      userShared.value.push(user)
    }
  }

  loaded(users.length, options.value.pagination.perPage)
}

const close = () => {
  useModal().closeModal(props.modalId)
}
</script>