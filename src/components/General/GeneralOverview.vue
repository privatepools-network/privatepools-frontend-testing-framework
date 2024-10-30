<template>
  <div class="flex md:gap-1 gap-4 justify-between md:overflow-hidden overflow-y-auto">
    <div class="flex gap-4 lg:!w-[80%] w-auto">
      <div class="overview_big_container bg-[#FFFFFF24] dark:!bg-[#22222224]" v-for="(item, i) in bigContainerMock"
        :key="`${i}-big-container`">
        {{ console.log('generalOverviewLoader', generalOverviewLoader) }}
        <LoaderPulse v-if="generalOverviewLoader" />
        <div v-else>
          <div class="flex justify-between items-center mb-10">
            <div>
              <div class="text_header dark:!text-[#ffffffb2] text-[#000000B2]">
                {{ item.name }}
              </div>
              <div class="text_value flex items-center text-black dark:!text-white">
                <CounterAnimation
                    :currency="item.name.includes('APR') || item.name.includes('Trades') ? '%' : ''"
                    :decimal-places="currencyDecimals"
                    :value="
                      parseFloat(item.value).toFixed(
                        item.description.includes('Total Trades') || item.description.includes('APR') ? 0 : currencyDecimals,
                      )
                    "
                  />{{ item.name.includes('APR') ? '%' : '' }}
              
              </div>
            </div>
            <div class="icon_container bg-white dark:!bg-[#22222224]">
              <img :src="item.icon" />
            </div>
          </div>

          <div>
            <div class="text_header dark:!text-[#ffffffb2] text-[#000000B2]">
              {{ item.description }}
            </div>
            <div class="text_value text-black dark:!text-white flex items-center gap-1">
              <CounterAnimation
                    :currency="item.name.includes('APR') || item.name.includes('Trades') ? '%' : ''"
                    :decimal-places="currencyDecimals"
                    :value="
                      parseFloat(item.value_2).toFixed(
                        item.description.includes('24h Trades')  || item.description.includes('APR') ? 0 : currencyDecimals,
                      )
                    "
                  />{{ item.name.includes('APR') ? '%' : '' }}
            
              <div class="flex items-center text-[8px] text-[#8E8E8E]">
                <svg :class="parseFloat(item.value_2) > 0 ? '' : 'rotate-180'" width="7" height="7" viewBox="0 0 7 7"
                  fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_323_7059)">
                    <path
                      d="M5.443 3.82153C5.75076 4.35499 5.36579 5.02177 4.74993 5.02197L1.60356 5.02381C0.987104 5.0244 0.601444 4.35685 0.909706 3.82292L2.48448 1.09532C2.79275 0.561397 3.56369 0.561612 3.87141 1.09578L5.443 3.82153Z"
                      :fill="parseFloat(item.value_2) > 0 ? '#40B66B' : '#D22B2B'
                        " />
                  </g>
                  <defs>
                    <clipPath id="clip0_323_7059">
                      <rect width="5.12436" height="5.12436" fill="white"
                        transform="translate(4.43781 7) rotate(-150)" />
                    </clipPath>
                  </defs>
                </svg>
                {{ item.percentage.toFixed(2) }}%
              </div>
            </div>
          </div>
          <!-- <div class="mt-5 flex justify-center">
            {{ console.log('item', item) }}
            <CChart type="line" style="
                height: 70px;

                filter: drop-shadow(0 0 0.5rem #00c9ff);
              " class="lg:w-[12svw] w-full" :data="{
                // labels: moment
                //   .unix(item.chartLabels * 1000)
                //   .format('MMMM Do YYYY, h:mm:ss a'),
                labels: item.chartLabels,

                datasets: [
                  {
                    label: 'Profit',
                    backgroundColor: '#03F5AE00',
                    borderColor: '#03ACF599',
                    data: item.chartData,
                    fill: true,
                    pointRadius: 1,
                    pointHitRadius: 2,
                    pointStyle: 'circle',
                  },
                ],
              }" :options="{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    enabled: false,
                    usePointStyle: true,
                  },
                },

                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                },
              }" />
          </div> -->
        </div>
      </div>
    </div>
    <div class="flex gap-3 flex-col lg:w-[20%] w-full">
      <div class="overview_small_container bg-[#FFFFFF24] dark:!bg-[#22222224]" v-for="(item, i) in smallContainerMock"
        :key="`${i}-small`">
        <LoaderPulse v-if="generalOverviewLoader" />
        <div v-else class="flex justify-between items-center">
          <div>
            <div class="text_header dark:!text-[#ffffffb2] text-[#000000B2]">
              {{ item.name }}
            </div>
            <div class="text_value flex items-center text-black dark:!text-white">
              <CounterAnimation
                    :currency="item.name !== 'Total users' ? '' : '1'"
                    :decimal-places="currencyDecimals"
                    :value="
                      parseFloat(item.value).toFixed(
                        currencyDecimals,
                      )
                    "
                  />
              <!-- {{
                parseFloat(item.value)
                  .toFixed(3)
                  .replace(/(\.0+|0+)$/, '')
              }} -->
            </div>
          </div>
          <div class="icon_container bg-white dark:!bg-[#22222224]">
            <img :src="item.icon" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import LoaderPulse from '../loaders/LoaderPulse.vue'

import { CChart } from '@coreui/vue-chartjs'
import PPNTVL from '@/assets/icons/generalIcons/PPNTVL.svg'
import totalUsers from '@/assets/icons/generalIcons/totalUsers.svg'
import DepositedLiquidity from '@/assets/icons/generalIcons/DepositedLiquidity.svg'
import FeesIcon from '@/assets/icons/generalIcons/Fees.svg'
// import RealizedProfit from '@/assets/icons/generalIcons/realizedProfit.svg'
import TotalProfitsIcon from '@/assets/icons/generalIcons/TotalProfits.svg'
import averageAPRIcon from '@/assets/icons/generalIcons/averageAPR.svg'
import totalVolumeIcon from '@/assets/icons/generalIcons/totalVolume.svg'
import { useDark } from '@vueuse/core'
import d3logo from '@/assets/images/d3v.png'
import { defineProps, computed } from 'vue'
import { t } from 'i18next'
import CounterAnimation from '@/UI/CounterAnimation.vue'

import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'

const settingsStore = useSettings()

const { currentCurrency } = storeToRefs(settingsStore)


const currencyDecimals = computed(() =>
  currentCurrency.value == 'USD' ? 0 : 3,
)

const postfix = computed(() =>
  currentCurrency.value == 'USD' ? '' : `_${currentCurrency.value}`,
)
const isDark = useDark()

const props = defineProps(['overview', 'generalOverviewLoader'])
const bigContainerMock = computed(() =>
  props.overview
    ? [
      {
        icon: TotalProfitsIcon,
        name: t('total_profits'),
        value: props.overview[`totalProfits${postfix.value}`],
        description: `24H ${t('profits')}`,
        value_2: props.overview[`profits24H${postfix.value}`],
        chartLabels: [0, 0, 0, 0, 0, 0, 0],
        // chartLabels: props.overview.profitChart.timestamps,
        // chartData: props.overview.profitChart.data,
        chartData: [0, 0, 0, 0, 0, 0, 0],
        percentage: props.overview.profitPercentage,
      },
      {
        icon: averageAPRIcon,
        name: `${t('average')} APR`,
        value: props.overview.avgAPR,
        description: '24H APR',
        value_2: props.overview.APR24H,
        chartLabels: props.overview.aprChart.timestamps,
        chartData: props.overview.aprChart.data,
        percentage: props.overview.APRPercentage,
      },
      {
        icon: PPNTVL,
        name: 'Total Trades',
        value: props.overview.totalTrades ?? 0,
        description: `24h Trades`,
        value_2: props.overview.trades24H ?? 0,
        chartLabels: props.overview.ppnChart.timestamps,
        chartData: props.overview.ppnChart.data,
        percentage: props.overview.PPNPricePercentage ?? 0,
      },
      {
        icon: totalVolumeIcon,
        name: 'Total Volume',
        value: props.overview[`totalVolume${postfix.value}`],
        description: `24h ${t('volume')}`,
        value_2: props.overview[`volume24H${postfix.value}`],
        // chartLabels: props.overview.volumeChart.timestamps,
        chartLabels: [0, 0, 0, 0, 0, 0, 0],
        // chartData: props.overview.volumeChart.data,
        chartData: [0, 0, 0, 0, 0, 0, 0],
        percentage: props.overview.volumePercentage,
      },
    ]
    : [],
)

const smallContainerMock = computed(() =>
  props.overview
    ? [
      {
        icon: totalUsers,
        name: t('total_users'),
        value: props.overview.totalUsers,
      },
      {
        icon: DepositedLiquidity,
        name: 'TVL',
        value: props.overview[`TVL${postfix.value}`],
      },
      // {
      //   icon: FeesIcon,
      //   name: `Gas Fees`,
      //   value: props.overview[`totalGasFee${postfix.value}`],
      // },
      // {
      //   icon: totalVolumeIcon,
      //   name: `24H ${t('volume')}`,
      //   value: props.overview[`volume24H${postfix.value}`],
      // },
    ]
    : [],
)
</script>
<style lang="scss" scoped>
.overview_big_container {
  backdrop-filter: blur(10px);
  border: 1px solid #00e0ff61;
  border-radius: 30px;
  padding: 20px 30px;
  width: 100%;
  box-shadow: 0px 4px 4px 0px #00000040;
  margin-bottom: 5px;

  @media (min-width: 1950px) {
    width: 10.5vw;
  }

  @media (max-width: 768px) {
    width: 250px;
  }
}

.overview_small_container {
  backdrop-filter: blur(10px);
  border: 1px solid #00e0ff61;
  border-radius: 30px;
  padding: 20px 30px;
  width: 100%;
  height: fit-content;
  box-shadow: 0px 4px 4px 0px #00000040;
  margin-bottom: 5px;
  @media (min-width: 1950px) {
    width: 10.5vw;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
}

.icon_container {
  // background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;

  border-radius: 16px;
  padding: 10px;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text_header {
  font-size: clamp(10px, 0.7vw, 13px);
  font-weight: 400;
  line-height: 17px;
  // color: #ffffffb2;
}

.text_value {
  font-family: 'Roboto Mono', monospace;
  font-size: clamp(18px, 1vw, 32px);
  font-weight: 700;
  line-height: 34px;
  // color: #ffffff;
}

:deep(.chartjs-tooltip) {
  display: none !important;
}
</style>
