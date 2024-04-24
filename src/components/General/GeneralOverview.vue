<template>
  <div class="d-flex gap-1 flex-wrap justify-content-between">
    <div class="d-flex gap-4">
      <div class="overview_big_container bg-[#FFFFFF24] dark:!bg-[#22222224]" v-for="(item, i) in bigContainerMock"
        :key="`${i}-big-container`">
        <div class="icon_container bg-white dark:!bg-[#22222224]">
          <img :src="item.icon" />
        </div>
        <div>
          <div class="text_header dark:!text-[#ffffffb2] text-[#000000B2]">{{ item.name }}</div>
          <div class="text_value text-black dark:!text-white">{{ item.value }}</div>
        </div>
        <div>
          <div class="text_header dark:!text-[#ffffffb2] text-[#000000B2]">{{ item.description }}</div>
          <div class="text_value text-black dark:!text-white">{{ item.value_2 }}</div>
        </div>
        <div class="mt-5">
          <CChart type="line" style="height: 70px; filter: drop-shadow(0 0 0.5rem #00c9ff)" :data="{
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
      }" :options="{
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
      }" />
        </div>
      </div>
    </div>
    <div class="d-flex gap-4 flex-wrap justify-content-end" style="width: 35%">
      <div class="overview_small_container bg-[#FFFFFF24] dark:!bg-[#22222224]" v-for="(item, i) in smallContainerMock"
        :key="`${i}-small`">
        <div class="icon_container bg-white dark:!bg-[#22222224]">
          <img :src="item.icon" />
        </div>
        <div>
          <div class="text_header dark:!text-[#ffffffb2] text-[#000000B2]">{{ item.name }}</div>
          <div class="text_value text-black dark:!text-white">{{ item.value }}</div>
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
import { useDark } from '@vueuse/core'
import d3logo from '@/assets/images/d3v.png'
import { defineProps, computed } from "vue"
const isDark = useDark()

const props = defineProps(["overview"])
const bigContainerMock = computed(() => props.overview ? [
  {
    icon: TotalProfitsIcon,
    name: 'Total profits',
    value: props.overview.totalProfits,
    description: '24H profits',
    value_2: props.overview.profits24H,
    chartLabels: props.overview.profitChart.timestamps,
    chartData: props.overview.profitChart.data
  },
  {
    icon: averageAPRIcon,
    name: 'Average APR',
    value: props.overview.avgAPR,
    description: '24H APR',
    value_2: props.overview.APR24H,
    chartLabels: props.overview.aprChart.timestamps,
    chartData: props.overview.aprChart.data
  },
  {
    icon: d3logo,
    name: 'PPN TVL',
    value: props.overview.PPNTVL,
    description: 'PPN price',
    value_2: props.overview.PPNPrice,
    chartLabels: props.overview.ppnChart.timestamps,
    chartData: props.overview.ppnChart.data
  },
] : [])


const smallContainerMock = computed(() => props.overview ? [
  {
    icon: totalUsers,
    name: 'Total users',
    value: props.overview.totalUsers,
  },
  {
    icon: DepositedLiquidity,
    name: 'TVL',
    value: props.overview.TVL,
  },
  {
    icon: FeesIcon,
    name: '24H Trades',
    value: props.overview.trades24H,
  },
  {
    icon: RealizedProfit,
    name: '24H Volume',
    value: props.overview.volume24H,
  },
] : [])

</script>
<style lang="scss" scoped>
.overview_big_container {
  // background: #22222224;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000B5;
  border: 1px solid #ffffff0d;
  border-radius: 16px;
  padding: 20px 30px;
  width: 17vw;
}

.overview_small_container {
  // background: #22222224;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000B5;
  border: 1px solid #ffffff0d;
  border-radius: 16px;
  padding: 20px 30px;
  width: 12.5vw;
  height: fit-content;
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
  margin-top: 22px;
  font-family: Montserrat;
  font-size: clamp(10px, 0.7vw, 13px);
  font-weight: 400;
  line-height: 17px;
  // color: #ffffffb2;
}

.text_value {
  margin-top: 5px;

  font-family: Montserrat;
  font-size: clamp(14px, 0.8vw, 19px);
  font-weight: 700;
  line-height: 34px;
  // color: #ffffff;
}

:deep(.chartjs-tooltip) {
  display: none !important;
}
</style>
