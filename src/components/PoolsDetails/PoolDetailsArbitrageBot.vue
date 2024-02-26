<template>
  <div class="arbitrage_bot_card py-3 px-4">
    <div
      class="d-flex align-items-center justify-content-between gap-2 flex-wrap"
    >
      <div class="d-flex align-items-center justify-content-between w-100">
        <!-- <img :src="darkpool_logo" /> -->
        <div
          style="
            font-size: clamp(10px, 0.9vw, 16px);
            font-weight: 700;
            font-family: Inter;
            color: white;
          "
          v-if="pool && pool.tokens"
        >
          <img
            class="pair_avatars_manage_pool pair_avatars_active"
            :data-tooltip="tokenEntity.symbol"
            v-for="(tokenEntity, tokenEntityIndex) in pool?.tokens"
            :key="`token-entity-key-${tokenEntityIndex}`"
            :src="computedTokenImage(tokenEntity.symbol)"
            :title="tokenEntity.symbol"
          />
          <!-- {{ pool && pool.tokens ? pool.tokens.map(t => t.symbol).join("/") : "" }} -->
        </div>
        <ThreeDots v-else style="margin-left: 20px" />
      </div>
    </div>

    <div class="px-2">
      <div style="margin-top: 5%; color: rgba(204, 204, 204, 1)">
        Total Value Locked
      </div>
      <div class="mb-2">
        <div
          @click="clickOnVisibleTVL()"
          class="visible_head"
          style="cursor: pointer"
        >
          <div
            class="d-flex align-items-center gap-2"
            style="
              margin-left: -20px;
              width: clamp(10px, 0.8vw, clamp(10px, 0.8vw, 14px));
            "
          >
            <div>
              <div>
                <img
                  :src="arrow_up"
                  :class="!visibleTVL ? 'toggle-down' : 'toggle-up'"
                />
              </div>
            </div>
            <div
              v-if="pool"
              style="
                font-size: clamp(10px, 0.9vw, 16px);
                font-weight: 700;
                font-family: Inter;
              "
              class="visible_head"
            >
              <CurrencySymbol :symbol="currencySelected.symbol" />{{
                numberToAposthrophe(pool.totalLiquidity, currencyDecimals)
              }}
            </div>
            <div v-else style="margin-left: 20px">
              <ThreeDots></ThreeDots>
            </div>
          </div>
        </div>
        <CCollapse :visible="visibleTVL">
          <div style="color: rgba(204, 204, 204, 1)">
            <div style="font-size: 13px; margin-top: 10px; margin-bottom: 5px">
              Assets Breakdown
            </div>
            <div
              class="d-flex flex-column gap-1"
              v-if="pool && pool.tokens && tokenPrices"
            >
              <div
                v-for="token in pool.tokens"
                :key="token.symbol"
                class="d-flex align-items-center justify-content-between"
              >
                <div>
                  {{ Number(token.balance).toFixed(2) }} {{ token.symbol }}
                  <img
                    :src="getTokenEntity(token.symbol, 'short').icon"
                    width="10"
                  />
                </div>
                <div
                  style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)"
                >
                  <CurrencySymbol :symbol="currencySelected.symbol" />{{
                    numberToAposthrophe(
                      token.balance * GetTokenPrice(token.address),
                      currencyDecimals,
                    )
                  }}
                </div>
              </div>
            </div>
            <div class="mt-2 d-flex flex-column gap-3" v-else>
              <div class="d-flex align-items-center justify-content-between">
                <div style="margin-left: 20px">
                  <ThreeDots></ThreeDots>
                </div>
                <div>
                  <ThreeDots></ThreeDots>
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <div style="margin-left: 20px">
                  <ThreeDots></ThreeDots>
                </div>
                <div>
                  <ThreeDots></ThreeDots>
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
      </div>

      <div class="mb-2">
        <div
          @click="clickOnVisibleRevenue()"
          class="visible_head"
          style="cursor: pointer"
        >
          <div
            class="d-flex align-items-center gap-2"
            style="margin-left: -20px"
          >
            <div>
              <div>
                <img
                  :src="arrow_up"
                  :width="10"
                  :class="!visibleTotalRevenue ? 'toggle-down' : 'toggle-up'"
                />
              </div>
            </div>
            <div
              style="
                font-weight: 700;
                font-family: Inter;
                color: white;
                width: 100%;
              "
            >
              <div
                class="d-flex align-items-center justify-content-between visible_head"
              >
                <div
                  style="
                    font-family: Inter;
                    font-weight: 400;
                    font-size: clamp(10px, 0.8vw, clamp(10px, 0.8vw, 14px));
                    font-size: clamp(10px, 0.9vw, 16px);
                  "
                >
                  Total Pool APR
                </div>
                <div
                  v-if="pool && historical_tvl.length > 0"
                  style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)"
                >
                  {{ poolApr['Total'].toFixed(2) }}%
                </div>
                <div v-else>
                  <ThreeDots></ThreeDots>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CCollapse :visible="visibleTotalRevenue">
          <div
            style="
              color: rgba(204, 204, 204, 1);
              margin-top: 10px;
              margin-bottom: 5px;
            "
          >
            <div class="d-flex flex-column gap-1">
              <div class="d-flex align-items-center justify-content-between">
                <div>Daily APR</div>
                <div
                  v-if="pool && historical_tvl.length > 0"
                  style="
                    color: white;
                    font-weight: 400;
                    font-size: clamp(10px, 0.8vw, 14px);
                  "
                >
                  {{ poolApr['Daily'].toFixed(2) }}%
                </div>
                <div v-else>
                  <ThreeDots></ThreeDots>
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <div>Weekly APR</div>
                <div
                  v-if="pool && historical_tvl.length > 0"
                  style="
                    color: white;
                    font-weight: 400;
                    font-size: clamp(10px, 0.8vw, 14px);
                  "
                >
                  {{ poolApr['Weekly'].toFixed(2) }}%
                </div>
                <div v-else>
                  <ThreeDots></ThreeDots>
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <div>Monthly APR</div>
                <div
                  v-if="pool && historical_tvl.length > 0"
                  style="
                    color: white;
                    font-weight: 400;
                    font-size: clamp(10px, 0.8vw, 14px);
                  "
                >
                  {{ poolApr['Monthly'].toFixed(2) }}%
                </div>
                <div v-else>
                  <ThreeDots></ThreeDots>
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
      </div>

      <div class="mb-2">
        <div
          @click="clickOnVisibleProfit()"
          style="cursor: pointer"
          class="visible_head"
        >
          <div
            class="d-flex align-items-center gap-2"
            style="margin-left: -20px"
          >
            <div>
              <div>
                <img
                  :src="arrow_up"
                  :width="10"
                  :class="!visibleTotalProfit ? 'toggle-down' : 'toggle-up'"
                />
              </div>
            </div>
            <div
              style="
                font-weight: 700;
                font-family: Inter;
                color: white;
                width: 100%;
              "
            >
              <div
                class="d-flex align-items-center justify-content-between visible_head"
              >
                <div
                  style="
                    font-family: Inter;
                    font-weight: 400;
                    font-size: clamp(10px, 0.8vw, clamp(10px, 0.8vw, 14px));
                    font-size: clamp(10px, 0.9vw, 16px);
                  "
                >
                  Pool Volume
                </div>
                <div
                  style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)"
                  v-if="swapsData.length > 0"
                >
                  <CurrencySymbol :symbol="currencySelected.symbol" />{{
                    numberToAposthrophe(
                      poolSwapStats['Volume All Time'],
                      currencyDecimals,
                    )
                  }}
                </div>
                <div v-else>
                  <ThreeDots></ThreeDots>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CCollapse
          :visible="visibleTotalProfit"
          v-if="poolSwapStats['Volume All Time']"
        >
          <div
            style="
              color: rgba(204, 204, 204, 1);
              margin-top: 10px;
              margin-bottom: 5px;
            "
          >
            <div class="d-flex flex-column gap-1">
              <SidebarHeaderDropdown
                :symbol="currencySelected.symbol"
                :currencyDecimals="currencyDecimals"
                :headerValue="
                  swapsData.length > 0 ? poolSwapStats['Volume 24 H'] : null
                "
                :headerTitle="'24H Volume'"
                :visible="dropdownChildrenVisibility['Volume 24 Hours']"
                @headerClick="
                  (v) => (dropdownChildrenVisibility['Volume 24 Hours'] = v)
                "
                @closeAllDrops="closeAllDropdowns"
              ></SidebarHeaderDropdown>
              <TokenCCollapse
                :symbol="currencySelected.symbol"
                :currencyDecimals="currencyDecimals"
                :data="volumeInfo['24h']"
                :tokensAmountData="volumeInfo['24hAmount']"
                :visible="dropdownChildrenVisibility['Volume 24 Hours']"
              >
              </TokenCCollapse>
              <SidebarHeaderDropdown
                :symbol="currencySelected.symbol"
                :currencyDecimals="currencyDecimals"
                :headerValue="
                  swapsData.length > 0 ? poolSwapStats['Volume 7 D'] : null
                "
                :headerTitle="'7 Days Volume'"
                :visible="dropdownChildrenVisibility['Volume 7 Days']"
                @headerClick="
                  (v) => (dropdownChildrenVisibility['Volume 7 Days'] = v)
                "
                @closeAllDrops="closeAllDropdowns"
              ></SidebarHeaderDropdown>
              <TokenCCollapse
                :symbol="currencySelected.symbol"
                :currencyDecimals="currencyDecimals"
                :data="volumeInfo['7d']"
                :tokensAmountData="volumeInfo['7dAmount']"
                :visible="dropdownChildrenVisibility['Volume 7 Days']"
              >
              </TokenCCollapse>
              <SidebarHeaderDropdown
                :symbol="currencySelected.symbol"
                :currencyDecimals="currencyDecimals"
                :headerValue="
                  swapsData.length > 0 ? poolSwapStats['Volume 30 D'] : null
                "
                :headerTitle="'30 Days Volume'"
                :visible="dropdownChildrenVisibility['Volume 30 Days']"
                @headerClick="
                  (v) => (dropdownChildrenVisibility['Volume 30 Days'] = v)
                "
                @closeAllDrops="closeAllDropdowns"
              ></SidebarHeaderDropdown>
              <TokenCCollapse
                :data="volumeInfo['30d']"
                :tokensAmountData="volumeInfo['30dAmount']"
                :visible="dropdownChildrenVisibility['Volume 30 Days']"
              >
              </TokenCCollapse>
            </div>
          </div>
        </CCollapse>
      </div>
      <div style="cursor: pointer" class="visible_head">
        <div class="d-flex align-items-center gap-2" style="margin-left: -10px">
          <div></div>
          <div
            style="
              font-weight: 700;
              font-family: Inter;
              color: white;
              width: 100%;
            "
          >
            <div
              class="d-flex align-items-center justify-content-between visible_head"
            >
              <div
                style="
                  font-family: Inter;
                  font-weight: 400;
                  font-size: clamp(10px, 0.8vw, clamp(10px, 0.8vw, 14px));
                  font-size: clamp(10px, 0.9vw, 16px);
                "
              >
                LP Price
              </div>
              <div
                v-if="pool"
                style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)"
              >
                <CurrencySymbol :symbol="currencySelected.symbol" />{{
                  numberToAposthrophe(pool.lpPrice, currencyDecimals || 2)
                }}
              </div>
              <div v-else>
                <ThreeDots></ThreeDots>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between w-100 gap-3 mt-4">
      <div
        class="rewards_button w-100"
        style="
          color: white;
          background: linear-gradient(85.18deg, #2775ca 0%, #2abdff 100%);
        " @click="$emit('changeToDepositView')"
      >
        Add Liquidity
      </div>
      <div style="
          color: white;" class="rewards_button w-100">Withdraw</div>
    </div>
  </div>
</template>
<script setup>
// import darkpool_logo from '@/assets/icons/darkpool_logo.svg'
import arrow_up from '@/assets/icons/arrow/arrow_up.svg'
import { ref, defineProps, defineEmits, toRefs, computed, onMounted } from 'vue'
// import { formatBigNumber } from '@/lib/utils'
import {
  getAdditionalInfoByTimeline,
  TIMELINE_MAPPING,
} from '@/lib/formatter/poolsFormatter'
import { GetAvgAprForPeriod } from '@/lib/formatter/statistics/apr/statisticsAprFormatter'
import ThreeDots from '@/components/loaders/ThreeDots'
import { CalculateTokenOrderPrice } from '@/composables/math/chartMath/trackingInfoMath'
import computedTokenImage from '@/composables/useComputedTokenImage'
import numberToAposthrophe from '@/lib/formatter/numberToAposthrophe'
import CurrencySymbol from '@/components/TrackInfo/CurrencySymbol.vue'
import {
  usePool24hVolumeTokens,
  usePool7dVolumeTokens,
  usePool30dVolumeTokens,
  usePool24hVolumeTokensAmount,
  usePool7dVolumeTokensAmount,
  usePool30dVolumeTokensAmount,
} from '@/composables/pools/usePoolSwapsStats'
import SidebarHeaderDropdown from '@/components/TrackTrades/SidebarHeaderDropdown.vue'
import TokenCCollapse from '@/components/TrackTrades/TokenCCollapse.vue'
import { getTokenEntity } from '@/lib/helpers/util'

const emit = defineEmits([
  'changeToDepositView'
])
const props = defineProps([
  'changeToDepositView',
  'tokenPrices',
  'cryptocomparePrices',
  'historical_tvl',
  'pool',
  'swapsData',
  'historical_tvl',
  'chart_data',
  'chainSelected',
  'currencySelected',
])
const {
  tokenPrices,
  pool,
  swapsData,
  historical_tvl,
  chart_data,
  chainSelected,
  cryptocomparePrices,
  currencySelected,
} = toRefs(props)

const currencyDecimals = computed(() =>
  currencySelected.value.symbol == '$' ? 0 : 5,
)

const visibleTVL = ref(true)
const visibleTotalRevenue = ref(true)
const visibleTotalProfit = ref(true)

const dropdownChildrenVisibility = ref({})

function closeAllDropdowns() {
  Object.keys(dropdownChildrenVisibility.value).forEach(
    (v) => (dropdownChildrenVisibility.value[v] = false),
  )
}

function clickOnVisibleTVL() {
  // visibleTotalRevenue.value = false
  // visibleTotalProfit.value = false
  visibleTVL.value = !visibleTVL.value
}
function clickOnVisibleRevenue() {
  // visibleTVL.value = false
  // visibleTotalProfit.value = false
  visibleTotalRevenue.value = !visibleTotalRevenue.value
}
function clickOnVisibleProfit() {
  // visibleTotalRevenue.value = false
  // visibleTVL.value = false
  visibleTotalProfit.value = !visibleTotalProfit.value
}

const poolSwapStats = computed(() =>
  getAdditionalInfoByTimeline(TIMELINE_MAPPING, swapsData.value),
)

const volumeInfo = computed(() =>
  pool.value
    ? {
        '24h': usePool24hVolumeTokens(swapsData.value, pool.value.tokens),
        '7d': usePool7dVolumeTokens(swapsData.value, pool.value.tokens),
        '30d': usePool30dVolumeTokens(swapsData.value, pool.value.tokens),
        '24hAmount': usePool24hVolumeTokensAmount(
          swapsData.value,
          pool.value.tokens,
        ),
        '7dAmount': usePool7dVolumeTokensAmount(
          swapsData.value,
          pool.value.tokens,
        ),
        '30dAmount': usePool30dVolumeTokensAmount(
          swapsData.value,
          pool.value.tokens,
        ),
      }
    : { '24h': [], '7d': [], '30d': [] },
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
const poolApr = computed(() => ({
  Daily:
    pool.value && historical_tvl.value.length > 0
      ? GetAvgAprForPeriod(
          chart_data.value,
          pool.value.tokens.map((t) => ({
            ...t,
            Blockchain: chainSelected.value,
          })),
          chainSelected.value,
          '24H',
        )
      : 0,
  Weekly:
    pool.value && historical_tvl.value.length > 0
      ? GetAvgAprForPeriod(
          chart_data.value,
          pool.value.tokens.map((t) => ({
            ...t,
            Blockchain: chainSelected.value,
          })),
          chainSelected.value,
          '7D',
        )
      : 0,
  Monthly:
    pool.value && historical_tvl.value.length > 0
      ? GetAvgAprForPeriod(
          chart_data.value,
          pool.value.tokens.map((t) => ({
            ...t,
            Blockchain: chainSelected.value,
          })),
          chainSelected.value,
          '1M',
        )
      : 0,
  Total:
    pool.value && historical_tvl.value.length > 0
      ? GetAvgAprForPeriod(
          chart_data.value,
          pool.value.tokens.map((t) => ({
            ...t,
            Blockchain: chainSelected.value,
          })),
          chainSelected.value,
          'total',
        )
      : 0,
}))

console.log(tokenPrices)
function GetTokenPrice(address) {
  let token = pool.value.tokens.find((t) => t.address == address)
  let found = cryptocomparePrices.value.find((t) => t.symbol == token.symbol)
  if (!found) return 0
  return CalculateTokenOrderPrice(found.Hourly[found.Hourly.length - 1])
  // console.log(cryptocomparePrices.value)
  // if (!tokenPrices.value || !tokenPrices.value[address]) {

  // }
  // return tokenPrices.value[address][0].priceUSD
}
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
  color: #fff;
}
.visible_head:hover {
  color: #00a3ff;
}

.multiselect__tags {
  background: none !important;
  border-color: #00c9ff !important;
}

.multiselect__content-wrapper {
  border-color: #00c9ff !important;
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
  background: #22222224;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 4px 0px #00000040;

  border-radius: 20px 0px 0px 20px;
}

@media (max-width: $xxl) {
  .arbitrage_bot_card {
    width: 30%;
    font-size: clamp(9px, 0.7vw, clamp(10px, 0.8vw, 14px));
  }
}

.pair_avatars_manage_pool {
  width: 22px;
  margin-right: -2px;
}


.rewards_button {
  background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;
color: #2ABDFF;
padding: 8px 12px;
font-family: Inter;
font-size: clamp(8px, 0.7vw, 12px);
font-weight: 600;
line-height: 24px;
  border-radius: 8px;
text-align: center;
 cursor: pointer;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
