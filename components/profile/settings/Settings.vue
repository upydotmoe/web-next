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
          <label :for="!inputData.showExplicit ? 'checked' : 'unchecked'" class="inline-flex items-center mt-2">
            <span class="relative cursor-pointer" @click="inputData.showExplicit = !inputData.showExplicit">
              <span class="block w-10 h-6 bg-gray-300 rounded-full shadow-inner" />
              <span v-if="!inputData.showExplicit" class="block absolute inset-y-0 left-0 mt-1 ml-1 w-4 h-4 bg-gray-100 rounded-full shadow transition-transform duration-300 ease-in-out focus-within:shadow-outline">
                <input id="unchecked" type="checkbox" class="absolute w-0 h-0 opacity-0">
              </span>
              
              <span v-if="inputData.showExplicit" class="block absolute inset-y-0 left-0 mt-1 ml-1 w-4 h-4 rounded-full shadow transition-transform duration-300 ease-in-out transform translate-x-full focus-within:shadow-outline button-color">
                <input id="checked" type="checkbox" class="absolute w-0 h-0 opacity-0">
              </span>
            </span>
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
