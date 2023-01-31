<template>
  <Layout
    :with-footer="false"
    :hide-side="true"
    class="h-full theme-color"
  >
    <div class="h-full">
      <Notifications
        ref="notificationRef"
      />
    </div>
  </Layout>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

// components
import Layout from '~/components/layouts/Layout.vue'
import Notifications from '~/components/notifications/Notifications.vue'

// stores
const auth = useAuthStore()

const router = useRouter()

onBeforeMount(() => {
  if (!auth.loggedIn) {
    router.push('/explore')
  }
})

const notificationRef = ref(null)
onMounted(() => {
  notificationRef.value.open()
})
</script>
