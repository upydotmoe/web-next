<template>
  <Layout
    :with-footer="true"
  >
    <div class="px-2 lg:mt-5">
      <div class="w-full">
        <span class="text-lg text-center">Hi, thank you for visiting this page! <b>(๑‵●‿●‵๑)</b></span>

        <div class="mt-8 text-xs">
          Welcome to Upy, a community platform that is specifically designed for artists.
          <br><br>
          Our main goal is not only to provide a portfolio site where you can showcase your work, but also to create a space where artists can interact with each other and collaborate on creative feature.
          <br><br>
          By choosing to support Upy, you are showing your commitment to our platform and helping us continue to grow and improve. We value your input and are always open to hearing your suggestions for new features or improvements. Any funds that we receive through sponsorship will be used to cover our server and other expenses, as well as allow us to hire additional developers to help us work more efficiently and effectively.
          <br><br>
          Thank you for considering a supporter of Upy and for supporting the artistic community.<br><br>
          Much love~ 😘
        </div>
      </div>

      <div class="mt-10">
        <span class="text-lg italic">Why should I support Upy?</span>

        <div class="grid gap-3 mt-4 grid-cols">
          <!-- support the team -->
          <div class="flex flex-col p-6 w-full text-center rounded-md shadow-sm hover:shadow-xl theme-color">
            <Icon
              :name="'i-fluent-people-checkmark-24-regular'"
              class="text-4xl"
            />
            <div class="mt-4 text-left">
              <span class="text-base font-bold">Support the team</span>
              <div class="mt-1">
                A dedicated team of professionals (currently consisting of one individual) operates Upy, and your support will enable them to continually improve and enhance the platform.
              </div>
            </div>
          </div>

          <!-- server -->
          <div class="flex flex-col p-6 w-full text-center rounded-md shadow-sm hover:shadow-xl theme-color">
            <Icon
              :name="'i-ion-server-outline'"
              class="text-4xl"
            />
            <div class="mt-4 text-left">
              <span class="text-base font-bold">Server and other bills</span>
              <div class="mt-1">
                Donations are utilized to cover the expenses associated with maintaining and operating the website, including server costs and other necessary bills.
              </div>
            </div>
          </div>

          <!-- no ads -->
          <!-- <div class="flex flex-col p-6 w-full text-center rounded-md shadow-sm hover:shadow-xl theme-color">
            <Icon :name="'i-ion-sad-outline'" class="text-4xl" />
            <div class="mt-4 text-left">
              <span class="text-base font-bold">Stay Ad-free</span>
              <div class="mt-1">
                Your donations help keep the platform free from annoying ads and outside sponsors.
              </div>
            </div>
          </div> -->

          <!-- open-source -->
          <!-- <div class="flex flex-col p-6 w-full text-center rounded-md shadow-sm hover:shadow-xl theme-color">
            <Icon :name="'i-ion-people-circle-outline'" class="text-4xl" />
            <div class="mt-4 text-left">
              <span class="text-base font-bold">Become open-source</span>
              <div class="mt-1">
                Your donations help make this platform open-source, so we can reward all the contributors who have worked hard to help making this platform better.
              </div>
            </div>
          </div> -->

          <!-- make the platform better -->
          <div class="flex flex-col p-6 w-full text-center rounded-md shadow-sm hover:shadow-xl theme-color">
            <Icon
              :name="'i-ion-hand-right-outline'"
              class="text-4xl"
            />
            <div class="mt-4 text-left">
              <span class="text-base font-bold">Make the platform even better</span>
              <div class="mt-1">
                Your donations to our platform serve as encouragement for us to continue adding new features and improving the overall user experience. We welcome any feature requests as they demonstrate your commitment to and appreciation for the platform. Your support enables us to continuously enhance and refine the platform for the benefit of all users.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <span class="text-lg">Donation options</span>

        <div class="grid grid-cols-1 gap-3 mt-4 md:grid-cols-2 lg:grid-cols-3">
          <!-- PayPal -->
          <a
            :href="'https://paypal.me/noric1902'"
            target="_blank"
            class="flex flex-col justify-center p-6 w-full text-center align-middle rounded-md shadow-sm hover:shadow-xl theme-color"
          >
            <img
              class="mx-auto mb-4 w-14 h-14"
              src="https://cdn.iconscout.com/icon/free/png-256/paypal-1527455-1298285.png"
            >
            <span class="mx-auto text-lg font-bold">PayPal</span>
          </a>

          <!-- patreon -->
          <a
            :href="'https://patreon.com/upydotmoe'"
            target="_blank"
            class="flex flex-col justify-center p-6 w-full text-center align-middle rounded-md shadow-sm hover:shadow-xl theme-color"
          >
            <img
              class="mx-auto mb-4 w-14 h-14"
              src="https://cdn.iconscout.com/icon/free/png-256/patreon-282262.png"
            >
            <span class="mx-auto text-lg font-bold">Patreon</span>
          </a>

          <!-- ko-fi -->
          <a
            :href="'https://ko-fi.com/upydotmoe'"
            target="_blank"
            class="flex flex-col justify-center p-6 w-full text-center align-middle rounded-md shadow-sm hover:shadow-xl theme-color"
          >
            <img
              class="mx-auto mb-4 w-14 h-14"
              src="https://cdn.iconscout.com/icon/free/png-256/ko-fi-3628878-3030018.png"
            >
            <span class="mx-auto text-lg font-bold">ko-fi</span>
          </a>

          <!-- saweria -->
          <a
            :href="'https://saweria.co/upydotmoe'"
            target="_blank"
            class="flex flex-col justify-center p-6 w-full text-center align-middle rounded-md shadow-sm hover:shadow-xl theme-color"
          >
            <img
              class="mx-auto mb-4 w-14 h-14"
              src="https://d1fdloi71mui9q.cloudfront.net/vqAU6rLS5ySXzmBdFaaU_saweria%20icon.png"
            >
            <span class="mx-auto text-lg font-bold">saweria</span>
          </a>

          <!-- github sponsor -->
          <a
            :href="'https://github.com/sponsors/upydotmoe'"
            target="_blank"
            class="flex flex-col justify-center p-6 w-full text-center align-middle rounded-md shadow-sm hover:shadow-xl theme-color"
          >
            <img
              class="mx-auto mb-4 w-14 h-14"
              src="/others/gh-sponsor.png"
            >
            <span class="mx-auto text-lg font-bold">Github Sponsor</span>
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
