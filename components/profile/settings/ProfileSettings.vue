<template>
  <div>
    <form
      :id="formId"
      @submit.prevent="update(formId)"
    >
      <div class="opt">
        <label class="title-tiny">{{ $t('explicitContent') }}</label>

        <label 
          for="explicit-toggle"
          class="inline-flex relative items-center mb-5 cursor-pointer"
        >
          <input 
            id="explicit-toggle"
            type="checkbox" 
            class="sr-only peer" 
            :checked="inputData.showExplicit" 
            @click="inputData.showExplicit = !inputData.showExplicit"
          >
          <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />

          <span class="ml-2">{{ $t('profile.forms.update.showExplicitContent') }}</span>
        </label>
      </div>

      <!-- gore mode toggle -->
      <div
        v-if="inputData.showExplicit"
        class="opt"
      >
        <label class="title-tiny">{{ $t('goreContent') }}</label>

        <label 
          for="gore-toggle"
          class="inline-flex relative items-center mb-5 cursor-pointer"
        >
          <input 
            id="gore-toggle"
            type="checkbox" 
            class="sr-only peer" 
            :checked="inputData.showGore" 
            @click="inputData.showGore = !inputData.showGore"
          >
          <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />

          <span class="ml-2">{{ $t('profile.forms.update.showGoreContent') }}</span>
        </label>
      </div>

      <div class="buttons">
        <button
          type="submit"
          :class="[
            'submit',
            { '!secondary-button pointer-events-none cursor-not-allowed': saving.settings.buttonDisabled }
          ]"
        >
          {{ saving.settings.loading ? $t('updating') : $t('update') }}
        </button>
      </div>
    </form>

    <SuccessMessageModal
      id="update-profile-settings-success-modal"
      :modal-id="'update-profile-settings-success-modal'"
      class="modal"
      :message="$t('profile.forms.update.profileUpdated')"
    />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// stores
import useAuthStore from '@/stores/auth.store'

// composables
import useUser from '~/composables/users/useUser'

// components
import SuccessMessageModal from '~/components/globals/SuccessMessageModal.vue'

// stores
const auth = useAuthStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())

const { t } = useI18n()

const { $router } = useNuxtApp()

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
      inputData.value.showGore = !!data.user_settings.show_gore
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
  showExplicit: false,
  showGore: false,
})
const update = async () => {
  useValidator().validate(formId, t)

  saving.value.settings.loading = true
  
  const [success, error] = await userApi.updateSettings({
    userId: auth.user.id,
    showExplicit: inputData.value.showExplicit,
    showGore: inputData.value.showGore,
  })

  if (!success && error) {
    saving.value.settings.success = false
    // todo: handle error
  } else {
    saving.value.settings.success = true
    useModal().openModal('update-profile-settings-success-modal')
    
    auth.user.user_settings.show_explicit = inputData.value.showExplicit ? 1 : 0
    auth.user.user_settings.show_gore = inputData.value.showGore ? 1 : 0
  }

  saving.value.settings.loading = false
}
</script>

<style lang="scss" scoped>
form {
  .opt {
    @apply flex flex-col gap-2;
  }
}
</style>
