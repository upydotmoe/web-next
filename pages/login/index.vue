<template>
  <LayoutsLayout
    :hide-side="true"
  >
    <form action="">
      <input 
        v-model="input.emailUsername"
        type="text"
      >

      <input 
        v-model="input.password"
        type="password"
      >

      <input
        type="submit"
        class="primary-button"
        value="Login"
        @click="login()"
      >
    </form>
  </LayoutsLayout>
</template>

<script setup lang="ts">
  const input = ref({
    emailUsername: null,
    password: null
  })

  const login = async () => {
    try {
      console.log('login successful');
    } catch (error) {
      console.log('login error:', error);
    }
  }
</script>