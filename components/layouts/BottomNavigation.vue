<template>
  <div class="bottom-navigation">
    <nuxt-link :to="'/explore'">
      <ion-icon name="home-outline'" />
    </nuxt-link>
    <nuxt-link :to="'/feed'">
      <ion-icon name="reader-outline'" />
    </nuxt-link>
    <nuxt-link :to="'/shuffle'">
      <ion-icon name="shuffle-outline'" />
    </nuxt-link>
    <nuxt-link :to="'/profile'">
      <ion-icon name="person-outline'" />
    </nuxt-link>
  </div>
</template>

<script setup>
// 
</script>

<style lang="scss">
@import "~/assets/css/navigation.scss";

</style>
