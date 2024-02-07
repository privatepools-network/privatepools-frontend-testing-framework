<template>
  <div class="arbitrage_bot_card  py-3 px-4">
    <div class="d-flex align-items-center justify-content-between gap-2 flex-wrap">
      <div class="d-flex align-items-center justify-content-between w-100">
        <!-- <img :src="darkpool_logo" /> -->
        <div class="arbitrage_bot_header">Arbitrage System</div>

      </div>
      <!-- <div>
        <multiselect :modelValue="chainSelected" @update:modelValue="chainSelected = $event" placeholder="" label="title"
          track-by="code" :options="chainOptions" :option-height="104" :show-labels="true" :searchable="false"
          :allow-empty="false" :hide-selected="true" :close-on-select="true" :taggable="false" :showLabels="false">
          <template v-slot:singleLabel="{ option }">
            <div style="display: flex; align-items: center">
              <img v-if="option.code !== 'ALL'" style="width: 20px; height: 20px; margin-right: 5px"
                :src="option.img" /><span> {{ option.name
                }}</span>

            </div>
          </template>
          <template v-slot:option="{ option }">
            <div style="display: flex; align-items: center">
              <img v-if="option.code !== 'ALL'" style="width: 20px; height: 20px; margin-right: 5px"
                :src="option.img" /><span> {{ option.name
                }}</span>

            </div>
          </template>
        </multiselect>
      </div> -->
    </div>

    <div class="px-2">
      <div style="margin-top: 5%; color: rgba(204, 204, 204, 1)">
        Number of trades
      </div>
      <div class="mb-xxl-4 mb-2">
        <div @click="clickOnVisibleTrades()" class="visible_head" style="cursor: pointer">
          <div class="d-flex align-items-center gap-2" style="margin-left: -20px; width: 15px">
            <div>
              <div>
                <img :src="arrow_up" :class="!visibleTrades ? 'toggle-down' : 'toggle-up'" />
              </div>
            </div>
            <div v-if="!data" class="totals_loader_header">
              <ThreeDots />
            </div>
            <div v-else class="visible_head arbitrage_bot_header">
              {{ data?.Trades }}
            </div>
          </div>
        </div>
        <CCollapse :visible="visibleTrades">
          <div style="color: rgba(204, 204, 204, 1)">
            <div class="arbitrage_bot_sections_text">Chain Breakdown</div>
            <div class="d-flex flex-column gap-1">
              <div v-for="chain in chainSelected.toLowerCase() == 'all chains'
                ? netwoks
                : [chainSelected]" :key="chain" class="d-flex align-items-center justify-content-between">
                <div>{{ chain }}</div>
                <div v-if="data == undefined || !data[`Trades${chain}`]" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)">
                  {{ data[`Trades${chain}`] }} Trades
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
      </div>

      <div class="mb-xxl-4 mb-2">
        <div @click="clickOnVisibleTotalRevenue()" class="visible_head" style="cursor: pointer">
          <div class="d-flex align-items-center gap-2" style="margin-left: -20px">
            <div>
              <div>
                <img :src="arrow_up" :width="10" :class="!visibleTotalRevenue ? 'toggle-down' : 'toggle-up'" />
              </div>
            </div>
            <div style="
                font-weight: 700;
                font-family: Inter;
                color: white;
                width: 100%;
              ">
              <div class="d-flex align-items-baseline justify-content-between visible_head">
                <div class="arbitrage_bot_sections_text">Total Profit</div>

                <div v-if="!data" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)">
                  <span v-if="currencySelected.symbol === '₿'">
                    <img :src="btcSymbol" width="9" />
                  </span>
                  <span v-else-if="currencySelected.symbol === 'Ξ'">
                    <img :src="ethSymbol" width="9" />
                  </span>
                  <span v-else>{{ currencySelected.symbol }} </span> {{ formatBigNumber(data?.Profit, currencyDecimals) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <CCollapse :visible="visibleTotalRevenue">
          <div style="
              color: rgba(204, 204, 204, 1);
              margin-top: 10px;
              margin-bottom: 5px;
            ">
            <div class="d-flex flex-column gap-1">
              <SidebarHeaderDropdown :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :headerValue="data?.Profit24H" :headerTitle="'Profit 24 Hours'"
                :visible="dropdownChildrenVisibility['Profit 24 Hours']" @headerClick="(v) => (dropdownChildrenVisibility['Profit 24 Hours'] = v)
                  " @closeAllDrops="closeAllDropdowns"></SidebarHeaderDropdown>
              <TokenCCollapse :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :data="data?.Profit24HTokens" :tokensAmountData="data?.Profit24HTokensAmount"
                :visible="dropdownChildrenVisibility['Profit 24 Hours']">
              </TokenCCollapse>
              <SidebarHeaderDropdown :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :headerValue="data?.Profit7D" :headerTitle="'Profit 7 Days'"
                :visible="dropdownChildrenVisibility['Profit 7 Days']" @headerClick="(v) => (dropdownChildrenVisibility['Profit 7 Days'] = v)
                  " @closeAllDrops="closeAllDropdowns"></SidebarHeaderDropdown>
              <TokenCCollapse :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :data="data?.Profit7DTokens" :tokensAmountData="data?.Profit7DTokensAmount"
                :visible="dropdownChildrenVisibility['Profit 7 Days']">
              </TokenCCollapse>
              <SidebarHeaderDropdown :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :headerValue="data?.Profit30D" :headerTitle="'Profit 30 Days'"
                :visible="dropdownChildrenVisibility['Profit 30 Days']" @headerClick="(v) => (dropdownChildrenVisibility['Profit 30 Days'] = v)
                  " @closeAllDrops="closeAllDropdowns"></SidebarHeaderDropdown>
              <TokenCCollapse :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :data="data?.Profit30DTokens" :tokensAmountData="data?.Profit30DTokensAmount"
                :visible="dropdownChildrenVisibility['Profit 30 Days']">
              </TokenCCollapse>
            </div>
          </div>
        </CCollapse>
      </div>

      <div class="mb-xxl-4 mb-2">
        <div @click="clickOnVisibleTotalProfit" style="cursor: pointer" class="visible_head">
          <div class="d-flex align-items-center gap-2" style="margin-left: -20px">
            <div>
              <div>
                <img :src="arrow_up" :width="10" :class="!visibleTotalProfit ? 'toggle-down' : 'toggle-up'" />
              </div>
            </div>
            <div style="
                font-weight: 700;
                font-family: Inter;
                color: white;
                width: 100%;
              ">
              <div class="d-flex align-items-baseline justify-content-between visible_head">
                <div class="arbitrage_bot_sections_text">Total Gas Fees</div>
                <div v-if="!data" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)">
                  <span v-if="currencySelected.symbol === '₿'">
                    <img :src="btcSymbol" width="9" />
                  </span>
                  <span v-else-if="currencySelected.symbol === 'Ξ'">
                    <img :src="ethSymbol" width="9" />
                  </span>
                  <span v-else>{{ currencySelected.symbol }} </span> {{ formatBigNumber(data?.GasFee, currencyDecimals) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <CCollapse :visible="visibleTotalProfit">
          <div style="
              color: rgba(204, 204, 204, 1);
              margin-top: 10px;
              margin-bottom: 5px;
            ">
            <div class="d-flex flex-column gap-1">
              <SidebarHeaderDropdown :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :headerValue="data?.GasFee24H" :headerTitle="'Gas Fees 24 Hours'"
                :visible="dropdownChildrenVisibility['Gas Fees 24 Hours']" @headerClick="(v) => (dropdownChildrenVisibility['Gas Fees 24 Hours'] = v)
                  " @closeAllDrops="closeAllDropdowns"></SidebarHeaderDropdown>
              <TokenCCollapse :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :data="data?.GasFee24HTokens" :tokensAmountData="data?.GasFee24HTokensAmount"
                :visible="dropdownChildrenVisibility['Gas Fees 24 Hours']">
              </TokenCCollapse>
              <SidebarHeaderDropdown :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :headerValue="data?.GasFee7D" :headerTitle="'Gas Fees 7 Days'"
                :visible="dropdownChildrenVisibility['Gas Fees 7 Days']" @headerClick="(v) => (dropdownChildrenVisibility['Gas Fees 7 Days'] = v)
                  " @closeAllDrops="closeAllDropdowns"></SidebarHeaderDropdown>
              <TokenCCollapse :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :data="data?.GasFee7DTokens" :tokensAmountData="data?.GasFee7DTokensAmount"
                :visible="dropdownChildrenVisibility['Gas Fees 7 Days']">
              </TokenCCollapse>
              <SidebarHeaderDropdown :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :headerValue="data?.GasFee30D" :headerTitle="'Gas Fees 30 Days'"
                :visible="dropdownChildrenVisibility['Gas Fees 30 Days']" @headerClick="(v) => (dropdownChildrenVisibility['Gas Fees 30 Days'] = v)
                  " @closeAllDrops="closeAllDropdowns"></SidebarHeaderDropdown>
              <TokenCCollapse :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :data="data?.GasFee30DTokens" :tokensAmountData="data?.GasFee30DTokensAmount"
                :visible="dropdownChildrenVisibility['Gas Fees 30 Days']">
              </TokenCCollapse>
            </div>
          </div>
        </CCollapse>
      </div>
    </div>
  </div>
</template>
<script setup>
// import darkpool_logo from '@/assets/icons/darkpool_logo.svg'
import arrow_up from '@/assets/icons/arrow/arrow_up.svg'
import {
  ref,
  defineProps,
  toRefs,
  onMounted,
  computed,
} from 'vue'
import { formatBigNumber } from '@/lib/utils/index'
import SidebarHeaderDropdown from './SidebarHeaderDropdown.vue'
import TokenCCollapse from './TokenCCollapse.vue'
import ThreeDots from '@/components/loaders/ThreeDots.vue'
import { DisplayNetwork, Network } from '@/composables/useNetwork'

import btcSymbol from '@/assets/images/tokens/btcSymbol.png'
import ethSymbol from '@/assets/images/tokens/ethSymbol.png'

const props = defineProps(['data', 'chainSelected', 'currencySelected'])
const { currencySelected } = toRefs(props)
const currencyDecimals = computed(() =>
  currencySelected.value.symbol == '$' ? 0 : 5,
)
const { data, chainSelected } = toRefs(props)
const netwoks = [
  process.env.VUE_APP_KEY_ARBITRUM
    ? DisplayNetwork[Network.ARBITRUM]
    : undefined,
  process.env.VUE_APP_KEY_BINANCE ? DisplayNetwork[Network.BINANCE] : undefined,
  process.env.VUE_APP_KEY_POLYGON ? DisplayNetwork[Network.POLYGON] : undefined,
].filter((n) => n != undefined)

const visibleTrades = ref(true)
const visibleTotalRevenue = ref(true)
const visibleTotalProfit = ref(true)

const dropdownChildrenVisibility = ref({})

function closeAllDropdowns() {
  Object.keys(dropdownChildrenVisibility.value).forEach(
    (v) => (dropdownChildrenVisibility.value[v] = false),
  )
}

function clickOnVisibleTrades() {
  // visibleTotalRevenue.value = false
  // visibleTotalProfit.value = false
  visibleTrades.value = !visibleTrades.value
}
function clickOnVisibleTotalProfit() {
  // visibleTotalRevenue.value = false
  // visibleTrades.value = false
  visibleTotalProfit.value = !visibleTotalProfit.value
}
function clickOnVisibleTotalRevenue() {
  // visibleTrades.value = false
  // visibleTotalProfit.value = false
  visibleTotalRevenue.value = !visibleTotalRevenue.value
}

onMounted(() => {
  const availableHeaders = ['Profit', 'Gas Fees']
  const periods = ['24 Hours', '7 Days', '30 Days']
  for (let i = 0; i < availableHeaders.length; i++) {
    for (let k = 0; k < periods.length; k++) {
      dropdownChildrenVisibility.value[
        `${availableHeaders[i]} ${periods[k]}`
      ] = false
    }
  }
})

</script>
<style lang="scss">
@import '@/styles/_variables.scss';

.totals_loader {
  margin-right: 20px;
  margin-top: 6px;
  margin-bottom: 6px;
}

.totals_loader_header {
  margin-left: 20px;
  margin-top: 6px;
  margin-bottom: 6px;
}

.toggle-down {
  transform: rotate(0deg);
  transition: all 0.3s;
}

.toggle-up {
  transform: rotate(180deg);
  transition: all 0.3s;
}

.visible_head {
  color: white;
}

.visible_head:hover {
  color: #00A3FF;
}

.multiselect__tags {
  background: none !important;
  border-color: #00C9FF !important;
}

.multiselect__content-wrapper {
  border-color: #00C9FF !important;
}

.multiselect__single {
  background: none !important;
  color: white !important;
}

.multiselect__option {
  background: rgb(15, 17, 19) !important;
  color: white !important;
}

.multiselect__option:hover {
  background: #00c8ffb0 !important;
}

.arbitrage_bot_header {
  font-size: clamp(10px, 0.7vw, 14px);
  font-weight: 700;
  font-family: Inter;
  color: white;
}

.arbitrage_bot_sections_text {
  font-size: clamp(10px, 0.7vw, 14px);
  margin-top: 10px;
  margin-bottom: 5px;
}

.arbitrage_bot_card {
  width: 30%;
  background: linear-gradient(356.2deg, #001b220e 0%, #000000 105.42%);
  // border: 1px solid rgba(163, 164, 165, 0.3);
  border-radius: 20px 0px 0px 20px;
}

@media (max-width: $xxl) {
  .arbitrage_bot_card {
    width: 30%;
    font-size: clamp(10px, 0.7vw, 14px);
  }
}

@media (max-width: $xl) {
  .timeline_container {
    width: fit-content;
    display: flex;
    position: static;
    z-index: 30;
    margin-left: 0;
    margin-top: 0;
    margin-bottom: 20px;
  }

  .arbitrage_bot_card {
    width: 100%;
    font-size: 12px;
    border: 1px solid rgba(163, 164, 165, 0.3);
    border-width: 1px 1px 0px 1px;
    border-radius: 20px 20px 0px 0px;
    padding: 20px 20px 10px 20px;
  }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
