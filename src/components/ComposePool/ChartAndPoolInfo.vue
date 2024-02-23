<template>
  <div
    class="total_epoch"
    v-if="router.currentRoute.value.path === '/pools/concentrated_pool'"
  >
    <div>Total Rewards This Epoch:</div>
    <div>0%</div>
  </div>
  <div v-else class="total_epoch">
    <div class="d-flex gap-4">
      <div class="d-flex flex-column">
        <div>LP Rewards</div>
        <div>
          $245.5
          <img
            class="pair_avatars_manage_pool"
            v-for="(tokenEntity, tokenEntityIndex) in ['BTC', 'ETH']"
            :key="`token-entity-key-${tokenEntityIndex}`"
            :title="tokenEntity"
            :src="getTokenEntity(tokenEntity, 'short').icon"
          />
        </div>
      </div>
      <div class="d-flex flex-column">
        <div>LP Rewards</div>
        <div>
          $245.5
          <img
            class="pair_avatars_manage_pool"
            v-for="(tokenEntity, tokenEntityIndex) in ['BTC', 'ETH']"
            :key="`token-entity-key-${tokenEntityIndex}`"
            :title="tokenEntity"
            :src="getTokenEntity(tokenEntity, 'short').icon"
          />
        </div>
      </div>
    </div>
    <div>
      <div class="claim_button">
        Claim Rewards
        <svg
          width="16"
          height="11"
          viewBox="0 0 16 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12.1731 3.19979C11.6779 3.38892 11.2887 3.81683 11.1167 4.36124L10.7957 5.3769C10.7911 5.39239 10.778 5.40282 10.7631 5.40282C10.7483 5.40282 10.7352 5.39239 10.7306 5.3769L10.4097 4.36124C10.2376 3.8168 9.84833 3.38888 9.3531 3.19979L8.42932 2.84699C8.41554 2.84171 8.40628 2.82744 8.40628 2.8114C8.40628 2.79536 8.41554 2.78108 8.42932 2.77581L9.3531 2.42301C9.84833 2.23392 10.2376 1.806 10.4097 1.26156L10.7306 0.245883C10.7352 0.230422 10.7483 0.219971 10.7631 0.219971C10.778 0.219971 10.7911 0.230422 10.7957 0.245883L11.1167 1.26156C11.2887 1.80597 11.6779 2.23388 12.1731 2.42301L13.0969 2.77581C13.1106 2.78108 13.1199 2.79536 13.1199 2.8114C13.1199 2.82744 13.1106 2.84171 13.0969 2.84699L12.1731 3.19979ZM8.11137 6.36879C7.42363 6.63152 6.88309 7.22583 6.64421 7.98197L6.19828 9.39261C6.19173 9.41386 6.1736 9.42811 6.1532 9.42811C6.1328 9.42811 6.11466 9.41386 6.10812 9.39261L5.66218 7.98197C5.42331 7.22583 4.88277 6.63152 4.19503 6.36879L2.91184 5.87881C2.89271 5.87146 2.87988 5.85166 2.87988 5.82935C2.87988 5.80709 2.89271 5.78729 2.91184 5.77994L4.19503 5.28996C4.88278 5.02723 5.42331 4.43293 5.66218 3.6768L6.10812 2.26615C6.11466 2.24491 6.1328 2.23062 6.1532 2.23062C6.1736 2.23062 6.19173 2.24491 6.19828 2.26615L6.64421 3.6768C6.88309 4.43293 7.42363 5.02723 8.11137 5.28996L9.39457 5.77994C9.41369 5.78729 9.42653 5.80709 9.42653 5.82935C9.42653 5.85166 9.41369 5.87146 9.39457 5.87881L8.11137 6.36879ZM10.7316 9.94582C10.8692 9.51031 11.1805 9.16799 11.5766 9.01663L12.316 8.73441C12.327 8.73019 12.3344 8.71875 12.3344 8.7059C12.3344 8.69309 12.327 8.68165 12.316 8.67743L11.5766 8.39521C11.1805 8.24385 10.8692 7.90153 10.7316 7.46602L10.4748 6.65352C10.4713 6.64067 10.4606 6.63187 10.4485 6.63187C10.4363 6.63187 10.4256 6.64067 10.4222 6.65352L10.166 7.46602C10.0283 7.90171 9.71666 8.24403 9.32033 8.39521L8.5816 8.67743C8.57059 8.68165 8.56317 8.69309 8.56317 8.7059C8.56317 8.71875 8.57059 8.73019 8.5816 8.73441L9.32033 9.01663C9.71666 9.16781 10.0283 9.51013 10.166 9.94582L10.4222 10.7584C10.4256 10.7712 10.4363 10.78 10.4485 10.78C10.4606 10.78 10.4713 10.7712 10.4748 10.7584L10.7316 9.94582Z"
            fill="url(#paint0_linear_270_31588)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_270_31588"
              x1="13.1199"
              y1="-5.06003"
              x2="3.68831"
              y2="6.89985"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#2775CA" />
              <stop offset="1" stop-color="#0663CA" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  </div>

  <div class="concentrated_card" style="height: 90%">
    <div>
      <div class="compose_text mb-3">Price Range Overview</div>
    </div>

    <div class="range_chart_card">
      <div
        class="d-flex justify-content-center flex-column align-items-center"
        v-if="!tokensInitialized"
      >
        <img :src="range_chart_icon" width="100" />
        <div class="compose_text mt-3">Your position will appear here.</div>
      </div>
      <div v-else class="w-100">
        <HistogramSlider
          style="padding: 0px 60px"
          :width="'100%'"
          :bar-height="180"
          :bar-gap="0"
          :bar-width="41"
          :bar-radius="0"
          gridNum="10"
          :prettify="prettify"
          :data="data"
          :drag-interval="true"
          :force-edges="false"
          :colors="['#4facfe', '#00C9FF']"
          :min="0"
          :max="price * 2"
          :forceEdges="true"
        />
      </div>
    </div>
    <div
      style="text-align: center; color: #7db0bc; margin-top: 10px"
      v-if="tokensInitialized"
    >
      Current Price: {{ token0.symbol }} per {{ token1.symbol }}
    </div>

    <hr class="compose_hr" />
    <div class="pool_info" v-if="poolInfo">
      <div class="d-flex justify-content-between mb-3">
        <span style="font-size: 16px">Pool Info</span>
        <a
          :href="`${
            configService.getNetworkConfig(networkId).explorer
          }/address/${poolInfo.address}`"
          style="text-decoration: underline"
          >Address: {{ shorten(poolInfo.address) }}</a
        >
      </div>
      <div class="d-flex justify-content-between">
        <span>Current Swap Fee:</span>
        <span>{{ (poolInfo.fee / 1000).toFixed(2) }}%</span>
      </div>
      <div class="d-flex justify-content-between">
        <span>Tickspacing:</span>
        <span>{{ poolInfo.tickSpacing }}</span>
      </div>
      <div class="d-flex justify-content-between">
        <span>Average APR of this Pool:</span>
        <span>{{ poolApr.toFixed(2) }}%</span>
      </div>
      <div class="d-flex justify-content-between">
        <span>TVL:</span>
        <span>${{ formatBigNumber(tvl) }}</span>
      </div>
    </div>

    <hr class="compose_hr" />
  </div>
</template>
<script setup>
import router from '@/router'

import range_chart_icon from '@/assets/icons/range_chart_icon.svg'
import HistogramSlider from 'vue3-histogram-slider'
import 'vue3-histogram-slider/dist/histogram-slider.css'
import { defineProps, computed } from 'vue'
import { shorten } from '@/lib/utils'
import { formatBigNumber } from '@/lib/utils/index'
import { configService } from '@/services/config/config.service'
import { networkId } from '@/composables/useNetwork'
import { getTokenEntity } from '@/lib/helpers/util'

const props = defineProps([
  'concentratedLiquidityStep',
  'minPriceRange',
  'maxPriceRange',
  'token0',
  'token1',
  'price',
  'poolInfo',
  'tvl',
  'poolApr',
])
const step = computed(() =>
  props.price < 10
    ? 0.01
    : props.price < 100
    ? 0.1
    : props.price < 1000
    ? 1
    : 10,
)
const data = computed(() => {
  let result = []
  let min = 0
  let max = props.price * 2
  for (let i = min; i < max; i += step.value) {
    result.push(i.toString())
  }
  console.log('RESULT - ', result)
  return result
})

const tokensInitialized = computed(
  () => props.token0.price && props.token1.price,
)

function prettify(ts) {
  return `${Number(ts).toFixed(2)}`
}
</script>
<style lang="scss" scoped>
.total_epoch {
  background: #00000024;
  border: 1px solid #ffffff0d;
  padding: 12px;
  border-radius: 16px;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  color: #c1c8ce;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.concentrated_card {
  margin-top: 50px;
  background: #00000024;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

  border-radius: 16px;
  padding: 15px;
}

.compose_text {
  font-size: clamp(11px, 0.8vw, 15px);
  color: white;
}

.range_chart_card {
  background: #00000024;

  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 120px 0px;
}

.compose_hr {
  border-bottom: 1px solid #27292c;
  margin: 0px;
  margin-top: 5px;
  margin-right: -10px;
  margin-left: -10px;
}

.pool_info {
  margin-top: 20px;
  margin-bottom: 20px;
  font-family: Inter;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  color: #c1c8ce;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pair_avatars_manage_pool {
  width: 14px;
  margin-right: -2px;
}

.claim_button {
  background: linear-gradient(90deg, #2775ca 0%, #2abdff 100%);
  box-shadow: 0px 4px 4px 0px #00000040;
  border-radius: 12px;
  padding: 8px 12px;
  color: #FFFFFF;
  &:hover {
    background: #2abdff;
    cursor: pointer;
  }
}
</style>
