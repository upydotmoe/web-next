<template>
  <div class="bottom-navigation">
    <nuxt-link :to="localePath('/explore')">
      <ion-icon name="home-outline'" />
    </nuxt-link>
    <nuxt-link :to="localePath('/feed')">
      <ion-icon name="reader-outline'" />
    </nuxt-link>
    <nuxt-link :to="localePath('/shuffle')">
      <ion-icon name="shuffle-outline'" />
    </nuxt-link>
    <nuxt-link :to="localePath('/profile')">
      <ion-icon name="person-outline'" />
    </nuxt-link>
  </div>
</template>

<script>
export default {
  setup () {

  }
}
</script>

<style lang="scss">
@import "~/assets/css/navigation.scss";

</style>
