<template>
  <CCard class="card-row px-4 py-4 mb-4" style="background-color: rgba(24, 28, 31, 1)"
    v-if="allSwapableTokens && allSwapableTokens.length > 1 && tokenSelectedToSwap && tokenSelectedToSwap.price">
    <div class="swap_token">
      <div class="text-white">Sell</div>
      <div class="d-flex justify-content-between align-items-center py-3" style="width: 450px">
        <div>
          <multiselect style="width: 250px" :modelValue="tokenSelectedToSwap" @update:modelValue="(event) => {
            tokenSelectedToSwap = event
          }
            " placeholder="" label="title" track-by="address" :options="allSwapableTokens" :option-height="104"
            :show-labels="true" :searchable="false" :allow-empty="false" :hide-selected="true" :close-on-select="true"
            :taggable="false" :showLabels="false">
            <template v-slot:singleLabel="{ option }">
              <div class="d-flex align-items-center gap-3 p-2" style="cursor: pointer;">
                <div class="d-flex align-items-center gap-2">
                  <img width="25" :src="option.img" alt="Token icon" />
                  <div class="assets-select__label">
                    <span class="assets-select__name">
                      {{ option.name }}
                    </span>
                  </div>
                </div>

                <div class="select__dropdown-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                    <path d="M1 1L7 7L13 1" stroke="#C1C1D1" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </div>
              </div>
            </template>
            <template v-slot:option="{ option }">
              <div class="d-flex flex-column p-2">
                <div class="d-flex align-items-center gap-2">
                  <img class="" :src="option.img" alt="Token icon" width="40" />
                  <div class="d-flex flex-column">
                    <span style="
                        color: rgba(163, 164, 165, 1);
                        font-weight: 400;
                        font-size: 18px;
                      ">
                      {{ option.name }}
                    </span>

                    <span style="
                        color: rgba(107, 114, 128, 1);
                        font-weight: 400;
                        font-size: 14px;
                      ">
                      {{ option.symbol }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </multiselect>
        </div>
        <input type="number" style="
                    background: none;
            border: none;
            width: 180px;
            color: rgba(193, 193, 209, 1);
            font-weight: 600;
            font-size: 20px;
          " v-model="tokenSelectedToSwap.value" @input="watchTokenToSwap">

      </div>
      <div style="
          color: rgba(130, 130, 145, 1);
          display: flex;
          justify-content: flex-end;
        ">
        ~${{ tokenSelectedToSwap.price.toFixed(2) }}
      </div>
    </div>
    <div class="d-flex py-2 gap-2">
      <CButton @click="() => setPercentValue(25)" style="background-color: rgba(255, 255, 255, 0.08); width: 25%"
        variant="outline">
        <div class="d-flex justify-content-center text-white">25%</div>
      </CButton>
      <CButton @click="() => setPercentValue(50)" style="background-color: rgba(255, 255, 255, 0.08); width: 25%"
        variant="outline">
        <div class="d-flex justify-content-center text-white">50%</div>
      </CButton>
      <CButton @click="() => setPercentValue(75)" style="background-color: rgba(255, 255, 255, 0.08); width: 25%"
        variant="outline">
        <div class="d-flex justify-content-center text-white">75%</div>
      </CButton>
      <CButton @click="() => setPercentValue(100)" style="background-color: rgba(255, 255, 255, 0.08); width: 25%"
        variant="outline">
        <div class="d-flex justify-content-center text-white">100%</div>
      </CButton>
    </div>
    <div class="d-flex justify-content-center pb-2"><img :src="swapIcon" /></div>
    <div class="swap_token">
      <div class="text-white">Buy</div>
      <div class="d-flex justify-content-between align-items-center py-3" style="width: 450px">
        <div>
          <multiselect style="width: 250px" :modelValue="tokenSelectedToBuy" @update:modelValue="(event) => {
            tokenSelectedToBuy = event
          }
            " placeholder="" label="title" track-by="address" :options="allSwapableTokens" :option-height="104"
            :show-labels="true" :searchable="false" :allow-empty="false" :hide-selected="true" :close-on-select="true"
            :taggable="false" :showLabels="false">
            <template v-slot:singleLabel="{ option }">
              <div class="d-flex align-items-center gap-3 p-2" style="cursor: pointer;">
                <div class="d-flex align-items-center gap-2">
                  <img width="25" :src="option.img" alt="Token icon" />
                  <div class="assets-select__label">
                    <span class="assets-select__name">
                      {{ option.name }}
                    </span>
                  </div>
                </div>

                <div class="select__dropdown-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                    <path d="M1 1L7 7L13 1" stroke="#C1C1D1" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </div>
              </div>
            </template>
            <template v-slot:option="{ option }">
              <div class="d-flex flex-column p-2">
                <div class="d-flex align-items-center gap-2">
                  <img class="" :src="option.img" alt="Token icon" width="40" />
                  <div class="d-flex flex-column">
                    <span style="
                        color: rgba(163, 164, 165, 1);
                        font-weight: 400;
                        font-size: 18px;
                      ">
                      {{ option.name }}
                    </span>

                    <span style="
                        color: rgba(107, 114, 128, 1);
                        font-weight: 400;
                        font-size: 14px;
                      ">
                      {{ option.symbol }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </multiselect>
        </div>
        <input type="number" style="
            background: none;
            border: none;
            width: 180px;
            color: rgba(193, 193, 209, 1);
            font-weight: 600;
            font-size: 20px;
          " v-model="tokenSelectedToBuy.value" @input="watchTokenToBuy">
      </div>
      <div style="
          color: rgba(130, 130, 145, 1);
          display: flex;
          justify-content: flex-end;
        ">
        ~${{ tokenSelectedToBuy.price.toFixed(2) }}
      </div>
    </div>
    <div class="d-flex justify-content-center my-3 w-100">
      <div class="w-100" v-if="connectToWeb3">
        <CButton @click="() => swapClick()" color="success" variant="" class="w-100"
          style="height: 50px; border-radius: 12px;">
          <div class="d-flex justify-content-center">
            <div class="text-white">Swap</div>
          </div>
        </CButton>
      </div>
      <div class="w-100" v-else>
        <CButton color="success" variant="" class="w-100" style="height: 50px;">
          <div class="d-flex justify-content-center gap-3">
            <img :src="walletIcon" />
            <div class="text-white">Connect Wallet</div>
          </div>
        </CButton>
      </div>
    </div>
    <div class="swap_additional_info">
      <div class="d-flex align-items-center justify-content-between">
        <div>Price impact</div>
        <div>{{ priceImpact.toFixed(4) }}%</div>
      </div>
      <div class="d-flex align-items-center justify-content-between">
        <div>1 {{ tokenSelectedToSwap.symbol }} is</div>
        <div>{{ (tokenSelectedToSwap.price / tokenSelectedToBuy.price).toFixed(4) }} {{ tokenSelectedToBuy.symbol }}</div>
      </div>
      <div class="d-flex align-items-center justify-content-between">
        <div>1 {{ tokenSelectedToBuy.symbol }} is</div>
        <div>{{ (tokenSelectedToBuy.price / tokenSelectedToSwap.price).toFixed(4) }} {{ tokenSelectedToSwap.symbol }}
        </div>
      </div>
    </div>
  </CCard>
  <div>
    <CAlert class="d-flex gap-2 w-75" style="
            background-color: rgba(15, 17, 19, 1);
            color: white;
            border: none;
            margin-top: 20px;
            display: flex;
          " color="primary" :visible="showWarning" dismissible @close="() => {
            showWarning = false
          }
            ">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M22 12C22 17.5228 17.5228 22 12 22H2.9937C2.11018 22 1.66771 20.9229 2.29245 20.2929L4.2495 18.3195C2.84334 16.597 2 14.397 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.2071 8.79289C15.5976 9.18342 15.5976 9.81658 15.2071 10.2071L13.4142 12L15.2071 13.7929C15.5976 14.1834 15.5976 14.8166 15.2071 15.2071C14.8166 15.5976 14.1834 15.5976 13.7929 15.2071L12 13.4142L10.2071 15.2071C9.81658 15.5976 9.18342 15.5976 8.79289 15.2071C8.40237 14.8166 8.40237 14.1834 8.79289 13.7929L10.5858 12L8.79289 10.2071C8.40237 9.81658 8.40237 9.18342 8.79289 8.79289C9.18342 8.40237 9.81658 8.40237 10.2071 8.79289L12 10.5858L13.7929 8.79289C14.1834 8.40237 14.8166 8.40237 15.2071 8.79289Z"
          fill="#FF507A" />
      </svg>

      <div>
        {{ warningMessage }}
      </div>
    </CAlert>
  </div>
</template>

<script setup>
import Multiselect from 'vue-multiselect'
import swapIcon from '../assets/icons/swap-arrow.svg'
import walletIcon from '../assets/icons/wallet.svg'
import { onMounted, defineProps, toRefs, ref, watch, computed } from 'vue'
import useSor from "@/composables/admin/swap/useSor"
import { getWrapAction, WrapType } from "@/lib/utils/balancer/wrapper"
const props = defineProps(['allSwapableTokens', 'nativeTokenPrice'])



const { allSwapableTokens, nativeTokenPrice } = toRefs(props)

const connectToWeb3 = ref(true)

const tokenSelectedToSwap = ref({})
const tokenSelectedToBuy = ref({})


const showWarning = ref(false)
const warningMessage = ref(false)
const tokenInAddressInput = computed(() => tokenSelectedToSwap.value.address)
const tokenOutAddressInput = computed(() => tokenSelectedToBuy.value.address)
const tokenInAmountInput = computed(() => tokenSelectedToSwap.value.value)
const tokenOutAmountInput = computed(() => tokenSelectedToBuy.value.value)
const exactIn = ref(false)
const wrapType = computed(() => tokenSelectedToBuy.value.address ? getWrapAction(tokenSelectedToSwap.value.address, tokenSelectedToBuy.value.address) : WrapType.NonWrap)
const slippageBufferRate = ref(0.01)
const sorProps = computed(() => ({
  exactIn,
  tokenInAddressInput,
  tokenInAmountInput,
  tokenOutAddressInput,
  tokenOutAmountInput,
  tokens: allSwapableTokens,
  wrapType,
  tokenSelectedToSwap,
  tokenSelectedToBuy,
  slippageBufferRate,
  nativeTokenPrice
}))


const { trade, handleAmountChange, init, priceImpact } = useSor(sorProps.value)


onMounted(async () => {
  if (allSwapableTokens.value.length > 1) {
    tokenSelectedToSwap.value = allSwapableTokens.value[0]
    tokenSelectedToBuy.value = allSwapableTokens.value[1]
    await init()
  }
})
watch(allSwapableTokens, async (newTokens) => {
  if (newTokens.length > 1) {

    tokenSelectedToSwap.value = newTokens[0]
    tokenSelectedToBuy.value = newTokens[1]
  }
})
function watchTokenToSwap(newValue) {
  exactIn.value = true
  if (newValue != '')
    tokenSelectedToBuy.value.value = parseFloat(((tokenSelectedToSwap.value.price * tokenSelectedToSwap.value.value) / tokenSelectedToBuy.value.price).toFixed(8))
  else
    tokenSelectedToBuy.value.value = 0
  if (tokenSelectedToBuy.value.value > 0) {
    console.log("SWAP")
    handleAmountChange()
  }
}

function watchTokenToBuy(newValue) {
  exactIn.value = false
  if (newValue != '')
    tokenSelectedToSwap.value.value = parseFloat(((tokenSelectedToBuy.value.price * tokenSelectedToBuy.value.value) / tokenSelectedToSwap.value.price).toFixed(8))
  else
    tokenSelectedToSwap.value.value = 0
  if (tokenSelectedToSwap.value.value > 0) {
    console.log("BUY")
    handleAmountChange()
  }
}

watch(tokenInAddressInput, (newVal) => {
  watchTokenToBuy(newVal)
  handleAmountChange()

})

watch(tokenOutAddressInput, (newVal) => {
  watchTokenToSwap(newVal)
  handleAmountChange()
})

function setPercentValue(percent) {
  if (tokenSelectedToSwap.value.balance > 0) {
    console.log(tokenSelectedToSwap.value.balance)
    let r = (tokenSelectedToSwap.value.balance / 100) * percent
    console.log(r)
    tokenSelectedToSwap.value.value = r
  }
}


async function swapClick() {


  warningMessage.value = ""
  showWarning.value = false
  let result = await trade()
  if (!result) {
    warningMessage.value = "Tx estimation failed"
    showWarning.value = true
  }
}
</script>
<style lang="scss">
.swap_token {
  background-color: rgba(0, 0, 0, 0.53);
  padding: 13px;
  border-radius: 6px;
}

.swap_additional_info {
  background-color: rgba(0, 0, 0, 0.28);
  color: rgba(193, 193, 209, 1);
  padding: 13px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.multiselect--active .multiselect__tags {
  border-width: 1px 1px 0 1px !important;
}

.multiselect__tags {
  background: linear-gradient(0deg, #181c1f 0%, #181c1f 100%) !important;
  border: none !important;
  padding: 0 !important;
}

.multiselect__option--highlight {
  background: linear-gradient(0deg, #181c1f 0%, #181c1f 100%) !important;
}

.multiselect__content-wrapper {
  border-color: #181c1f !important;
}

.multiselect__single {
  background: rgba(0, 0, 0, 0.53) !important;
  color: white !important;
  padding: 0 !important;
  margin: 0 !important;
}

.multiselect__option {
  background: linear-gradient(0deg, #181c1f 0%, #181c1f 100%);
  padding: 0 !important;
  color: white !important;

  &:after {
    display: none;
  }
}

.multiselect__option:hover {
  background: linear-gradient(0deg,
      rgba(24, 28, 31, 0.95) 0%,
      rgba(24, 28, 31, 0.95) 100%) !important;
}

.multiselect__select {
  display: none !important;
}

/* Scrollbar */
.multiselect__content-wrapper::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

.multiselect__content-wrapper::-webkit-scrollbar {
  width: 12px;
  background-color: #f5f5f5;
}

.multiselect__content-wrapper::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
