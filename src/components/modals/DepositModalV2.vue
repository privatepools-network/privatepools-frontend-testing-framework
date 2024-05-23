<template>
  <div class="px-1" v-if="!depositFinished">
    <div class="my-2 bg-[#22222224] shadow-md rounded-2xl text-white">
      <div
        class="text-[13px] font-normal p-2"
        style="border-bottom: 1px solid rgba(163, 164, 165, 0.2)"
      >
        {{ $t('you_providing') }}
      </div>

      <div class="mt-3">
        <div
          v-for="(token, index) in tokens"
          :key="`tokens-key-${index}`"
          class="d-flex align-items-center justify-content-between px-3 gap-3"
        >
          <div class="d-flex flex-column align-items-start text-white">
            <div class="font-['Roboto_Mono',_monospace] text-[13px]">
              {{ token.depositAmount.toFixed(4) }} {{ token.symbol }}
            </div>
            <div class="font-['Roboto_Mono',_monospace] text-[13px]">
              ${{ token.usdAmount.toFixed(2) }}
            </div>
          </div>
          <div class="d-flex align-items-center">
            <img
              :src="getTokenEntity(token.symbol, 'short').icon"
              width="60"
              class="p-2"
            />
            <!-- <div class="d-flex flex-column ">
                <div class="modal_body_header">{{ token.symbol }}</div>
                <div class="modal_body_header">{{ token.name }}</div>
              </div> -->
          </div>
        </div>
      </div>
    </div>

    <div class="my-4 bg-[#22222224] shadow-md rounded-2xl text-white">
      <div
        class="text-[13px] font-normal p-2"
        style="border-bottom: 1px solid rgba(163, 164, 165, 0.2)"
      >
        {{ $t('you_expected_to_receive') }}
      </div>

      <div class="my-3">
        <div
          class="d-flex align-items-center justify-content-between px-3 gap-3"
        >
          <div
            class="d-flex flex-column align-items-start text-white font-['Roboto_Mono',_monospace] text-[13px]"
          >
            <div class="font-['Roboto_Mono',_monospace] text-[13px]">
              {{ (total / pool.lpPrice).toFixed(2) }}
              {{
                pool.tokens
                  .map((t) => `${t.weight * 100}%${t.symbol}`)
                  .join('/')
              }}
            </div>
            <!-- <div class="font-['Roboto_Mono',_monospace] text-[13px]">
              ${{ total.toFixed(2) }} ({{
                (total / ((pool.lpPrice * pool.totalShares) / 100)).toFixed(2)
              }}%)
            </div> -->
          </div>
          <div>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="20" r="20" fill="#CFB428" />
              <mask
                id="mask0_5891_7647"
                style="mask-type: alpha"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="40"
                height="40"
              >
                <circle cx="20" cy="20" r="20" fill="#3E3E3E" />
              </mask>
              <g mask="url(#mask0_5891_7647)">
                <rect
                  x="-12.6309"
                  y="7.43506"
                  width="33.8175"
                  height="33.8175"
                  transform="rotate(-30 -12.6309 7.43506)"
                  fill="#2A5CA9"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="my-4 bg-[#22222224] shadow-md rounded-2xl text-white">
      <div
        class="text-[13px] font-normal p-2"
        style="border-bottom: 1px solid rgba(163, 164, 165, 0.2)"
      >
        {{ $t('summary') }}
      </div>
      <div
        class="d-flex flex-column p-2"
        style="font-size: 14px; color: rgba(221, 221, 221, 1)"
      >
        <div class="d-flex justify-content-between align-items-center">
          <div>{{ $t('total') }}</div>
          <div class="d-flex gap-1 font-['Roboto_Mono',_monospace] text-[13px]">
            ${{ total.toFixed(2) }}
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div>{{ $t('value_loss') }}</div>
          <div class="d-flex gap-1 font-['Roboto_Mono',_monospace] text-[13px]">
            {{ valueLoss }}%
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div>{{ $t('potential_weekly_yield') }}</div>
          <div class="d-flex gap-1 font-['Roboto_Mono',_monospace] text-[13px]">
            %{{ weeklyYield }}
          </div>
        </div>
      </div>
    </div>

    <div class="my-3 d-flex justify-content-center position-relative">
      {{ console.log('approveStep', approveStep) }}
      <!-- There should be iteration by length of every token that need approve - ApproveStep I guess will be index -->
      <div class="d-flex gap-1">
        <Step
          :activeStep="approveStep - 1"
          :displayedActiveStep="1"
          :mmActive="mmActive"
          :stepText="'Approve'"
        />

        <div class="w-12 mt-1">
          <ProgressLoader v-if="mmActive && approveStep === 4 || approveStep === 2" />
          <span v-else class="progress_loader_still"></span>
        </div>

        <Step
          :activeStep="approveStep - 2"
          :displayedActiveStep="2"
          :mmActive="mmActive"
          :stepText="'Deposit'"
        />
      </div>
    </div>

    <div
      class="compose_pool_connect_wallet"
      @click="OnPreviewClick()"
      v-if="approveStep === 1"
    >
      {{ $t('approve_tokens_for_adding') }}
    </div>
    <div class="compose_pool_connect_wallet" v-if="approveStep === 2">
      {{ $t('approving_tokens') }}... <span class="button_loader pl-2"></span>
    </div>
    <div
      class="compose_pool_connect_wallet"
      @click="OnPreviewClick(); approveStep = 4
      "
      v-else-if="approveStep === 3"
    >
      {{ $t('add_liquidity') }}
    </div>
    <div class="compose_pool_connect_wallet" v-else-if="approveStep === 4">
     
      Adding Liquidty <span v-if="mmActive" class="button_loader pl-2"></span>
    </div>
    <div
      class="compose_pool_connect_wallet"
      @click="OnPreviewClick()"
      v-else-if="approveStep === 5"
    >
      {{ $t('confirming') }} <span class="button_loader pl-2"></span>
    </div>
  </div>
  <!-- <div v-else-if="depositFinished">
        <ConfirmationReceipt :link="txLink" :header_text="'Deposit has settled'"
          :header_subtext="'Successfully deposit your tokens'" />
      </div> -->
</template>

<script setup>
import close_modal_icon from '@/assets/icons/arrow/close_modal_icon.svg'
import { getTokenEntity } from '@/lib/helpers/util'
import { defineProps, defineEmits, ref, watch } from 'vue'
import metamask from '@/assets/icons/approveTokenSteps/metamask.svg'
// import ConfirmationReceipt from '@/UI/ConfirmationReceipt.vue'
// import { GetDisplayStringError } from "@/lib/utils/balancer/helpers/displayError"
import { formatNotificationDate } from '@/lib/utils'
import { useJoinPool } from '@/composables/poolActions/deposit/useJoinPool'
import { configService } from '@/services/config/config.service'
import { networkId, DisplayNetwork } from '@/composables/useNetwork'
import { useApproveTokens } from '@/composables/poolActions/deposit/useApproveTokens'
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue'
import 'vue3-toastify/dist/index.css'
import checked_step_img from '@/assets/icons/CLIcons/checked_step.svg'

import { t } from 'i18next'
import Step from '@/UI/Step.vue'
import ProgressLoader from '@/UI/ProgressLoader.vue'
import successSound from '@/assets/sounds/success_sound.mp3'
import errorSound from '@/assets/sounds/error_sound.mp3'
import { useSound } from '@vueuse/sound'


const playSuccess = useSound(successSound, { volume: 1 })
const playError = useSound(errorSound, { volume: 1 })


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
//     closeButton: false,
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
])
const emit = defineEmits(['changeVisibleDepositClose', 'changeApproveStep', 'explode', 'addedTXHash'])
console.log('PROPS - ', props)
const depositFinished = ref(false)

const txLink = ref('')
async function OnPreviewClick() {
  console.log('props.approveStep', props.approveStep)

  if (props.approveStep === 1) {
    // props.approveStep = 2
    emit('changeApproveStep', 2)
    let tokenAddresses = props.tokens.map((t) => t.address)
    mmActive.value = true
    let success = await useApproveTokens(
      tokenAddresses,
      props.tokens.map((t) => t.depositAmount),
      props.account,
    )
    if (!success) {
      emit('changeApproveStep', 1)
      return
    }

    console.log('success', success)
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

    txLink.value = `${
      configService.getNetworkConfig(networkId.value).explorer
    }/tx/${tx.hash}`

    // props.approveStep = 5
    
    emit('changeApproveStep', 5)
    emit('explode')


    if (tx.error) {
      console.log('!!!', tx.error)
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
          closeButton: false,
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
        header_text: 'Approve confirmed',
        toast_text: `${parseFloat(props.fiatTotal).toFixed(
          4,
        )} USD - ${formatNotificationDate(new Date().getTime())}`,
        tx_link: `${conf.explorer}/tx/${tx.hash}`,
        speedUp: '',
      },
      
      closeOnClick: false,
      autoClose: 10000,
      closeButton: false,
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
