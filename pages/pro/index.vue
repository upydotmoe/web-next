<template>
  <Layout
    :with-footer="true"
  >
    <div class="flex flex-col gap-20">
      <!-- header -->
      <div class="flex flex-col p-10 w-full text-xl text-center rounded-md theme-color">
        <div v-if="isPro" class="text-xl font-bold">
          <p class="flex flex-row gap-2 justify-center text-yellow-400">
            <Icon
              :name="'i-fluent-star-emphasis-24-regular'"
              :text-size="'text-3xl'"
              class="text-yellow-400"
            />
            PRO version active
          </p>

          <p class="mt-2 text-sm font-normal">Expires on/by {{ formatDate(validUntil, false, false) }}</p>
          
          <p class="flex flex-row gap-2 justify-center mt-8 text-sm italic font-normal">
            Thank you for your support, much love
            <Icon
              :name="'i-noto-heart-hands'"
              :text-size="'text-2xl'"
              class="text-red-500"
            />
          </p>
        </div>

        <div v-else>
          <p class="mb-6 font-bold">
            Unlock all features for only ${{ amount }} a month with PRO version
          </p>

          <a href="#pay" class="p-3 mx-auto w-2/5 text-base font-bold text-white rounded-md button-color hover:shadow-lg">
            GET PRO VERSION
          </a>
        </div>
      </div>

      <div class="features-grid">
        <div class="flex flex-row justify-center mb-4 text-lg italic text-center">
          <Icon class="mr-2" :name="'i-twemoji-thinking-face'" :text-size="'text-4xl'" />
          <span class="mt-1">What features will be unlocked?</span>
        </div>

        <!-- Multiple Image Upload -->
        <div class="feature">
          <img src="/pro/upload-multiple-images.png" />
          <div>
            <h1>More Image in One Post</h1>
            Break the limit and upload more images at once.
          </div>
        </div>

        <!-- Private Collection -->
        <div class="feature">
          <div>
            <h1>Private Collection</h1>
            Hide your secret collections from public so no one can see the artworks inside but yourself.
          </div>
          <img src="/pro/private-collection.png" />
        </div>

        <!-- Unlimited Collections -->
        <div class="feature">
          <img src="/pro/unlimited-collections.png" />
          <div>
            <h1>Unlimited Collection</h1>
            Break the limit and create as many collections as you want.
          </div>
        </div>

        <!-- Unlimited Collection Items -->
        <div class="feature">
          <div>
            <h1>Unlimited Collection Items</h1>
            Break the limit and add as many artworks you want to your collections.
          </div>
          <img src="/pro/unlimited-collection-items.png" />
        </div>

        <!-- Private Album -->
        <div class="feature">
          <img src="/pro/private-album.png" />
          <div>
            <h1>Private Album</h1>
            Create a private album and add your work to it.
          </div>
        </div>

        <!-- Unlimited Album -->
        <div class="feature">
          <div>
            <h1>Unlimited Albums</h1>
            Break the limit and create as many albums as you want.
          </div>
          <img src="/pro/private-album.png" />
        </div>

        <!-- Unlimited Album Items -->
        <div class="feature">
          <img src="/pro/private-album.png" />
          <div>
            <h1>Unlimited Album Items</h1>
            Break the limit and add as many artworks you want to your albums.
          </div>
        </div>

        <!-- Follow Privately -->
        <div class="feature">
          <div>
            <h1>Follow Someone Privately</h1>
            Hide who you follow with this, so no one that you followed that user.
          </div>
          <img src="/pro/follow-privately.png" />
        </div>

        <!-- Hide My Followings -->
        <div class="feature">
          <img src="/pro/hide-followings.png" />
          <div>
            <h1>Hide Who You Follow</h1>
            Hide who you follow, so your friends or your family don't know whoever you follow.
          </div>
        </div>

        <!-- Hide My Followers -->
        <div class="feature">
          <div>
            <h1>Hide Who Following You</h1>
            Hide your followers from public, so no one can see who following you.
          </div>
          <img src="/pro/hide-followers.png" />
        </div>

        <!-- List All My Liked Artworks -->
        <div class="feature">
          <img src="/pro/list-all-my-liked-arts.png" />
          <div>
            <h1>List All My Liked Artworks</h1>
            Break the limit and view your previously liked artworks.
          </div>
        </div>

        <div class="text-lg italic font-bold text-center">
          and many more coming..
        </div>
      </div>
    
      <div
        v-if="!isPro && isPaymentActive"
        id="pay"
        class="p-10 w-full text-center rounded-md theme-color"
      >
        <div class="mb-4 text-lg font-bold">Get PRO version for only ${{ amount }}/month</div>

        <div id="smart-button-container" class="mx-auto w-4/6">
          <div style="te3h-36-align: center;">
            <div id="paypalRef" ref="paypalRef"></div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
// stores
import useAuthStore from '@/stores/auth.store'

import Layout from '~/components/layouts/Layout.vue'
import Icon from '~/components/globals/Icon.vue'

// stores
const auth = useAuthStore()

// composition
const { oApiConfiguration, fetchOptions } = useApiFetch()
const proApi = usePro(oApiConfiguration, fetchOptions())
const settingAPi = useSetting(oApiConfiguration, fetchOptions())

onBeforeMount(async () => {
  await checkPaymentStatus()
  await checkCurrentSubscriptionStatus()
})

/**
 * Check if payment is currently active or not
 */
const isPaymentActive = ref(false)
const checkPaymentStatus = async () => {
  const [data, error] = await settingAPi.getSetting('is_payment_active')

  if (error) {
    isPaymentActive.value = false
  } else {
    isPaymentActive.value = data == 1 ? true : false
  }
}

const isPro = ref(false)
const validUntil = ref('')
const checkCurrentSubscriptionStatus = async () => {
  const [data, error] = await proApi.checkSubscriptionStatus()

  if (error) {
    isPro.value = false
  } else {
    if (data.is_pro) {
      isPro.value = true
      validUntil.value = data.until
    } else {
      isPro.value = false
    }
  }
}

onMounted (() => {
  const script = document.createElement("script")
  script.src = "https://www.paypal.com/sdk/js?client-id=AbFZEy35RTD5A3oCINCJ0m6gfaofU2B95o8gOMRq7ry8C58Uw9hfVNEeVejkXLDjqHOt0ueQ_GoswZei&enable-funding=venmo&currency=USD"
  script.addEventListener("load", initPaypal)
  document.body.appendChild(script)
})

const amount = ref('2.99')
const paypalRef = ref('paypalRef')
const initPaypal = () => {
  window.paypal.Buttons({
    style: {
      shape: 'rect',
      color: 'blue',
      layout: 'vertical',
      label: 'paypal',
    },

    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{"description":"Upy 1 Month (Sandbox)","amount":{"currency_code":"USD","value": amount.value}}]
      });
    },

    onApprove: async function(data, actions) {
      return await actions.order.capture().then(async function(orderData) {
        // console.log(orderData)
        // console.log('Merchant ID:', orderData.purchase_units[0].payee.merchant_id)

        if (orderData.purchase_units[0].payee.merchant_id === 'NUTUV969GELDJ' && orderData.purchase_units[0].amount.value == amount.value) {
          const [success, error] = await proApi.registerProVersion({
            paymentType: 'paypal',
            amount: amount.value,
            orderData: JSON.stringify(orderData)
          })

          if (success) {
            isPro.value = true
          } else {
            console.error('something went wrong!', error)
          }
        }
      });
    },

    onError: function(err) {
      console.log('paypal error:', err)
    }
  }).render(document.getElementById('paypalRef'))
}
</script>

<style lang="scss" scoped>
.features-grid {
  @apply flex flex-col gap-y-16 mb-20;

  .feature {
    @apply flex flex-row gap-4 justify-between w-full;

    img {
      @apply object-cover w-4/6 h-40 rounded-md border-4 border-blue-300;
    }

    div {
      @apply w-full;
      
      h1 {
        @apply mb-2 text-lg font-bold;
      }
    }
  }
}
</style>