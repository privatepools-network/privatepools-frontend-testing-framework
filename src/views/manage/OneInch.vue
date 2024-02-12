<template>
  <MainCard>
    <CRow class="mb-4 d-flex align-items-center">
      <CCol md="auto">
        <div class="text-white fw-bold fs-4">{{ caption }}</div>
      </CCol>
      <CCol md="auto">
        <div>
          <multiselect :modelValue="chainSelected" @update:modelValue="chainSelected = $event" placeholder=""
            label="title" track-by="code" :options="chainOptions" :option-height="104" :show-labels="true"
            :searchable="false" :allow-empty="false" :hide-selected="true" :close-on-select="true" :taggable="false"
            :showLabels="false">
            <template v-slot:singleLabel="{ option }">
              <div style="display: flex; align-items: center">
                <img style="width: 20px; height: 20px; margin-right: 5px" :src="option.img" /><span> {{ option.name
                }}</span>
                <span style="
                          color: rgba(108, 114, 132, 1);
                          margin-left: 2.5px;
                        ">({{ option.code }})</span>
              </div>
            </template>
            <template v-slot:option="{ option }">
              <div style="display: flex; align-items: center">
                <img style="width: 20px; height: 20px; margin-right: 5px" :src="option.img" /><span> {{ option.name
                }}</span>
                <span style="
                          color: rgba(108, 114, 132, 1);
                          margin-left: 2.5px;
                        ">({{ option.code }})</span>
              </div>
            </template>
          </multiselect>
        </div>
      </CCol>
      <CCol />
    </CRow>
    <CRow>
      <SelectTokens :isInitialized="true" :isBotRunning="isBotRunning" @onSelect="onSelect" :trackBy="'code'"
        :selectedTokens="selectedTokens" :onSave="() => useSaveDexes(chainSelected, selectedTokens)" :strategy="false"
        caption="DEXs" :options="computedNetwork" :chainSelected="chainSelected" :isSaveDisabled="isSaveDisabled"
        :possibleTokens="possibleTokens" />
    </CRow>
  </MainCard>
</template>

<script setup>
import SelectTokens from '@/components/SelectTokens'
import { ref, computed, watch, onMounted } from 'vue'
import binanceNetwork from '../../assets/networks/binance'
import arbitrumNetwork from '../../assets/networks/arbitrum'
import polygonNetwork from '../../assets/networks/polygon'
import arb from '@/assets/images/networks/arbitrum.png'
import polygon from '@/assets/images/networks/polygon.png'
import binance from '@/assets/images/networks/binance2.png'
import Multiselect from 'vue-multiselect'
import { GetChoosenRoutes } from "@/composables/admin/dex/useChoosenRoutes"
import { GetPossibleRoutes } from "@/composables/admin/dex/usePossibleRoutes"
import { GetBotStatus, useBotStatus } from "@/composables/admin/useBotStatus"
import { useSaveDexes } from "@/composables/admin/dex/useSaveDexes"
import MainCard from '@/UI/MainCard.vue'




// const optionsTokens = ref([])
const caption = ref('Select DEXs')

const chainSelected = ref({ name: 'Arbitrum', code: 'ETH', img: arb })
const chainOptions = ref([
  { name: 'Arbitrum', code: 'ETH', img: arb },
  { name: 'Binance', code: 'BNB', img: binance },
  { name: 'Polygon', code: 'MATIC', img: polygon },
])




const computedNetwork = ref([])


const { data: statusCheckQuery } = useBotStatus(chainSelected)
const isBotRunning = computed(() => statusCheckQuery.value)

const isInitialized = ref(false)
const selectedTokens = ref([])
const possibleTokens = ref([])
watch(
  chainSelected,
  async () => {
    computedNetwork.value = GetChainDexes(chainSelected.value.name)
    let choosenRoutes = await GetChoosenRoutes(chainSelected.value)
    let _possibleRoutes = await GetPossibleRoutes(chainSelected.value)
    computedNetwork.value.forEach((opt) => { if (!_possibleRoutes.includes(opt.code)) opt["$isDisabled"] = true; else opt['$isDisabled'] = false })
    isBotRunning.value = await GetBotStatus(chainSelected)
    selectedTokens.value = [...computedNetwork.value.filter(opt => choosenRoutes.includes(opt.code))];
    possibleTokens.value = [...computedNetwork.value.filter(opt => _possibleRoutes.includes(opt.code))]
  },
)
const isSaveDisabled = computed(() => isBotRunning.value)



function GetChainDexes(name) {
  return name === 'Arbitrum'
    ? arbitrumNetwork
    : name === 'Polygon'
      ? polygonNetwork
      : name === 'Binance'
        ? binanceNetwork
        : 'Unsupported network'
}

onMounted(async () => {
  computedNetwork.value = GetChainDexes(chainSelected.value.name)
  computedNetwork.value.forEach((opt) => { opt["$isDisabled"] = true; })
  let possibleRoutes = await GetPossibleRoutes(chainSelected.value)
  computedNetwork.value.forEach((opt) => { if (!possibleRoutes.includes(opt.code)) opt["$isDisabled"] = true; else opt['$isDisabled'] = false })
  let initRoutes = await GetChoosenRoutes(chainSelected.value)
  let initTokens = [...computedNetwork.value.filter(opt => initRoutes.includes(opt.code))]
  selectedTokens.value = initTokens
  possibleTokens.value = [...computedNetwork.value.filter(opt => possibleRoutes.includes(opt.code))]
  if (!isBotRunning.value) {
    isInitialized.value = true
  }
})



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
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
