<template>
  <div class="arbitrage_bot_card bg-white dark:!bg-[#22222224] py-3 px-4">
    <div class="d-flex align-items-center justify-content-between text-black dark:!text-white gap-2 flex-wrap">
      <div class="d-flex align-items-center justify-content-between text-black dark:!text-white w-100"></div>
    </div>

    <div class="px-2">
      <div class="arbitrage_bot_header mt-[5%] text-black dark:!text-white">
        {{ $t('TVL') }}
      </div>
      <div class="mb-xxl-4 mb-2">
        <div @click="clickOnVisibleTVL()" class="visible_head" style="cursor: pointer">
          <div class="d-flex align-items-center gap-2">
            <!-- <div v-if="!chains_data" class="totals_loader_header">
              <ThreeDots />
            </div> -->
            <div class="visible_head text-black dark:!text-white">
              <div class="d-flex align-items-center font-semibold text-[18px] font-['Roboto_Mono',_monospace]">
                <CounterAnimation :decimalPlaces="currencyDecimals"
                  :value="chains_data ? chains_data?.[`tvl${postfix}`] : 0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-xxl-4 mb-2">
        <div @click="clickOnVisibleRevenue()" class="visible_head" style="cursor: pointer">
          <div class="d-flex align-items-center gap-2" style="margin-left: -20px">
            <img :src="arrow_up" :width="10" :class="!visibleTotalRevenue ? 'toggle-down' : 'toggle-up'" />

            <div style="
                font-weight: 700;

                width: 100%;
              ">
              <div class="d-flex align-items-baseline justify-content-between visible_head">
                <div style="font-weight: 400" class="arbitrage_bot_sections_text text-black dark:!text-white">
                  {{ $t('total_volume') }}
                </div>
                <!-- <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div
                  class="text-black flex items-center dark:!text-white font-extrabold text-[12px] font-['Roboto_Mono',_monospace]">
                  <CounterAnimation :decimalPlaces="currencyDecimals"
                    :value="chains_data ? chains_data?.[`totalVolume${postfix}`] : 0" />
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
              <div class="d-flex align-items-center justify-content-between text-black dark:!text-white">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">
                  {{ $t('volume') }} 24 {{ $t('hours') }}
                </div>
                <!-- <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div class="text-black dark:!text-white font-normal text-[12px] font-['Roboto_Mono',_monospace]">

                  <CounterAnimation :decimalPlaces="currencyDecimals"
                    :value="chains_data ? chains_data?.[`volume24H${postfix}`] : 0" />
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between text-black dark:!text-white">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">
                  {{ $t('volume') }} 7 {{ $t('days') }}
                </div>
                <!-- <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div class="text-black dark:!text-white font-normal text-[12px] font-['Roboto_Mono',_monospace]">
                  <CounterAnimation :decimalPlaces="currencyDecimals"
                    :value="chains_data ? chains_data?.[`volume7D${postfix}`] : 0" />
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between text-black dark:!text-white">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">
                  {{ $t('volume') }} 30 {{ $t('days') }}
                </div>
                <!-- <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div class="text-black dark:!text-white font-normal text-[12px] font-['Roboto_Mono',_monospace]">
                  <CounterAnimation :decimalPlaces="currencyDecimals"
                    :value="chains_data ? chains_data?.[`volume30D${postfix}`] : 0" />
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
      </div>

      <div class="mb-xxl-4 mb-2">
        <div @click="clickOnVisibleProfit()" class="visible_head" style="cursor: pointer">
          <div class="d-flex align-items-center gap-2" style="margin-left: -20px">
            <div>
              <div>
                <img :src="arrow_up" :width="10" :class="!visibleTotalProfit ? 'toggle-down' : 'toggle-up'" />
              </div>
            </div>
            <div style="
                font-weight: 700;
                color: white;
                width: 100%;
              ">
              <div class="d-flex align-items-baseline justify-content-between visible_head">
                <div style="font-weight: 400" class="arbitrage_bot_sections_text text-black dark:!text-white">
                  {{ $t('total_profits') }}
                </div>
                <!-- <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div class="text-black dark:!text-white font-extrabold text-[12px] font-['Roboto_Mono',_monospace]">
                  <CounterAnimation :decimalPlaces="currencyDecimals"
                    :value="chains_data ? chains_data?.[`totalProfits${postfix}`] : 0" />

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
              <div class="d-flex align-items-center justify-content-between text-black dark:!text-white">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">
                  {{ $t('profit') }} 24 {{ $t('hours') }}
                </div>
                <!-- <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div class="text-black dark:!text-white font-normal text-[12px] font-['Roboto_Mono',_monospace]">

                  <CounterAnimation :decimalPlaces="currencyDecimals"
                    :value="chains_data ? chains_data?.[`profit24H${postfix}`] : 0" />
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between text-black dark:!text-white">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">
                  {{ $t('profit') }} 7 Days
                </div>
                <!-- <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div class="text-black dark:!text-white font-normal text-[12px] font-['Roboto_Mono',_monospace]">

                  <CounterAnimation :decimalPlaces="currencyDecimals"
                    :value="chains_data ? chains_data?.[`profit7D${postfix}`] : 0" />
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between text-black dark:!text-white">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">
                  {{ $t('profit') }} 30 Days
                </div>
                <!-- <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div class="text-black dark:!text-white font-normal text-[12px] font-['Roboto_Mono',_monospace]">

                  <CounterAnimation :decimalPlaces="currencyDecimals"
                    :value="chains_data ? chains_data?.[`profit30D${postfix}`] : 0" />
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
      </div>

      <div class="mb-xxl-4 mb-2">
        <div @click="clickOnVisibleTotalTrades()" class="visible_head" style="cursor: pointer">
          <div class="d-flex align-items-center gap-2" style="margin-left: -20px">
            <div>
              <div>
                <img :src="arrow_up" :width="10" :class="!visibleTotalTrades ? 'toggle-down' : 'toggle-up'" />
              </div>
            </div>
            <div style="
                font-weight: 700;

                width: 100%;
              ">
              <div class="d-flex align-items-baseline justify-content-between visible_head">
                <div style="font-weight: 400" class="arbitrage_bot_sections_text text-black dark:!text-white">
                  {{ $t('total_trades') }}
                </div>
                <!-- <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div class="text-black dark:!text-white font-extrabold text-[12px] font-['Roboto_Mono',_monospace]">

                  <CounterAnimation :currency="true" :value="chains_data?.totalTrades" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <CCollapse :visible="visibleTotalTrades">
          <div style="
              color: rgba(204, 204, 204, 1);
              margin-top: 10px;
              margin-bottom: 5px;
            ">
            <div class="d-flex flex-column gap-1">
              <div class="d-flex align-items-center justify-content-between text-black dark:!text-white">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">
                  {{ $t('trades') }} 24 {{ $t('hours') }}
                </div>
                <!-- <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div class="text-black dark:!text-white font-normal text-[12px] font-['Roboto_Mono',_monospace]">

                  <CounterAnimation :currency="true" :value="chains_data?.trades24H" />
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between text-black dark:!text-white">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">
                  {{ $t('trades') }} 7 {{ $t('days') }}
                </div>
                <!-- <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div class="text-black dark:!text-white font-normal text-[12px] font-['Roboto_Mono',_monospace]">

                  <CounterAnimation :currency="true" :value="chains_data?.trades7D" />
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between text-black dark:!text-white">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">
                  {{ $t('trades') }} 30 {{ $t('days') }}
                </div>
                <!-- <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div class="text-black dark:!text-white font-normal text-[12px] font-['Roboto_Mono',_monospace]">

                  <CounterAnimation :currency="true" :value="chains_data?.trades30D" />
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
      </div>

      <div class="mb-xxl-4 mb-2">
        <div @click="clickOnVisibleGas()" class="visible_head" style="cursor: pointer">
          <div class="d-flex align-items-center gap-2" style="margin-left: -20px">
            <div>
              <div>
                <img :src="arrow_up" :width="10" :class="!visibleTotalGas ? 'toggle-down' : 'toggle-up'" />
              </div>
            </div>
            <div style="
                font-weight: 700;

                width: 100%;
              ">
              <div class="d-flex align-items-baseline justify-content-between visible_head">
                <div style="font-weight: 400" class="arbitrage_bot_sections_text text-black dark:!text-white">
                  {{ $t('average') }} APR
                </div>
                <!-- <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div
                  class="text-black dark:!text-white font-extrabold flex items-center text-[12px] font-['Roboto_Mono',_monospace]">

                  <CounterAnimation :currency="true" :value="avgAPR" :decimalPlaces="2" />%
                </div>
              </div>
            </div>
          </div>
        </div>
        <CCollapse :visible="visibleTotalGas">
          <div style="
              color: rgba(204, 204, 204, 1);
              margin-top: 10px;
              margin-bottom: 5px;
            ">
            <div class="d-flex flex-column gap-1">
              <div class="d-flex align-items-center justify-content-between text-black dark:!text-white">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">
                  APR 24 {{ $t('hours') }}
                </div>
                <!-- <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div
                  class="text-black dark:!text-white flex items-center font-normal text-[12px] font-['Roboto_Mono',_monospace]">

                  <CounterAnimation :currency="true" :value="chains_data?.APR24H.toFixed(2)" />%
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between text-black dark:!text-white">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">
                  APR 7 {{ $t('days') }}
                </div>
                <!-- <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div
                  class="text-black dark:!text-white flex items-center font-normal text-[12px] font-['Roboto_Mono',_monospace]">

                  <CounterAnimation :currency="true" :value="chains_data?.APR7D" />%
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between text-black dark:!text-white">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">
                  APR 30 {{ $t('days') }}
                </div>
                <!-- <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div
                  class="text-black dark:!text-white flex items-center font-normal text-[12px] font-['Roboto_Mono',_monospace]">

                  <CounterAnimation :currency="true" :value="chains_data?.APR30D" />%
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
      </div>

      <div style="cursor: pointer" class="visible_head">
        <div class="d-flex align-items-center gap-2" style="margin-left: -10px">
          <div></div>
          <div style="width: 100%">
            <div
              class="d-flex align-items-center justify-content-between text-black dark:!text-white visible_head mt-3">
              <div class="text-[13px] mt-[10px] mb-[5px] font-['Syne',_sans-serif] font-semibold">
                {{
                router.currentRoute.value.path === '/user_analytics'
                ? 'Number of Users'
                : t('number_of_index_pools')
                }}
              </div>
              <div class="text-black dark:!text-white font-extrabold text-[12px] font-['Roboto_Mono',_monospace]">
                {{ chains_data ? chains_data?.poolsNumber : 0 }}
              </div>
              <!-- <div v-else>
                <ThreeDots></ThreeDots>
              </div> -->
              {{console.log(chartData)}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import arrow_up from '@/assets/icons/arrow/arrow_up.svg'
import { ref, defineProps, toRefs, computed, onMounted } from 'vue'
import ThreeDots from '@/components/loaders/ThreeDots.vue'
import numberToAposthrophe from '@/lib/formatter/numberToAposthrophe'
import router from '@/router'
import { formatBigNumber, calculateAverage } from '@/lib/utils/index'
import CurrencySymbol from '../TrackInfo/CurrencySymbol.vue'
import { t } from 'i18next'
import CounterAnimation from '@/UI/CounterAnimation.vue'

import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'


const settingsStore = useSettings();

const { currentCurrency } = storeToRefs(settingsStore)
const currencyDecimals = computed(() =>
  currentCurrency.value == 'USD' ? 2 : 5,
)
const postfix = computed(() => currentCurrency.value == "USD" ? "" : `_${currentCurrency.value}`)
const props = defineProps(['chains_data', 'currencySelected', 'chainSelected', 'chartData'])

const { chainSelected, currencySelected, chartData, chains_data } = toRefs(props)
const visibleTVL = ref(true)
const visibleTotalRevenue = ref(true)
const visibleTotalProfit = ref(true)
const visibleTotalGas = ref(true)
const visibleTotalTrades = ref(true)

const dropdownChildrenVisibility = ref({})

const avgAPR = computed(() => chartData.value.length > 0 ? (chains_data.value[`totalProfits${postfix.value}`] / calculateAverage(chartData.value.map((item) => item[`TVL${postfix.value}`]['All Chains']))) * 100 : 0)



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
function clickOnVisibleTotalTrades() {
  // visibleTotalRevenue.value = false
  // visibleTotalProfit.value = false
  // visibleTVL.value = false
  visibleTotalTrades.value = !visibleTotalTrades.value
}

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

  .track_chart_card {
    border-radius: 0px 0px 20px 20px !important;
  }

  .arbitrage_bot_card {
    width: 100%;
    font-size: 12px;
    border-width: 1px 1px 0px 1px;
    border-radius: 20px 20px 0px 0px;
    padding: 20px 20px 10px 20px;
  }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
