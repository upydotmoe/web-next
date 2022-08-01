<template>
  <ion-icon 
    :name="name"
    class="transition-all icon-color focus:outline-none"
    :class="{ 'cursor-default text-gray-300 hover:text-gray-300': disabled }"
  />
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
