<template>

      <div class="d-flex justify-content-between w-100">
        <div style="cursor: pointer" @click="
          depositStep == 1 ? $emit('changeVisibleDepositClose') : depositStep--
          ">
          <img :src="arrow_back" />
        </div>
        <!-- <div style="cursor: pointer" @click="$emit('changeVisibleDepositClose')">
          <img :src="close_modal_icon" />
        </div> -->
      </div>

      <div class="px-5" v-if="!depositFinished">
        <div class="modal_body_header">
          <h3>Add liquidity preview</h3>
        </div>
        <div style="
            border: 1px solid rgba(163, 164, 165, 0.2);
            border-radius: 20px;
            color: white;
          " class="my-2">
          <div class="fs-6 fw-bold p-2" style="border-bottom: 1px solid rgba(163, 164, 165, 0.2)">
            You’re providing
          </div>

          <div class="mt-3">
            <div v-for="(token, index) in tokens" :key="`tokens-key-${index}`"
              class="d-flex align-items-center justify-content-between px-3 gap-3">
              <div class="d-flex flex-column align-items-start text-white">
                <div>{{ token.depositAmount }} {{ token.symbol }}</div>
                <div>${{ token.usdAmount }}</div>
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
            You’re expected to receive
          </div>

          <div class="my-3">
            <div class="d-flex align-items-center justify-content-between px-3 gap-3">
              <div class="d-flex flex-column align-items-start text-white">
                <div>{{ (total / pool.lpPrice).toFixed(2) }} {{ pool.tokens.map((t) =>
                  `${t.weight * 100}%${t.symbol}`).join('/') }}</div>
                <div>${{ total.toFixed(2) }} ({{ (total / ((pool.lpPrice * pool.totalShares) / 100)).toFixed(2) }}%)</div>
              </div>
              <div>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="20" fill="#CFB428" />
                  <mask id="mask0_5891_7647" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="40"
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
            Summary
          </div>
          <div class="d-flex flex-column p-2" style="font-size: 14px; color: rgba(221, 221, 221, 1)">
            <div class="d-flex justify-content-between align-items-center">
              <div>Total</div>
              <div class="d-flex gap-1">${{ total.toFixed(2) }}</div>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <div>Value Loss</div>
              <div class="d-flex gap-1">{{ valueLoss }}%</div>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <div>Potential weekly yield</div>
              <div class="d-flex gap-1">${{ weeklyYield }}</div>
            </div>
          </div>
        </div>



        <div class="my-3 d-flex justify-content-center position-relative">
          {{ console.log('approveStep', approveStep) }}
          <!-- There should be iteration by length of every token that need approve - ApproveStep I guess will be index -->
          <div class="d-flex gap-2">
            <VTooltip :distance="0" :placement="'top'">
              <div>
              <div class="position-relative" v-if="approveStep === 1">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="15" cy="15" r="14.5" :stroke="approveStep === 1 ? '#00C9FF' : 'white'" />
                </svg>
                <div :class="approveStep === 1
                  ? 'step_number step_number_active'
                  : 'step_number'
                  ">
                  1
                </div>
              </div>
              <div class="position-relative" v-else-if="approveStep === 2">
              <div class="metamask_loader"></div>
              <div class="step_number step_number_active">
                <img :src="metamask" width="20" />
              </div>
            </div>
            <div class="position-relative" v-if="approveStep === 3 || approveStep === 4 || approveStep === 5">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="15" cy="15" r="14.5" :stroke="approveStep === 3 ? '#00C9FF' : 'white'" />
                </svg>
                <div :class="approveStep === 3
                  ? 'step_number step_number_active'
                  : 'step_number'
                  ">
                  <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.97 10.583L0 5.613L0.714 4.9L4.97 9.156L14.126 0L14.839 0.713L4.97 10.583Z" fill="#7EF6B2"/>
</svg>

                </div>
                
              </div>
            
          </div>
              <template #popper>
                <div style="
                      background: linear-gradient(
                        rgba(89, 89, 89, 0.75),
                        rgba(73, 73, 73, 0.15)
                      );
                      backdrop-filter: blur(10px);
                      padding: 10px;
                      border-radius: 4px;
                      width: 300px;
                    ">

                  <div style="display: flex; flex-direction: column; font-size: clamp(10px, 0.8vw, 14px);">
                    You must approve all tokens to add liquidity for this token on Dark Pool. Approvals are required once per token, per wallet.
                  </div>
                </div>
              </template>
            </VTooltip>
           <!-- <div class="position-relative">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="15" cy="15" r="14.5" :stroke="approveStep === 1 ? '#00C9FF' : 'white'" />
                </svg>
              <div class="step_number step_number_active">
                <img :src="metamask" width="20" />
              </div>
            </div> -->
            <div class="position-relative" v-if="approveStep === 1 || approveStep === 2 || approveStep === 3 || approveStep === 4">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="14.5" :stroke="approveStep === 3 || approveStep === 4 || approveStep === 5 ? '#00C9FF' : 'white'" />
              </svg>
              <div :class="approveStep === 3 || approveStep === 4 || approveStep === 5 ? 'step_number active' : 'step_number'
                ">
                2
              </div>
            </div>
            <div v-else-if="approveStep === 4 || approveStep === 5" class="position-relative" >
              <div class="position-relative" >
              <div class="metamask_loader"></div>
              <div class="step_number step_number_active">
                <img :src="metamask" width="20" />
              </div>
            </div>
            </div>
          </div>
        </div>


        <div class="compose_pool_connect_wallet" @click="OnPreviewClick()" v-if="approveStep === 1">
          Approve tokens for adding liquidity
        </div>
        <div class="compose_pool_connect_wallet" v-if="approveStep === 2">
          Approving Tokens... <span class="button_loader pl-2"></span>
        </div>
        <div class="compose_pool_connect_wallet" @click="OnPreviewClick();  approveStep = 4" v-else-if="approveStep === 3">
          Add Liquidity  
        </div>
        <div class="compose_pool_connect_wallet" v-else-if="approveStep === 4">
          <span class="button_loader pl-2"></span> Confirm approval in wallet 
        </div>
        <div class="compose_pool_connect_wallet" @click="OnPreviewClick()" v-else-if="approveStep === 5">
          Confirming <span class="button_loader pl-2"></span> 
        </div>
      </div>
      <!-- <div v-else-if="depositFinished">
        <ConfirmationReceipt :link="txLink" :header_text="'Deposit has settled'"
          :header_subtext="'Successfully deposit your tokens'" />
      </div> -->

</template>

<script setup>
import arrow_back from '@/assets/icons/arrow/arrow_back.svg'
import close_modal_icon from '@/assets/icons/arrow/close_modal_icon.svg'
import { getTokenEntity } from '@/lib/helpers/util'
import { defineProps,defineEmits, ref, watch } from 'vue'
import metamask from '@/assets/icons/approveTokenSteps/metamask.svg'
// import ConfirmationReceipt from '@/UI/ConfirmationReceipt.vue'
// import { GetDisplayStringError } from "@/lib/utils/balancer/helpers/displayError"
import { formatNotificationDate } from '@/lib/utils'
import { useJoinPool } from '@/composables/poolActions/deposit/useJoinPool'
import { configService } from '@/services/config/config.service'
import { networkId, DisplayNetwork } from '@/composables/useNetwork'
import { useApproveTokens } from '@/composables/poolActions/deposit/useApproveTokens'
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue';
import 'vue3-toastify/dist/index.css';
var emitter = require('tiny-emitter/instance');


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

let conf = configService.getNetworkConfig(
    networkId.value,
  )

// function SetSuccessTxPopup(hash, subtext) {

//   popupType.value = "success"
//   popupText.value = "Tx confirmed!"
//   popupSubText.value = subtext
//   popupLink.value = `${conf.explorer}/tx/${hash}`
// }

const props = defineProps(['visibleDepositModal', 'changeVisibleDepositClose', 'tokens', 'total', 'valueLoss', 'pool', 'bptOut', 'account', 'fiatTotal', "weeklyYield"])
const emit = defineEmits(['changeVisibleDepositClose'])
console.log("PROPS - ", props)
const depositFinished = ref(false)
const approveStep = ref(1)

const txLink = ref('')
async function OnPreviewClick() {
  if (approveStep.value === 1) {
  const ApproveTokensToastPending = toast.loading(
    Toast,
    {
    
      data: {
        header_text: 'Approve pending',
        toast_text: 'Approve all requested tokens in your wallet',
        tx_link: '',
        speedUp: ''
      },
      position: toast.POSITION.TOP_LEFT,
      theme: "dark", 
      closeOnClick: false,
    },
  );
  approveStep.value = 2
  let tokenAddresses = props.tokens.map((t) => t.address)
  let success = await useApproveTokens(
    tokenAddresses,
    props.tokens.map((t) => t.depositAmount),
    props.account,
  )
  if (!success) {
    toast.update(ApproveTokensToastPending, {
      render: Toast,
      data: {
        header_text: 'Approval rejected',
        toast_text: `You rejected tokens approval`,
        tx_link: '',
        speedUp: '',
      },
      autoClose: 7000,
      closeOnClick: false,
      closeButton: false,
      type: 'error',
      isLoading: false,
    })
    approveStep.value = 1
    return
  }
  toast.update(ApproveTokensToastPending, {
      render: Toast,
      data: {
        header_text: 'All tokens approved',
        toast_text: `All tokens from wallet successfully approved`,
        tx_link: ``,
        speedUp: ''
      },
     
      closeOnClick: false,
      autoClose: 5000,
      closeButton: false,
      type: 'success',
      isLoading: false,
    });
  console.log('success',success)
  approveStep.value = 3
}else {

  let tx = await useJoinPool(
    props.pool,
    Object.values(props.pool.tokens),
    props.tokens.map((t) => t.depositAmount),
    props.account,
    props.bptOut,
    
  )
 
  // if (!success) {
  //   approveStep.value = 1
  //   SetErrorTxPopup("Approve was cancelled")
  //   notify()
  //   return
  // }
  // ?
  // approveStep.value = 4

    console.log('3123')

  txLink.value = `${configService.getNetworkConfig(networkId.value).explorer}/tx/${tx.hash}`

  approveStep.value = 5




  const ConfirmToastPending = toast.loading(
    Toast,
    {
    
      data: {
        header_text: 'Add liquidity pending',
        toast_text: `${parseFloat(props.fiatTotal).toFixed(4)} USD - ${formatNotificationDate(new Date().getTime())}`,
        tx_link: '',
        speedUp: '/'
      },
      position: toast.POSITION.TOP_LEFT,
      theme: "dark", 
      closeOnClick: false,
    },
  );

  
  if (tx.error) {
    console.log("!!!", tx.error)
    approveStep.value = 3
    setTimeout(() => {
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
    }, 1000);
   
    // setTxError(tx)
    // notify()
    return
  }
  await tx.wait()
  
 

    toast.update(ConfirmToastPending, {
      render: Toast,
      data: {
        header_text: 'Approve confirmed',
        toast_text: `${parseFloat(props.fiatTotal).toFixed(4)} USD - ${formatNotificationDate(new Date().getTime())}`,
        tx_link: `${conf.explorer}/tx/${tx.hash}`,
        speedUp: ''
      },
     
      closeOnClick: false,
      autoClose: 10000,
      closeButton: false,
      type: 'success',
      isLoading: false,
    });

  // SetSuccessTxPopup(tx.hash, "Tokens successfully deposited")
  // notify()
  emit('changeVisibleDepositClose')
  depositFinished.value = true

  emitter.emit('addNotification', {
    type: 'Deposit',
    value: `${parseFloat(props.fiatTotal).toFixed(4)} USD - ${formatNotificationDate(new Date().getTime())}`,
    status: 'Success',
    hash: tx.hash,
    network: DisplayNetwork[networkId.value]
  });
}
}
// function setTxError(e) {
//   let errorCode = e.error.data.message
//   SetErrorTxPopup(GetDisplayStringError(errorCode))
// }


watch(
  () => props.visibleDepositModal,
  () => {
    console.log('111')
    approveStep.value = 1
    depositFinished.value = false
  }
)

</script>
<style lang="scss" scoped>
.compose_pool_connect_wallet {
  margin-top: 8px;
  padding: 8px;
  font-size: 12px;
  color: white;
  border: 0px;
  background: linear-gradient(89.26deg, #00C9FF 5.07%, #00c8ffb7 99.37%);
  width: 100%;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  // transition-duration: 0.3s;
  text-shadow: 1px 1px 2px black;

  &:hover {
    color: #fff;
    background: #00C9FF;
    box-shadow: 0px 12px 24px 0px rgba(#00C9FF, 0.2),
      0px 4px 8px 0px rgba(#00C9FF, 0.3);
  }
}



.step_number {
  cursor: help;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.4000000059604645px;
  text-align: center;
  color: white;

  &_active {
    color: #00C9FF;
  }
}

.modal_body_header {
  font-family: Montserrat;
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: -0.5px;
  color: white;
}

.metamask_loader {
  width: 30px;
    height: 30px;
    border: 2px solid #FFF;
    border-bottom-color: #00C9FF;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
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

.button_loader {
    width: 17px;
    height: 17px;
    border: 2px solid #FFF;
    border-bottom-color: #00C9FF;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    margin-left: 10px;
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
