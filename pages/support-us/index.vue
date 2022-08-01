<template>
  <Layout
    :with-footer="false"
  >
    <div class="mb-20">
      <div class="w-full">
        <span class="text-lg text-center">Welcome <b>┌( ಠ‿ಠ)┘</b></span>

        <div class="mt-8 text-xs">
          First of all, thank you for visiting this page <b>(๑‵●‿●‵๑)</b>
          <br><br>
          This platform is currently developed and maintained by only one person but I consider myself as a 'we' not 'I'. If you enjoyed this platform, please consider donating to the developer, so we can continue to make this platform better and of course pay the bills <b>(｀∀´)</b>
          <br><br>
          We never planned to put ads on this site because we really hate ads, it's really annoying and will destroy the experience of this site, so any donations are appreciated and will be used to pay for server costs and other costs.
          <br><br>
          We planned to make this platform as a community platform, where people can share their ideas and innovations to make this platform better, 
          you can request a new feature or some feature changes that comes up to your mind by submitting a request at <nuxt-link :to="'build-together'" class="font-bold underline">developer space</nuxt-link>,
          then we will review your request and determine if your idea is suitable or possible to be added to this platform or not.
          <br><br>
          For anyone who can code or who can help us to make this platform better, please consider contributing to the project. We are planning to make this project as open-source at some point in the future, but for now you can message us on <a class="font-bold underline" href="https://twitter.com/upydotmoe">Twitter</a> if you willing to help our core team member develop this platform.
        </div>
      </div>

      <div class="mt-10">
        <span class="text-lg italic">Why should I support Upy?</span>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <!-- support the team -->
          <div class="flex flex-col p-6 w-full text-center rounded-md shadow-sm hover:shadow-xl theme-color">
            <Icon :name="'people-outline'" class="mx-auto text-4xl" />
            <div class="mt-4 text-left">
              <span class="text-base font-bold">Support the team</span>
              <div class="mt-1">
                A small team (currently one person) runs Upy, your support will help them to continue to make this platform better.
              </div>
            </div>
          </div>

          <!-- server -->
          <div class="flex flex-col p-6 w-full text-center rounded-md shadow-sm hover:shadow-xl theme-color">
            <Icon :name="'server-outline'" class="mx-auto text-4xl" />
            <div class="mt-4 text-left">
              <span class="text-base font-bold">Server and other bills</span>
              <div class="mt-1">
                Donation go towards the server and other bills for running the website and keep it alive.
              </div>
            </div>
          </div>

          <!-- no ads -->
          <div class="flex flex-col p-6 w-full text-center rounded-md shadow-sm hover:shadow-xl theme-color">
            <Icon :name="'sad-outline'" class="mx-auto text-4xl" />
            <div class="mt-4 text-left">
              <span class="text-base font-bold">Stay Ad-free</span>
              <div class="mt-1">
                Your donations help keep the platform free from annoying ads and outside sponsors.
              </div>
            </div>
          </div>

          <!-- open-source -->
          <!-- <div class="flex flex-col p-6 w-full text-center rounded-md shadow-sm hover:shadow-xl theme-color">
            <Icon :name="'people-circle-outline'" class="mx-auto text-4xl" />
            <div class="mt-4 text-left">
              <span class="text-base font-bold">Become open-source</span>
              <div class="mt-1">
                Your donations help make this platform open-source, so we can reward all the contributors who have worked hard to help making this platform better.
              </div>
            </div>
          </div> -->

          <!-- make the platform better -->
          <div class="flex flex-col p-6 w-full text-center rounded-md shadow-sm hover:shadow-xl theme-color">
            <Icon :name="'hand-right-outline'" class="mx-auto text-4xl" />
            <div class="mt-4 text-left">
              <span class="text-base font-bold">Make the platform even better</span>
              <div class="mt-1">
                By donating to our platform that means it encourages us to add more features to this platform, we are pleased to receive any features you guys requested, because that's means you guys care about this platform and want to make it better.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <span class="text-lg">Donation options</span>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <!-- PayPal -->
          <a :href="'https://paypal.me/noric1902'" target="_blank" class="flex flex-col justify-center p-6 w-full text-center align-middle rounded-md shadow-sm hover:shadow-xl theme-color">
            <img class="mx-auto mb-4 w-14 h-14" src="https://cdn.iconscout.com/icon/free/png-256/paypal-1527455-1298285.png">
            <span class="mx-auto text-lg font-bold">PayPal</span>
          </a>

          <!-- patreon -->
          <a :href="'https://patreon.com/upydotmoe'" target="_blank" class="flex flex-col justify-center p-6 w-full text-center align-middle rounded-md shadow-sm hover:shadow-xl theme-color">
            <img class="mx-auto mb-4 w-14 h-14" src="https://cdn.iconscout.com/icon/free/png-256/patreon-282262.png">
            <span class="mx-auto text-lg font-bold">Patreon</span>
          </a>

          <!-- ko-fi -->
          <a :href="'https://ko-fi.com/upydotmoe'" target="_blank" class="flex flex-col justify-center p-6 w-full text-center align-middle rounded-md shadow-sm hover:shadow-xl theme-color">
            <img class="mx-auto mb-4 w-14 h-14" src="https://cdn.iconscout.com/icon/free/png-256/ko-fi-3628878-3030018.png">
            <span class="mx-auto text-lg font-bold">ko-fi</span>
          </a>

          <!-- saweria -->
          <a :href="'https://saweria.co/upydotmoe'" target="_blank" class="flex flex-col justify-center p-6 w-full text-center align-middle rounded-md shadow-sm hover:shadow-xl theme-color">
            <img class="mx-auto mb-4 w-14 h-14" src="https://d1fdloi71mui9q.cloudfront.net/vqAU6rLS5ySXzmBdFaaU_saweria%20icon.png">
            <span class="mx-auto text-lg font-bold">saweria</span>
          </a>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
// components
import Layout from '~/components/layouts/Layout.vue'
import Icon from '~/components/globals/Icon.vue'
</script>
