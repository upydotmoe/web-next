<template>
  <div class="w-full">
    <!-- Part 1: Update profile settings/personalization -->
    <form
      :id="formId"
      @submit.prevent="update(formId)"
    >
      <!-- explicit mode toggle -->
      <div class="mb-2 input-block">
        <label class="font-semibold">{{ $t('explicitContent') }}</label>
        <div class="field">
          <label 
            for="small-toggle"
            class="inline-flex relative items-center mb-5 cursor-pointer"
          >
            <input 
              @click="inputData.showExplicit = !inputData.showExplicit"
              id="small-toggle" 
              type="checkbox" 
              class="sr-only peer" 
              :checked="inputData.showExplicit"
            >
            <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>

            <span class="ml-2">{{ $t('profile.forms.update.showExplicitContent') }}</span>
          </label>
        </div>
      </div>

      <!-- submit button -->
      <div class="flex flex-row justify-between w-full">
        <div>
          <span v-show="saving.settings.loading || saving.settings.success" class="text-success">
            {{ saving.settings.loading ? $t('updating') : $t('updated') }}
          </span>
        </div>

        <button
          type="submit"
          :class="[
            'w-full md:w-auto',
            saving.settings.buttonDisabled ? 'secondary-button pointer-events-none cursor-not-allowed' : 'primary-button cursor-pointer'
          ]"
        >
          {{ saving.settings.loading ? $t('updating') : $t('update') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// stores
import useAuthStore from '@/stores/auth.store'

// composables
import useUser from '~/composables/users/useUser'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())

const { $router } = useNuxtApp()
const { t } = useI18n()

onBeforeMount (() => {
  if (!auth.loggedIn) {
    $router.push('/')
  }
})

onMounted (() => {
  fetchUserInfo()
})

// 
const fetchUserInfo = async () => {
  if (auth.loggedIn) {
    const [data, error] = await userApi.getInfo(auth.user.id)

    if (error) {
      // todo: handle error
    } else {
      inputData.value.showExplicit = !!data.user_settings.show_explicit
    }
  } else {
    // todo: handle unauthenticated user
  }
}

const saving = ref({
  settings: {
    loading: false,
    success: false,
    buttonDisabled: false
  }
})

/** Save changes */
const formId = 'update-setting-form'
const inputData = ref({
  showExplicit: false
})
const update = async () => {
  useValidator().validate(formId, t)

  saving.value.settings.loading = true
  
  const [success, error] = await userApi.updateSettings({
    userId: auth.user.id,
    showExplicit: inputData.value.showExplicit
  })

  if (!success && error) {
    saving.value.settings.success = false
    // todo: handle error
  } else {
    saving.value.settings.success = true
    
    auth.user.user_settings.show_explicit = inputData.value.showExplicit ? 1 : 0
  }

  saving.value.settings.loading = false
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

form {
  .input-block {

    .field {
      @apply mt-2 mb-4;

      .icon {
        @apply ml-3 h-10 relative text-lg text-color-secondary -mb-2 rounded-l-md;
      }
    }
  }
}
</style>
