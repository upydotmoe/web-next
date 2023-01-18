<template>
  <div
    v-if="socials"
    class="flex flex-row flex-wrap gap-2 justify-center md:justify-start"
  >
    <span
      v-for="social in socialCategories"
      :key="social.valueKey"
      :class="{ 'hidden': !social.show }"
    >
      <a
        v-if="social.show"
        href="#"
        :class="[
          'group/facebook socials__badge',
          !social.hex ? `border-${social.color}-500 bg-${social.color}-500` : ''
        ]"
        :style="[
          social.hex ? `border-color: ${social.hex}; background-color: ${social.hex};` : ''
        ]"
        @click.prevent="social.valueKey === 'personal_website' ? openModal(social.modalId) : openLink(social.href)"
      >
        <div
          :class="[
            'socials__badge-name',
            !social.hex ? `bg-${social.color}-500` : ''
          ]"
          :style="social.hex ? `background-color: ${social.hex}` : ''"
        >
          <Icon :name="social.icon" />
          {{ social.title }}
        </div>
        <div class="py-1 px-2 rounded-md theme-color">
          {{ socials[social.valueKey] }}
        </div>
      </a>
    </span>
    <!-- <button
      v-if="socials.personal_website" 
      @click="openModal('external-website-visit-confirmation-modal')"
      target="blank" 
      class="cursor-pointer"
    >
      <Icon :name="'i-ph-link-simple-break-bold'" :text-size="'text-xl'" />
    </button>

    <a 
      v-if="socials.patreon" 
      :href="'https://patreon.com/' + socials.patreon + '/'"
      target="blank" 
      class="cursor-pointer"
    >
      <Icon :name="'i-gg-patreon'" :text-size="'text-xl'" />
    </a>
    
    <a 
      v-if="socials.twitch" 
      :href="'https://twitch.com/' + socials.twitch + '/'"
      target="blank" 
      class="cursor-pointer"
    >
      <Icon :name="'i-ph-twitch-logo-fill'" :text-size="'text-xl'" />
    </a>
    
    <a 
      v-if="socials.instagram" 
      :href="'https://instagram.com/' + socials.instagram + '/'"
      target="blank" 
      class="cursor-pointer"
    >
      <Icon :name="'i-ion-logo-instagram'" :text-size="'text-xl'" />
    </a>

    <a 
      v-if="socials.twitter" 
      :href="'https://twitter.com/' + socials.twitter" 
      target="blank" 
      class="cursor-pointer"
    >
      <Icon :name="'i-ion-logo-twitter'" :text-size="'text-xl'" />
    </a>

    <a 
      v-if="socials.facebook" 
      :href="'https://facebook.com/' + socials.facebook" 
      target="blank" 
      class="border-blue-500 socials__badge group-hover/facebook:border-blue-600 group/facebook"
    >
      <div class="bg-blue-500 socials__badge-name group-hover/facebook:bg-blue-600">
        <Icon :name="'i-ion-logo-facebook'" />
        facebook
      </div>
      <div class="py-1 px-2 rounded-md">
        {{ socials.facebook }}
      </div>
    </a>
    
    <a 
      v-if="socials.youtube" 
      :href="socials.youtube"
      target="blank" 
      class="cursor-pointer"
    >
      <Icon :name="'i-ion-logo-youtube'" :text-size="'text-xl'" />
    </a>
    
    <a 
      v-if="socials.discord" 
      :href="'https://discord.com/' + socials.discord + '/'"
      target="blank" 
      class="cursor-pointer"
    >
      <Icon :name="'i-ic-twotone-discord'" :text-size="'text-xl'" />
    </a>
    
    <a 
      v-if="socials.picarto"
      :href="'https://picarto.tv/' + socials.picarto + '/'"
      target="blank" 
      class="cursor-pointer"
    >
      <Icon :name="'i-cib-picarto-tv'" :text-size="'text-xl'" />
    </a>
    
    <a 
      v-if="socials.gumroad" 
      :href="'https://' + socials.gumroad + '.gumroad.com'"
      target="blank" 
      class="cursor-pointer"
    >
      <Icon :name="'i-cib-gumroad'" :text-size="'text-xl'" />
    </a> -->
  </div>
</template>

<script setup>
// components
import Icon from '~/components/globals/Icon.vue';

const props = defineProps({
  socials: {
    type: Array,
    default: () => []
  }
})

const socialCategories = [
  {
    title: 'website',
    valueKey: 'personal_website',
    href: props.socials.personal_website,
    icon: 'i-ph-link-simple-break-bold',
    color: 'gray',
    hex: '#333333',
    show: props.socials.personal_website && props.socials.personal_website != '' ? true : false,
    modalId: 'external-website-visit-confirmation-modal'
  },
  {
    title: 'patreon',
    valueKey: 'patreon',
    href: 'https://patreon.com/' + props.socials.patreon,
    icon: 'i-gg-patreon',
    color: 'orange',
    hex: '#f97316',
    show: props.socials.patreon && props.socials.patreon != '' ? true : false,
  },
  {
    title: 'twitch',
    valueKey: 'twitch',
    href: 'https://twitch.com/' + props.socials.twitch,
    icon: 'i-ph-twitch-logo-fill',
    color: 'purple',
    hex: '#6441a5',
    show: props.socials.twitch && props.socials.twitch != '' ? true : false,
  },
  {
    title: 'instagram',
    valueKey: 'instagram',
    href: 'https://instagram.com/' + props.socials.instagram,
    icon: 'i-ion-logo-instagram',
    color: 'fuchsia',
    hex: '#8a3ab9',
    show: props.socials.instagram && props.socials.instagram != '' ? true : false,
  },
  {
    title: 'twitter',
    valueKey: 'twitter',
    href: 'https://twitter.com/' + props.socials.twitter,
    icon: 'i-ion-logo-twitter',
    color: 'cyan',
    hex: '#1DA1F2',
    show: props.socials.twitter && props.socials.twitter != '' ? true : false,
  },
  {
    title: 'facebook',
    valueKey: 'facebook',
    href: 'https://facebook.com/' + props.socials.facebook,
    icon: 'i-ion-logo-facebook',
    color: 'blue',
    show: props.socials.facebook && props.socials.facebook != '' ? true : false,
  },
  {
    title: 'youtube',
    valueKey: 'youtube',
    href: props.socials.youtube,
    icon: 'i-ion-logo-youtube',
    color: 'red',
    show: props.socials.youtube && props.socials.youtube != '' ? true : false,
  },
  {
    title: 'discord',
    valueKey: 'discord',
    href: 'https://discord.com/' + props.socials.discord,
    icon: 'i-ic-twotone-discord',
    color: 'indigo',
    hex: '#7289d9',
    show: props.socials.discord && props.socials.discord != '' ? true : false,
  },
  {
    title: 'picarto',
    valueKey: 'picarto',
    href: 'https://picarto.tv/' + props.socials.picarto,
    icon: 'i-cib-picarto-tv',
    color: 'green',
    show: props.socials.picarto && props.socials.picarto != '' ? true : false,
  },
  {
    title: 'gumroad',
    valueKey: 'gumroad',
    href: 'https://' + props.socials.gumroad + '.gumroad.com',
    icon: 'i-cib-gumroad',
    color: 'pink',
    hex: '#FE92E4',
    show: props.socials.gumroad && props.socials.gumroad != '' ? true : false,
  }
]

const openLink = (url) => {
  window.open(url, '_blank')
}
</script>

<style lang="scss" scoped>
.socials {
  &__badge {
    @apply flex flex-row rounded-md border-2 cursor-pointer transition-all duration-200 ease-in-out;

    &-name {
      @apply flex flex-row gap-2 p-1 pr-2 text-white;

      .icon {
        @apply text-white;
      }
    }
  }
}
</style>