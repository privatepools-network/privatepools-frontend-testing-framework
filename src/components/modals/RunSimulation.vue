

<template>
  <CModal size="lg" alignment="center" :visible="visibleRunModal" @close="$emit('changeVisibleRun')">
    <CModalHeader :close-button="false">
      <div class="d-flex justify-content-between w-100">
        <div style="cursor: pointer" @click="$emit('changeVisibleRun')">
          <img :src="arrow_back" />
        </div>
        <div style="cursor: pointer" @click="$emit('changeVisibleRun')">
          <img :src="close_modal_icon" />
        </div>
      </div>
    </CModalHeader>
    <CModalBody>
      <div class="modal_body_inside">
        <div>
          <div class="modal_body_header">
            Run Simulation
          </div>
          <div class="modal-body__stage">
            <div class="modal-body__stage_el">
              <div class="modal-body__title">
                Amount & Token IN
              </div>
              <div class="modal-body__data">
                <div class="modal-body__select">
                  <TokenSelector :tokens="possibleTokens" :tokenSelected="tokenSelectedIn" @updateToken="updateTokenIn">
                  </TokenSelector>

                </div>
                <div class="modal-body__input" v-if="tokenSelectedIn">
                  <input type="text" v-model="valueIn">
                  <div class="modal-body__input_label">
                    ~${{ (valueIn * GetTokenPricesBySymbol(tokenSelectedIn.symbol)).toFixed(4) }}
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-body__stage_el">
              <div class="modal-body__title">
                Amount & Token Out
              </div>
              <div class="modal-body__data">
                <div class="modal-body__select">
                  <TokenSelector :tokens="possibleTokens" :tokenSelected="tokenSelectedOut" @updateToken="updateTokenOut">
                  </TokenSelector>

                </div>
                <div class="modal-body__input" v-if="tokenSelectedOut">
                  <input type="text" v-model="valueOut" disabled>
                  <div class="modal-body__input_label">
                    ~${{ (valueOut * GetTokenPricesBySymbol(tokenSelectedOut.symbol)).toFixed(4) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="divider">
            <div class="divider__el">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path d="M7 13.5L12 18.5L17 13.5" stroke="#01B47E" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M7 6.5L12 11.5L17 6.5" stroke="#01B47E" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />

              </svg>
            </div>
          </div>
          <div class="modal-body__stage">
            <div class="modal-body__title" style="margin-bottom: 18px;">
              Simulation Results
            </div>
            <div class="modal-body__data" v-for="item in simResults" :key="item.name">
              <div class="tokens-selector">
                <div class="tokens-selector__icon"><img :src="item.img" /></div>

                <div class="tokens-selector__selected-item-text">{{ item.name }}</div>
              </div>
              <div class="modal-body__input" v-if="tokenSelectedOut">
                <input type="text" v-model="item.value" readonly>
                <div class="modal-body__input_label">
                  ~${{ (item.value * GetTokenPricesBySymbol(tokenSelectedOut.symbol)).toFixed(4) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CModalBody>
  </CModal>
</template>

<script setup>

import arrow_back from '@/assets/icons/arrow/arrow_back.svg'
import close_modal_icon from '@/assets/icons/arrow/close_modal_icon.svg'
import oneinch from '@/assets/images/dexs/1inch.png'
import paraswap from '@/assets/images/dexs/paraswap.png'
import odos from '@/assets/images/dexs/odos.png'
import firebird from '@/assets/images/dexs/firebird.png'
import orion from '@/assets/images/dexs/orion.png'

import TokenSelector from "@/UI/TokenSelector.vue";

import { GetTokenPricesBySymbols } from "@/composables/balances/cryptocompare"
import { ref, defineProps, toRefs, watch, computed } from 'vue'
import { UseDexesQuotes } from "@/composables/admin/quote/useDexesQuotes"
import { ReversedDisplayNetwork } from '@/composables/useNetwork'
const props = defineProps({
  visibleRunModal: Boolean,
  possibleTokens: [Object],
  chainSelected: String
})
const { visibleRunModal, possibleTokens, chainSelected } = toRefs(props)


function updateTokenIn(item) {
  if (item)
    tokenSelectedIn.value = item
}
function updateTokenOut(item) {
  if (item)
    tokenSelectedOut.value = item
}





const tokenSelectedIn = ref(possibleTokens.value[0])
const tokenSelectedOut = ref(possibleTokens.value[1])
const valueIn = ref('1')
const valueOut = ref('0')
const tokenPrices = ref([])


const dexesDefault = { '1inch': 0, 'firebird': 0, 'paraswap': 0, 'orion': 0, 'odos': 0 }
const dexesInfo = ref({ ...dexesDefault })
const simResults = computed(() => [
  {
    name: '1inch',
    img: oneinch,
    value: dexesInfo.value['1inch']
  }, {
    name: 'Firebird',
    img: firebird,
    value: dexesInfo.value['firebird']
  }, {
    name: 'Odos',
    img: odos,
    value: dexesInfo.value['odos']
  }, {
    name: 'Paraswap',
    img: paraswap,
    value: dexesInfo.value['paraswap']
  }, {
    name: 'Orion',
    img: orion,
    value: dexesInfo.value['orion']
  },

])

watch(([tokenSelectedIn, tokenSelectedOut, valueIn, visibleRunModal]), async () => {
  if (visibleRunModal.value) {
    dexesInfo.value = { ...dexesDefault }
    valueOut.value = '0'
    UpdateDexes()
  }
})


async function UpdateDexes() {
  let network_id = ReversedDisplayNetwork[chainSelected.value]
  dexesInfo.value = await UseDexesQuotes(network_id, tokenSelectedIn.value, tokenSelectedOut.value, valueIn.value)
  let values = []
  for (const [, value] of Object.entries(dexesInfo.value)) {
    values.push(parseFloat(value))
  }
  valueOut.value = Math.max(...values)
}
function GetTokenPricesBySymbol(symbol) {
  if (!tokenPrices.value[symbol]) {
    return 0
  }
  return tokenPrices.value[symbol]
}



watch(possibleTokens, async () => {
  tokenSelectedIn.value = possibleTokens.value[0]
  tokenSelectedOut.value = possibleTokens.value[1]
  tokenPrices.value = await GetTokenPricesBySymbols(possibleTokens.value.map((t) => t.symbol))
})

</script>
<style lang="scss">
.fade {
  backdrop-filter: blur(4px);
}
</style>
<style lang="scss" scoped>
.tokens-selector {
  display: flex;
  align-items: center;

  &__icon {
    height: 52px;
    width: 52px;
    border-radius: 50%;
    background-color: #ffffffde;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-right: 8px;

    img {
      width: 65%;
    }
  }

  &__selected-item-text {
    font-size: 16px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0em;
    color: #ffffff;

    margin-right: 8px;
  }

  &__img {}
}

.modal-body {
  &__stage {
    border-radius: 20px;
    border: 1px solid rgba(163, 164, 165, 0.40);
    background: #083427;
    padding: 11px 17px;
    margin-bottom: 20px;

    &_el {
      margin-bottom: 15px;
    }
  }

  &__title {
    font-size: 12px;
    color: #fff;
    margin-bottom: 10px;
  }

  &__data {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  &__select {
    width: 70%;
  }

  &__input {
    text-align: right;

    input {
      text-align: right;
      color: #fff;
      border: none;
      background: transparent;
      outline: none
    }

    &_label {
      font-size: 12px;
      color: #828291
    }
  }
}

.divider {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  &__el {
    padding: 5px;
    border-radius: 9999px;
    border: 4px solid #01B47E;
    background: #083427;
  }
}

.modal_body_header {
  font-family: Poppins;
  font-size: 20px;
  font-weight: 500;
  color: white;
  margin-bottom: 30px;
}


.modal_body_inside {
  padding: 0px 110px;
}


.modal_stake_token {
  border: 1px solid rgba(163, 164, 165, 0.2);
  border-radius: 20px;
  padding: 15px;
}

.modal_stake_token_inner {}

.modal_stake_token_inner_name {
  background-color: rgba(59, 97, 65, 0.14);
  border-radius: 17px;
  color: white;
  font-size: 14px;
  padding: 2px 18px;
}

// Multiselect custom
:deep(.multiselect__tags) {
  border: none !important;
  background: none !important;
  cursor: pointer;
}

:deep(.multiselect__input, .multiselect__single) {
  background: none !important
}

:deep(.multiselect__content-wrapper) {
  border-color: rgba(1, 180, 126, 1) !important;
}

:deep(.multiselect__single) {
  background: none !important;
  color: white !important;
}

:deep(.multiselect__select) {
  display: none;
}

:deep(.multiselect__option) {
  border: 1px solid rgba(1, 180, 126, 1) !important;
  background: rgb(15, 17, 19) !important;
  color: white !important;
}

:deep(.multiselect__option:hover) {
  background: rgba(1, 180, 126, 0.884) !important;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
