<template>
    <div class="d-flex gap-4 flex-wrap justify-content-between">
  <div class="d-flex gap-4">
    <div class="overview_big_container">
      <div class="icon_container">
        <svg
          width="28"
          height="27"
          viewBox="0 0 28 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3.66406 6H0.664062V27H3.66406V6Z" fill="white" />
          <path d="M11.6641 11H8.66406V27H11.6641V11Z" fill="white" />
          <path d="M19.6641 4H16.6641V27H19.6641V4Z" fill="white" />
          <path d="M27.6641 0H24.6641V27H27.6641V0Z" fill="#00C9FF" />
        </svg>
      </div>
      <div>
        <div class="text_header">Total volume</div>
        <div class="text_value">$12.71M</div>
      </div>
      <div>
        <div class="text_header">24H volume</div>
        <div class="text_value">$169.14K</div>
      </div>
      <div class="mt-5">
        <CChart
          type="line"
          style="
            height: 70px;
          
            filter: drop-shadow(0 0 0.5rem #00c9ff);
          "
          :data="{
            labels: [1, 3, 2, 1, 4, 4, 2, 1, 3, 2, 1, 4, 4, 2],
            datasets: [
              {
                label: 'My First dataset',
                backgroundColor: '#03F5AE00',
                borderColor: '#03ACF599',
                data: [1, 3, 2, 1, 4, 4, 2, 6, 7, 2, 1, 4, 4, 2],
                fill: true,
                pointRadius: 0,
                pointHitRadius: 0,
              },
            ],
          }"
          :options="{
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
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
              point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
              },
            },
          }"
        />
      </div>
    </div>
    <div class="overview_big_container">
      <div class="icon_container">
        <svg
          width="32"
          height="28"
          viewBox="0 0 32 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.5875 0.320007V3.20001H26.5306L22.5368 7.59311L19.7075 4.76381L11.7875 12.6838L8.95525 9.85161L0.0185547 17.9741L1.95635 20.1059L8.85955 13.8284L11.7875 16.7563L19.7075 8.83631L22.6367 11.7655L28.3475 5.48521V8.96001H31.2275V0.320007H22.5875ZM26.9075 12.56V27.68H29.7875V12.56H26.9075ZM16.8275 14.72V27.68H19.7075V14.72H16.8275ZM21.8675 14.72V27.68H24.7475V14.72H21.8675ZM6.74745 18.32V27.68H9.62745V18.32H6.74745ZM11.7875 19.04V27.68H14.6675V19.04H11.7875ZM1.70745 21.92V27.68H4.58745V21.92H1.70745Z"
            fill="#00C9FF"
          />
          <path
            d="M26.907 12.56V27.68H29.787V12.56H26.907ZM16.827 14.72V27.68H19.707V14.72H16.827ZM21.867 14.72V27.68H24.747V14.72H21.867ZM6.74703 18.32V27.68H9.62703V18.32H6.74703ZM11.787 19.04V27.68H14.667V19.04H11.787ZM1.70703 21.92V27.68H4.58703V21.92H1.70703Z"
            fill="white"
          />
        </svg>
      </div>
      <div>
        <div class="text_header">Total trades</div>
        <div class="text_value">3.14K</div>
      </div>
      <div>
        <div class="text_header">24H trades</div>
        <div class="text_value">34</div>
      </div>
      <div class="mt-5">
        <CChart
          type="line"
          style="
            height: 70px;
          
            filter: drop-shadow(0 0 0.5rem #00c9ff);
          "
          :data="{
            labels: [1, 3, 2, 2, 4, 2, 2, 2, 3, 2, 7, 8, 9, 7],
            datasets: [
              {
                label: 'My First dataset',
                backgroundColor: '#03F5AE00',
                borderColor: '#03ACF599',
                data: [1, 3, 2, 2, 4, 2, 2, 2, 3, 2, 7, 8, 9, 7],
                fill: true,
                pointRadius: 0,
                pointHitRadius: 0,
              },
            ],
          }"
          :options="{
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
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
              point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
              },
            },
          }"
        />
      </div>
    </div>
    <div class="overview_big_container">
      <div class="icon_container">
        <img :src="walletPoolsImg" />
      </div>
      <div>
        <div class="text_header">PPN TVL</div>
        <div class="text_value">$275.01K</div>
      </div>
      <div>
        <div class="text_header">PPN price</div>
        <div class="text_value">$1.18</div>
      </div>
      <div class="mt-5">
        <CChart
          type="line"
          style="
            height: 70px;
          
            filter: drop-shadow(0 0 0.5rem #00c9ff);
          "
          :data="{
            labels: [1, 2, 3, 2],
            datasets: [
              {
                label: 'My First dataset',
                backgroundColor: '#03F5AE00',
                borderColor: '#03ACF599',
                data: [1, 2, 3, 2],
                fill: true,
                pointRadius: 0,
                pointHitRadius: 0,
              },
            ],
          }"
          :options="{
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
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
              point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
              },
            },
          }"
        />
      </div>
    </div>
    
  </div>
  <div class="d-flex gap-4 flex-wrap justify-content-end" style="width: 35%;">
      <div class="overview_small_container" v-for="item, i in smallContainerMock" :key="`${i}-small`">
        <div class="icon_container">
         <img :src="item.icon" />
        </div>
        <div>
          <div class="text_header">{{ item.name }}</div>
          <div class="text_value">{{ item.value }}</div>
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

const smallContainerMock = [
    {
        icon:  totalUsers,
          name: 'Total users',
          value: '95'
    },
    {
        icon:  DepositedLiquidity,
          name: 'Deposited Liquidity',
          value: '$725.79K'
    },
    {
        icon:  FeesIcon,
          name: '24H fees',
          value: '$107.05'
    },
    {
        icon:  RealizedProfit,
          name: '24H realized Profit',
          value: '$326.04'
    },
]

</script>
<style lang="scss" scoped>
.overview_big_container {
  background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;
  border: 1px solid #ffffff0d;
  border-radius: 16px;
  padding: 20px 30px;
  width: 17vw;
}
.overview_small_container {
  background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;
  border: 1px solid #ffffff0d;
  border-radius: 16px;
  padding: 20px 30px;
  width: 12.5vw;
  height: fit-content;
}



.icon_container {
  background: #22222224;
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
  color: #ffffffb2;
}
.text_value {
  margin-top: 5px;

  font-family: Poppins;
  font-size: clamp(14px, 0.8vw, 19px);
  font-weight: 700;
  line-height: 34px;
  color: #ffffff;
}
</style>
