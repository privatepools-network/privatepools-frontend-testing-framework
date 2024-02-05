<template>
  <CContainer>
    <CRow class="mt-5 d-flex">
      <CRow class="d-flex align-items-center text-white fs-4">
        <CAvatar :src="Funds" size="lg" />
        Funds
      </CRow>
      <CCard style="padding: 0" class="mb-4">
        <CCardBody class="p-4">
          <CTable borderless>
            <CTableHead>
              <CTableRow class="text-white card-row text-end">
                <CTableHeaderCell scope="col" class="text-start">Token</CTableHeaderCell>
                <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                <CTableHeaderCell scope="col">USD Value</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="(fund, i) in fundList" :key="i" class="border-bottom border-bottom-light text-end">
                <CTableHeaderCell scope="row" class="text-white py-3 text-start">
                  <CAvatar :src="fund.icon" size="md" /> {{ fund.token }}
                </CTableHeaderCell>
                <CTableDataCell class="py-3">
                  <div class="text-white">${{ fund.price }}</div>
                </CTableDataCell>
                <CTableDataCell class="py-3">
                  <div class="d-flex flex-column">
                    <div class="text-white">{{ fund.Amount }}</div>
                  </div>
                </CTableDataCell>
                <CTableDataCell class="py-3">
                  <span class="text-white"> ${{ fund.usd }} </span>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
            <CTableHead>
              <CTableRow>
                <CTableDataCell></CTableDataCell>
                <CTableDataCell></CTableDataCell>
                <CTableDataCell></CTableDataCell>
                <CTableDataCell class="text-end">
                  <div class="text-secondary text-decoration-underline" style="cursor: pointer">
                    Show all
                    <CAvatar :src="Down" style="width: 12px" />
                  </div>
                </CTableDataCell>
              </CTableRow>
            </CTableHead>
          </CTable>
        </CCardBody>
      </CCard>
    </CRow>
  </CContainer>
</template>

<script>
import { CAvatar, CCardBody, CContainer } from '@coreui/vue'
import Pool from '@/assets/images/pool.png'
import Arbitrum from '@/assets/images/networks/arbitrum.png'
// import Avalanche from '@/assets/images/networks/avalanche.png'
// import Optimism from '@/assets/images/networks/optimism.png'
import Ethereum from '@/assets/images/networks/ethereum.png'
// import Binance from '@/assets/images/networks/binance.png'
// import Gnosis from '@/assets/images/networks/gnosis.png'
// import Fantom from '@/assets/images/networks/fantom.png'
// import Polygon from '@/assets/images/networks/polygon.png'
import Bot from '@/assets/images/protocols/bot.png'
import Gmx from '@/assets/images/protocols/gmx.png'
import GmxLogo from '@/assets/images/networks/gmx.png'
import Href from '@/assets/images/href.png'
// import Spooky from '@/assets/images/protocols/spooky.png'
// import Convex from '@/assets/images/protocols/convex.png'
// import Biconomy from '@/assets/images/protocols/biconomy.png'
import Uniswap from '@/assets/images/protocols/uniswap.png'
import Search from '@/assets/images/search.png'
import Funds from '@/assets/images/funds.png'
import Down from '@/assets/images/down.png'
import Usdc from '@/assets/images/tokens/usdc.png'
import Usdt from '@/assets/images/tokens/usdt.png'
import Btc from '@/assets/images/tokens/btc.png'
import Ether from '@/assets/images/tokens/ether.png'

export default {
  name: 'Funds',
  components: { CContainer, CCardBody, CAvatar },
  setup() {
    const networks = [
      {
        title: 'Assets on Arbitrum',
        amount: '4,810,362',
        percent: '99%',
        icon: Arbitrum,
      },
      // {
      //   title: 'Assets on Avalanche',
      //   amount: '27,875',
      //   percent: '1%',
      //   icon: Avalanche,
      // },
      // {
      //   title: 'Assets on Optimism',
      //   amount: '27,875',
      //   percent: '1%',
      //   icon: Optimism,
      // },
      // {
      //   title: 'Assets on Ethereum',
      //   amount: '11,426',
      //   percent: '0%',
      //   icon: Ethereum,
      // },
      // {
      //   title: 'Assets on BNB Chain',
      //   amount: '1,719',
      //   percent: '0%',
      //   icon: Binance,
      // },
      // {
      //   title: 'Assets on Gnosis Chain',
      //   amount: '0',
      //   percent: '0%',
      //   icon: Gnosis,
      // },
      // {
      //   title: 'Assets on Polygon',
      //   amount: '0',
      //   percent: '0%',
      //   icon: Polygon,
      // },
      // {
      //   title: 'Assets on Fantom',
      //   amount: '0',
      //   percent: '0%',
      //   icon: Fantom,
      // },
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
      // {
      //   title: 'Convex',
      //   amount: '3,660,803',
      //   icon: Convex,
      // },
      // {
      //   title: 'SpookySwap',
      //   amount: '3,660',
      //   icon: Spooky,
      // },
      // {
      //   title: 'Biconomy',
      //   amount: '3,660',
      //   icon: Biconomy,
      // },
      // {
      //   title: 'GMX',
      //   amount: '1,188,352',
      //   icon: Gmx,
      // },
      // {
      //   title: 'Convex',
      //   amount: '3,660,803',
      //   icon: Convex,
      // },
    ]
    const fundList = [
      {
        token: 'USDC',
        icon: Usdc,
        price: 0.9994,
        Amount: '3,433,021',
        usd: '3,555,855',
      },
      {
        token: 'WBTC',
        icon: Btc,
        price: 29452,
        Amount: '3,021',
        usd: '43,555,855',
      },
      {
        token: 'USDT',
        icon: Usdt,
        price: 1,
        Amount: '3,021',
        usd: '55,855',
      },
      {
        token: 'Ether',
        icon: Ether,
        price: 1526,
        Amount: '3,433,021',
        usd: '3,555,855',
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
      Funds,
      fundList,
      Down,
    }
  },
}
</script>
