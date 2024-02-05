<template>
  <MainCard :class="{'main_card_full':results.length > 0}">
  <CRow class="d-flex align-items-center">
    <Title :title="'Simulator page'" style="margin-bottom: 28px;">
      <VTooltip :distance="0" :placement="'right'">
      <div style="cursor: help">
      <img :src="info" class="info_icon" />
      </div>
      <template #popper>
      <div style="
      background: linear-gradient(
      rgba(89, 89, 89, 0.75),
      rgba(73, 73, 73, 0.15)
      );
      backdrop-filter: blur(10px);
      padding: 10px;
      border-radius: 4px;
      width: 400px;
      ">
      <div style="font-size:clamp(10px, 0.9vw, 16px)">Information</div>
      <div style="display: flex; flex-direction: column; font-size: clamp(10px, 0.8vw, 14px);">
      <div>Name: Full name of the asset along with used abbreviation</div>
      <div>Price: Current market price of the asset</div>
      <div>Price Variation : Asset's price has changed in the last 24 hours.</div>
      <div>Volume: Trading volume for the asset over the past 24 hours.</div>
      </div>
      </div>
      </template>
      </VTooltip>
    </Title>
    <div class="d-flex justify-content-between flex-wrap">

      <div class="assets" v-if="simulation_result.liquidityInfo == false || results == false">
        <div class="assets-select">
          <div class="assets__title" style="margin-bottom: 15px;">
            Select Assets & Weights(%)
          </div>
          <div class="assets-select__list">
            <SimulatorAssetSelect v-for="(token, i) in simulatorTokensSelected" :key="token.id" :token="token"
              :selectNum="i" :simulatorTokensOptions="simulatorTokensOptions" @onSelect="onSelect">
            </SimulatorAssetSelect>
          </div>
          <SimulatorAssetInterface @addAsset="addAsset" @clearAssets="clearAssets" @removeLastAsset="removeLastAsset">
          </SimulatorAssetInterface>
          <SimulatorAssetFeatures v-model:feeAmount="feeAmount" v-model:depositAmount="depositAmount"
            @amountValidate="amountValidate">
          </SimulatorAssetFeatures>
          <SimulatorAssetPeriod v-model:periodStart="period[0]" v-model:periodEnd="period[1]"></SimulatorAssetPeriod>
          <div class="assets__button" @click="onSimulationStart">
            Run Simulation
          </div>
        </div>
      </div>


      <div class="chart" v-if="simulation_result.liquidityInfo && results">


        <!-- <SimulatorAssetChart v-if="chartTypeTab === 'Old chart'" :chartData="chartData" :tokens="selectedTokens" :preFiltersList="preFiltersList"></SimulatorAssetChart> -->
      <SimulatorChartV2 />
      </div>
    </div>
    <div>
      <CAlert class="d-flex gap-2 w-75" style="
            background-color: rgba(15, 17, 19, 1);
            color: white;
            border: none;
            margin-top: 20px;
            display: flex;
          " color="primary" :visible="showWarning" dismissible @close="() => {
            showWarning = false
          }
            ">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M22 12C22 17.5228 17.5228 22 12 22H2.9937C2.11018 22 1.66771 20.9229 2.29245 20.2929L4.2495 18.3195C2.84334 16.597 2 14.397 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.2071 8.79289C15.5976 9.18342 15.5976 9.81658 15.2071 10.2071L13.4142 12L15.2071 13.7929C15.5976 14.1834 15.5976 14.8166 15.2071 15.2071C14.8166 15.5976 14.1834 15.5976 13.7929 15.2071L12 13.4142L10.2071 15.2071C9.81658 15.5976 9.18342 15.5976 8.79289 15.2071C8.40237 14.8166 8.40237 14.1834 8.79289 13.7929L10.5858 12L8.79289 10.2071C8.40237 9.81658 8.40237 9.18342 8.79289 8.79289C9.18342 8.40237 9.81658 8.40237 10.2071 8.79289L12 10.5858L13.7929 8.79289C14.1834 8.40237 14.8166 8.40237 15.2071 8.79289Z"
            fill="#FF507A" />
        </svg>

        <div>
          {{ warningMessage }}
        </div>
      </CAlert>
    </div>
    <div class="results mt-5" v-if="simulation_result.liquidityInfo && results">
      <Title :title="'Simulation Results'"></Title>
      <div class="results-wrapper">
        <SimulatorAssetResults v-model:selectedYear="selectedYear" :results="results" :yearOptions="yearOptions"
          :liquidity-info="simulation_result.liquidityInfo">
        </SimulatorAssetResults>
        <div class="results-data">
          <div class="results-data__wrapper">
            <div class="results-data__header fw-bold">
              Simulation Data
            </div>
            <SimulatorAssetData v-for="(item, i) in filtersSelected" @onSlect="onFilterSelect"
              :filtersSelected="filtersSelected" :item="item" :i="i" :filtersOptions="filtersOptions" :key="item.title">
            </SimulatorAssetData>
          </div>
          <div class="results-data__wrapper">
            <div class="results-data__header fw-bold">
              Parameters
            </div>
            <div class="results-data__el">
              <div class="results-data__title">
                Assets
              </div>
              <div class="results-data__param">
                <img width="25" v-for="token in simulatorTokensSelected" :key="token.img" :src="token.img" alt="Token">
              </div>
            </div>
            <SimulatorAssetParametr v-for="item in parameters" :key="item.title" :item="item"></SimulatorAssetParametr>
            <div class="assets__button results-data__button" @click="clearData">Run new Simulation</div>
          </div>
        </div>

      </div>
    </div>
  </CRow>
</MainCard>
</template>
<script setup>

import { CRow } from "@coreui/vue";
import { ref, watch, onMounted } from "vue";
import SimulatorAssetSelect from '@/components/Simulator/SimulatorAssetSelect.vue'
import SimulatorAssetInterface from "@/components/Simulator/SimulatorAssetInterface.vue";
import SimulatorAssetFeatures from "@/components/Simulator/SimulatorAssetFeatures.vue";
import SimulatorAssetPeriod from "@/components/Simulator/SimulatorAssetPeriod.vue";
import '@vuepic/vue-datepicker/dist/main.css'
import SimulatorAssetResults from "@/components/Simulator/SimulatorAssetResults.vue";
import SimulatorAssetData from "@/components/Simulator/SimulatorAssetData.vue";
import SimulatorAssetParametr from "@/components/Simulator/SimulatorAssetParametr.vue";
import { useSimulation } from "@/composables/simulator/useSimulation";
import simulate_tokens from '@/lib/config/simulate_tokens.json'
import { getTokenEntity } from "@/lib/helpers/util";
// import SimulatorAssetChart from "@/components/Simulator/SimulatorAssetChart.vue";
import SimulatorChartV2 from "@/components/Simulator/SimulatorChartV2.vue";
import MainCard from '@/UI/MainCard.vue'
import Title from "@/UI/Title";
import info from "@/assets/images/info.svg";

//Assets select
const simulatorTokensSelected = ref([])
const simulatorTokensOptions = ref([{}])
// const preFiltersList = [
//   {
//     title: 'TVL',
//     isSolo: true
//   },
//   {
//     title: 'Profits',
//     isSolo: true
//   },
//   {
//     title: 'Profits per Pair',
//     isSolo: false
//   },{
//     title: 'Price of Assets',
//     isSolo: false
//   },
//   {
//     title: 'Assets Reserves',
//     isSolo: false
//   },
//   {
//     title: 'Assets ratio',
//     isSolo: false
//   },
//   {
//     title: 'Reserves Ratio',
//     isSolo: false
//   },

// ]

const showWarning = ref(false)
const warningMessage = ref('')

// const selectedTokens = computed(() => simulatorTokensSelected.value.map(t => t.symbol))

onMounted(() => {
  let result_tokens = []
  for (let token of simulate_tokens) {
    result_tokens.push({ symbol: token, amount: 25, img: getTokenEntity(token + ' simulator', 'short').icon, id: token })
  }
  console.log(result_tokens)
  simulatorTokensOptions.value = result_tokens
  simulatorTokensSelected.value = [simulatorTokensOptions.value[0], simulatorTokensOptions.value[1]]
})


function onSelect(token) {
  simulatorTokensSelected.value[token.selectNum] = token.v1
}

//Select interface

function addAsset() {
  simulatorTokensSelected.value.push(simulatorTokensOptions.value[0])
}

function clearAssets() {
  simulatorTokensSelected.value.splice(2, simulatorTokensOptions.value.length)
}

function removeLastAsset() {
  simulatorTokensSelected.value.pop()
}

//Assets features
const depositAmount = ref('1000')
const feeAmount = ref('0.01')
const period = ref([new Date(new Date().setDate(new Date().getDate() - 700)), new Date(new Date().setDate(new Date().getDate() - 90))])

function amountValidate() {
  if (depositAmount.value == '' || depositAmount.value <= 0) {
    depositAmount.value = '1000'
  }
  depositAmount.value = depositAmount.value.replace(/[^.' '\d]/g, '').trim()
  depositAmount.value = depositAmount.value.replaceAll(' ', '')
}

//Simulating results
const selectedYear = ref('')
const yearOptions = ref([])
const results = ref([])

//Simulation results fulldata

function onFilterSelect(filter, i) {
  filtersSelected.value[i] = filter
}

const parameters = ref([])
const filtersSelected = ref([])
const filtersOptions = ref([])
// const chartTypeTab = ref('Old chart')

const simulation_result = ref({})
const chartData = ref({})

watch(selectedYear, (newYear) => {
  results.value = simulation_result.value['yearlyResults'][newYear]
})



async function onSimulationStart() {
  console.log(period.value)
  let sum = simulatorTokensSelected.value.map(t => t.amount).reduce((sum, v) => sum + parseFloat(v), 0)
  showWarning.value = false
  console.log(sum)
  if (sum < 99) {
    warningMessage.value = 'The sum of the token weights should be 100.'
    showWarning.value = true
    return
  }
  let result = await useSimulation(
    simulatorTokensSelected.value.map(t => t.symbol),
    simulatorTokensSelected.value.map(t => parseFloat(t.amount)),
    parseFloat(feeAmount.value),
    parseFloat(depositAmount.value),
    period.value.map((d) => typeof d == 'string' ? new Date(new Date(d).setMinutes(0, 0, 0)).toISOString() : new Date(d.setMinutes(0, 0, 0)).toISOString()),
    chartData
  )
  console.log(chartData)
  if (typeof result == 'string') {
    warningMessage.value = result
    showWarning.value = true
    return
  }
  simulation_result.value = result
  if (simulation_result.value && simulation_result.value.liquidityInfo) {

    yearOptions.value = Object.keys(simulation_result.value['yearlyResults']).sort()
    console.log(simulation_result.value)
    selectedYear.value = yearOptions.value[0]
    results.value = simulation_result.value['yearlyResults'][selectedYear.value]
    parameters.value = simulation_result.value['parameters']
    // filtersOptions.value = simulation_result.value.profitsInfo
    filtersOptions.value = [
      {
        label: 'Total Profits (USD)',
        options: [
          {
            title: 'BTC',
            data: '$7.34'
          },
          {
            title: 'ETH',
            data: '$0'
          }
        ]
      },{
        label: 'Average Liquidity',
        options: [
          {
            title: 'BTC',
            data: '$7.34'
          },
          {
            title: 'ETH',
            data: '$0'
          }
        ]
      },{
        label: 'Final Pool Liquidity',
        options: [
          {
            title: 'BTC',
            data: '0 BTC'
          },
          {
            title: 'ETH',
            data: '0 ETH'
          }
        ]
      },{
        label: 'APR YOY',
        options: [
          {
            data: '56.7%'
          },
        ]
      },{
        label: 'Total Profits EOY (USD)',
        options: [
          {
            title: 'BTC',
            data: '$7.34'
          },
          {
            title: 'ETH',
            data: '$0'
          }
        ]
      },{
        label: 'BTC/USDC Profit',
        options: [
          {
            title: 'BTC',
            data: '0 BTC'
          },
          {
            title: 'ETH',
            data: '0 ETH'
          }
        ]
      },{
        label: 'Capital Gains',
        options: [
          {
            data: '$7.34'
          },
        ]
      },{
        label: 'Profit Loss',
        options: [
          {
            data: '14.7%'
          },

        ]
      },{
        label: 'ROI YOY',
        options: [
          {
            title: 'ETH',
            data: '25.8%'
          }
        ]
      },
    ]
    console.log(filtersOptions.value)
    filtersSelected.value = filtersOptions.value.map(p => p.options[0])
    console.log(filtersSelected.value)
  }
}
function clearData() {
  simulation_result.value = {}
  results.value = []
}
</script>

<style lang="sass">
.main_card
  width: 50%
  @media (max-width: 1200px)
    width: 100%
  &_full
    width: 100%
.multiselect__select
  display: none !important
.assets
  border-radius: 20px
  border: 1px solid rgba(163, 164, 165, 0.20)
  width: 100%
  //@media all and (max-width: 1200px)
  //  width: 100%

  &-select
    padding: 16px 27px

    &__list
      display: flex
      justify-content: space-between
      flex-wrap: wrap
  &__title
    font-weight: 500
    margin-bottom: 4px
    color: #fff
    font-size: clamp(12px, 0.8vw, 14px)
  &__button
    color: #fff
    font-size: 20px
    text-align: center
    padding: 10px 0
    width: 250px
    display: inline-block
    border-radius: 20px
    background: linear-gradient(89deg, rgba(1, 180, 126, 0.60) 5.07%, rgba(126, 246, 178, 0.60) 99.37%)
    cursor: pointer
    &:hover
      background: #01B47E
      box-shadow: 0px 12px 24px 0px rgba(#01B47E, 0.20), 0px 4px 8px 0px rgba(#01B47E, 0.30)
.chart
  display: flex
  flex-direction: column
  align-items: flex-start
  width: 100%


.results
  &-wrapper
    display: flex
    flex-wrap: wrap
    justify-content: space-between
    align-items: flex-start
    margin-bottom: 100px

  &-data
    display: flex
    justify-content: space-between
    width: 43%
    flex-wrap: wrap
    @media all and (max-width: 1500px)
      width: 35%
    @media all and (max-width: 1199px)
      width: 100%
      margin-top: 20px

    &__wrapper
      display: flex
      flex-direction: column
      justify-content: space-between
      color: #ffffff
      border-radius: 20px
      border: 0.2px solid rgba(163, 164, 165, 0.40)
      padding: 30px 24px 20px 24px
      width: 48%
      @media all and (max-width: 1500px)
        width: 100%
        margin-bottom: 20px

    &__header
      padding-bottom: 24px
      border-bottom: 1px solid rgba(163, 164, 165, 0.40)
      margin-bottom: 28px

    &__el
      display: flex
      align-items: center
      justify-content: space-between
      margin-bottom: 14px
      height: 30px

      &:last-child
        margin-bottom: 0

    &__title
      font-size: 12px
      margin-right: 6px

    &__param
      max-width: 50%
      font-size: 14px
      font-weight: 600
      text-align: end

    &__value
      font-size: 18px
      font-weight: 700
      @media all and (max-width: 1500px)
        font-size: 14px

    &__button
      font-size: 18px
      margin-top: 15px

</style>
