<template>
  <div class="d-flex gap-1 flex-wrap justify-content-between">
    <div class="d-flex gap-4">
      <div
        class="overview_big_container bg-[#FFFFFF24] dark:!bg-[#22222224]"
        v-for="(item, i) in bigContainerMock"
        :key="`${i}-big-container`"
      >
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
    <div class="d-flex gap-4 flex-wrap justify-content-end" style="width: 35%">
      <div
        class="overview_small_container bg-[#FFFFFF24] dark:!bg-[#22222224]"
        v-for="(item, i) in smallContainerMock"
        :key="`${i}-small`"
      >
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

const isDark = useDark()


const bigContainerMock = [
  {
    icon: TotalProfitsIcon,
    name: 'Total profits',
    value: '$12.71M',
    description: '24H profits',
    value_2: '$169.14K',
    chartLabels: ['1AM', '4AM', '8AM', '12AM', '6PM', '12PM'],
    chartData: [1, 3, 2, 1, 4, 3]
  },
  {
    icon: averageAPRIcon,
    name: 'Average APR',
    value: '3.14%',
    description: '24H APR',
    value_2: '34%',
    chartLabels: ['1AM', '4AM', '8AM', '12AM', '6PM', '12PM'],
    chartData: [3, 5, 6, 5, 3, 1]
  },
  {
    icon: walletPoolsImg,
    name: 'PPN TVL',
    value: '$275.01K',
    description: 'PPN price',
    value_2: '$1.18',
    chartLabels: ['1AM', '4AM', '8AM', '12AM', '6PM', '12PM'],
    chartData: [3, 3, 3, 4, 3, 3]
  },
]


const smallContainerMock = [
  {
    icon: totalUsers,
    name: 'Total users',
    value: '95',
  },
  {
    icon: DepositedLiquidity,
    name: 'TVL',
    value: '$725.79K',
  },
  {
    icon: FeesIcon,
    name: '24H Trades',
    value: '107',
  },
  {
    icon: RealizedProfit,
    name: '24H Volume',
    value: '$326.04',
  },
]

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
  font-family: Poppins;
  font-size: clamp(10px, 0.7vw, 13px);
  font-weight: 400;
  line-height: 17px;
  // color: #ffffffb2;
}
.text_value {
  margin-top: 5px;

  font-family: Poppins;
  font-size: clamp(14px, 0.8vw, 19px);
  font-weight: 700;
  line-height: 34px;
  // color: #ffffff;
}

:deep(.chartjs-tooltip) {
  display: none !important;
}
</style>
