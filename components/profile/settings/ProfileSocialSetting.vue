<template>
  <form
    :id="formId"
    @submit.prevent="update(formId)"
  >
    <n-validate>
      <label>{{ $t('profile.forms.update.socials.facebook') }}</label>

      <div class="social-input">
        <Icon :name="'i-logos-facebook'" />

        <input 
          v-model="inputData.facebook"
          type="text" 
          :class="[
            { 'pointer-events-none cursor-not-allowed': saving.socials.loading }
          ]"
          :placeholder="$t('profile.forms.update.socials.facebookPlaceholder')"
          @keydown.space.prevent
        >
      </div>
    </n-validate>

    <n-validate>
      <label>{{ $t('profile.forms.update.socials.twitter') }}</label>

      <div class="social-input">
        <Icon :name="'i-logos-twitter'" />

        <input 
          v-model="inputData.twitter"
          type="text" 
          :class="[
            { 'pointer-events-none cursor-not-allowed': saving.socials.loading }
          ]"
          :placeholder="$t('profile.forms.update.socials.twitterPlaceholder')"
          @keydown.space.prevent
        >
      </div>
    </n-validate>

    <n-validate>
      <label>{{ $t('profile.forms.update.socials.instagram') }}</label>

      <div class="social-input">
        <Icon :name="'i-ion-logo-instagram'" />

        <input 
          v-model="inputData.instagram"
          type="text" 
          :class="[
            { 'pointer-events-none cursor-not-allowed': saving.socials.loading }
          ]"
          :placeholder="$t('profile.forms.update.socials.instagramPlaceholder')"
          @keydown.space.prevent
        >
      </div>
    </n-validate>

    <n-validate>
      <label>{{ $t('profile.forms.update.socials.patreon') }}</label>

      <div class="social-input">
        <Icon :name="'i-logos-patreon'" />

        <input 
          v-model="inputData.patreon"
          type="text" 
          :class="[
            { 'pointer-events-none cursor-not-allowed': saving.socials.loading }
          ]"
          :placeholder="$t('profile.forms.update.socials.patreonPlaceholder')"
          @keydown.space.prevent
        >
      </div>
    </n-validate>
      
    <n-validate>
      <label>{{ $t('profile.forms.update.socials.youtube') }}</label>

      <div class="social-input">
        <Icon :name="'i-logos-youtube-icon'" />

        <input 
          v-model="inputData.youtube"
          type="text" 
          :class="[
            { 'pointer-events-none cursor-not-allowed': saving.socials.loading }
          ]"
          :placeholder="$t('profile.forms.update.socials.youtubePlaceholder')"
          @keydown.space.prevent
        >
      </div>
    </n-validate>
      
    <n-validate>
      <label>{{ $t('profile.forms.update.socials.twitch') }}</label>

      <div class="social-input">
        <Icon :name="'i-logos-twitch'" />

        <input 
          v-model="inputData.twitch"
          type="text" 
          :class="[
            { 'pointer-events-none cursor-not-allowed': saving.socials.loading }
          ]"
          :placeholder="$t('profile.forms.update.socials.twitchPlaceholder')"
          @keydown.space.prevent
        >
      </div>
    </n-validate>
      
    <n-validate>
      <label>{{ $t('profile.forms.update.socials.discord') }}</label>

      <div class="social-input">
        <Icon :name="'i-logos-discord-icon'" />

        <input 
          v-model="inputData.discord"
          type="text" 
          :class="[
            { 'pointer-events-none cursor-not-allowed': saving.socials.loading }
          ]"
          :placeholder="$t('profile.forms.update.socials.discordPlaceholder')"
          @keydown.space.prevent
        >
      </div>
    </n-validate>
      
    <n-validate>
      <label>{{ $t('profile.forms.update.socials.picarto') }}</label>

      <div class="social-input">
        <Icon
          :name="'i-cib-picarto-tv'"
          :icon-color="'bg-green-600'"
        />
        
        <input 
          v-model="inputData.picarto"
          type="text" 
          :class="[
            { 'pointer-events-none cursor-not-allowed': saving.socials.loading }
          ]"
          :placeholder="$t('profile.forms.update.socials.picartoPlaceholder')"
          @keydown.space.prevent
        >
      </div>
    </n-validate>
      
    <n-validate>
      <label>{{ $t('profile.forms.update.socials.gumroad') }}</label>

      <div class="social-input">
        <Icon :name="'i-cib-gumroad'" />

        <input 
          v-model="inputData.gumroad"
          type="text" 
          :class="[
            { 'pointer-events-none cursor-not-allowed': saving.socials.loading }
          ]"
          :placeholder="$t('profile.forms.update.socials.gumroadPlaceholder')"
          @keydown.space.prevent
        >
      </div>
    </n-validate>
      
    <n-validate>
      <label>{{ $t('profile.forms.update.socials.personalWebsite') }}</label>

      <div class="social-input">
        <Icon :name="'i-ph-link-simple-break-bold'" />

        <input 
          v-model="inputData.site"
          type="text" 
          :class="[
            { 'pointer-events-none cursor-not-allowed': saving.socials.loading }
          ]"
          :placeholder="$t('profile.forms.update.socials.personalWebsitePlaceholder')"
          @keydown.space.prevent
        >
      </div>
    </n-validate>

    <div class="buttons">
      <button
        type="submit"
        :class="[
          'submit',
          { '!secondary-button !pointer-events-none !cursor-not-allowed': saving.socials.buttonDisabled }
        ]"
      >
        {{ saving.socials.loading ? $t('updating') : $t('update') }}
      </button>
    </div>
  </form>

  <SuccessMessageModal
    id="update-user-socials-success-modal"
    :modal-id="'update-user-socials-success-modal'"
    class="modal"
    :message="$t('profile.forms.update.profileUpdated')"
  />
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// stores
import useAuthStore from '@/stores/auth.store'

// components
import Icon from '~/components/globals/Icon.vue'
import SuccessMessageModal from '~/components/globals/SuccessMessageModal.vue'

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
      inputData.value.twitch = data.user_socials.twitch
      inputData.value.discord = data.user_socials.discord
      inputData.value.picarto = data.user_socials.picarto
      inputData.value.gumroad = data.user_socials.gumroad
      inputData.value.site = data.user_socials.personal_website
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
  youtube: '',
  twitch: '',
  discrod: '',
  picarto: '',
  gumroad: '',
  site: '',
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
    youtube: inputData.value.youtube,
    twitch: inputData.value.twitch,
    discord: inputData.value.discord,
    picarto: inputData.value.picarto,
    gumroad: inputData.value.gumroad,
    site: inputData.value.site,
  })

  if (!success && error) {
    saving.value.socials.success = false
    // todo: handle error
  } else {
    saving.value.socials.success = true
    useModal().openModal('update-user-socials-success-modal')
  }

  saving.value.socials.loading = false
}
</script>

<style lang="scss" scoped>
.social-input {
  @apply flex flex-row theme-color rounded-md;

  .icon {
    @apply ml-4 mr-1 h-12 relative text-lg text-color-secondary inline-block rounded-l-md;
  }
  
  input {
    @apply rounded-l-none;
  }
}
</style>
