<template>
  <div class="new-tokens-container">
    <!-- <div class="new-tokens-headers">
      <div>Symbol</div>
      <div>Name</div>
      <div>Weight</div>
      <div>Balance</div>
      <div>Value</div>
    </div>
    <div class="d-flex flex-column gap-2">
      <div
        v-for="(token, poolTokenIndex) in tokens"
        :key="`pool-new-token-${poolTokenIndex}`"
        class="new-tokens-body"
      >
        <div class="table-row">{{ token.symbol }}</div>
        <div class="table-row">{{ token.name }}</div>
        <div class="table-row">{{ token.weight }}</div>
        <div class="table-row">{{ token.balance }}</div>
        <div class="table-row">0</div>
      </div>
    </div> -->

    <div class="table-container">
      <div class="table-row">
        <div class="row-item-heading">Symbol</div>
        <div class="row-item-heading">Name</div>
        <div class="row-item-heading">Weight</div>
        <div class="row-item-heading">Balance</div>
        <div class="row-item-heading">Value</div>
      </div>
      <div class="d-flex flex-column gap-1">
        <div class="table-row new-tokens-body" v-for="(token, poolTokenIndex) in tokens"
          :key="`pool-new-token-${poolTokenIndex}`">
          <div class="row-item">
            <div class="d-flex align-items-baseline gap-2">
              <div><img :src="computedTokenImage(token)" width="30" /></div>
              <div>{{ token.symbol }}</div>
              <a target="_blank" :href="trackCurrentNetwork.name === 'arbitrum'
                ? `${process.env.VUE_APP_EXPLORER_ARBITRUM}/token/${token.address}`
                : trackCurrentNetwork.name === 'bnb'
                  ? `${process.env.VUE_APP_EXPLORER_BINANCE}/token/${token.address}`
                  : trackCurrentNetwork.name === 'matic'
                    ? `${process.env.VUE_APP_EXPLORER_POLYGON}/token/${token.address}`
                    : process.env.VUE_APP_EXPLORER_ARBITRUM">
                <svg width="13" height="13" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_2305_87191)">
                    <path
                      d="M11.3594 7.58333V11.0833C11.3594 11.3928 11.2365 11.6895 11.0177 11.9083C10.7989 12.1271 10.5021 12.25 10.1927 12.25H3.77604C3.46662 12.25 3.16988 12.1271 2.95108 11.9083C2.73229 11.6895 2.60938 11.3928 2.60938 11.0833V4.66667C2.60938 4.35725 2.73229 4.0605 2.95108 3.84171C3.16988 3.62292 3.46662 3.5 3.77604 3.5H7.27604"
                      stroke="#00C9FF" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M9.60938 1.75H13.1094V5.25" stroke="#00C9FF" stroke-width="1.16667" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M6.69287 8.16667L13.1095 1.75" stroke="#00C9FF" stroke-width="1.16667" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2305_87191">
                      <rect width="14" height="14" fill="white" transform="translate(0.859375)" />
                    </clipPath>
                  </defs>
                </svg>
              </a>
            </div>
          </div>
          <div class="row-item">{{ token.name }}</div>
          <div class="row-item">
            <CProgress class="w-75">
              <CProgressBar color="success" :value="Number(token.weight)">{{ token.weight }}%</CProgressBar>
            </CProgress>
          </div>
          <div class="row-item">{{ Number(token?.balance).toFixed(2) }}</div>
          <div class="row-item">

            ${{ ((cryptoComparePrices[token.address] ? cryptoComparePrices[token.address] : 0) * token.balance).toFixed(2)
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import computedTokenImage from '@/composables/useComputedTokenImage'
defineProps(['tokens', 'tokenPrices', 'cryptoComparePrices'])
import { useStore } from 'vuex'



const store = useStore()

const trackCurrentNetwork = computed(() => {
  return store.getters.getCurrentNetwork
})

</script>
<style lang="scss">
.new-tokens-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #181c1f;
  border: 1px solid rgba(1, 180, 126, 0.35);
  border-radius: 5px;
  padding-top: 15px;
  padding-bottom: 15px;
}

.table-container {
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  margin: 0 auto;
  border-radius: 4px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.08);
}

.table-row {
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
}

.row-item-heading {
  display: flex;
  color: rgba(195, 197, 233, 1);
  font-weight: 700;
  flex: 1;
  font-size: 14px;
  padding: 8px 0;
  justify-content: start;
  align-items: center;
  transition: all 0.15s ease-in-out;
}

.row-item {
  display: flex;
  background-color: rgba(59, 97, 65, 0.06);
  color: rgba(193, 193, 209, 1);
  flex: 1;
  font-size: 14px;
  padding: 4px 0;
  justify-content: start;
  align-items: center;
  transition: all 0.15s ease-in-out;
}

/* .row-item:hover {
  cursor: pointer;
  background-color: #F0F0F0;
} */
</style>
