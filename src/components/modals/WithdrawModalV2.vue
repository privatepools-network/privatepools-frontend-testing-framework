<template>
  <div class="d-flex justify-content-between w-100">
    <div v-if="approveStep !== 5" class="flex items-center gap-2 py-2">
      <img :src="arrow_back" class="w-2 cursor-pointer" @click="$emit('changeVisibleDepositBack')" />
      <div class="text-[14px] text-white">Withdraw Liquidity</div>
    </div>
  </div>

  <div class="px-1" v-if="!depositFinished">
    <div class="my-2 bg-[#22222224] shadow-md rounded-2xl text-white">
      <div class="text-[13px] font-normal p-2" style="border-bottom: 1px solid rgba(163, 164, 165, 0.2)">
        {{ $t('you_providing') }}
      </div>

      <div class="my-3">
        <div class="d-flex align-items-center justify-content-between p-3 gap-3">
          <div class="d-flex flex-column align-items-start text-white">
            <div class="text-[13px]">
              {{ (poolShare.balance * lineNumberPercent).toFixed(2) }}
              {{ pool.tokens.map((t) => `${parseFloat(t.weight * 100).toFixed(0)}%${t.symbol}`).join('/') }}
            </div>
            <div class="font-['Roboto_Mono',_monospace] text-[13px]">
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
                <rect x="-12.6309" y="7.43506" width="33.8175" height="33.8175" transform="rotate(-30 -12.6309 7.43506)"
                  fill="#2A5CA9" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="my-4 bg-[#22222224] shadow-md rounded-2xl text-white">
      <div class="text-[13px] font-normal p-2" style="border-bottom: 1px solid rgba(163, 164, 165, 0.2)">
        {{ $t('you_expected_to_receive') }}
      </div>

      <div class="my-3">
        <div v-for="(token, index) in allPossibleTokens" :key="`tokens-key-${index}`"
          class="d-flex align-items-center justify-content-between p-3 gap-3">
          <div class="d-flex flex-column align-items-start text-white">
            <div class="font-['Roboto_Mono',_monospace] text-[13px]">
              {{ token.withdrawAmount }} {{ token.symbol }}
            </div>
            <div class="font-['Roboto_Mono',_monospace] text-[13px]">
              ${{ token.usdAmount }}
            </div>
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

    <div class="my-4 bg-[#22222224] shadow-md rounded-2xl text-white">
      <div class="text-[13px] font-normal p-2" style="border-bottom: 1px solid rgba(163, 164, 165, 0.2)">
        {{ $t('summary') }}
      </div>
      <div class="d-flex flex-column p-2 font-['Roboto_Mono',_monospace] text-[13px]"
        style="color: rgba(221, 221, 221, 1)">
        <div class="d-flex justify-content-between align-items-center">
          <div>{{ $t('total') }}</div>
          <div class="d-flex gap-1 font-['Roboto_Mono',_monospace] text-[13px]">
            ${{ usdSummary }}
          </div>
        </div>
        <!-- <div class="d-flex justify-content-between align-items-center">
          <div>{{ $t('value_loss') }}</div>
          <div class="d-flex gap-1 font-['Roboto_Mono',_monospace] text-[13px]">
            {{ priceImpact }}%
          </div>
        </div> -->
      </div>
    </div>

    <div v-if="!confirmingState" class="compose_pool_connect_wallet" @click="OnWithdrawClick">
      {{ $t('withdraw') }}
    </div>
    <div v-else-if="confirmingState" class="compose_pool_connect_wallet">
      {{ $t('confirming') }} <span class="button_loader pl-2"></span>
    </div>
  </div>
  <div v-else-if="depositFinished">
    <div>
      <div class="py-4 flex flex-col items-center justify-center mb-5">
        <ConfettiExplosion v-if="confettiVisible" :particleSize="8" :duration="5000"
          :colors="['#00E0FF', '#00c9ff', '#2E3191', '#41BBC7']" />
        <div class="text-[20px] text-white font-medium mb-3">
          Liquidity removed!
        </div>
        <svg @click="explode" class="mb-3" width="74" height="74" viewBox="0 0 74 74" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M36.9987 0.333008C16.7587 0.333008 0.332031 16.7597 0.332031 36.9997C0.332031 57.2397 16.7587 73.6663 36.9987 73.6663C57.2387 73.6663 73.6654 57.2397 73.6654 36.9997C73.6654 16.7597 57.2387 0.333008 36.9987 0.333008ZM27.062 52.7297L13.8987 39.5663C13.5592 39.2269 13.29 38.8239 13.1062 38.3803C12.9225 37.9368 12.828 37.4614 12.828 36.9813C12.828 36.5013 12.9225 36.0259 13.1062 35.5824C13.29 35.1388 13.5592 34.7358 13.8987 34.3963C14.2382 34.0569 14.6412 33.7876 15.0847 33.6039C15.5282 33.4202 16.0036 33.3256 16.4837 33.3256C16.9638 33.3256 17.4392 33.4202 17.8827 33.6039C18.3262 33.7876 18.7292 34.0569 19.0687 34.3963L29.6654 44.9563L54.892 19.7297C55.5776 19.0441 56.5075 18.6589 57.477 18.6589C58.4466 18.6589 59.3764 19.0441 60.062 19.7297C60.7476 20.4153 61.1328 21.3451 61.1328 22.3147C61.1328 23.2842 60.7476 24.2141 60.062 24.8997L32.232 52.7297C31.8928 53.0696 31.4899 53.3393 31.0463 53.5233C30.6028 53.7073 30.1272 53.802 29.647 53.802C29.1668 53.802 28.6913 53.7073 28.2477 53.5233C27.8042 53.3393 27.4012 53.0696 27.062 52.7297Z"
            fill="#00E0FF" />
        </svg>
        <div class="text-[15px] text-[#888888] font-medium">
          Successfully removed liquidity.
        </div>
      </div>

      <div class="flex justify-evenly mb-3">
        <a :href="`https://bscscan.com/tx/${txHash}`" class="text-decoration-none" target="_blank">
          <div class="compose_pool_connect_wallet flex items-center">
            Receipt
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_558_15327)">
                <path
                  d="M10.5 7.58333V11.0833C10.5 11.3928 10.3771 11.6895 10.1583 11.9083C9.9395 12.1271 9.64275 12.25 9.33333 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V4.66667C1.75 4.35725 1.87292 4.0605 2.09171 3.84171C2.3105 3.62292 2.60725 3.5 2.91667 3.5H6.41667"
                  stroke="#05061B" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8.75 1.75H12.25V5.25" stroke="#05061B" stroke-width="1.16667" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M5.83203 8.16667L12.2487 1.75" stroke="#05061B" stroke-width="1.16667" stroke-linecap="round"
                  stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_558_15327">
                  <rect width="14" height="14" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </a>
        <a :href="`/pools`" class="text-decoration-none">
          <div class="compose_pool_connect_wallet">Pools</div>
        </a>
      </div>
    </div>
  </div>

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
import { defineProps, defineEmits, ref, watch, nextTick } from 'vue'
import { useExitPool } from '@/composables/poolActions/withdraw/useExitPool'
import { configService } from '@/services/config/config.service'
import { GetDisplayStringError } from '@/lib/utils/balancer/helpers/displayError'
import { networkId, DisplayNetwork } from '@/composables/useNetwork'
import { formatNotificationDate, bnum } from '@/lib/utils'
import { formatUnits } from '@ethersproject/units'
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue'
import 'vue3-toastify/dist/index.css'
import ConfettiExplosion from "vue-confetti-explosion";
import { useSound } from '@vueuse/sound'
import successSound from '@/assets/sounds/success_sound.mp3'
import errorSound from '@/assets/sounds/error_sound.mp3'


const playSuccess = useSound(successSound, { volume: 1 })
const playError = useSound(errorSound, { volume: 1 })

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


const confettiVisible = ref(false);

const explode = async () => {
  confettiVisible.value = false;
  await nextTick();
  confettiVisible.value = true;
};


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


const emit = defineEmits(['changeVisibleDeposit', 'changeVisibleDepositBack'])

const depositFinished = ref(false)
const confirmingState = ref(false)
// hardcoded tx
const txHash = ref('')

// const ConfirmToastPending = ref('')
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
    closeButton: true,
    position: toast.POSITION.TOP_RIGHT,
    data: {
      header_text: popupText.value,
      toast_text: popupSubText.value,
      tx_link: popupLink.value,
    },
  })
}

function SetErrorTxPopup(subtext) {
  popupType.value = 'error'
  popupText.value = 'Error happened!'
  popupSubText.value = subtext
  popupLink.value = ``
}

let conf = configService.getNetworkConfig(networkId.value)

function roundDown(number, decimals) {
  decimals = decimals || 0
  return (
    Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals)
  ).toString()
}
const txLink = ref('')
const soundError = ref(false)

async function OnWithdrawClick() {
  const ConfirmToastPending = toast.loading(Toast, {
    data: {
      header_text: 'Withdraw pending',
      toast_text: `Withdraw confirming - ${formatNotificationDate(
        new Date().getTime(),
      )}`,
      tx_link: '',
      speedUp: '/',
    },
    position: toast.POSITION.TOP_RIGHT,
    theme: 'dark',
    closeOnClick: false,
  })
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
    false,
    outIndex,
    confirmingState,
    // ConfirmToastPending,
  )

  // if (confirmingState.value === true) {

  // }

  if (tx && !tx.error) {
    txLink.value = `${configService.getNetworkConfig(networkId.value).explorer
      }/tx/${tx.hash}`
    txHash.value = tx.hash
    try {
      await tx.wait()
    } catch (error) {
      playError.play()
      soundError.value = true
      toast.update(ConfirmToastPending, {
        render: Toast,
        data: {
          header_text: 'Withdraw rejected',
          toast_text: `You rejected withdraw`,
          tx_link: '',
          speedUp: '',
        },
        autoClose: 7000,
        closeOnClick: false,
        closeButton: true,
        type: 'error',
        isLoading: false,
      })
      emit('changeVisibleDepositBack')
    }

    // SetSuccessTxPopup(tx.hash, "Tokens successfully withdrew")
    // notify()

    // soundError to not duplicate sounds
    if (soundError.value === false) {
      playSuccess.play()
    }


    toast.update(ConfirmToastPending, {
      render: Toast,
      data: {
        header_text: 'Tokens successfully withdrew',
        toast_text: `${parseFloat(props.usdSummary).toFixed(
          4,
        )} USD - ${formatNotificationDate(new Date().getTime())}`,
        tx_link: `${conf.explorer}/tx/${tx.hash}`,
        speedUp: '',
      },

      closeOnClick: false,
      autoClose: 10000,
      closeButton: true,
      type: 'success',
      isLoading: false,
    })

    await props.init()
    soundError.value = false
    // startFireworks()
    emit('changeVisibleDeposit')

    depositFinished.value = true
    explode()
    confirmingState.value = false
  } else if (tx.error) {
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
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: -0.5px;
  color: white;
}
</style>
