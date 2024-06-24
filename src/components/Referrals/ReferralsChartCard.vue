<template>
  <div class="arbitrage_bot_card bg-[white] dark:!bg-[#22222224] py-3 px-4">
    <div class="dark:!text-white text-black d-flex align-items-center justify-content-between gap-2 flex-wrap">
      <div class="d-flex align-items-center">
        <!-- <img :src="darkpool_logo" /> -->
        <div class="arbitrage_bot_header dark:!text-white text-black">
          {{ $t('Referral Performance') }}
        </div>
      </div>
    </div>

    <div class="px-2">
      <div class="mb-xxl-4 mb-2">
        <div @click="visibleTVL = !visibleTVL" class="visible_head" style="cursor: pointer">
          <div class="d-flex align-items-center gap-2" style="margin-left: -20px; width: 15px">

            <img :src="arrow_up" :width="10" :class="!visibleTVL ? 'toggle-down' : 'toggle-up'" />

            <!-- <div v-if="!networks_data" class="totals_loader_header">
              <ThreeDots />
            </div> -->
            <div v-if="networks_data"
              class="visible_head mt-[10px]  dark:!text-white text-black font-semibold text-[18px] font-['Roboto_Mono',_monospace]">
              <!-- {{ parseFloat(networks_data.portfolioBalance).toFixed(3) }} -->
              <CounterAnimation :currency="''" :decimalPlaces="currencyDecimals"
                :value="parseFloat(networks_data[`portfolioBalance${postfix}`]).toFixed(3)" />
            </div>
          </div>
        </div>
        <CCollapse :visible="visibleTVL">
          <div>
            <div class="arbitrage_bot_sections_text dark:!text-white text-black ">
              {{ $t('Referrals Usage Breakdown') }}
            </div>
            <div class="d-flex flex-column gap-1" v-if="networks_data">
              <div class="dark:!text-white text-black d-flex align-items-center justify-content-between"
                v-for="pool in networks_data.breakdown" :key="pool.id">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif] flex items-center gap-1">{{ pool.id }}
                  <div class="flex items-center gap-1"><img :src="computedTokenImage(token)" class="w-3 h-3"
                      :key="`token-${i}`" v-for="token, i in pool.id.split('-')" /></div>
                </div>
                <div
                  class="dark:!text-white text-black font-extrabold text-[12px] flex items-center font-['Roboto_Mono',_monospace]">
                  <CounterAnimation :currency="''" :decimalPlaces="currencyDecimals"
                    :value="parseFloat(pool[`shareBalance${postfix_raw}`]).toFixed(currencyDecimals)" />

                </div>
              </div>
            </div>
          </div>
        </CCollapse>
      </div>

      <div class="mb-xxl-4 mb-2">
        <div @click="visibleTotalGas = !visibleTotalGas" style="cursor: pointer">
          <div class="d-flex align-items-center gap-2" style="margin-left: -20px">
            <div>
              <div>
                <img :src="arrow_up" :width="10" :class="!visibleTotalGas ? 'toggle-down' : 'toggle-up'" />
              </div>
            </div>
            <div style="
                font-weight: 700;
                
                color: white;
                width: 100%;
              ">
              <div class="d-flex align-items-baseline justify-content-between visible_head">
                <div style=" font-weight: 400" class="arbitrage_bot_sections_text dark:!text-white text-black ">
                  Referred Wallets
                </div>
                <!-- <div v-if="!networks_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div
                  class="dark:!text-white text-black font-extrabold text-[12px] flex items-center font-['Roboto_Mono',_monospace]">
                  <CounterAnimation :currency="true" :value="parseFloat(networks_data?.APR).toFixed(3)" />
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
              <div class="dark:!text-white text-black d-flex align-items-center justify-content-between">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">Wallets for 24 {{ $t('hours') }}</div>
                <!-- <div v-if="!networks_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div
                  class="dark:!text-white text-black flex items-center font-normal text-[12px] font-['Roboto_Mono',_monospace]">
                  <CounterAnimation :currency="true" :value="parseFloat(networks_data?.['APR 24H']).toFixed(3)" />
                </div>
              </div>
              <div class="dark:!text-white text-black d-flex align-items-center justify-content-between">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">Wallets for 7 {{ $t('days') }}</div>
                <!-- <div v-if="!networks_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div
                  class="dark:!text-white text-black flex items-center font-normal text-[12px] font-['Roboto_Mono',_monospace]">
                  <CounterAnimation :currency="true" :value="parseFloat(networks_data?.['APR 7D']).toFixed(3)" />
                </div>
              </div>
              <div class="dark:!text-white text-black d-flex align-items-center justify-content-between">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">Wallets for 30 {{ $t('days') }}</div>
                <!-- <div v-if="!networks_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div
                  class="dark:!text-white text-black flex items-center font-normal text-[12px] font-['Roboto_Mono',_monospace]">
                  <CounterAnimation :currency="true" :value="parseFloat(networks_data?.['APR 30D']).toFixed(3)" />
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
      </div>

      <div class="mb-xxl-4 mb-2">
        <div @click="visibleTotalProfit = !visibleTotalProfit" style="cursor: pointer" class="visible_head">
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
                <div style=" font-weight: 400" class="arbitrage_bot_sections_text dark:!text-white text-black">
                  {{ $t('Profits Earned') }}
                </div>
                <!-- <div v-if="!networks_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div class="dark:!text-white text-black font-extrabold text-[12px] font-['Roboto_Mono',_monospace]">
                  <CounterAnimation :currency="''" :decimalPlaces="currencyDecimals"
                    :value="parseFloat(networks_data?.[`Profit${postfix}`]).toFixed(currencyDecimals)" />
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
              <div class="dark:!text-white text-black d-flex align-items-center justify-content-between">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">{{ $t('profit') }} 24 {{ $t('hours') }}</div>
                <!-- <div v-if="!networks_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div class="dark:!text-white text-black font-normal text-[12px] font-['Roboto_Mono',_monospace]">
                  <CounterAnimation :currency="''" :decimalPlaces="currencyDecimals"
                    :value="parseFloat(networks_data?.[`Profit 24H${postfix}`]).toFixed(currencyDecimals)" />
                </div>
              </div>
              <div class="dark:!text-white text-black d-flex align-items-center justify-content-between">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">{{ $t('profit') }} 7 {{ $t('days') }}</div>
                <!-- <div v-if="!networks_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div class="dark:!text-white text-black font-normal text-[12px] font-['Roboto_Mono',_monospace]">
                  <CounterAnimation :currency="''" :decimalPlaces="currencyDecimals"
                    :value="parseFloat(networks_data?.[`Profit 7D${postfix}`]).toFixed(currencyDecimals)" />
                </div>
              </div>
              <div class="dark:!text-white text-black d-flex align-items-center justify-content-between">
                <div class="text-[13px] font-normal font-['Syne',_sans-serif]">{{ $t('profit') }} 30 {{ $t('days') }}</div>
                <!-- <div v-if="!networks_data" class="totals_loader">
                  <ThreeDots />
                </div> -->
                <div class="dark:!text-white text-black font-normal text-[12px] font-['Roboto_Mono',_monospace]">
                  <CounterAnimation :currency="''" :decimalPlaces="currencyDecimals"
                    :value="parseFloat(networks_data?.[`Profit 30D${postfix}`]).toFixed(currencyDecimals)" />
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
      </div>
      <div style="cursor: pointer" class="visible_head">
        <div class="d-flex align-items-center gap-2" style="margin-left: -10px">
          <div></div>
          <div style="
              font-weight: 700;
              
              color: white;
              width: 100%;
            ">
            <div
              class="dark:!text-white text-black d-flex align-items-center justify-content-between visible_head mt-3">
              <div
                class="dark:!text-white text-black text-[13px] mt-[10px] mb-[5px] font-['Syne',_sans-serif] font-semibold">
                Claimable Rewards
              </div>
              <div class="dark:!text-white text-black font-extrabold text-[12px]">
                <CounterAnimation :currency="false" :value="10" :decimalPlaces="currencyDecimals" />

              </div>
              <!-- <div v-else style="margin-right: 15px">
                <ThreeDots></ThreeDots>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="referrals_button" @click="() => claimRewards(rewardsData)">{{ $t('claim_rewards') }}</div>
    </div>
  </div>
</template>
<script setup>
import arrow_up from '@/assets/icons/arrow/arrow_up.svg'
import { ref, defineProps, toRefs, computed } from 'vue'
import { claimRewards } from "@/composables/portfolio/useRewards"
import ThreeDots from '@/components/loaders/ThreeDots.vue'
import { formatBigNumber } from '@/lib/utils'
import { Network, DisplayNetwork } from '@/composables/useNetwork'
import computedTokenImage from '@/composables/useComputedTokenImage'
import CounterAnimation from '@/UI/CounterAnimation.vue'
import {
  usePool24hProfit,
  usePool7dProfit,
  usePool30dProfit,
  usePoolAllTimeProfit,
  usePool24hRevenue,
  usePool7dRevenue,
  usePool30dRevenue,
  usePoolAllTimeRevenue,
  usePool24hGasFee,
  usePool7dGasFee,
  usePool30dGasFee,
  usePoolAllTimeGasFee,
  isRightChainName,
} from '@/composables/pools/usePoolSwapsStats'
import CurrencySymbol from '../TrackInfo/CurrencySymbol.vue';
import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'

const settingsStore = useSettings()

const { currentCurrency } = storeToRefs(settingsStore)

const postfix = computed(() => currentCurrency.value == "USD" ? "" : `_${currentCurrency.value}`)
const postfix_raw = computed(() => currentCurrency.value == "USD" ? "Usd" : `${currentCurrency.value}`)
const currencyDecimals = computed(() =>
  currentCurrency.value == 'USD' ? 2 : 5,
)
const props = defineProps(['networks_data'])
const { networks_data, rewardsData } = toRefs(props)
const totalRewards = computed(() => rewardsData.value.reduce((sum, value) => sum + value[`reward${postfix_raw.value}`], 0).toFixed(currencyDecimals.value))
const isNetworkDataReady = computed(
  () =>
    networks_data.value.length && networks_data.value.length > 0 &&
    networks_data.value.filter((item) => item[0] != null && item[0].sharesOwned)
      .length > 0,
)


const visibleTVL = ref(true)
const visibleTotalRevenue = ref(true)
const visibleTotalProfit = ref(true)
const visibleTotalGas = ref(true)
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

.referrals_button {
  width: 100%;
  cursor: pointer;
  margin-top: 25px !important;
  margin-bottom: 5px;
  border-radius: 16px;

  font-size: 15px;
  font-weight: 600;
  line-height: 24px;
  color: #02031C;
  text-align: center;
  padding: 6px;
  background: #00E0FF;

  &:hover {
    filter: drop-shadow(0 0 0.7rem #00E0FF);
  }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
