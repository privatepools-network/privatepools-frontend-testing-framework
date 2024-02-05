<template>
  <CContainer>
    <CRow class="mb-5">
      <CCard class="border-gradient text-white py-4 px-2">
        This is a graph area
      </CCard>
    </CRow>
    <CRow>
      <div class="d-flex justify-content-between py-2">
        <div class="text-secondary">
          Data updated
          <span class="text-success"> 1 min </span>
          ago
          <CIcon icon="cil-loop-circular" class="ms-1" />
        </div>

        <CFormSelect size="sm" class="mb-3 border border-success" style="width: 140px">
          <option>All Chain</option>
          <option>BitCoin</option>
          <option>Ethereum</option>
          <option>Polygon</option>
        </CFormSelect>
      </div>
      <CCard>
        <CCardBody>
          <div class="d-flex flex-wrap justify-content-start">
            <div class="d-flex my-4 align-items-center me-4" v-for="(network, i) in networks" :key="i">
              <CAvatar :src="network.icon" class="me-2" />
              <div class="d-flex flex-column">
                <div class="text-white">{{ network.title }}</div>
                <div class="text-white">
                  <span class="fs-5"> ${{ network.amount }} </span>
                  <span>&nbsp; {{ network.percent }} </span>
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex flex-wrap justify-content-start my-4">
            <div class="d-flex align-items-center py-2 px-4 card-row me-2 mt-1" v-for="(protocol, i) in protocols"
              :key="i">
              <CAvatar :src="protocol.icon" class="me-2" />
              <div class="d-flex flex-column">
                <div class="text-white">{{ protocol.title }}</div>
                <div class="text-white">
                  <span class="fs-6"> ${{ protocol.amount }} </span>
                </div>
              </div>
            </div>
          </div>
        </CCardBody>
      </CCard>
    </CRow>
    <CRow class="mt-5 d-flex">
      <CRow class="text-white d-flex align-items-center fs-4">
        <CAvatar :src="Pool" size="md" />
        Pools
      </CRow>
      <CRow class="d-flex align-items-center text-white fs-4">
        <CAvatar :src="GmxLogo" size="xl" />
        GMX
      </CRow>
      <CCard style="padding: 0" class="mb-4">
        <label class="pool-label">Perpetuals</label>
        <CCardBody class="p-4">
          <CTable borderless>
            <CTableHead>
              <CTableRow class="text-white card-row">
                <CTableHeaderCell scope="col">Currency Pair</CTableHeaderCell>
                <CTableHeaderCell scope="col">Side</CTableHeaderCell>
                <CTableHeaderCell scope="col">Leverage</CTableHeaderCell>
                <CTableHeaderCell scope="col">Margin</CTableHeaderCell>
                <CTableHeaderCell scope="col">P&L</CTableHeaderCell>
                <CTableHeaderCell scope="col">USD Value</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="i in 1" :key="i">
                <CTableHeaderCell scope="row" class="text-white">
                  <CAvatar :src="Ethereum" size="sm" /> WETH/USDC
                </CTableHeaderCell>
                <CTableDataCell>
                  <div class="d-flex align-items-center text-white">Short</div>
                </CTableDataCell>
                <CTableDataCell>
                  <div class="d-flex flex-column">
                    <div class="text-white">14.94x</div>
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  <span class="text-white"> 602,910.55 USDC </span>
                </CTableDataCell>
                <CTableDataCell>
                  <span class="text-white"> $25,224.04 </span>
                </CTableDataCell>
                <CTableDataCell>
                  <span class="text-white"> $638,335.49 </span>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
      <CCard style="padding: 0" class="mb-4">
        <label class="pool-label">Perpetuals</label>
        <CCardBody class="p-4">
          <CTable borderless>
            <CTableHead>
              <CTableRow class="text-white card-row">
                <CTableHeaderCell scope="col">Currency Pair</CTableHeaderCell>
                <CTableHeaderCell scope="col">Side</CTableHeaderCell>
                <CTableHeaderCell scope="col">Leverage</CTableHeaderCell>
                <CTableHeaderCell scope="col">Margin</CTableHeaderCell>
                <CTableHeaderCell scope="col">P&L</CTableHeaderCell>
                <CTableHeaderCell scope="col">USD Value</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="i in 2" :key="i">
                <CTableHeaderCell scope="row" class="text-white">
                  <CAvatar :src="Ethereum" size="sm" /> WETH/USDC
                </CTableHeaderCell>
                <CTableDataCell>
                  <div class="d-flex align-items-center text-white">Short</div>
                </CTableDataCell>
                <CTableDataCell>
                  <div class="d-flex flex-column">
                    <div class="text-white">14.94x</div>
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  <span class="text-white"> 602,910.55 USDC </span>
                </CTableDataCell>
                <CTableDataCell>
                  <span class="text-white"> $25,224.04 </span>
                </CTableDataCell>
                <CTableDataCell>
                  <span class="text-white"> $638,335.49 </span>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CRow>
  </CContainer>
</template>

<script>
import CIcon from '@coreui/icons-vue'
import { CAvatar, CCardBody, CContainer } from '@coreui/vue'
import Pool from '@/assets/images/pool.png'
import Arbitrum from '@/assets/images/networks/arbitrum.png'
import Avalanche from '@/assets/images/networks/avalanche.png'
import Optimism from '@/assets/images/networks/optimism.png'
import Ethereum from '@/assets/images/networks/ethereum.png'
import Binance from '@/assets/images/networks/binance.png'
import Gnosis from '@/assets/images/networks/gnosis.png'
import Fantom from '@/assets/images/networks/fantom.png'
import Polygon from '@/assets/images/networks/polygon.png'
import Bot from '@/assets/images/protocols/bot.png'
import Gmx from '@/assets/images/protocols/gmx.png'
import GmxLogo from '@/assets/images/networks/gmx.png'
import Href from '@/assets/images/href.png'
import Spooky from '@/assets/images/protocols/spooky.png'
import Convex from '@/assets/images/protocols/convex.png'
import Biconomy from '@/assets/images/protocols/biconomy.png'
import Uniswap from '@/assets/images/protocols/uniswap.png'
import Search from '@/assets/images/search.png'

export default {
  name: 'Trades',
  components: { CContainer, CCardBody, CIcon, CAvatar },
  setup() {
    const networks = [
      {
        title: 'Assets on Arbitrum',
        amount: '4,810,362',
        percent: '99%',
        icon: Arbitrum,
      },
      {
        title: 'Assets on Avalanche',
        amount: '27,875',
        percent: '1%',
        icon: Avalanche,
      },
      {
        title: 'Assets on Optimism',
        amount: '27,875',
        percent: '1%',
        icon: Optimism,
      },
      {
        title: 'Assets on Ethereum',
        amount: '11,426',
        percent: '0%',
        icon: Ethereum,
      },
      {
        title: 'Assets on BNB Chain',
        amount: '1,719',
        percent: '0%',
        icon: Binance,
      },
      {
        title: 'Assets on Gnosis Chain',
        amount: '0',
        percent: '0%',
        icon: Gnosis,
      },
      {
        title: 'Assets on Polygon',
        amount: '0',
        percent: '0%',
        icon: Polygon,
      },
      {
        title: 'Assets on Fantom',
        amount: '0',
        percent: '0%',
        icon: Fantom,
      },
    ]
    const protocols = [
      {
        title: 'Funds',
        amount: '3,660,803',
        icon: Bot,
      },
      {
        title: 'GMX',
        amount: '1,188,352',
        icon: Gmx,
      },
      {
        title: 'Convex',
        amount: '3,660,803',
        icon: Convex,
      },
      {
        title: 'SpookySwap',
        amount: '3,660',
        icon: Spooky,
      },
      {
        title: 'Biconomy',
        amount: '3,660',
        icon: Biconomy,
      },
      {
        title: 'GMX',
        amount: '1,188,352',
        icon: Gmx,
      },
      {
        title: 'Convex',
        amount: '3,660,803',
        icon: Convex,
      },
    ]
    return {
      Pool,
      networks,
      protocols,
      Ethereum,
      Uniswap,
      Search,
      GmxLogo,
      Href,
    }
  },
}
</script>
