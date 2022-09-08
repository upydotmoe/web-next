<template>
  <Layout
    :with-footer="true"
  >
    <div class="flex flex-col gap-20">
      <!-- header -->
      <div class="flex flex-col p-10 w-full text-xl text-center rounded-md theme-color">
        <p class="mb-6 font-bold">
          Unlock all features for only ${{ amount }} a month with PRO version
        </p>

        <a href="#pay" class="p-2 mx-auto w-2/5 text-lg font-bold text-white rounded-md button-color hover:shadow-lg">
          GET PRO VERSION
        </a>
      </div>

      <div class="flex flex-col gap-10">
        <div class="flex flex-row justify-center mb-4 text-lg italic text-center">
          <Icon class="mr-2" :name="'i-twemoji-thinking-face'" :text-size="'text-4xl'" />
          <span class="mt-1">What features will be unlocked?</span>
        </div>

        <div class="flex flex-row w-full">
          <!-- preview -->
          <div class="mr-4 w-4/6 h-36 bg-blue-300 rounded-md"></div>
          <div class="w-full">
            <h1 class="mb-2 text-lg font-bold">Sort by Popularity</h1>
            Find popular artwork with advanced options
          </div>
        </div>

        <div class="flex flex-row w-full">
          <div class="w-full">
            <h1 class="mb-2 text-lg font-bold">Sort by Popularity</h1>
            Find popular artwork with advanced options
          </div>
          <div class="mr-4 w-4/6 h-36 bg-blue-300 rounded-md"></div>
        </div>

        <div class="flex flex-row w-full">
          <!-- preview -->
          <div class="mr-4 w-4/6 h-36 bg-blue-300 rounded-md"></div>
          <div class="w-full">
            <h1 class="mb-2 text-lg font-bold">Sort by Popularity</h1>
            Find popular artwork with advanced options
          </div>
        </div>

        <div class="flex flex-row w-full">
          <div class="w-full">
            <h1 class="mb-2 text-lg font-bold">Sort by Popularity</h1>
            Find popular artwork with advanced options
          </div>
          <div class="mr-4 w-4/6 h-36 bg-blue-300 rounded-md"></div>
        </div>

        <div class="flex flex-row w-full">
          <!-- preview -->
          <div class="mr-4 w-4/6 h-36 bg-blue-300 rounded-md"></div>
          <div class="w-full">
            <h1 class="mb-2 text-lg font-bold">Sort by Popularity</h1>
            Find popular artwork with advanced options
          </div>
        </div>

        <div class="flex flex-row w-full">
          <div class="w-full">
            <h1 class="mb-2 text-lg font-bold">Sort by Popularity</h1>
            Find popular artwork with advanced options
          </div>
          <div class="mr-4 w-4/6 h-36 bg-blue-300 rounded-md"></div>
        </div>
      </div>
    
      <div id="pay" class="p-10 w-full text-center rounded-md theme-color">
        <div v-show="!isPro">
          <div class="mb-4 text-lg font-bold">Get PRO version for only ${{ amount }}/month</div>

          <div id="smart-button-container" class="mx-auto w-4/6">
            <div style="te3h-36-align: center;">
              <div id="paypalRef" ref="paypalRef"></div>
            </div>
          </div>
        </div>

        <div v-show="isPro" class="text-xl font-bold">
          <p class="text-green-500">PRO version active</p>
          <p class="mt-2 text-sm font-normal">Expiry Date: 00/00/0000</p>
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

onBeforeMount(async () => {
  await checkCurrentSubscriptionStatus()
})

const isPro = ref(false)
const checkCurrentSubscriptionStatus = async () => {
  const [data, error] = await proApi.checkSubscriptionStatus()

  if (error) {
    isPro.value = false
  } else {
    if (data.is_pro) {
      isPro.value = true
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
      console.log(err);
    }
  }).render(document.getElementById('paypalRef'))
}
</script>