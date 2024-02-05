<template>
  <CModal size="xl" alignment="center" :visible="SystemProfitModalVisible">
    <CModalHeader :close-button="false">
      <div class="d-flex justify-content-between w-100">
        <div class="modal_body_header">
          <span>{{ SystemProfitTime }} Profit Breakdown</span>
        </div>
        <div
          style="cursor: pointer"
          @click="$emit('changeVisibleSystemProfitModal')"
        >
          <img :src="close_modal_icon" />
        </div>
      </div>
    </CModalHeader>
    <CModalBody>
      <div class="modal_body_inside">
        <div class="d-flex gap-4">
          <div class="w-50">
            <div
              class="d-flex justify-content-between"
              style="border-bottom: 1px solid rgba(163, 164, 165, 0.281)"
            >
              <div
                style="width: 33%; font-family: Montserrat; font-weight: 700"
              >
                Assets
              </div>
              <div
                style="width: 33%; font-family: Montserrat; font-weight: 700"
              >
                Profit (Token Amount)
              </div>
              <div
                style="width: 33%; font-family: Montserrat; font-weight: 700"
              >
                Profit (<span v-if="symbol === '₿'">
                          <img :src="btcSymbol" width="9" />
                        </span>
                        <span v-else-if="symbol === 'Ξ'">
                          <img :src="ethSymbol" width="9" />
                        </span>
                        <span v-else>{{ symbol }} </span>)
              </div>
            </div>

            <!-- V-FOR -->
            {{ console.log('profitsDetails.token', profitsDetails.token) }}
            <div
              class="d-flex justify-content-between pb-1 pt-5"
              style="border-bottom: 1px solid rgba(163, 164, 165, 0.281)"
              v-for="(assets, i) in searchAndSort"
              :key="`assets-${i}`"
            >
              <div
                style="width: 33%; font-family: Montserrat; font-weight: 400"
              >
                <img
                  :src="getTokenEntity(assets.symbol, 'short').icon"
                  width="18"
                />

                {{ assets.symbol }}
              </div>
              <div
                style="width: 33%; font-family: Montserrat; font-weight: 400"
              >
                {{ numberToAposthrophe(assets.value, currencyDecimals) }}
                {{ assets.symbol }}
              </div>
              <div
                style="width: 33%; font-family: Montserrat; font-weight: 400"
              >
              <span v-if="symbol === '₿'">
                          <img :src="btcSymbol" width="9" />
                        </span>
                        <span v-else-if="symbol === 'Ξ'">
                          <img :src="ethSymbol" width="9" />
                        </span>
                        <span v-else>{{ symbol }} </span> {{
                  numberToAposthrophe(
                    profitsDetails.currency[i].value,
                    currencyDecimals,
                  )
                }}
              </div>
            </div>

            <div class="d-flex justify-content-end mt-2">
              <div class="d-flex align-items-center gap-2">
                <div @click="page > 1 ? page-- : ''" style="cursor: pointer;">
                  <svg
                    width="7"
                    height="10"
                    viewBox="0 0 7 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.729951 4.53442L4.89496 0.347936C5.10966 0.154714 5.43169 0.154714 5.62491 0.347936L6.11871 0.841727C6.31193 1.03495 6.31193 1.35699 6.11871 1.57168L2.81246 4.87793L6.11871 8.20564C6.31193 8.42033 6.31193 8.74237 6.11871 8.93559L5.62491 9.42938C5.43169 9.62261 5.10966 9.62261 4.89496 9.42938L0.729951 5.2429C0.536729 5.04968 0.536729 4.72764 0.729951 4.53442Z"
                      fill="white"
                      :fill-opacity="page > 1 ? '' : 0.2"
                    />
                  </svg>
                </div>
                <div>{{ page }}</div>
                <div @click="page < profitsDetails.token.length / pageSize ? page++ : ''" style="cursor: pointer;">
                  <svg
                    width="7"
                    height="10"
                    viewBox="0 0 7 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.4688 5.2429L2.30379 9.42938C2.0891 9.62261 1.76706 9.62261 1.57384 9.42938L1.08005 8.93559C0.886826 8.74237 0.886826 8.42033 1.08005 8.20564L4.3863 4.87793L1.08005 1.57168C0.886826 1.35699 0.886826 1.03495 1.08005 0.841727L1.57384 0.347936C1.76706 0.154714 2.0891 0.154714 2.30379 0.347936L6.4688 4.53442C6.66202 4.72764 6.66202 5.04968 6.4688 5.2429Z"
                      fill="white"
                      :fill-opacity="page < profitsDetails.token.length / pageSize ? '' : 0.2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div class="w-50" style="padding-left: 100px; padding-right: 100px">
            <div class="compose_steps">
              <div class="compose_text py-2">Daily Profit Breakdown</div>
              <hr class="compose_hr" />
              <div>
                <div class="chart_container my-5">
                  <!-- <LoaderPulse v-if="data.series.length === 0" /> -->
                  <apexchart
                    :options="dynamicDonut"
                    :series="profitsDetails.currency.map((t) => t.value)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CModalBody>
  </CModal>
</template>

<script setup>
import close_modal_icon from '@/assets/icons/arrow/close_modal_icon.svg'
import { getTokenEntity } from '@/lib/helpers/util'
import numberToAposthrophe from '@/lib/formatter/numberToAposthrophe'
import { defineProps, defineEmits, computed, ref, watch } from 'vue'
import { stringToColor } from '@/lib/utils'
import btcSymbol from '@/assets/images/tokens/btcSymbol.png'
import ethSymbol from '@/assets/images/tokens/ethSymbol.png'


const props = defineProps([
  'SystemProfitModalVisible',
  'SystemProfitTime',
  'profitsDetails',
  'symbol',
  'currencyDecimals',
])
const emit = defineEmits(['changeVisibleSystemProfitModal'])

watch(emit('changeVisibleSystemProfitModal'), () => {
  page.value = 1
})
const pageSize = 5
const page = ref(1)

const searchAndSort = computed(() => {
  const start = (page.value - 1) * pageSize
  const end = page.value * pageSize
  return props.profitsDetails.token.slice(start, end)
})

const dynamicDonut = computed(() => {
  let arrayOfColors = props.profitsDetails.currency.map((t) =>
    stringToColor(t.symbol),
  )
  let labels = props.profitsDetails.currency.map((t) => t.symbol)
  return {
    chart: {
      type: 'donut',
      width: '40%',
      height: '40%',
    },
    colors: arrayOfColors,
    labels: labels,
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      // fontFamily: 'Lato',
      fontWeight: 600,
      labels: {
        // colors: arrayOfColors,
        useSeriesColors: true,
      },
      markers: {
        fillColors: arrayOfColors,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
      colors: arrayOfColors,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '50%',
          background: 'transparent',
        },
      },
    },
    stroke: {
      show: true,
      width: 0.5,
      colors: ['#181C1F'],
    },
    tooltip: {
      enabled: true,
      // eslint-disable-next-line
      custom({ series, seriesIndex, dataPointIndex, w }) {
        return (
          '<div style="background: linear-gradient(rgba(89, 89, 89, 1), rgba(73, 73, 73, 0.45)); color:white; padding: 10px;">' +
          '<div style="font-size:clamp(10px, 0.9vw, 16px)">' +
          '</div>' +
          '<div style="display:flex; flex-direction:column; font-size: clamp(10px, 0.8vw, 14px)">' +
          '<div style="display:flex; align-items: center">' +
          w.globals.labels[seriesIndex] +
          ': ' +
          numberToAposthrophe(series[seriesIndex], props.currencyDecimals) +
          ` ${props.symbol !== '$' ? `<span style="margin-left: 2px"><img src="${props.symbol === '₿' ? btcSymbol : ethSymbol}" width='9'/></span>` : `<span style="margin-left: 2px">$</span>`}` +
          '</div>' +
          '</div>' +
          '</div>'
        )
      },
    },
  }
})
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.chart_container {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0px;
  // border-radius: 20px;
  padding: 5px 0px;
  height: 260px;

  :deep(.apexcharts-inner) {
    filter: drop-shadow(0 0 0.3rem #58b90a);
  }
}

.token-input {
  background-color: transparent;
  border: none;
  outline: none;
}

.modal_body_header {
  font-family: Montserrat;
  font-size: 18px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: -0.5px;
  color: white;
}

.modal_body_inside {
  font-family: Montserrat !important;
  padding: 0px 0px;
  font-size: clamp(12px, 0.8vw, 14px);
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0em;
  color: #fff;
}

.compose_steps {
  padding: 10px;
  width: 100%;

  height: fit-content;
  background: linear-gradient(
    90.52deg,
    rgba(53, 185, 192, 0.05) 0.36%,
    rgba(53, 185, 192, 0.02) 0.36%
  );
  border: 1px solid #01b47e2f;
  border-radius: 10px;
}

.compose_text {
  font-family: Montserrat;
  font-size: clamp(11px, 0.8vw, 15px);
  color: white;
}

.compose_hr {
  border-bottom: 1px solid #01b47e57;
  margin: 0px;
  margin-top: 5px;
  margin-right: -10px;
  margin-left: -10px;
}
</style>
