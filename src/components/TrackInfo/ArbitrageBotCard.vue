<template>
  <div class="arbitrage_bot_card py-3 px-4">
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
      <div class="arbitrage_bot_sections_text" style="margin-top: 5%; color: rgba(204, 204, 204, 1)">
        Total Value Locked
      </div>
      <div class="mb-xxl-4 mb-2">
        <div @click="clickOnVisibleTVL()" class="visible_head" style="cursor: pointer">
          <div class="d-flex align-items-center gap-2" style="margin-left: -20px; width: 15px">
            <div>
              <div>
                <img :src="arrow_up" :class="!visibleTVL ? 'toggle-down' : 'toggle-up'" />
              </div>
            </div>
            <div v-if="Object.keys(tvlInfo).length === 0" class="totals_loader_header">
              <ThreeDots />
            </div>
            <div v-else style="font-weight: 700; font-family: Inter" class="visible_head arbitrage_bot_sections_text">
              <span v-if="currencySelected.symbol === '₿'">
                <img :src="btcSymbol" width="9" />
              </span>
              <span v-else-if="currencySelected.symbol === 'Ξ'">
                <img :src="ethSymbol" width="9" />
              </span>
              <div v-else class="d-flex align-items-center">

                ${{ numberToAposthrophe(tvlAll, currencyDecimals) }}
              </div>
            </div>
          </div>
        </div>
        <CCollapse :visible="visibleTVL">
          <div style="color: rgba(204, 204, 204, 1)">
            <div class="arbitrage_bot_sections_text" style="margin-bottom: 5px">
              Chain Breakdown
            </div>
            <div class="d-flex flex-column gap-1">
              <div v-if="arb_init && ['ETH', 'ALL'].includes(chainSelected.code)"
                class="d-flex align-items-center justify-content-between">
                <div>Arbitrum</div>
                <div v-if="Object.keys(tvlInfo).length === 0" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)">
                  ${{
                    numberToAposthrophe(tvlInfo['Arbitrum'], currencyDecimals)
                  }}
                </div>
              </div>
              <div v-if="bnb_init && ['BNB', 'ALL'].includes(chainSelected.code)"
                class="d-flex align-items-center justify-content-between">
                <div>Binance</div>
                <div v-if="Object.keys(tvlInfo).length === 0" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)">
                  <span v-if="currencySelected.symbol === '₿'">
                    <img :src="btcSymbol" width="9" />
                  </span>
                  <span v-else-if="currencySelected.symbol === 'Ξ'">
                    <img :src="ethSymbol" width="9" />
                  </span>
                  <span v-else>{{ currencySelected.symbol }} </span> {{
                    numberToAposthrophe(tvlInfo['Binance'], currencyDecimals)
                  }}
                </div>
              </div>
              <div v-if="matic_init && ['MATIC', 'ALL'].includes(chainSelected.code)
                  " class="d-flex align-items-center justify-content-between">
                <div>Polygon</div>
                <div v-if="Object.keys(tvlInfo).length === 0" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)">
                  <span v-if="currencySelected.symbol === '₿'">
                    <img :src="btcSymbol" width="9" />
                  </span>
                  <span v-else-if="currencySelected.symbol === 'Ξ'">
                    <img :src="ethSymbol" width="9" />
                  </span>
                  <span v-else>{{ currencySelected.symbol }} </span> {{
                    numberToAposthrophe(tvlInfo['Polygon'], currencyDecimals)
                  }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
      </div>

      <div class="mb-xxl-4 mb-2">
        <div @click="clickOnVisibleRevenue()" class="visible_head" style="cursor: pointer">
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
                <div style="font-family: Inter; font-weight: 400" class="arbitrage_bot_sections_text">
                  Total Revenue
                </div>
                <div v-if="Object.keys(tvlInfo).length === 0" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)">
                  <span v-if="currencySelected.symbol === '₿'">
                    <img :src="btcSymbol" width="9" />
                  </span>
                  <span v-else-if="currencySelected.symbol === 'Ξ'">
                    <img :src="ethSymbol" width="9" />
                  </span>
                  <span v-else>{{ currencySelected.symbol }} </span> {{
                    numberToAposthrophe(revenueInfo.total, currencyDecimals)
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <CCollapse :visible="visibleTotalRevenue">
          <div style="
              color: rgba(204, 204, 204, 1);
              /* margin-top: 10px;
              margin-bottom: 5px; */
            ">
            <div class="d-flex flex-column gap-1">
              <SidebarHeaderDropdown :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :headerValue="revenueInfo['24h']" :headerTitle="'Revenue 24 Hours'"
                :visible="dropdownChildrenVisibility['Revenue 24 Hours']" @headerClick="(v) => (dropdownChildrenVisibility['Revenue 24 Hours'] = v)
                  " @closeAllDrops="closeAllDropdowns"></SidebarHeaderDropdown>
              <TokenCCollapse :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :data="revenueInfo['tokens24h']" :tokensAmountData="revenueInfo['tokensAmount24h']"
                :visible="dropdownChildrenVisibility['Revenue 24 Hours']">
              </TokenCCollapse>
              <SidebarHeaderDropdown :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :headerValue="revenueInfo['7d']" :headerTitle="'Revenue 7 Days'"
                :visible="dropdownChildrenVisibility['Revenue 7 Days']" @headerClick="(v) => (dropdownChildrenVisibility['Revenue 7 Days'] = v)
                  " @closeAllDrops="closeAllDropdowns"></SidebarHeaderDropdown>
              <TokenCCollapse :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :data="revenueInfo['tokens7d']" :tokensAmountData="revenueInfo['tokensAmount7d']"
                :visible="dropdownChildrenVisibility['Revenue 7 Days']">
              </TokenCCollapse>
              <SidebarHeaderDropdown :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :headerValue="revenueInfo['30d']" :headerTitle="'Revenue 30 Days'"
                :visible="dropdownChildrenVisibility['Revenue 30 Days']" @headerClick="(v) => (dropdownChildrenVisibility['Revenue 30 Days'] = v)
                  " @closeAllDrops="closeAllDropdowns"></SidebarHeaderDropdown>
              <TokenCCollapse :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :data="revenueInfo['tokens30d']" :tokensAmountData="revenueInfo['tokensAmount30d']"
                :visible="dropdownChildrenVisibility['Revenue 30 Days']">
              </TokenCCollapse>
            </div>
          </div>
        </CCollapse>
      </div>

      <div class="mb-xxl-4 mb-2">
        <div @click="clickOnVisibleGas()" style="cursor: pointer">
          <div class="d-flex align-items-center gap-2" style="margin-left: -20px">
            <div>
              <div>
                <img :src="arrow_up" :width="10" :class="!visibleTotalGas ? 'toggle-down' : 'toggle-up'" />
              </div>
            </div>
            <div style="
                font-weight: 700;
                font-family: Inter;
                color: white;
                width: 100%;
              ">
              <div class="d-flex align-items-baseline justify-content-between visible_head">
                <div style="font-family: Inter; font-weight: 400" class="arbitrage_bot_sections_text">
                  Total Gas Fees Spent
                </div>
                <div v-if="Object.keys(tvlInfo).length === 0" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)">
                  <span v-if="currencySelected.symbol === '₿'">
                    <img :src="btcSymbol" width="9" />
                  </span>
                  <span v-else-if="currencySelected.symbol === 'Ξ'">
                    <img :src="ethSymbol" width="9" />
                  </span>
                  <span v-else>{{ currencySelected.symbol }} </span> {{
                    numberToAposthrophe(feesInfo['total'], currencyDecimals)
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <CCollapse :visible="visibleTotalGas">
          <div style="
              color: rgba(204, 204, 204, 1);
              /* margin-top: 10px;
              margin-bottom: 5px; */
            ">
            <div class="d-flex flex-column gap-1">
              <SidebarHeaderDropdown :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :headerValue="feesInfo['24h']" :headerTitle="'Gas Fees 24 Hours'"
                :visible="dropdownChildrenVisibility['Gas Fees 24 Hours']" @headerClick="(v) => (dropdownChildrenVisibility['Gas Fees 24 Hours'] = v)
                  " @closeAllDrops="closeAllDropdowns"></SidebarHeaderDropdown>
              <TokenCCollapse :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :data="feesInfo['tokens24h']" :tokensAmountData="feesInfo['tokensAmount24h']"
                :visible="dropdownChildrenVisibility['Gas Fees 24 Hours']">
              </TokenCCollapse>
              <SidebarHeaderDropdown :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :headerValue="feesInfo['7d']" :headerTitle="'Gas Fees 7 Days'"
                :visible="dropdownChildrenVisibility['Gas Fees 7 Days']" @headerClick="(v) => (dropdownChildrenVisibility['Gas Fees 7 Days'] = v)
                  " @closeAllDrops="closeAllDropdowns"></SidebarHeaderDropdown>
              <TokenCCollapse :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :data="feesInfo['tokens7d']" :tokensAmountData="feesInfo['tokensAmount7d']"
                :visible="dropdownChildrenVisibility['Gas Fees 7 Days']">
              </TokenCCollapse>
              <SidebarHeaderDropdown :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :headerValue="feesInfo['30d']" :headerTitle="'Gas Fees 30 Days'"
                :visible="dropdownChildrenVisibility['Gas Fees 30 Days']" @headerClick="(v) => (dropdownChildrenVisibility['Gas Fees 30 Days'] = v)
                  " @closeAllDrops="closeAllDropdowns"></SidebarHeaderDropdown>
              <TokenCCollapse :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :data="feesInfo['tokens30d']" :tokensAmountData="feesInfo['tokensAmount30d']"
                :visible="dropdownChildrenVisibility['Gas Fees 30 Days']">
              </TokenCCollapse>
            </div>
          </div>
        </CCollapse>
      </div>

      <div class="mb-xxl-4 mb-2">
        <div @click="clickOnVisibleProfit()" style="cursor: pointer" class="visible_head">
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
                <div style="font-family: Inter; font-weight: 400" class="arbitrage_bot_sections_text">
                  Total Profits
                </div>
                <div v-if="Object.keys(tvlInfo).length === 0" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)">
                  <span v-if="currencySelected.symbol === '₿'">
                    <img :src="btcSymbol" width="9" />
                  </span>
                  <span v-else-if="currencySelected.symbol === 'Ξ'">
                    <img :src="ethSymbol" width="9" />
                  </span>
                  <span v-else>{{ currencySelected.symbol }} </span> {{
                    numberToAposthrophe(profitInfo.total, currencyDecimals)
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <CCollapse :visible="visibleTotalProfit">
          <div style="
              color: rgba(204, 204, 204, 1);
              /* margin-top: 10px;
              margin-bottom: 5px; */
            ">
            <div class="d-flex flex-column gap-1">
              <SidebarHeaderDropdown :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :headerValue="profitInfo['24h']" :headerTitle="'Profits 24 Hours'"
                :visible="dropdownChildrenVisibility['Profits 24 Hours']" @headerClick="(v) => (dropdownChildrenVisibility['Profits 24 Hours'] = v)
                  " @closeAllDrops="closeAllDropdowns"></SidebarHeaderDropdown>
              <TokenCCollapse :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :data="profitInfo['tokens24h']" :tokensAmountData="profitInfo['tokensAmount24h']"
                :visible="dropdownChildrenVisibility['Profits 24 Hours']">
              </TokenCCollapse>
              <SidebarHeaderDropdown :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :headerValue="profitInfo['7d']" :headerTitle="'Profits 7 Days'"
                :visible="dropdownChildrenVisibility['Profits 7 Days']" @headerClick="(v) => (dropdownChildrenVisibility['Profits 7 Days'] = v)
                  " @closeAllDrops="closeAllDropdowns"></SidebarHeaderDropdown>
              <TokenCCollapse :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :data="profitInfo['tokens7d']" :tokensAmountData="profitInfo['tokensAmount7d']"
                :visible="dropdownChildrenVisibility['Profits 7 Days']">
              </TokenCCollapse>
              <SidebarHeaderDropdown :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :headerValue="profitInfo['30d']" :headerTitle="'Profits 30 Days'"
                :visible="dropdownChildrenVisibility['Profits 30 Days']" @headerClick="(v) => (dropdownChildrenVisibility['Profits 30 Days'] = v)
                  " @closeAllDrops="closeAllDropdowns"></SidebarHeaderDropdown>
              <TokenCCollapse :currencyDecimals="currencyDecimals" :symbol="currencySelected.symbol"
                :data="profitInfo['tokens30d']" :tokensAmountData="profitInfo['tokensAmount30d']"
                :visible="dropdownChildrenVisibility['Profits 30 Days']">
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
import { ref, defineProps, toRefs, computed, onMounted } from 'vue'
import ThreeDots from '@/components/loaders/ThreeDots.vue'
import numberToAposthrophe from '@/lib/formatter/numberToAposthrophe'
import {
  isRightChainName,
  usePool24hGasFeeTokens,
  usePool7dGasFeeTokens,
  usePool30dGasFeeTokens,
  usePool24hGasFeeTokensAmount,
  usePool7dGasFeeTokensAmount,
  usePool30dGasFeeTokensAmount,
  usePool24hProfitTokens,
  usePool7dProfitTokens,
  usePool30dProfitTokens,
  usePool24hProfitTokensAmount,
  usePool7dProfitTokensAmount,
  usePool30dProfitTokensAmount,
  usePool24hRevenueTokens,
  usePool7dRevenueTokens,
  usePool30dRevenueTokens,
  usePool24hRevenueTokensAmount,
  usePool7dRevenueTokensAmount,
  usePool30dRevenueTokensAmount,
} from '@/composables/pools/usePoolSwapsStats'
import { groupBy } from '@/lib/utils'
import SidebarHeaderDropdown from '@/components/TrackTrades/SidebarHeaderDropdown.vue'
import TokenCCollapse from '@/components/TrackTrades/TokenCCollapse.vue'


const props = defineProps([
  'allTableData',
  'chainSelected',
  'tokensData',
  'poolSwapsData',
  'currencySelected',
])



const { allTableData, chainSelected, tokensData, poolSwapsData, currencySelected } = toRefs(props)
const currencyDecimals = computed(() => currencySelected.value.symbol == "$" ? 0 : 5)



const visibleTVL = ref(true)
const visibleTotalRevenue = ref(true)
const visibleTotalProfit = ref(true)
const visibleTotalGas = ref(true)

const dropdownChildrenVisibility = ref({})

function closeAllDropdowns() {
  Object.keys(dropdownChildrenVisibility.value).forEach(
    (v) => (dropdownChildrenVisibility.value[v] = false),
  )
}

function clickOnVisibleTVL() {
  // visibleTotalRevenue.value = false
  // visibleTotalProfit.value = false
  // visibleTotalGas.value = false
  visibleTVL.value = !visibleTVL.value
}
function clickOnVisibleRevenue() {
  // visibleTVL.value = false
  // visibleTotalProfit.value = false
  // visibleTotalGas.value = false
  visibleTotalRevenue.value = !visibleTotalRevenue.value
}
function clickOnVisibleProfit() {
  // visibleTotalRevenue.value = false
  // visibleTVL.value = false
  // visibleTotalGas.value = false
  visibleTotalProfit.value = !visibleTotalProfit.value
}
function clickOnVisibleGas() {
  // visibleTotalRevenue.value = false
  // visibleTotalProfit.value = false
  // visibleTVL.value = false
  visibleTotalGas.value = !visibleTotalGas.value
}

const chainFilteredSwapsData = computed(() =>
  poolSwapsData.value.filter((item) =>
    isRightChainName(item.chain, chainSelected.value.name),
  ),
)

onMounted(() => {
  const availableHeaders = ['Profit', 'Gas Fees', 'Revenue']
  const periods = ['24 Hours', '7 Days', '30 Days']
  for (let i = 0; i < availableHeaders.length; i++) {
    for (let k = 0; k < periods.length; k++) {
      dropdownChildrenVisibility.value[
        `${availableHeaders[i]} ${periods[k]}`
      ] = false
    }
  }
})

const tvlInfo = computed(() => {
  let groupped = groupBy(allTableData.value, ({ Blockchain }) => Blockchain)
  let result = {}
  for (const [key, value] of Object.entries(groupped)) {
    result[key] = value.reduce((sum, value) => sum + parseFloat(value.TVL), 0)
  }
  return result
})

const tvlAll = computed(() => {
  console.log(chainSelected.value)
  return chainSelected.value.code == 'ALL'
    ? (tvlInfo.value['Arbitrum'] ? tvlInfo.value['Arbitrum'] : 0) +
    (tvlInfo.value['Binance'] ? tvlInfo.value['Binance'] : 0) +
    (tvlInfo.value['Polygon'] ? tvlInfo.value['Polygon'] : 0)
    : tvlInfo.value[chainSelected.value.name]
})

const revenueInfo = computed(() => {
  let groupped = groupBy(allTableData.value, ({ Blockchain }) => Blockchain)
  let result = { '24h': 0, '7d': 0, '30d': 0, total: 0 }
  for (const [key, value] of Object.entries(groupped)) {
    if (chainSelected.value.code == 'ALL' || key == chainSelected.value.name) {
      result['total'] += value.reduce(
        (sum, value) => sum + parseFloat(value['Revenue All Time']),
        0,
      )
      result['24h'] += value.reduce(
        (sum, value) => sum + parseFloat(value['Revenue 24 H']),
        0,
      )
      result['7d'] += value.reduce(
        (sum, value) => sum + parseFloat(value['Revenue 7 D']),
        0,
      )
      result['30d'] += value.reduce(
        (sum, value) => sum + parseFloat(value['Revenue 30 D']),
        0,
      )
    }
  }
  result['tokens24h'] = usePool24hRevenueTokens(
    chainFilteredSwapsData.value,
    tokensData.value,
  )
  result['tokens7d'] = usePool7dRevenueTokens(
    chainFilteredSwapsData.value,
    tokensData.value,
  )
  result['tokens30d'] = usePool30dRevenueTokens(
    chainFilteredSwapsData.value,
    tokensData.value,
  )

  result['tokensAmount24h'] = usePool24hRevenueTokensAmount(
    chainFilteredSwapsData.value,
    tokensData.value,
  )
  result['tokensAmount7d'] = usePool7dRevenueTokensAmount(
    chainFilteredSwapsData.value,
    tokensData.value,
  )
  result['tokensAmount30d'] = usePool30dRevenueTokensAmount(
    chainFilteredSwapsData.value,
    tokensData.value,
  )
  return result
})
const profitInfo = computed(() => {
  let groupped = groupBy(allTableData.value, ({ Blockchain }) => Blockchain)
  let result = { '24h': 0, '7d': 0, '30d': 0, total: 0 }
  for (const [key, value] of Object.entries(groupped)) {
    if (chainSelected.value.code == 'ALL' || key == chainSelected.value.name) {
      result['total'] += value.reduce(
        (sum, value) => sum + parseFloat(value['Profit All Time']),
        0,
      )
      result['24h'] += value.reduce(
        (sum, value) => sum + parseFloat(value['Profit 24 H']),
        0,
      )
      result['7d'] += value.reduce(
        (sum, value) => sum + parseFloat(value['Profit 7 D']),
        0,
      )
      result['30d'] += value.reduce(
        (sum, value) => sum + parseFloat(value['Profit 30 D']),
        0,
      )
    }
  }
  result['tokens24h'] = usePool24hProfitTokens(
    chainFilteredSwapsData.value,
    tokensData.value,
  )
  result['tokens7d'] = usePool7dProfitTokens(
    chainFilteredSwapsData.value,
    tokensData.value,
  )
  result['tokens30d'] = usePool30dProfitTokens(
    chainFilteredSwapsData.value,
    tokensData.value,
  )

  result['tokensAmount24h'] = usePool24hProfitTokensAmount(
    chainFilteredSwapsData.value,
    tokensData.value,
  )
  result['tokensAmount7d'] = usePool7dProfitTokensAmount(
    chainFilteredSwapsData.value,
    tokensData.value,
  )
  result['tokensAmount30d'] = usePool30dProfitTokensAmount(
    chainFilteredSwapsData.value,
    tokensData.value,
  )
  return result
})
const feesInfo = computed(() => {
  let groupped = groupBy(allTableData.value, ({ Blockchain }) => Blockchain)
  let result = { '24h': 0, '7d': 0, '30d': 0, total: 0 }
  for (const [key, value] of Object.entries(groupped)) {
    if (chainSelected.value.code == 'ALL' || key == chainSelected.value.name) {
      result['total'] += value.reduce(
        (sum, value) => sum + parseFloat(value['Gas Fees All Time']),
        0,
      )
      result['24h'] += value.reduce(
        (sum, value) => sum + parseFloat(value['Gas Fees 24 H']),
        0,
      )
      result['7d'] += value.reduce(
        (sum, value) => sum + parseFloat(value['Gas Fees 7 D']),
        0,
      )
      result['30d'] += value.reduce(
        (sum, value) => sum + parseFloat(value['Gas Fees 30 D']),
        0,
      )
    }
  }
  result['tokens24h'] = usePool24hGasFeeTokens(
    chainFilteredSwapsData.value,
    tokensData.value,
  )
  result['tokens7d'] = usePool7dGasFeeTokens(
    chainFilteredSwapsData.value,
    tokensData.value,
  )
  result['tokens30d'] = usePool30dGasFeeTokens(
    chainFilteredSwapsData.value,
    tokensData.value,
  )

  result['tokensAmount24h'] = usePool24hGasFeeTokensAmount(
    chainFilteredSwapsData.value,
    tokensData.value,
  )
  result['tokensAmount7d'] = usePool7dGasFeeTokensAmount(
    chainFilteredSwapsData.value,
    tokensData.value,
  )
  result['tokensAmount30d'] = usePool30dGasFeeTokensAmount(
    chainFilteredSwapsData.value,
    tokensData.value,
  )
  return result
})
const arb_init = computed(() => process.env.VUE_APP_KEY_ARBITRUM)
const bnb_init = computed(() => process.env.VUE_APP_KEY_BINANCE)
const matic_init = computed(() => process.env.VUE_APP_KEY_POLYGON)
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
  color: #009a6c;
}

.multiselect__tags {
  background: none !important;
  border-color: rgba(1, 180, 126, 1) !important;
}

.multiselect__content-wrapper {
  border-color: rgba(1, 180, 126, 1) !important;
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
  background: rgba(1, 180, 126, 0.884) !important;
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
  /* background-color: rgba(7, 14, 15, 0.7); */
  border: 1px solid rgba(163, 164, 165, 0.3);
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
