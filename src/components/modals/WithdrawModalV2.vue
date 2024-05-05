<template>

      <div class="d-flex justify-content-between w-100">
        <div style="cursor: pointer" @click="
          depositStep == 1 ? $emit('changeVisibleDeposit') : depositStep--
          ">
          <img :src="arrow_back" />
        </div>
        <div style="cursor: pointer" @click="$emit('changeVisibleDeposit')">
          <img :src="close_modal_icon" />
        </div>
      </div>

      <div class="px-5" v-if="!depositFinished">
        <div class="modal_body_header">
          <h3>{{ $t('withdrawal_preview') }}</h3>
        </div>
        <div style="
            border: 1px solid rgba(163, 164, 165, 0.2);
            border-radius: 20px;
            color: white;
          " class="my-2">
          <div class="fs-6 fw-bold p-2" style="border-bottom: 1px solid rgba(163, 164, 165, 0.2)">
            {{ $t('you_providing') }}
          </div>

          <div class="my-3">
            <div class="d-flex align-items-center justify-content-between px-3 gap-3">
              <div class="d-flex flex-column align-items-start text-white">
                <div>
                  {{ (poolShare.balance * lineNumberPercent).toFixed(2) }}
                  {{
                    pool.tokens.map((t) => `${t.weight}%${t.symbol}`).join('/')
                  }}
                </div>
                <div class="font-['Roboto_Mono',_monospace]">
                  ${{ usdSummary }} ({{
                    (
                      (poolShare.balance * lineNumberPercent) /
                      (pool.lpPrice * pool.totalShares)
                    ).toFixed(2)
                  }}%)
                </div>
              </div>
              <div>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="20" fill="#CFB428" />
                  <mask id="mask0_5891_7647" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="40"
                    height="40">
                    <circle cx="20" cy="20" r="20" fill="#3E3E3E" />
                  </mask>
                  <g mask="url(#mask0_5891_7647)">
                    <rect x="-12.6309" y="7.43506" width="33.8175" height="33.8175"
                      transform="rotate(-30 -12.6309 7.43506)" fill="#2A5CA9" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div style="
            border: 1px solid rgba(163, 164, 165, 0.2);
            border-radius: 20px;
            color: white;
          " class="my-4">
          <div class="fs-6 fw-bold p-2" style="border-bottom: 1px solid rgba(163, 164, 165, 0.2)">
            {{ $t('you_expected_to_receive') }}
          </div>

          <div class="my-3">
            <div v-for="(token, index) in allPossibleTokens" :key="`tokens-key-${index}`"
              class="d-flex align-items-center justify-content-between px-3 gap-3">
              <div class="d-flex flex-column align-items-start text-white">
                <div class="font-['Roboto_Mono',_monospace]">{{ token.withdrawAmount }} {{ token.symbol }}</div>
                <div class="font-['Roboto_Mono',_monospace]">${{ token.usdAmount }}</div>
              </div>
              <div class="d-flex align-items-center">
                <img :src="getTokenEntity(token.symbol, 'short').icon" width="60" class="p-2" />
                <!-- <div class="d-flex flex-column ">
                <div class="modal_body_header">{{ token.symbol }}</div>
                <div class="modal_body_header">{{ token.name }}</div>
              </div> -->
              </div>
            </div>
          </div>
        </div>

        <div style="
            border: 1px solid rgba(163, 164, 165, 0.2);
            border-radius: 20px;
            color: white;
          " class="my-4">
          <div class="fs-6 fw-bold p-2" style="border-bottom: 1px solid rgba(163, 164, 165, 0.2)">
            {{ $t('summary') }}
          </div>
          <div class="d-flex flex-column p-2" style="font-size: 14px; color: rgba(221, 221, 221, 1)">
            <div class="d-flex justify-content-between align-items-center">
              <div>{{ $t('total') }}</div>
              <div class="d-flex gap-1 font-['Roboto_Mono',_monospace]">${{ usdSummary }}</div>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <div>{{ $t('value_loss') }}</div>
              <div class="d-flex gap-1 font-['Roboto_Mono',_monospace]">{{ priceImpact }}%</div>
            </div>
          </div>
        </div>

        <div v-if="!confirmingState" class="compose_pool_connect_wallet" @click="OnWithdrawClick">
          {{ $t('withdraw') }}
        </div>
        <div v-else-if="confirmingState" class="compose_pool_connect_wallet" @click="OnWithdrawClick">
          {{ $t('confirming') }} <span class="button_loader pl-2"></span>
        </div>
      </div>
      <!-- <div v-else-if="depositFinished">
        <ConfirmationReceipt
          :header_text="'Withdrawal confirmed!'"
          :header_subtext="'Successfully withdraw your tokens'"
        />
      </div> -->

  <!-- <Fireworks
    ref="fw"
    v-if="mounted"
    :autostart="false"
    :options="options"
    :style="{
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      position: 'fixed',
      background: 'none',
      zIndex: 0
    }"
  /> -->
</template>

<script setup>
import arrow_back from '@/assets/icons/arrow/arrow_back.svg'
import close_modal_icon from '@/assets/icons/arrow/close_modal_icon.svg'
import { getTokenEntity } from '@/lib/helpers/util'
import { defineProps, defineEmits, ref, watch } from 'vue'
import { useExitPool } from '@/composables/poolActions/withdraw/useExitPool'
import { configService } from '@/services/config/config.service'
import { GetDisplayStringError } from '@/lib/utils/balancer/helpers/displayError'
import { networkId, DisplayNetwork } from '@/composables/useNetwork'
import { formatNotificationDate, bnum } from '@/lib/utils'
import { formatUnits } from '@ethersproject/units'
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue'
import 'vue3-toastify/dist/index.css'
// import { Fireworks } from '@fireworks-js/vue'

// const fw = ref()
// const options = ref({ opacity: 0.5 })
// const mounted = ref(false)


// async function startFireworks() {
//   mounted.value = true
//   if (!fw.value) return
//   fw.value.start()
//   await new Promise((resolve) => setTimeout(resolve, 5000))
//   await fw.value.waitStop()
//   mounted.value = false
// }


const props = defineProps([
  'visibleDepositModal',
  'account',
  'poolShare',
  'usdSummary',
  'allSelectedTokens',
  'allPossibleTokens',
  'init',
  'lineNumberPercent',
  'getTokenWithdrawAmount',
  'changeVisibleDeposit',
  'total',
  'priceImpact',
  'pool',
  'bptIn',
  'bptBalance',
  'allSelectedTokens',
  'exactOut',
])
const emit = defineEmits(['changeVisibleDeposit'])

var emitter = require('tiny-emitter/instance')

const depositFinished = ref(false)
const confirmingState = ref(false)

const ConfirmToastPending = ref("")
const popupType = ref('error')
const popupText = ref('Error happened!')
const popupSubText = ref('')
const popupLink = ref('')
const notify = () => {
  toast(Toast, {
    closeOnClick: false,
    theme: 'dark',
    type: popupType.value,
    autoClose: 5000,
    closeButton: false,
    position: toast.POSITION.TOP_RIGHT,
    data: {
      header_text: popupText.value,
      toast_text: popupSubText.value,
      tx_link: popupLink.value,
    },
  })
}

// const notifyWithdraw = (popupText, popupSubText, popupLink, popupType) => {
//   toast(Toast, {
//     closeOnClick: false,
//     theme: 'dark',
//     type: popupType.value,
//     autoClose: 5000,
//     closeButton: false,
//     position: toast.POSITION.TOP_RIGHT,
//     data: {
//       header_text: popupText.value,
//       toast_text: popupSubText.value,
//       tx_link: popupLink.value,
//     },
//   })
// }

function SetErrorTxPopup(subtext) {
  popupType.value = 'error'
  popupText.value = 'Error happened!'
  popupSubText.value = subtext
  popupLink.value = ``
}

let conf = configService.getNetworkConfig(networkId.value)
// function SetSuccessTxPopup(hash, subtext) {
//   let conf = configService.getNetworkConfig(
//     networkId.value,
//   )
//   popupType.value = "success"
//   popupText.value = "Tx confirmed!"
//   popupSubText.value = subtext
//   popupLink.value = `${conf.explorer}/tx/${hash}`
// }

function roundDown(number, decimals) {
  decimals = decimals || 0
  return (
    Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals)
  ).toString()
}
const txLink = ref('')

async function OnWithdrawClick() {


  txLink.value = ''
  let amountsOut = []
  if (props.allSelectedTokens.length > 1)
    amountsOut = props.allSelectedTokens.map((t, i) =>
      props.getTokenWithdrawAmount(t, true, props.pool.tokens[i].decimals),
    )
  else
    amountsOut = props.pool.tokens.map((t) =>
      t.address == props.allSelectedTokens[0].address
        ? roundDown(parseFloat(props.getTokenWithdrawAmount(t, false, 6)), 6)
        : '0',
    )
  let tokensOut = props.allSelectedTokens.map((t) => t.address)
  const fractionBasisPoints =
    (parseInt(`${props.lineNumberPercent}4`) / 1000) * 100000
  let propBpt = bnum(props.bptBalance)
    .times(fractionBasisPoints)
    .div(100000)
    .toFixed(props.pool.onchain.decimals)
  if (props.lineNumberPercent == 100) propBpt = props.bptBalance.toString()
  let outIndex = null
  if (props.allSelectedTokens.length == 1) {
    console.log(props.bptIn)
    if (props.lineNumberPercent != 100)
      outIndex = tokensOut.findIndex(
        (t) => t == props.allSelectedTokens[0].address,
      )
    propBpt = parseFloat(
      formatUnits(props.bptIn, props.pool.onchain.decimals),
    ).toFixed(props.pool.onchain.decimals)
  }





  let tx = await useExitPool(
    { value: props.pool },
    props.account,
    amountsOut,
    tokensOut,
    propBpt,
    props.lineNumberPercent == 100,
    outIndex,
    confirmingState,
    ConfirmToastPending
  )

 
 if (confirmingState.value === true) {
  ConfirmToastPending.value = toast.loading(Toast, {
  data: {
    header_text: 'Withdraw pending',
    toast_text: `${props.usdSummary} USD - ${formatNotificationDate(
      new Date().getTime(),
    )}`,
    tx_link: '',
    speedUp: '/',
  },
  position: toast.POSITION.TOP_LEFT,
  theme: 'dark',
  closeOnClick: false,
})
 }

  
  if (tx && !tx.error) {
    txLink.value = `${configService.getNetworkConfig(networkId.value).explorer
      }/tx/${tx.hash}`





    emitter.emit('addNotification', {
      type: 'Withdraw',
      value: `${props.usdSummary} USD - ${formatNotificationDate(
        new Date().getTime(),
      )}`,
      status: 'Success',
      hash: tx.hash,
      network: DisplayNetwork[networkId.value],
    })
    await tx.wait()


    toast.update(ConfirmToastPending.value, {
      render: Toast,
      data: {
        header_text: 'Withdraw confirmed',
        toast_text: `${props.usdSummary} USD - ${formatNotificationDate(
          new Date().getTime(),
        )}`,
        tx_link: `${conf.explorer}/tx/${tx.hash}`,
        speedUp: '',
      },

      closeOnClick: false,
      autoClose: 10000,
      closeButton: false,
      type: 'success',
      isLoading: false,
    })

    // SetSuccessTxPopup(tx.hash, "Tokens successfully withdrew")
    // notify()
    await props.init()
    // startFireworks()
    emit('changeVisibleDeposit')
    depositFinished.value = true
    confirmingState.value = false

  } else if (tx.error) {
    // setTimeout(() => {
    //   toast.update(ConfirmToastPending, {
    //   render: Toast,
    //   data: {
    //     header_text: 'Confirm rejected',
    //     toast_text: `You rejected confirm`,
    //     tx_link: '',
    //     speedUp: '',
    //   },
    //   autoClose: 7000,
    //   closeOnClick: false,
    //   closeButton: false,
    //   type: 'error',
    //   isLoading: false,
    // })
    // confirmingState.value = false
    // }, 2000);
   
    setTxError(tx)
    notify()
  }
}
function setTxError(e) {

  let errorCode = e.error.data.message
  SetErrorTxPopup(GetDisplayStringError(errorCode))
}

watch(
  () => props.visibleDepositModal,
  () => {
    console.log('111')
    depositFinished.value = false
  },
)

// watch(fw, () => startFireworks())
</script>
<style lang="scss" scoped>



.modal_body_header {
  font-family: Montserrat;
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: -0.5px;
  color: white;
}



</style>