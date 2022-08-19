<template>
  <div class="w-full">
    <!-- Part 1: Update profile socials information -->
    <form
      :id="formId"
      @submit.prevent="update(formId)"
    >
      <n-validate class="input-block">
        <label class="font-semibold">Facebook</label>
        <div class="field">
          <div class="flex flex-row">            
            <Icon :name="'i-logos-facebook'" />
            <input 
              v-model="inputData.facebook"
              type="text" 
              class="rounded-l-none form-input input"
              :class="[{ 'pointer-events-none cursor-not-allowed': saving.socials.loading }]"
              placeholder="Your facebook username (https://facebook.com/<your-username-here>)"
              @keydown.space.prevent
            >
          </div>
        </div>
      </n-validate>

      <n-validate class="input-block">
        <label class="font-semibold">Twitter</label>
        <div class="field">
          <div class="flex flex-row">            
            <Icon :name="'i-logos-twitter'" />
            <input 
              v-model="inputData.twitter"
              type="text" 
              class="rounded-l-none form-input input"
              :class="[{ 'pointer-events-none cursor-not-allowed': saving.socials.loading }]"
              placeholder="Your twitter username (twitter.com/<your-username-here>)"
              @keydown.space.prevent
            >
          </div>
        </div>
      </n-validate>

      <n-validate class="input-block">
        <label class="font-semibold">Instagram</label>
        <div class="field">
          <div class="flex flex-row">            
            <Icon :name="'i-ion-logo-instagram'" />
            <input 
              v-model="inputData.instagram"
              type="text" 
              class="rounded-l-none form-input input"
              :class="[{ 'pointer-events-none cursor-not-allowed': saving.socials.loading }]"
              placeholder="Your instagram username (instagram.com/<your-username-here>)"
              @keydown.space.prevent
            >
          </div>
        </div>
      </n-validate>

      <n-validate class="input-block">
        <label class="font-semibold">Patreon</label>
        <div class="field">
          <div class="flex flex-row">            
            <Icon :name="'i-logos-patreon'" />
            <input 
              v-model="inputData.patreon"
              type="text" 
              class="rounded-l-none form-input input"
              :class="[{ 'pointer-events-none cursor-not-allowed': saving.socials.loading }]"
              placeholder="Your patreon username (patreon.com/<your-username-here>)"
              @keydown.space.prevent
            >
          </div>
        </div>
      </n-validate>
      
      <n-validate class="input-block">
        <label class="font-semibold">Youtube</label>
        <div class="field">
          <div class="flex flex-row">            
            <Icon :name="'i-logos-youtube-icon'" />
            <input 
              v-model="inputData.youtube"
              type="text" 
              class="rounded-l-none form-input input"
              :class="[{ 'pointer-events-none cursor-not-allowed': saving.socials.loading }]"
              placeholder="Your full youtube URL"
              @keydown.space.prevent
            >
          </div>
        </div>
      </n-validate>

      <!-- submit button -->
      <div class="flex flex-row justify-between mt-2 w-full">
        <div>
          <span v-show="saving.socials.loading || saving.socials.success" class="text-success">
            {{ saving.socials.loading ? $t('updating') : $t('updated') }}
          </span>
        </div>

        <button
          type="submit"
          :class="[
            'w-full md:w-auto',
            saving.socials.buttonDisabled ? 'secondary-button pointer-events-none cursor-not-allowed' : 'primary-button cursor-pointer'
          ]"
        >
          {{ saving.socials.loading ? $t('updating') : $t('update') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'

// composables
import useUser from '~/composables/users/useUser'

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
      inputData.value.facebook = data.user_socials.facebook
      inputData.value.twitter = data.user_socials.twitter
      inputData.value.instagram = data.user_socials.instagram
      inputData.value.patreon = data.user_socials.patreon
      inputData.value.youtube = data.user_socials.youtube
    }
  } else {
    // todo: handle unauthenticated user
  }
}

const saving = ref({
  socials: {
    loading: false,
    success: false,
    buttonDisabled: false
  }
})

/** Save changes */
const formId = 'update-social-form'
const inputData = ref({
  facebook: '',
  twitter: '',
  instagram: '',
  patreon: '',
  youtube: ''
})
const update = async () => {
  useValidator().validate(formId, t)

  saving.value.socials.loading = true
  
  const [success, error] = await userApi.updateSocials({
    userId: auth.user.id,
    facebook: inputData.value.facebook,
    twitter: inputData.value.twitter,
    instagram: inputData.value.instagram,
    patreon: inputData.value.patreon,
    youtube: inputData.value.youtube
  })

  if (!success && error) {
    saving.value.socials.success = false
    // todo: handle error
  } else {
    saving.value.socials.success = true
  }

  saving.value.socials.loading = false
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/tailwind.scss';

form {
  .input-block {

    .field {
      @apply mt-2 mb-4 input-bg rounded-md;

      .icon {
        @apply ml-3 h-10 relative text-lg text-color-secondary -mb-2 rounded-l-md;
      }
    }
  }
}
</style>
