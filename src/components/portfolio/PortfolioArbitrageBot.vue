<template>
  <div class="arbitrage_bot_card py-3 px-4">
    <div class="d-flex align-items-center justify-content-between gap-2 flex-wrap">
      <div class="d-flex align-items-center">
        <!-- <img :src="darkpool_logo" /> -->
        <div class="arbitrage_bot_header">
          My Portfolio
        </div>
      </div>

    </div>

    <div class="px-2">
      <div class="arbitrage_bot_sections_text" style="margin-top: 5%; color: rgba(204, 204, 204, 1)">
        Total Value Locked
      </div>
      <div class="mb-xxl-4 mb-2">
        <div @click="visibleTVL = !visibleTVL" class="visible_head" style="cursor: pointer">
          <div class="d-flex align-items-center gap-2" style="margin-left: -20px; width: 15px">
            <div>
              <div>
                <img :src="arrow_up" :class="!visibleTVL ? 'toggle-down' : 'toggle-up'" />
              </div>
            </div>
            <div v-if="!chains_data" class="totals_loader_header">
              <ThreeDots />
            </div>
            <div v-else style="font-weight: 700; font-family: Inter" class="visible_head arbitrage_bot_sections_text">
              ${{ formatBigNumber(tvl_data['TVL']) }}
            </div>
          </div>
        </div>
        <CCollapse :visible="visibleTVL">
          <div style="color: rgba(204, 204, 204, 1)">
            <div class="arbitrage_bot_sections_text" style="margin-top: 10px; margin-bottom: 5px">
              Chain Breakdown
            </div>
            <div class="d-flex flex-column gap-1">
              <div class="d-flex align-items-center justify-content-between"
                v-if="chainSelected.toLowerCase() == 'all chains' || chainSelected == 'Arbitrum'">
                <div>Arbitrum</div>
                <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)">
                  ${{ formatBigNumber(tvl_data['TVL Arbitrum']) }}
                </div>
              </div>
              <div v-if="chainSelected.toLowerCase() == 'all chains' || chainSelected == 'Binance'"
                class="d-flex align-items-center justify-content-between">
                <div>Binance</div>
                <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)">
                  ${{ formatBigNumber(tvl_data['TVL Binance']) }}
                </div>
              </div>
              <div v-if="chainSelected.toLowerCase() == 'all chains' || chainSelected == 'Polygon'"
                class="d-flex align-items-center justify-content-between">
                <div>Polygon</div>
                <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)">
                  ${{ formatBigNumber(tvl_data['TVL Polygon']) }}
                </div>
              </div>
            </div>
          </div>
        </CCollapse>
      </div>

      <div class="mb-xxl-4 mb-2">
        <div @click="visibleTotalRevenue = !visibleTotalRevenue" class="visible_head" style="cursor: pointer">
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
                <div style="font-family: Inter; font-weight: 400;" class="arbitrage_bot_sections_text">
                  Total Revenue
                </div>
                <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)">
                  ${{ formatBigNumber(chains_data['Sum']['Revenue']) }}
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
              <div class="d-flex align-items-center justify-content-between">
                <div>Revenue 24 Hours</div>
                <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 400; ">
                  ${{ formatBigNumber(chains_data['Sum']['Revenue 24H']) }}
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <div>Revenue 7 Days</div>
                <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 400; ">
                  ${{ formatBigNumber(chains_data['Sum']['Revenue 7D']) }}
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <div>Revenue 30 Days</div>
                <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 400; ">
                  ${{ formatBigNumber(chains_data['Sum']['Revenue 30D']) }}
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
                font-family: Inter;
                color: white;
                width: 100%;
              ">
              <div class="d-flex align-items-baseline justify-content-between visible_head">
                <div style="font-family: Inter; font-weight: 400;" class="arbitrage_bot_sections_text">
                  Total Gas Fees Spent
                </div>
                <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)">
                  ${{ formatBigNumber(chains_data['Sum']['Gas Fee']) }}
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
              <div class="d-flex align-items-center justify-content-between">
                <div>Gas Fees 24 Hours</div>
                <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 400; ">
                  ${{ formatBigNumber(chains_data['Sum']['Gas Fee 24H']) }}
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <div>Gas Fees 7 Days</div>
                <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 400; ">
                  ${{ formatBigNumber(chains_data['Sum']['Gas Fee 7D']) }}
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <div>Gas Fees 30 Days</div>
                <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 400; ">
                  ${{ formatBigNumber(chains_data['Sum']['Gas Fee 30D']) }}
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
                font-family: Inter;
                color: white;
                width: 100%;
              ">
              <div class="d-flex align-items-baseline justify-content-between visible_head">
                <div style="font-family: Inter; font-weight: 400;" class="arbitrage_bot_sections_text">
                  Total Profits
                </div>
                <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)">
                  ${{ formatBigNumber(chains_data['Sum']['Profit']) }}
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
              <div class="d-flex align-items-center justify-content-between">
                <div>Profits 24 Hours</div>
                <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 400; ">
                  ${{ formatBigNumber(chains_data['Sum']['Profit 24H']) }}
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <div>Profits 7 Days</div>
                <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 400; ">
                  ${{ formatBigNumber(chains_data['Sum']['Profit 7D']) }}
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <div>Profits 30 Days</div>
                <div v-if="!chains_data" class="totals_loader">
                  <ThreeDots />
                </div>
                <div v-else style="color: white; font-weight: 400; ">
                  ${{ formatBigNumber(chains_data['Sum']['Profit 30D']) }}
                </div>
              </div>
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
import { ref, defineProps, toRefs, computed } from 'vue'
import ThreeDots from '@/components/loaders/ThreeDots.vue'
import { formatBigNumber } from '@/lib/utils'
import { Network, DisplayNetwork } from "@/composables/useNetwork"
import {
  usePool24hProfit, usePool7dProfit, usePool30dProfit, usePoolAllTimeProfit,
  usePool24hRevenue, usePool7dRevenue, usePool30dRevenue, usePoolAllTimeRevenue,
  usePool24hGasFee, usePool7dGasFee, usePool30dGasFee, usePoolAllTimeGasFee, isRightChainName
} from '@/composables/pools/usePoolSwapsStats'
const props = defineProps(['networks_data', 'chainSelected'])
const { networks_data, chainSelected } = toRefs(props)

const isNetworkDataReady = computed(() => networks_data.value.length > 0 && networks_data.value.filter(item => item[0] != null && item[0].sharesOwned).length > 0)

// const selected_chain_data = computed(() => {
//   let networks = [Network.ARBITRUM, Network.BINANCE, Network.POLYGON]
//   let result = []
//   for (let i = 0; i < networks_data.value.length; i++) {
//     let network = networks[i]
//     let chain_name = DisplayNetwork[network]
//     if (isRightChainName(chain_name, chainSelected.value)) {
//       result.push()
//     }
//   }
//   return []
// })
const chains_data = computed(() => {
  if (!isNetworkDataReady.value)
    return null
  let result = {}
  const networks = [process.env.VUE_APP_KEY_ARBITRUM ? Network.ARBITRUM : undefined, process.env.VUE_APP_KEY_BINANCE ? Network.BINANCE : undefined, process.env.VUE_APP_KEY_POLYGON ? Network.POLYGON : undefined].filter((n) => n != undefined)

  let sum = {
    "TVL": 0, "Profit": 0, "Profit 24H": 0, "Profit 7D": 0, "Profit 30D": 0,
    "Revenue": 0, "Revenue 24H": 0, "Revenue 7D": 0, "Revenue 30D": 0,
    "Gas Fee": 0, "Gas Fee 24H": 0, "Gas Fee 7D": 0, "Gas Fee 30D": 0
  }
  for (let i = 0; i < networks.length; i++) {
    let network = networks[i]
    let chain_name = DisplayNetwork[network]
    if (!networks_data.value[i][0])
      continue
    let tvl = networks_data.value[i][0].sharesOwned.reduce((sum, p) => sum + parseFloat(p.poolId.totalLiquidity), 0)

    result[chain_name] = {
      'TVL': tvl,
    }
    if (isRightChainName(chain_name, chainSelected.value)) {
      sum['TVL'] += tvl
      let swaps_data = networks_data.value[i][1]
      sum['Profit'] += parseFloat(usePoolAllTimeProfit(swaps_data).value)
      sum['Profit 24H'] += parseFloat(usePool24hProfit(swaps_data).value)
      sum['Profit 7D'] += parseFloat(usePool7dProfit(swaps_data).value)
      sum['Profit 30D'] += parseFloat(usePool30dProfit(swaps_data).value)

      sum['Revenue'] += parseFloat(usePoolAllTimeRevenue(swaps_data).value)
      sum['Revenue 24H'] += parseFloat(usePool24hRevenue(swaps_data).value)
      sum['Revenue 7D'] += parseFloat(usePool7dRevenue(swaps_data).value)
      sum['Revenue 30D'] += parseFloat(usePool30dRevenue(swaps_data).value)

      sum['Gas Fee'] += parseFloat(usePoolAllTimeGasFee(swaps_data).value)
      sum['Gas Fee 24H'] += parseFloat(usePool24hGasFee(swaps_data).value)
      sum['Gas Fee 7D'] += parseFloat(usePool7dGasFee(swaps_data).value)
      sum['Gas Fee 30D'] += parseFloat(usePool30dGasFee(swaps_data).value)
    }
  }
  result['Sum'] = sum
  return result
})

const tvl_data = computed(() => ({
  "TVL": chains_data.value ? chains_data.value['Sum']['TVL'] : 0,
  "TVL Arbitrum": chains_data.value && chains_data.value['Arbitrum'] ? chains_data.value['Arbitrum']['TVL'] : 0,
  "TVL Binance": chains_data.value && chains_data.value['Binance'] ? chains_data.value['Binance']['TVL'] : 0,
  "TVL Polygon": chains_data.value && chains_data.value['Polygon'] ? chains_data.value['Polygon']['TVL'] : 0
}))




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
