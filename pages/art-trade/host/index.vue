<template>
  <Layout
    :with-footer="true"
    :hide-side="true"
    :no-right-side="true"
  >
    <div>
      <form
        :id="formId"
        @submit.prevent="createNewTradeRoom()"
      >
        <ErrorMessage
          :is-error="error.isError"
          :error-message="error.message"
        />

        <n-validate
          for="title"
          :name="$t('artTrades.form.title')"
        >
          <input 
            v-model="inputData.title"
            type="text"
            rules="required|min:5|max:100"
            :placeholder="$t('title')"
          >
        </n-validate>
      </form>
    </div>
  </Layout>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// stores
const auth = useAuthStore()

const router = useRouter()

onMounted(() => {
  if (!auth.loggedIn) {
    router.push('/')
  }
})
</script>