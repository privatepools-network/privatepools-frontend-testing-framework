<template>
  <div>
    <CRow>
      <div style="width: 600px">
        <div class="d-flex justify-content-start">
          <span class="text-white fs-5 fw-semibold me-2">
            Available Funds
          </span>
          <CInputGroup
            class="mb-3 border border-success rounded-pill"
            style="width: 300px"
          >
            <CInputGroupText
              component="label"
              class="text-white border-top-0 rounded-end rounded-pill border-bottom-0 border-start-0"
              style="background-color: #22282c"
            >
              <img :src="BinanceLabel" />
            </CInputGroupText>
            <CFormSelect
              class="border-0 border text-white rounded-pill rounded-start"
              style="border-left: 1px solid #00C9FF !important"
              @change="handleSelectChange"
            >
              <option :value="Network.ARBITRUM">Arbitrum</option>
              <option :value="Network.MAINNET">Ethereum</option>
              <option :value="Network.FANTOM">Fantom</option>
            </CFormSelect>
          </CInputGroup>
        </div>
        <CCard
          class="mb-4 mt-2 d-flex flex-row justify-content-around"
          color="primary border-gradient"
        >
          <CCardBody>
            <CRow>
              <template v-if="displayTokens.length">
                <CCol
                  :xs="6"
                  :md="4"
                  v-for="(token, i) in displayTokens"
                  :key="i"
                  class="mb-2"
                >
                  <div class="d-flex align-items-center">
                    <CAvatar :src="token.logoURI" class="me-2" />
                    <span class="text-white ms-1">{{ token.name }}: </span>
                    <span class="text-success">&nbsp; {{ token.amount }}</span>
                  </div>
                </CCol>
              </template>
              <template v-else>
                <CCol :md="12" class="text-white text-center"
                  >There is no data</CCol
                >
              </template>
            </CRow>
          </CCardBody>
        </CCard>
      </div>
    </CRow>
    <CRow class="mb-5">
      <CCol :md="12">
        <span class="text-white fs-4">Funds Overview</span>
        <CCard style="border-radius: 0" class="mt-2">
          <CCardBody>
            <div class="d-flex justify-content-end">
              <select
                class="float-right text-white bg-success rounded border-0 py-1 px-2 fs-7"
              >
                <option value="">today</option>
                <option value="">last week</option>
                <option value="">last month</option>
              </select>
            </div>
            <div id="chart"></div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CRow class="mb-5">
      <CCol :md="12" class="mt-4">
        <span class="text-white fs-4">Manage Funds</span>
        <CCard class="mb-4 mt-2">
          <CCardBody>
            <CTable striped responsive borderless>
              <CTableHead color="transparent">
                <CTableRow>
                  <CTableHeaderCell class="text-left text-white"
                    >Coin</CTableHeaderCell
                  >
                  <CTableHeaderCell class="text-left text-white"
                    >Name</CTableHeaderCell
                  >
                  <CTableHeaderCell class="text-left text-white"
                    >Total Balance</CTableHeaderCell
                  >
                  <CTableHeaderCell class="text-left text-white"
                    >Availible Balance</CTableHeaderCell
                  >
                  <CTableHeaderCell class="text-left text-white"
                    >In Order</CTableHeaderCell
                  >
                </CTableRow>
              </CTableHead>
              <CTableBody class="text-white mt-2">
                <CTableRow v-for="item in tableExample" :key="item.name">
                  <CTableDataCell
                    class="d-flex justify-content-start align-items-center"
                  >
                    <CAvatar
                      :src="item.token.icon"
                      style="width: 20px; height: 20px"
                      class="me-2"
                    />
                    <div>{{ item.token.symbol }}</div>
                  </CTableDataCell>
                  <CTableDataCell class="text-left">
                    <div>{{ item.token.name }}</div>
                  </CTableDataCell>
                  <CTableDataCell class="text-left">
                    {{ item.totalBalance }}
                  </CTableDataCell>
                  <CTableDataCell class="text-left text-success">
                    {{ item.availibleBalance }}
                  </CTableDataCell>
                  <CTableDataCell class="text-left text-warning">
                    {{ item.inOrder }}
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import Ether from '@/assets/images/tokens/ether.png'
import Usdc from '@/assets/images/tokens/usdc.png'
import Btc from '@/assets/images/bitcoin.png'
import Avalanche from '@/assets/images/networks/avalanche.png'
import BinanceLabel from '@/assets/images/labels/binance.png'
import Arbitrum from '@/assets/images/networks/arbitrum.png'
import Ethereum from '@/assets/images/networks/ethereum.png'
import Polygon from '@/assets/images/networks/polygon.png'
import Binance from '@/assets/images/networks/binance.png'
// import Fieldset from 'primevue/fieldset'
import { CCardBody, CRow } from '@coreui/vue'
import { Network } from '@/composables/useNetwork'
import config from '@/lib/config'
import { getJsonRpcProvider } from '@/composables/useProvider'
import useBalance from '@/composables/useBalance'
import useTokenPrice from '@/composables/useTokenPrice'
import useEthBalance from '@/composables/useEthBalance'
import { getNativeTokenPrices } from '@/composables/useTokenPrice'
import ApexCharts from 'apexcharts'

export default {
  name: 'Funds',
  components: {
    CRow,
    CCardBody,
  },
  data() {
    return {
      tokens: {
        [Network.ARBITRUM]: [],
        [Network.MAINNET]: [],
        [Network.FANTOM]: [],
      },
      nativeTokenPrices: {
        [Network.ARBITRUM]: 0.0,
        [Network.MAINNET]: 0.0,
        [Network.FANTOM]: 0.0,
      },
      selectedOption: 0,
      displayTokens: [],
    }
  },
  methods: {
    async getBalance(networkId) {
      const provider = getJsonRpcProvider(networkId)
      const tokenKeys = Object.keys(config[networkId].tokens)

      for (const key of tokenKeys) {
        useBalance(
          config[networkId].tokens[key]['address'],
          provider,
          config['userWallet'],
        ).then(
          (balance) =>
            useTokenPrice(config[networkId].tokens[key]['apiId'], 'usd')
              .then((price) => {
                if (balance > 0)
                  this.tokens[networkId].push({
                    name: config[networkId].tokens[key]['name'],
                    amount: (balance * price).toFixed(2),
                    logoURI: config[networkId].tokens[key]['logoURI'],
                  })

                return balance * price
              })
              .catch(() => 0), // Handle error if fetching token price fails
        )
      }

      const ethBalancePromise = useEthBalance(provider, config['userWallet'])

      const [ethBalance] = await Promise.all([ethBalancePromise])

      if (ethBalance > 0)
        this.tokens[networkId].push({
          name: config[networkId]['nativeAsset']['name'],
          amount: (ethBalance * this.nativeTokenPrices[networkId]).toFixed(2),
          logoURI: config[networkId]['nativeAsset']['logoURI'],
        })
    },
    handleSelectChange(e) {
      this.selectedOption = parseInt(e.target.value)
      this.displayTokens = this.tokens[this.selectedOption]
    },
    handleAsset(networkId) {
      if (networkId !== 0) this.displayTokens = this.tokens[networkId]
    },
  },
  setup() {
    const tableExample = [
      {
        token: {
          name: 'Ethereum',
          symbol: 'ETH',
          icon: Ethereum,
        },
        totalBalance: '0.00000000',
        availibleBalance: '0.00000000',
        inOrder: '0.00000000',
      },
      {
        token: {
          name: 'Bitcoin',
          symbol: 'BTC',
          icon: Btc,
        },
        totalBalance: '0.00000000',
        availibleBalance: '0.00000000',
        inOrder: '0.00000000',
      },
      {
        token: {
          name: 'Avalanche',
          symbol: 'AVAX',
          icon: Avalanche,
        },
        totalBalance: '0.00000000',
        availibleBalance: '0.00000000',
        inOrder: '0.00000000',
      },
      {
        token: {
          name: 'Binance',
          symbol: 'BNB',
          icon: Binance,
        },
        totalBalance: '0.00000000',
        availibleBalance: '0.00000000',
        inOrder: '0.00000000',
      },
      {
        token: {
          name: 'Arbitrum',
          symbol: 'ETH',
          icon: Arbitrum,
        },
        totalBalance: '0.00000000',
        availibleBalance: '0.00000000',
        inOrder: '0.00000000',
      },
      {
        token: {
          name: 'Polygon',
          symbol: 'MATIC',
          icon: Polygon,
        },
        totalBalance: '0.00000000',
        availibleBalance: '0.00000000',
        inOrder: '0.00000000',
      },
    ]

    const funds = [
      {
        img: Btc,
        label: 'Bitcoin',
        value: 3.5648,
      },
      {
        img: Avalanche,
        label: 'AVAX',
        value: 78.2,
      },
      {
        img: Avalanche,
        label: 'AVAX',
        value: 78.2,
      },
      {
        img: Avalanche,
        label: 'AVAX',
        value: 78.2,
      },
      {
        img: Ethereum,
        label: 'Ether',
        value: 12,
      },
      {
        img: Polygon,
        label: 'MATIC',
        value: 78.2,
      },
      {
        img: Binance,
        label: 'BNB',
        value: 78.2,
      },
    ]

    return {
      tableExample,
      Ether,
      Btc,
      Usdc,
      funds,
      Network,
      BinanceLabel,
    }
  },
  async mounted() {
    const series = [
      {
        name: 'wBTC',
        data: [
          44, 55, 41, 67, 22, 43, 21, 49, 44, 55, 41, 67, 22, 43, 21, 44, 55,
          41, 67, 22, 43, 21, 49, 44, 55, 41, 67, 22, 43, 21,
        ],
      },
      {
        name: 'wETH',
        data: [
          44, 55, 41, 67, 22, 43, 21, 49, 44, 55, 41, 67, 22, 43, 21, 44, 55,
          41, 67, 22, 43, 21, 49, 44, 55, 41, 67, 22, 43, 21,
        ],
      },
      {
        name: 'VLX',
        data: [
          44, 55, 41, 67, 22, 43, 21, 49, 44, 55, 41, 67, 22, 43, 21, 44, 55,
          41, 67, 22, 43, 21, 49, 44, 55, 41, 67, 22, 43, 21,
        ],
      },
      {
        name: 'BUSD',
        data: [
          44, 55, 41, 67, 22, 43, 21, 49, 44, 55, 41, 67, 22, 43, 21, 44, 55,
          41, 67, 22, 43, 21, 49, 44, 55, 41, 67, 22, 43, 21,
        ],
      },
    ]

    const chartOptions = {
      grid: {
        borderColor: 'rgba(233, 233, 233, 0.08)',
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      legend: {
        labels: {
          colors: ['#615E83'],
        },
        itemMargin: {
          horizontal: 10,
          vertical: 0,
        },
      },
      xaxis: {
        type: 'category',
        categories: [
          '01.04.23',
          '02.04.23',
          '03.04.23',
          '04.04.23',
          '05.04.23',
          '06.04.23',
          '07.04.23',
          '08.04.23',
          '09.04.23',
          '10.04.23',
          '11.04.23',
          '12.04.23',
          '13.04.23',
          '14.04.23',
          '15.04.23',
          '16.04.23',
          '17.04.23',
          '18.04.23',
          '19.04.23',
          '20.04.23',
          '21.04.23',
          '22.04.23',
          '23.04.23',
          '24.04.23',
          '25.04.23',
          '26.04.23',
          '27.04.23',
          '28.04.23',
          '29.04.23',
          '30.04.23',
        ],
        labels: {
          show: true,
          rotate: '-45',
          rotateAlways: true,
          style: {
            colors: '#FFFFFF',
          },
          offsetX: 5,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#FFFFFF',
          },
        },
      },
      fill: {
        opacity: 1,
        colors: [
          '#F6921A',
          '#2775CA',
          '#27A17C',
          '#8247E5',
          '#627EEA',
          '#E84142',
          '#F9BC2D',
        ],
      },
      series: series,
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 5,
          columnWidth: '20%',
        },
      },
    }

    var chart = new ApexCharts(document.querySelector('#chart'), chartOptions)
    chart.render()

    const [arbitrumPrice, ethPrice, fantomPrice] = await Promise.all([
      getNativeTokenPrices(Network.ARBITRUM),
      getNativeTokenPrices(Network.MAINNET),
      getNativeTokenPrices(Network.FANTOM),
    ])
    this.nativeTokenPrices[Network.ARBITRUM] = arbitrumPrice
    this.nativeTokenPrices[Network.MAINNET] = ethPrice
    this.nativeTokenPrices[Network.FANTOM] = fantomPrice

    await Promise.all([
      this.getBalance(Network.ARBITRUM),
      this.getBalance(Network.MAINNET),
      this.getBalance(Network.FANTOM),
    ])

    this.handleAsset(Network.ARBITRUM)
  },
}
</script>
