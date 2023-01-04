<template>
  <Layout 
    :with-footer="false" 
    :hide-side="true"
    :no-right-side="true"
  >
    <div class="p-2 pt-4 mx-auto w-1/3 rounded">
      <div class="">
        <div
          v-if="!showSuccess"
          class="mb-2 text-base"
        >
          {{ $t('accountRecovery.resetPassword') }}
        </div>

        <!-- warn & error message box -->
        <div
          v-if="showErrorMessage"
          class="p-2 mb-2 w-full text-white bg-red-500 rounded-md"
        >
          {{ errorMessage }}
        </div>

        <div
          v-if="showSuccess"
          class="p-2 mb-2 w-full text-white bg-green-500 rounded-md"
        >
          {{ $t('accountRecovery.accountRecovered') }}
        </div>
        
        <!-- form -->
        <form
          v-show="!showRecoveryLinkSentDialog"
          :id="formId"
          @submit.prevent="reset(formId)"
        >
          <n-validate
            for="password"
            :name="$t('accountRecovery.form.newPassword')"
          >
            <input 
              v-model="newPassword"
              type="password" 
              rules="required|min:6|containSymbol|containNumber"
              class="form-input"
              :placeholder="$t('accountRecovery.form.newPassword')"
            >
          </n-validate>

          <n-validate
            for="retype-password"
            :name="$t('accountRecovery.form.retypeNewPassword')"
          >
            <input 
              v-model="reNewPassword"
              type="password" 
              rules="required|min:6|containSymbol|containNumber|equalTo:password"
              class="form-input"
              :placeholder="$t('accountRecovery.form.retypeNewPassword')"
            >
          </n-validate>

          <button
            type="submit"
            class="float-right mt-2 primary-button"
          >
            {{ $t('reset') }}
          </button>
        </form>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// composables
import useUser from '~~/composables/users/useUser'

// components
import Layout from '~/components/layouts/Layout.vue'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()

const { iv, content } = route.params

// composables
const { oApiConfiguration, fetchOptions } = useApiFetch()
const userApi = useUser(oApiConfiguration, fetchOptions())

onMounted (() => {
  checkTokenValidity()
})

const checkTokenValidity = async () => {
  const [data, error] = await userApi.checkResetPasswordTokenValidity({
    iv,
    content
  })

  if (error) {
    router.push({
      path: '/'
    })
  } else {
    if (!data.valid) {
      router.push({
        path: '/'
      })
    }
  }
}

const formId = 'password-reset-form'

const newPassword = ref('')
const reNewPassword = ref('')

const showErrorMessage = ref(false)
const errorMessage = ref('')
const showSuccess = ref(false)
const reset = async () => {
  useValidator().validate(formId, t)
  
  showSuccess.value = false
  showErrorMessage.value = false

  const [data, error] = await userApi.resetPassword({
    iv,
    content,
    newPassword: newPassword.value
  })

  if (error) {
    showError(error)
  } else {
    showSuccess.value = true
  }
}

const showError = (err) => {
  showErrorMessage.value = true
  errorMessage.value = err
}
</script>

<style lang="scss" scoped>
// @import '~/assets/css/tailwind.scss';
</style>
