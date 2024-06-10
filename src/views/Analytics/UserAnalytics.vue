<template>
  <MainCard>
    <SpecificTopPortfolio v-if="specificTopPortfolioOpen" @changeToSpecificPortfolio="changeToSpecificPortfolio"
      :allPortfolios="allPortfolios" :selectedAddress="selectedAddress" />
    <div v-else>
      <div class="my-3 text-black dark:!text-white text-[20px] font-bold">
        Users Analytics
      </div>

      <!-- <div class="track_info_container">
        <GeneralBotCard
          :currencySelected="currencySelected"
          :chainSelected="chainSelected"
          :allTableData="allPoolsTableData"
          :tokensData="tokensData"
          :poolSwapsData="poolSwapsData"
        />
        <TrackingInfoChart
          :historicalPrices="historicalPrices"
          :chartData="chartData"
          :chainSelected="chainSelected"
          :tokensData="tokensData"
          :symbol="currencySymbol"
        />
      </div> -->

      <div class="mt-5 mb-3 text-black dark:!text-white text-[18px] font-bold">
        Top Portfolios
      </div>
      <UserAnalyticsPortfoliosTable :allPortfolios="allPortfolios"
        @changeToSpecificPortfolio="changeToSpecificPortfolio" />

      <div class="mt-5 mb-3 flex items-center gap-1 text-black dark:!text-white text-[18px] font-bold">
        Top Referrals
        <svg @click="router.push('/referrals')" style="cursor: pointer" width="11" height="11" viewBox="0 0 16 16"
          fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_463_87)">
            <mask id="mask0_463_87" style="mask-type: luminance" maskUnits="userSpaceOnUse" x="0" y="-1" width="16"
              height="16">
              <path d="M16 -1H0V15H16V-1Z" fill="white" />
            </mask>
            <g mask="url(#mask0_463_87)">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M0.598864 15C0.147435 14.8583 -0.00113632 14.5394 6.53456e-06 14.0811C0.00800654 10.3131 0.00457796 6.54399 0.00457796 2.77484C0.00457796 2.19199 0.282292 1.91199 0.862864 1.91199H7.92229C8.32915 1.91199 8.60229 2.10399 8.70058 2.4537C8.81486 2.85827 8.54172 3.28799 8.12686 3.35084C8.03544 3.36456 7.94058 3.36913 7.84801 3.36913C5.78058 3.36913 3.71429 3.37142 1.64801 3.36684C1.50058 3.36684 1.45601 3.39656 1.45601 3.55199C1.46058 6.82056 1.46058 10.0903 1.45601 13.36C1.45601 13.5108 1.49486 13.5497 1.64572 13.5486C4.91429 13.544 8.18286 13.544 11.4526 13.5486C11.608 13.5486 11.6389 13.5028 11.6389 13.3577C11.6343 11.2754 11.6354 9.1931 11.6354 7.11084C11.6354 6.71084 11.7989 6.43999 12.1063 6.32456C12.5463 6.1577 13.016 6.43884 13.0834 6.91199C13.0949 6.98856 13.0926 7.06742 13.0926 7.14513C13.0926 9.4571 13.0869 11.768 13.0971 14.0788C13.0994 14.536 12.9509 14.856 12.5006 15H0.598864Z"
                fill="#B9B9B9" />
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M16.0035 5.69028C15.9486 5.79542 15.9178 5.91085 15.8389 6.00457C15.7477 6.11595 15.6256 6.19792 15.4879 6.2402C15.3503 6.28249 15.2032 6.28321 15.0652 6.24228C14.9299 6.20169 14.8097 6.12177 14.72 6.01269C14.6302 5.90361 14.575 5.77029 14.5612 5.62971C14.553 5.54692 14.5492 5.46376 14.5498 5.38057L14.5486 1.70971V1.53028C14.4675 1.54514 14.4355 1.60228 14.3955 1.64342C11.9791 4.05673 9.56382 6.4712 7.14976 8.88685C6.93947 9.0983 6.70862 9.2309 6.3989 9.1634C6.2789 9.1378 6.16741 9.0821 6.07498 9.0014C5.98255 8.92066 5.91224 8.81771 5.8707 8.70225C5.82917 8.5868 5.81777 8.46265 5.83761 8.34157C5.85744 8.22048 5.90784 8.10645 5.98405 8.01028C6.03547 7.94514 6.0949 7.88685 6.15319 7.82743L13.3532 0.62742C13.3966 0.58514 13.4538 0.55428 13.5246 0.504C13.4218 0.44685 13.3589 0.46057 13.3006 0.46057L9.58405 0.45942C9.43824 0.46866 9.29222 0.44523 9.15662 0.39085C9.01114 0.32411 8.89206 0.2108 8.81817 0.06882C8.74428 -0.073158 8.71981 -0.235707 8.74862 -0.393147C8.77528 -0.551026 8.85381 -0.695513 8.97179 -0.803762C9.08977 -0.912012 9.24046 -0.977848 9.40005 -0.990861C9.46176 -0.996576 9.52576 -0.995433 9.58747 -0.995433C11.4195 -0.995433 13.2515 -0.988575 15.0846 -1C15.5418 -1.00343 15.8618 -0.852576 16.0035 -0.401147V5.69028Z"
                fill="#B9B9B9" />
            </g>
          </g>
          <defs>
            <clipPath id="clip0_463_87">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <TopReferralsPortfolioTable />
    </div>
  </MainCard>
</template>

<script setup>
import MainCard from '@/UI/MainCard.vue'
import { ref, onMounted } from 'vue'

import UserAnalyticsPortfoliosTable from '@/components/General/UserAnalyticsPortfoliosTable.vue'
import SpecificTopPortfolio from './SpecificTopPortfolio.vue'
import TopReferralsPortfolioTable from '@/components/General/TopReferralsPortfolioTable.vue'
import router from '@/router'
import { getTopPortfolios } from "@/composables/data/topPortfoliosData"

const allPortfolios = ref([])
const selectedAddress = ref("")
const specificTopPortfolioOpen = ref(false)


function changeToSpecificPortfolio(wallet) {
  selectedAddress.value = wallet
  console.log("ADDRESS - ", selectedAddress.value)
  specificTopPortfolioOpen.value = !specificTopPortfolioOpen.value
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  })
}

onMounted(async () => {
  allPortfolios.value = await getTopPortfolios()
})


</script>
<style lang="scss">
@import '@/styles/_variables.scss';

.track_info_container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  /* gap: 10px; */
}

@media (min-width: $xl) {
  .track_info_container {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    /* gap: 15px; */
  }
}
</style>
