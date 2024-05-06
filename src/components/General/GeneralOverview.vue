<template>
  <div class="d-flex gap-1 flex-wrap justify-content-between">
    <div class="d-flex gap-4">
      <div
        class="overview_big_container bg-[#FFFFFF24] dark:!bg-[#22222224]"
        v-for="(item, i) in bigContainerMock"
        :key="`${i}-big-container`"
      >
        <div class="flex justify-between items-center mb-10">
          <div>
            <div class="text_header dark:!text-[#ffffffb2] text-[#000000B2]">
              {{ item.name }}
            </div>
            <div class="text_value text-black dark:!text-white">
              {{
                item.name.includes('APR')
                  ? `${parseFloat(item.value).toFixed(3)}%`
                  : parseFloat(item.value).toFixed(3)
              }}
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
            {{
              item.name.includes('APR')
                ? `${parseFloat(item.value_2).toFixed(3)}%`
                : parseFloat(item.value_2).toFixed(3)
            }}
            <div class="flex items-center text-[8px] text-[#8E8E8E]">
              <svg
                width="7"
                height="7"
                viewBox="0 0 7 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_323_7059)">
                  <path
                    d="M5.443 3.82153C5.75076 4.35499 5.36579 5.02177 4.74993 5.02197L1.60356 5.02381C0.987104 5.0244 0.601444 4.35685 0.909706 3.82292L2.48448 1.09532C2.79275 0.561397 3.56369 0.561612 3.87141 1.09578L5.443 3.82153Z"
                    fill="#00FF5D"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_323_7059">
                    <rect
                      width="5.12436"
                      height="5.12436"
                      fill="white"
                      transform="translate(4.43781 7) rotate(-150)"
                    />
                  </clipPath>
                </defs>
              </svg>
              5.15%
            </div>
          </div>
        </div>
        <div class="mt-5">
          <CChart
            type="line"
            style="height: 70px; filter: drop-shadow(0 0 0.5rem #00c9ff)"
            :data="{
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
                },
              ],
            }"
            :options="{
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  enabled: true,
                },
              },

              maintainAspectRatio: false,
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
            }"
          />
        </div>
      </div>
    </div>
    <div class="flex gap-3 flex-col">
      <div
        class="overview_small_container bg-[#FFFFFF24] dark:!bg-[#22222224]"
        v-for="(item, i) in smallContainerMock"
        :key="`${i}-small`"
      >
        <div class="flex justify-between items-center">
          <div>
            <div class="text_header dark:!text-[#ffffffb2] text-[#000000B2]">
              {{ item.name }}
            </div>
            <div class="text_value text-black dark:!text-white">
              {{
                parseFloat(item.value)
                  .toFixed(3)
                  .replace(/(\.0+|0+)$/, '')
              }}
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
import { CChart } from '@coreui/vue-chartjs'
import walletPoolsImg from '@/assets/icons/sidebarIcons/walletPoolsImage.svg'
import totalUsers from '@/assets/icons/generalIcons/totalUsers.svg'
import DepositedLiquidity from '@/assets/icons/generalIcons/DepositedLiquidity.svg'
import FeesIcon from '@/assets/icons/generalIcons/Fees.svg'
import RealizedProfit from '@/assets/icons/generalIcons/realizedProfit.svg'
import TotalProfitsIcon from '@/assets/icons/generalIcons/TotalProfits.svg'
import averageAPRIcon from '@/assets/icons/generalIcons/averageAPR.svg'
import totalVolumeIcon from '@/assets/icons/generalIcons/totalVolume.svg'
import { useDark } from '@vueuse/core'
import d3logo from '@/assets/images/d3v.png'
import { defineProps, computed } from 'vue'
import { t } from 'i18next'
const isDark = useDark()

const props = defineProps(['overview'])
const bigContainerMock = computed(() =>
  props.overview
    ? [
        {
          icon: TotalProfitsIcon,
          name: t('total_profits'),
          value: props.overview.totalProfits,
          description: `24H ${t('profits')}`,
          value_2: props.overview.profits24H,
          chartLabels: props.overview.profitChart.timestamps,
          chartData: props.overview.profitChart.data,
        },
        {
          icon: averageAPRIcon,
          name: `${t('average')} APR`,
          value: props.overview.avgAPR,
          description: '24H APR',
          value_2: props.overview.APR24H,
          chartLabels: props.overview.aprChart.timestamps,
          chartData: props.overview.aprChart.data,
        },
        {
          icon: d3logo,
          name: 'PPN TVL',
          value: props.overview.PPNTVL,
          description: `PPN ${t('price')}`,
          value_2: props.overview.PPNPrice,
          chartLabels: props.overview.ppnChart.timestamps,
          chartData: props.overview.ppnChart.data,
        },
        {
          icon: totalVolumeIcon,
          name: 'Total Volume',
          value: props.overview.PPNTVL,
          description: `24h ${t('volume')}`,
          value_2: props.overview.APR24H,
          chartLabels: props.overview.ppnChart.timestamps,
          chartData: props.overview.ppnChart.data,
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
          value: props.overview.TVL,
        },
        {
          icon: FeesIcon,
          name: `24H ${t('trades')}`,
          value: props.overview.trades24H,
        },
        {
          icon: RealizedProfit,
          name: `24H ${t('volume')}`,
          value: props.overview.volume24H,
        },
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
  width: 16.5vw;
  box-shadow: 0px 4px 4px 0px #00000040;
}

.overview_small_container {
  backdrop-filter: blur(10px);
  border: 1px solid #00e0ff61;
  border-radius: 30px;
  padding: 10px 30px;
  width: 14vw;
  height: fit-content;
  box-shadow: 0px 4px 4px 0px #00000040;
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
