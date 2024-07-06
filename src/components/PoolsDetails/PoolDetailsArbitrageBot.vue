<template>
  <div class="arbitrage_bot_card dark:!bg-[#22222224] bg-[white] py-3 px-4">
    <!-- <div class="d-flex align-items-center justify-content-between gap-2 flex-wrap">
      <div class="d-flex align-items-center justify-content-between w-100">
        <div v-if="pool && pool.tokens" class="flex items-center text-black dark:!text-white font-bold text-[14px]">
          <img class="pair_avatars_manage_pool pair_avatars_active" :data-tooltip="tokenEntity.symbol"
            v-for="(tokenEntity, tokenEntityIndex) in pool?.tokens" :key="`token-entity-key-${tokenEntityIndex}`"
            :src="computedTokenImage(tokenEntity.symbol)" :title="tokenEntity.symbol" />
        </div>
        <ThreeDots v-else style="margin-left: 20px" />
      </div>
    </div> -->

    <div class="px-2">
      <div class="text-black dark:!text-white mt-[5%] arbitrage_bot_header">{{ $t('TVL') }}</div>
      <div class="mb-2">
        <div @click="clickOnVisibleTVL()" class="visible_head" style="cursor: pointer">
          <div class="d-flex align-items-center gap-2" style="margin-left: -20px; width: clamp(10px, 0.8vw, 14px)">
            
                <img :src="arrow_up" :width="10" :class="!visibleTVL ? 'toggle-down' : 'toggle-up'" />
              
            <div 
              class="visible_head flex items-center text-black dark:!text-white text-[18px] font-semibold font-['Roboto_Mono',_monospace]">
              {{console.log('pool', pool)}}
              <CounterAnimation
                    :currency="''"
                    :value="pool?.[`totalLiquidity${currentCurrency == 'USD' ? '' : '_'+currentCurrency}`]"
                    :decimal-places="currencyDecimals"
                  />

            </div>
            <!-- <div v-else style="margin-left: 20px">
              <ThreeDots></ThreeDots>
            </div> -->
          </div>
        </div>
        <CCollapse :visible="visibleTVL">
          <div class="text-black dark:!text-white">
            <div class="text-[13px] mt-[10px] mb-[5px] font-['Syne',_sans-serif] font-semibold">
              {{ $t('assets_breakdown') }}
            </div>
            <div class="d-flex flex-column gap-1 text-xs" v-if="pool && pool.tokens && cryptocomparePrices">
              <div v-for="token in pool.tokens" :key="token.symbol"
                class="d-flex align-items-center justify-content-between">
                <div class="flex items-center gap-1">
                  {{ Number(token.balance).toFixed(2) }} <span class="font-['Syne',_sans-serif]"> {{token.symbol }}</span>
                  <img :src="getTokenEntity(token.symbol, 'short').icon" width="10" />
                </div>
                <div class="text-black dark:!text-white flex items-center font-normal font-['Roboto_Mono',_monospace]">
                  
                   <CounterAnimation
                    :currency="''"
                    :value=" token?.[`balance${currentCurrency == 'USD' ? 'Usd' : currentCurrency}`] ??
                      token.balance * GetTokenPrice(token.address)"
                    :decimal-places="currencyDecimals"
                  />
                </div>
              </div>
            </div>
            <!-- <div class="mt-2 d-flex flex-column gap-3" v-else>
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
            </div> -->
          </div>
        </CCollapse>
      </div>

      <div class="mb-2">
        <div @click="clickOnVisibleRevenue()" class="visible_head text-black dark:!text-white" style="cursor: pointer">
          <div class="d-flex align-items-center gap-2" style="margin-left: -20px">
            <div>
              <div>
                <img :src="arrow_up" :width="10" :class="!visibleTotalRevenue ? 'toggle-down' : 'toggle-up'" />
              </div>
            </div>
            <div class="text-black dark:!text-white font-bold w-full">
              <div
                class="d-flex align-items-center justify-content-between visible_head font-normal text-black dark:!text-white">
                <div class="text-[13px] mt-[10px] mb-[5px] font-['Syne',_sans-serif] font-semibold">Pool APR</div>
                <div  class="text-black dark:!text-white flex items-center text-[13px] font-semibold font-['Roboto_Mono',_monospace]">
             
                  <CounterAnimation
                    :currency="true"
                    :value="pool?.['TotalAPR'].toFixed(2)"
                  />%
                </div>
                <!-- <div v-else style="margin-right: 15px">
                  <ThreeDots></ThreeDots>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <CCollapse :visible="visibleTotalRevenue">
          <div class="text-black dark:!text-white mt-[10px] mb-[5px]">
            <div class="d-flex flex-column gap-1">
              <div class="d-flex align-items-center justify-content-between">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">{{ $t('daily') }} APR</div>
                <div
                  class="text-black flex items-center dark:!text-white font-normal text-[12px] font-['Roboto_Mono',_monospace]">
             
                  
                  <CounterAnimation
                    :currency="true"
                    :value="pool?.['24hAPR'].toFixed(2)"
                  />%
                </div>
                <!-- <div v-else style="margin-right: 15px">
                  <ThreeDots></ThreeDots>
                </div> -->
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">{{ $t('weekly') }} APR</div>
                <div 
                  class="text-black dark:!text-white font-normal flex items-center text-[12px] font-['Roboto_Mono',_monospace]">
                
                  <CounterAnimation
                    :currency="true"
                    :value="pool?.['7dAPR'].toFixed(2)"
                  />%
                </div>
                <!-- <div v-else style="margin-right: 15px">
                  <ThreeDots></ThreeDots>
                </div> -->
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">{{ $t('monthly') }} APR</div>
                <div 
                  class="text-black dark:!text-white flex items-center font-normal text-[12px] font-['Roboto_Mono',_monospace]">
                
                  <CounterAnimation
                    :currency="true"
                    :value="pool?.['30dAPR'].toFixed(2)"
                  />%
                </div>
                <!-- <div v-else style="margin-right: 15px">
                  <ThreeDots></ThreeDots>
                </div> -->
              </div>
            </div>
          </div>
        </CCollapse>
      </div>

      <div class="mb-2">
        <div @click="clickOnVisibleProfit()" style="cursor: pointer" class="visible_head text-black dark:!text-white">
          <div class="d-flex align-items-center gap-2" style="margin-left: -20px">
            <div>
              <div>
                <img :src="arrow_up" :width="10" :class="!visibleTotalProfit ? 'toggle-down' : 'toggle-up'" />
              </div>
            </div>
            <div class="text-black dark:!text-white font-bold w-full">
              <div
                class="d-flex align-items-center justify-content-between visible_head font-normal text-black dark:!text-white">
                <div class="text-[13px] mt-[10px] mb-[5px] font-['Syne',_sans-serif] font-semibold">
                  Pool {{ $t('volume') }}
                </div>
                <div class="text-black dark:!text-white flex items-center text-[13px] font-semibold font-['Roboto_Mono',_monospace]" v-if="pool">
                  
                   <CounterAnimation
                    :currency="''"
                    :value="pool?.[`TotalVolume${currentCurrency == 'USD' ? 'Usd' : currentCurrency}`]"
                    :decimal-places="currencyDecimals"
                  />
                </div>
                <!-- <div v-else style="margin-right: 15px">
                  <ThreeDots></ThreeDots>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <CCollapse :visible="visibleTotalProfit" v-if="poolSwapStats['Volume All Time']">
          <div class="text-black dark:!text-white mt-[10px] mb-[5px]">
            <div class="d-flex flex-column gap-1">
              <div class="d-flex align-items-center justify-content-between">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">24H {{ $t('volume') }}</div>
                <div 
                  class="text-black dark:!text-white flex items-center gap-1 font-normal text-[12px] font-['Roboto_Mono',_monospace]">
                
                  <CounterAnimation
                    :currency="''"
                    :value="pool?.[`24hVolume${currentCurrency == 'USD' ? 'Usd' : currentCurrency
                    }`]"
                    :decimal-places="currencyDecimals"
                  />
                </div>
                <!-- <div v-else>
                  <ThreeDots></ThreeDots>
                </div> -->
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">7 {{ $t('days') }} {{ $t('volume') }}</div>
                <div 
                  class="text-black dark:!text-white font-normal flex items-center gap-1 text-[12px] font-['Roboto_Mono',_monospace]">
                
                  <CounterAnimation
                    :currency="''"
                    :value="pool?.[`7dVolume${currentCurrency == 'USD' ? 'Usd' : currentCurrency
                    }`]"
                    :decimal-places="currencyDecimals"
                  />
                </div>
                <!-- <div v-else>
                  <ThreeDots></ThreeDots>
                </div> -->
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">30 {{ $t('days') }} {{ $t('volume') }}</div>
                <div
                  class="text-black dark:!text-white font-normal flex items-center gap-1 text-[12px] font-['Roboto_Mono',_monospace]">
               
                  <CounterAnimation
                    :currency="''"
                    :value="pool?.[`30dVolume${currentCurrency == 'USD' ? 'Usd' : currentCurrency
                    }`]"
                    :decimal-places="currencyDecimals"
                  />
                </div>
                <!-- <div v-else>
                  <ThreeDots></ThreeDots>
                </div> -->
              </div>
            </div>
          </div>
        </CCollapse>
      </div>

    </div>

    <div class="d-flex justify-content-between w-100 gap-3 mt-4">
      <div class="rewards_button w-100" @click="$emit('changeToDepositView', pool.id)">
        {{ $t('add_liquidity') }}
      </div>
      <div class="rewards_button border-white text-white w-100" @click="$emit('changeToWithdrawView', pool.id)">
        {{ $t('withdraw') }}
      </div>
    </div>
  </div>
</template>
<script setup>
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
import { getTokenEntity } from '@/lib/helpers/util'
import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'
import CounterAnimation from '@/UI/CounterAnimation.vue'


const settingsStore = useSettings()

const { currentCurrency } = storeToRefs(settingsStore)

const emit = defineEmits(['changeToDepositView', 'changeToWithdrawView'])
const props = defineProps([
  'tokenPrices',
  'cryptocomparePrices',
  'historical_tvl',
  'pool',
  'swapsData',
  'historical_tvl',
  'chart_data',
  'chainSelected',
  'currencySelected',
  'userBalance',
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
  userBalance,
} = toRefs(props)

const currencyDecimals = computed(() =>
  currentCurrency.value == 'USD' ? 0 : 5,
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

function GetTokenPrice(address) {
  let token = pool.value.tokens.find((t) => t.address == address)
  let found = cryptocomparePrices.value.find((t) => t.symbol == token.symbol)
  console.log('FOUND - ', address, found)
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
  // color: #fff;
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





.arbitrage_bot_card {
  width: 30%;
  backdrop-filter: blur(10px);
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
  .track_chart_card {
    border-radius: 0px 0px 20px 20px  !important;
  }
  .arbitrage_bot_card {
    width: 100%;
    font-size: 12px;
    border-width: 1px 1px 0px 1px;
    border-radius: 20px 20px 0px 0px;
    padding: 20px 20px 10px 20px;
  }
}
.pair_avatars_manage_pool {
  width: 22px;
  margin-right: -2px;
}

.rewards_button {
  padding: 8px;
  font-size: clamp(10px, 0.7vw, 12px);
  font-weight: 600;
  line-height: 24px;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  color: #00E0FF;
  background: #02031C;
  border: 1px solid #00E0FF;

  // box-shadow: 0px 4px 8.9px 0px #2775CA33;
  &:hover {
    background: #00e1ff4d;
  }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
