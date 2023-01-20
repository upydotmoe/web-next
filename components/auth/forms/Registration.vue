<template>
  <div
    v-show="showForm"
    class="w-full"
  >
    <!-- step 1: registartion form -->
    <section id="registration-form">
      <form
        v-show="!showRegistrationSuccessDialog"
        :id="formId"
        @submit.prevent="proceed(formId)"
      >
        <ErrorMessage
          :is-error="registerAlert.active"
          :error-message="registerAlert.message"
        />

        <n-validate 
          for="email"
          :name="$t('registration.form.email')"
        >
          <input
            v-model="formData.email"
            type="text"
            autocomplete="off"
            rules="required|email"
            class="input-color-secondary"
            :placeholder="$t('registration.form.email')"
          >
        </n-validate>

        <n-validate 
          for="username"
          :name="$t('registration.form.username')"
        >
          <input
            v-model="formData.username"
            type="text"
            autocomplete="off"
            rules="required|min:4|max:12"
            class="input-color-secondary"
            :placeholder="$t('registration.form.username')"
          >
        </n-validate>

        <n-validate 
          for="name"
          :name="$t('registration.form.name')"
        >
          <input
            v-model="formData.name"
            type="text"
            autocomplete="off"
            rules="required"
            class="input-color-secondary"
            :placeholder="$t('registration.form.name')"
          >
        </n-validate>

        <n-validate 
          for="password"
          :name="$t('registration.form.password')" 
        >
          <input
            v-model="formData.password"
            type="password"
            autocomplete="off"
            rules="required|containNumber|containSymbol"
            class="input-color-secondary"
            :placeholder="$t('registration.form.password')"
          >
        </n-validate>

        <input
          type="submit"
          :value="$t('registration.register').toUpperCase()"
        >
      </form>
    </section>

    <!-- step 2: show generated passphrase along with the email and the username -->
    <section
      v-if="showRegistrationSuccessDialog"
      id="success-dialog"
      class="w-full text-center"
    >
      <div class="mb-4">
        <!-- {{ $t('registration.form.registered.accountCreatedInfo') }} -->
        <div class="mx-auto w-full">
          <p>{{ $t('registration.form.registered.passphraseCopyAlert') }}</p>

          <div class="mt-6">
            <div class="flex flex-row justify-end w-full">
              <button
                class="inline-flex flex-row gap-2"
                @click="copyData('all')"
              >
                {{ $t('copyAll') }} <Icon :name="'i-icon-park-outline-copy'" />
              </button>
            </div>

            <div class="passphrase">
              <div class="passphrase__item">
                <div class="passphrase__item-section">
                  <span>USERNAME</span>
                  <p>{{ passphraseInfo.username }}</p>
                </div>
                <div class="passphrase__copy">
                  <Icon
                    :name="'i-icon-park-outline-copy'"
                    @click="copyData('username')"
                  />
                </div>
              </div>
              <div class="passphrase__item">
                <div class="passphrase__item-section">
                  <span>EMAIL</span>
                  <p>{{ passphraseInfo.email }}</p>
                </div>
                <div class="passphrase__copy">
                  <Icon
                    :name="'i-icon-park-outline-copy'"
                    @click="copyData('email')"
                  />
                </div>
              </div>
              <div class="passphrase__item">
                <div class="passphrase__item-section">
                  <span>PASSPHRASE</span>
                  <p>{{ passphraseInfo.passphrase }}</p>
                </div>
                <div class="passphrase__copy">
                  <Icon
                    :name="'i-icon-park-outline-copy'"
                    @click="copyData('passphrase')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        class="href"
        @click="authFormStore.toggleLoginRegister()"
      >
        {{ $t('logins.login').toUpperCase() }}
      </button>
      <!-- <div>
        {{ $t('registration.form.registered.didNotReceiveVerificationLink') }}
        <span class="font-medium cursor-pointer link-color" @click="resendEmailActivationInstruction()">Resend</span>
      </div> -->

      <!-- <div v-show="showResendNotification" class="p-2 mt-4 w-full text-white bg-green-500 rounded-md">
        {{ $t('registration.form.registered.verificationLinkSent') }}
      </div> -->
    </section>
    
    <!-- Passphrase copied notification -->
    <SplashAlert 
      v-show="copied"
      id="copy-alert"
      :text="$t('copied')"
      :icon="'i-bi-check-all'"
    />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// stores
import useAuthFormStore from '@/stores/auth-form.store'

// components
import Icon from '~/components/globals/Icon.vue'
import SplashAlert from '~/components/globals/SplashAlert.vue'
import ErrorMessage from './ErrorMessage.vue';

// stores
const authFormStore = useAuthFormStore()

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const authApi = useAuth(oApiConfiguration, fetchOptions())

const { t } = useI18n()

const runtimeConfig = useRuntimeConfig()

const showForm = computed(() => authFormStore.showRegistration)
watch (() => authFormStore.showRegistration, () => {
  resetForm()
})

const registerAlert = ref({
  active: computed(() => authFormStore.registerAlert),
  message: ''
})

const showRegistrationSuccessDialog = computed(() => authFormStore.showRegistrationSuccessDialog)
const showResendNotification = ref(false)

// input data
const initialValue = {
  username: runtimeConfig.public.dev ? 'rkgkmoe' : '',
  email: runtimeConfig.public.dev ? 'rkgk.moe@gmail.com' : '',
  name: runtimeConfig.public.dev ? 'Rkgk Moe' : '',
  password: runtimeConfig.public.dev ? 'password123!' : ''
}
const formData = reactive({ ...initialValue })

// reset inputted data everytime user switched to login form
const resetForm = () => {
  // reset err
  authFormStore.resetErr()

  Object.assign(formData, { ...initialValue })
}

const formId = 'user-registration-form'
const passphraseInfo = ref({
  username: '',
  email: '',
  passphrase: '',
})
const proceed = async () => {
  useValidator().validate(formId, t)

  const [success, data, error] = await authApi.registerNewAccount({
    email: formData.email,
    password: formData.password,
    username: formData.username,
    name: formData.name
  })

  if (error) {
    showError(error)
  } else {
    const { passphrase: generatedPassphrase } = data

    passphraseInfo.value = {
      username: formData.username,
      email: formData.email,
      passphrase: generatedPassphrase
    }
    
    resetForm()
    authFormStore.toggleSuccessDialog(true)
  }
}
const showError = async (message) => {
  authFormStore.triggerRegisterAlert()
  registerAlert.value.message = message
}

const copied = ref(false)
let splashInterval
const copyData = (target) => {
  const source = target == 'all' ?
                  `Username: ${passphraseInfo.value.username}, Email: ${passphraseInfo.value.email}, Passphrase: ${passphraseInfo.value.passphrase}` : passphraseInfo.value[target]
  const { copy } = useClipboard({ source })
  copy()

  // show splash notification
  useSplash().splash(splashInterval, copied, 'copy-alert')
}

// const resendEmailActivationInstruction = async () => {
//   showResendNotification.value = false

//   const [success, error] = await authApi.resendVerificationLink(registeredMail.value)

//   if (error) {
//     showResendNotification.value = true
//   } else {
//     setTimeout(() => {
//       showResendNotification.value = true
//     }, 1500)
//   }
// }
</script>

<style lang="scss" scoped>
@import '@/assets/css/tailwind.scss';

input {
  @apply theme-color-secondary;
}

.passphrase {
  @apply flex flex-col gap-4 p-2 mt-2 text-left rounded-md theme-color-secondary;

  &__item {
    @apply flex flex-row justify-between align-middle;

    &-section {
      @apply flex flex-col;

      span {
        @apply font-semibold;
      }
    }
  }

  &__copy {
    @apply flex flex-col justify-center;
  }
}
</style>