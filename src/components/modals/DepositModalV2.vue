<template>
  <div class="px-1" v-if="!depositFinished">
    <div class="my-2 bg-[#22222224] shadow-md rounded-2xl text-white">
      <div class="text-[13px] font-normal p-2" style="border-bottom: 1px solid rgba(163, 164, 165, 0.2)">
        {{ $t('you_providing') }}
      </div>

      <div class="mt-3">
        <div v-for="(token, index) in tokens" :key="`tokens-key-${index}`"
          class="d-flex align-items-center justify-content-between px-3 gap-3">
          <div class="d-flex flex-column align-items-start text-white">
            <div class="font-['Roboto_Mono',_monospace] text-[13px]">
              {{ token.depositAmount.toFixed(4) }} {{ token.symbol }}
            </div>
            <div class="font-['Roboto_Mono',_monospace] text-[13px]">
              ${{ token.usdAmount.toFixed(2) }}
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
        {{ $t('you_expected_to_receive') }}
      </div>

      <div class="my-3">
        <div class="d-flex align-items-center justify-content-between px-3 gap-3">
          <div class="d-flex flex-column align-items-start text-white font-['Roboto_Mono',_monospace] text-[13px]">
            <div class="font-['Roboto_Mono',_monospace] text-[13px]">
              {{ (total / pool.lpPrice).toFixed(2) }}
              {{ pool['display_name'] }}
              <!-- {{
                pool.tokens
                  .map(
                    (t) =>
                      `${parseFloat(t.weight * 100).toFixed(0)}%${t.symbol}`,
                  )
                  .join('/')
              }} -->
            </div>
            <!-- <div class="font-['Roboto_Mono',_monospace] text-[13px]">
              ${{ total.toFixed(2) }} ({{
                (total / ((pool.lpPrice * pool.totalShares) / 100)).toFixed(2)
              }}%)
            </div> -->
          </div>
          <div v-if="width > 768">
            <img :src="defaultIcon" class="w-[35px]" />
          </div>
        </div>
      </div>
    </div>

    <div class="my-4 bg-[#22222224] shadow-md rounded-2xl text-white">
      <div class="text-[13px] font-normal p-2" style="border-bottom: 1px solid rgba(163, 164, 165, 0.2)">
        {{ $t('summary') }}
      </div>
      <div class="d-flex flex-column p-2" style="font-size: 14px; color: rgba(221, 221, 221, 1)">
        <div class="d-flex justify-content-between align-items-center">
          <div>{{ $t('total') }}</div>
          <div class="d-flex gap-1 font-['Roboto_Mono',_monospace] text-[13px]">
            ${{ total.toFixed(2) }}
          </div>
        </div>
        <!-- <div class="d-flex justify-content-between align-items-center">
          <div>{{ $t('value_loss') }}</div>
          <div class="d-flex gap-1 font-['Roboto_Mono',_monospace] text-[13px]">
            {{ valueLoss }}%
          </div>
        </div> -->
        <div class="d-flex justify-content-between align-items-center">
          <div>{{ $t('potential_weekly_yield') }}</div>
          <div class="d-flex gap-1 font-['Roboto_Mono',_monospace] text-[13px]">
            {{ parseFloat(weeklyYield).toFixed(2) }}%
          </div>
        </div>
      </div>
    </div>

    <div class="my-3 d-flex justify-content-center position-relative">
      <!-- There should be iteration by length of every token that need approve - ApproveStep I guess will be index -->
      <div class="d-flex gap-1">
        <Step :activeStep="approveStep - 1" :displayedActiveStep="1" :mmActive="mmActive"
          :stepText="!wbnbSelected ? 'Wrap &\n Approve' : 'Approve'" />

        <div class="w-12 mt-1">
          <ProgressLoader v-if="(mmActive && approveStep === 4) || approveStep === 2" />
          <span v-else class="progress_loader_still"></span>
        </div>

        <Step :activeStep="approveStep - 2" :displayedActiveStep="2" :mmActive="mmActive" :stepText="'Deposit'" />
      </div>
    </div>

    <div class="compose_pool_connect_wallet" @click="OnPreviewClick()" v-if="approveStep === 1">
      {{ $t('approve_tokens_for_adding') }}
    </div>
    <div class="compose_pool_connect_wallet" v-if="approveStep === 2">
      {{ $t('approving_tokens') }}... <span class="button_loader pl-2"></span>
    </div>
    <div class="compose_pool_connect_wallet" @click="
      depositMethod === 'zap' ? $emit('zapperModalOpen') : OnPreviewClick(),
      $emit('changeApproveStep', 4)
      " v-else-if="approveStep === 3">
      Adding Liquidty
    </div>
    <div class="compose_pool_connect_wallet" v-else-if="approveStep === 4" 
    @click="
      depositMethod === 'zap' ? $emit('zapperModalOpen') : OnPreviewClick()"
      >
      {{fetchingZapTrades ? 'Fetching Trades' : 'Adding Liquidty'}} <span v-if="mmActive || fetchingZapTrades" class="button_loader pl-2"></span>
    </div>
    <div class="compose_pool_connect_wallet flex items-center gap-1 justify-center" @click="OnPreviewClick()" v-else-if="approveStep === 5">
      {{ $t('confirming') }} <span class="button_loader pl-2"></span>
    </div>
  </div>
  <!-- <div v-else-if="depositFinished">
        <ConfirmationReceipt :link="txLink" :header_text="'Deposit has settled'"
          :header_subtext="'Successfully deposit your tokens'" />
      </div> -->
      {{console.log('fetchingZapTrades!!!', fetchingZapTrades)}}
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import { useSound } from '@vueuse/sound'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import Toast from '@/UI/Toast.vue'
import Step from '@/UI/Step.vue'
import ProgressLoader from '@/UI/ProgressLoader.vue'
import { useJoinPool, getMaxBalance } from '@/composables/poolActions/deposit/useJoinPool'
import { useApproveTokens } from '@/composables/poolActions/deposit/useApproveTokens'
import { useDevice } from '@/composables/adaptive/useDevice'
import { networkId } from '@/composables/useNetwork'
import { configService } from '@/services/config/config.service'
import { getTokenEntity } from '@/lib/helpers/util'
import { formatNotificationDate } from '@/lib/utils'
import successSound from '@/assets/sounds/success_sound.mp3'
import errorSound from '@/assets/sounds/error_sound.mp3'
import defaultIcon from '@/assets/images/tokens/DEFAULT.png'

const playSuccess = useSound(successSound, { volume: 1 })
const playError = useSound(errorSound, { volume: 1 })
const { width } = useDevice()

const mmActive = ref(false)

// const popupType = ref("error")
// const popupSubText = ref("")
// const popupLink = ref("")
// const notify = () => {
//   toast(Toast, {
//     closeOnClick: true,
//     theme: "dark",
//     type: popupType.value,
//     autoClose: 5000,
//     closeButton: true,
//     position: toast.POSITION.TOP_RIGHT,
//     data: {
//       header_text: popupText.value,
//       toast_text: popupSubText.value,
//       tx_link: popupLink.value
//     }

//   });
// }
// function SetErrorTxPopup(subtext) {
//   popupType.value = "error"
//   popupText.value = "Error happened!"
//   popupSubText.value = subtext
//   popupLink.value = ``
// }

let conf = configService.getNetworkConfig(networkId.value)

// function SetSuccessTxPopup(hash, subtext) {

//   popupType.value = "success"
//   popupText.value = "Tx confirmed!"
//   popupSubText.value = subtext
//   popupLink.value = `${conf.explorer}/tx/${hash}`
// }

const props = defineProps([
  'fetchingZapTrades',
  'visibleDepositModal',
  'changeVisibleDepositClose',
  'tokens',
  'total',
  'valueLoss',
  'pool',
  'bptOut',
  'account',
  'fiatTotal',
  'weeklyYield',
  'approveStep',
  'depositMethod',
  'wbnbSelected',
  
])
const emit = defineEmits([
  'zapperModalOpen',
  'changeVisibleDepositClose',
  'changeApproveStep',
  'explode',
  'addedTXHash',
])


watch([props.tokens], () => {
  console.log('props.tokens', props.tokens)
})

const depositFinished = ref(false)

const txLink = ref('')
async function OnPreviewClick() {
  if (props.approveStep === 1) {
    // props.approveStep = 2
    emit('changeApproveStep', 2)
    let tokenAddresses = props.tokens.map((t) => t.address.toLowerCase())
    if (!props.wbnbSelected) {
      let index = tokenAddresses.indexOf('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
      if (index != -1) {
        tokenAddresses[index] = '0x0000000000000000000000000000000000000000'
      }
    }
    mmActive.value = true
    let success = await useApproveTokens(
      tokenAddresses,
      props.tokens.map((t) => getMaxBalance({ ...t, amount: t.depositAmount })),
      props.account,
      props.depositMethod,
      true
    )
    if (!success) {
      emit('changeApproveStep', 1)
      return
    }

    mmActive.value = false
    emit('changeApproveStep', 3)
  } else {
    mmActive.value = true
    const ConfirmToastPending = toast.loading(Toast, {
      data: {
        header_text: 'Add liquidity pending',
        toast_text: `${parseFloat(props.fiatTotal).toFixed(
          4,
        )} USD - ${formatNotificationDate(new Date().getTime())}`,
        tx_link: '',
        speedUp: '/',
      },
      position: toast.POSITION.TOP_RIGHT,
      theme: 'dark',
      closeOnClick: false,
    })
    let tx = await useJoinPool(
      props.pool,
      Object.values(props.pool.tokens),
      props.tokens.map((t) => t.depositAmount),
      props.account,
      props.bptOut,
    )

    emit('addedTXHash', tx.hash)

    txLink.value = `${configService.getNetworkConfig(networkId.value).explorer
      }/tx/${tx.hash}`

    // props.approveStep = 5

    emit('changeApproveStep', 5)
    emit('explode')

    if (tx.error) {
      // props.approveStep = 3
      emit('changeApproveStep', 3)
      setTimeout(() => {
        playError.play()
        toast.update(ConfirmToastPending, {
          render: Toast,
          data: {
            header_text: 'Confirm rejected',
            toast_text: `You rejected confirm`,
            tx_link: '',
            speedUp: '',
          },
          autoClose: 7000,
          closeOnClick: false,
          closeButton: true,
          type: 'error',
          isLoading: false,
        })
      }, 1000)

      // setTxError(tx)
      // notify()
      return
    }
    await tx.wait()
    playSuccess.play()
    toast.update(ConfirmToastPending, {
      render: Toast,
      data: {
        header_text: 'Deposit confirmed',
        toast_text: `${parseFloat(props.fiatTotal).toFixed(
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

    mmActive.value = false
    emit('changeVisibleDepositClose')
    depositFinished.value = true
  }
}
</script>
<style lang="scss" scoped>
.modal_body_header {
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: -0.5px;
  color: white;
}

.metamask_loader {
  width: 30px;
  height: 30px;
  // border: 2px solid #fff;
  border-bottom-color: #00c9ff;
  border-radius: 100%;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
