<template>
  <MainCard>
    <CRow class="mb-4 d-flex align-items-center">
      <CCol md="auto">
        <div class="text-white fw-bold fs-4">{{ caption }}</div>
      </CCol>
      <CCol md="auto">
        <div>
                <multiselect
                  :modelValue="chainSelected"
                  @update:modelValue="chainSelected = $event"
                  placeholder=""
                  label="title"
                  track-by="code"
                  :options="chainOptions"
                  :option-height="104"
                  :show-labels="true"
                  :searchable="false"
                  :allow-empty="false"
                  :hide-selected="true"
                  :close-on-select="true"
                  :taggable="false"
                  :showLabels="false"
                >
                  <template v-slot:singleLabel="{ option }"
                    ><div style="display: flex; align-items: center">
                      <img
                        style="width: 20px; height: 20px; margin-right: 5px"
                        :src="option.img"
                      /><span> {{ option.name }}</span>
                      <span
                        style="
                          color: rgba(108, 114, 132, 1);
                          margin-left: 2.5px;
                        "
                        >({{ option.code }})</span
                      >
                    </div></template
                  >
                  <template v-slot:option="{ option }">
                    <div style="display: flex; align-items: center">
                      <img
                        style="width: 20px; height: 20px; margin-right: 5px"
                        :src="option.img"
                      /><span> {{ option.name }}</span>
                      <span
                        style="
                          color: rgba(108, 114, 132, 1);
                          margin-left: 2.5px;
                        "
                        >({{ option.code }})</span
                      >
                    </div>
                  </template>
                </multiselect>
              </div>
        <div></div>
      </CCol>
      <CCol />
    </CRow>
    <CRow>
      <SelectTokens
      :isInitialized="true"
      @onSelect="onSelect"
      :trackBy="'code'"
        :strategy="false"
        :selectedTokens="selectedTokens"
        :possibleTokens="possibleTokens"
        caption="DEXs"
        :options="computedNetwork"
        :chainSelected="chainSelected.name"
      />
    </CRow>
  </MainCard>
</template>

<script setup>
import SelectTokens from '@/components/SelectTokens'
import { ref, computed } from 'vue'
import binanceNetwork from '../../assets/networks/firebird_networks/binance_firebird.json'
import arbitrumNetwork from '../../assets/networks/firebird_networks/arbitrum_firebird.json'
import polygonNetwork from '../../assets/networks/firebird_networks/polygon_firebird.json'
import arb from '@/assets/images/networks/arbitrum.png'
import polygon from '@/assets/images/networks/polygon.png'
import binance from '@/assets/images/networks/binance2.png'
import Multiselect from 'vue-multiselect'
import MainCard from '@/UI/MainCard.vue'

const selectedTokens = ref([])
const possibleTokens = ref([])

const chainSelected = ref({ name: 'Arbitrum', code: 'ETH', img: arb })
const chainOptions = ref([
        { name: 'Arbitrum', code: 'ETH', img: arb },
        { name: 'Binance', code: 'BNB', img: binance },
        { name: 'Polygon', code: 'MATIC', img: polygon },
])
const caption = ref('Select DEXs')

const computedNetwork = computed(() =>
  chainSelected.value.name === 'Arbitrum'
    ? arbitrumNetwork
  : chainSelected.value.name === 'Polygon'
    ? polygonNetwork
    : chainSelected.value.name === 'Binance'
    ? binanceNetwork
    : 'Unsupported network',
)

function onSelect(options) {
    selectedTokens.value = options
  // console.log("Inside onSelect function");

  // let isInside = selectedTokens.value.findIndex((o) => o.code === option.code) > -1;

  // // Clear the possibleTokens array initially
  // console.log("Clearing possibleTokens");
  // possibleTokens.value = [];

  // if (isInside) {
  //   selectedTokens.value = selectedTokens.value.filter(o => o.code !== option.code);
  // } else {
  //   selectedTokens.value.push(option)
  // }

  // possibleTokens.value = [...selectedTokens.value];


}

</script>

<style lang="scss" scoped>
.caption {
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0em;
  color: #ffffff;
  margin-bottom: 20px;
}
:deep(.multiselect__select:before) {
position: relative;
    right: 0;
    top: 65%;
    color: #999;
    margin-top: 4px;
    border-style: solid;
    border-width: 5px 5px 0 5px;
    border-color: #999 transparent transparent transparent;
    content: "";
}
:deep(.multiselect__tags) {
  background: none !important;
  border-color: #00C9FF !important;
}
:deep(.multiselect__content-wrapper) {
  border-color: #00C9FF !important;
}
:deep(.multiselect__single) {
  background: none !important;
  color: white !important;
}
:deep(.multiselect__option) {
  background: rgb(15, 17, 19) !important;
  color: white !important;
}
:deep(.multiselect__option:hover) {
  background: rgba(1, 180, 126, 0.884) !important;
}

/* Scrollbar */
:deep(.multiselect__content-wrapper::-webkit-scrollbar-track) {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

:deep(.multiselect__content-wrapper::-webkit-scrollbar) {
  width: 4px;
  background-color: rgba(1, 180, 126);
}

:deep(.multiselect__content-wrapper::-webkit-scrollbar-thumb) {
  border-radius: 0px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgba(1, 180, 126);
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
