<template>
  <div
    class="total_epoch text-black dark:!text-[#c1c8ce] bg-white dark:!bg-[#DCEEF605]"
    v-if="router.currentRoute.value.path === '/pools/concentrated_pool'"
  >
    <div>{{ $t('average_rewards') }}:</div>
    <div>0%</div>
  </div>
  <div v-else class="total_epoch text-black dark:!text-[#c1c8ce] bg-white dark:!bg-[#DCEEF605]">
    <div class="d-flex gap-4">
      <div class="d-flex flex-column">
        <div>LP {{ $t('rewards') }}</div>
        <div class="flex items-center gap-1">
          $-
          <img
            class="pair_avatars_manage_pool"
            v-for="(tokenEntity, tokenEntityIndex) in [
              token0.symbol,
              token1.symbol,
            ]"
            :key="`token-entity-key-${tokenEntityIndex}`"
            :title="tokenEntity"
            :src="getTokenEntity(tokenEntity, 'short').icon"
          />
        </div>
      </div>
      <div class="d-flex flex-column">
        <div>{{ $t('earned_fees') }}</div>
        <div class="flex items-center gap-1">
          $-
          <img
            class="pair_avatars_manage_pool"
            v-for="(tokenEntity, tokenEntityIndex) in [
              token0.symbol,
              token1.symbol,
            ]"
            :key="`token-entity-key-${tokenEntityIndex}`"
            :title="tokenEntity"
            :src="getTokenEntity(tokenEntity, 'short').icon"
          />
        </div>
      </div>
    </div>
    <div>
      <div class="claim_button">
        {{ $t('claim_rewards') }}
     
      </div>
    </div>
  </div>

  <div class="concentrated_card bg-white dark:!bg-[#DCEEF605]">
    <div v-if="router.currentRoute.value.path === '/pools/concentrated_pool'">
      <div class="compose_text text-black dark:!text-white mb-3">{{ $t('price_range_overview') }}</div>
    </div>
    <!-- <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="compose_text" style="font-size: 15px">
          Position Overview
        </div>
        <div class="details-el__title d-flex gap-1 align-items-center green">
          In range
          <div class="details-el__circle"></div>
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="compose_text">Price Range</div>
        <div class="compose_text">
          {{ token0.symbol }} per {{ token1.symbol }}
          <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.1465 0.146515C5.24026 0.0527797 5.36742 0.00012207 5.5 0.00012207C5.63258 0.00012207 5.75974 0.0527797 5.8535 0.146515L7.8535 2.14652C7.94724 2.24028 7.99989 2.36743 7.99989 2.50002C7.99989 2.6326 7.94724 2.75975 7.8535 2.85352L5.8535 4.85352C5.7592 4.94459 5.6329 4.99499 5.5018 4.99385C5.3707 4.99271 5.24529 4.94013 5.15259 4.84742C5.05989 4.75472 5.0073 4.62931 5.00616 4.49822C5.00502 4.36712 5.05542 4.24082 5.1465 4.14652L6.293 3.00002H0.5C0.367392 3.00002 0.240215 2.94734 0.146447 2.85357C0.0526785 2.7598 0 2.63262 0 2.50002C0 2.36741 0.0526785 2.24023 0.146447 2.14646C0.240215 2.05269 0.367392 2.00002 0.5 2.00002H6.293L5.1465 0.853515C5.05276 0.759751 5.00011 0.632597 5.00011 0.500015C5.00011 0.367433 5.05276 0.240279 5.1465 0.146515ZM2.8535 5.14652C2.94724 5.24028 2.99989 5.36743 2.99989 5.50002C2.99989 5.6326 2.94724 5.75975 2.8535 5.85352L1.707 7.00002H7.5C7.63261 7.00002 7.75979 7.05269 7.85355 7.14646C7.94732 7.24023 8 7.36741 8 7.50002C8 7.63262 7.94732 7.7598 7.85355 7.85357C7.75979 7.94734 7.63261 8.00002 7.5 8.00002H1.707L2.8535 9.14651C2.94458 9.24082 2.99498 9.36712 2.99384 9.49822C2.9927 9.62931 2.94011 9.75472 2.84741 9.84742C2.75471 9.94013 2.6293 9.99271 2.4982 9.99385C2.3671 9.99499 2.2408 9.94459 2.1465 9.85352L0.1465 7.85352C0.0527646 7.75975 0.000106812 7.6326 0.000106812 7.50002C0.000106812 7.36743 0.0527646 7.24028 0.1465 7.14651L2.1465 5.14652C2.24026 5.05278 2.36742 5.00012 2.5 5.00012C2.63258 5.00012 2.75974 5.05278 2.8535 5.14652Z"
              fill="#C1C8CE" />
          </svg>
        </div>
      </div>
    </div> -->

    <div class="range_chart_card bg-white dark:!bg-[#DCEEF605]">
      <div class="d-flex justify-content-center flex-column align-items-center">
        <!-- v-if="!tokensInitialized" -->
        <img :src="range_chart_icon" width="100" />
        <div class="compose_text text-black dark:!text-white mt-3">{{ $t('your_position_will_appear') }}</div>
      </div>
      <!-- <div v-else class="w-[350px]">
        <HistogramSlider style="padding: 0px 60px" :width="'100%'" :bar-height="180" :bar-gap="0" :bar-width="41"
          :bar-radius="0" gridNum="10" :prettify="prettify" :data="data" :drag-interval="true" :force-edges="false"
          :colors="['#4facfe', '#00C9FF']" :min="0" :max="price * 2" :forceEdges="true" />
      </div> -->
    </div>
    <div
      style="text-align: center; color: #7db0bc; margin-top: 10px"
      v-if="tokensInitialized"
    >
      {{ $t('current_price') }}: {{ token0.symbol }} {{ $t('per') }} {{ token1.symbol }}
    </div>

    <div
      v-if="router.currentRoute.value.path === '/pools/concentrated_pool/add'"
      class="d-flex justify-content-between align-items-center my-3"
    >
      <div class="compose_text text-black dark:!text-white">
        <span >{{ $t('min_price') }}:</span> 18.503 ({{
          token0.symbol
        }}
        = $34,652)
      </div>
      <div class="compose_text text-black dark:!text-white">
        <span >{{ $t('max_price') }}:</span> 18.503 ({{
          token1.symbol
        }}
        = $1,503)
      </div>
    </div>

    <div
      v-if="
        router.currentRoute.value.path ===
          '/pools/concentrated_pool/add/withdraw' ||
        router.currentRoute.value.path ===
          '/pools/concentrated_pool/add/deposit'
      "
      class="mt-3"
    >
      <div class="compose_text text-black dark:!text-white mb-3">{{ $t('max_price') }}</div>
      <div class="position_range_container bg-white dark:!bg-[#DCEEF605] relative">
        <div class="overflow-hidden">
        <div class="absolute top-[-10px] left-[-20px]">
          <img :src="getTokenEntity(token0.symbol, 'short').icon" width="100" class="opacity-[6%]"/>
        </div>
      </div>
      <div class="overflow-hidden">
        <div class="absolute top-[-10px] right-[-20px]">
          <img :src="getTokenEntity(token1.symbol, 'short').icon" width="100" class="opacity-[6%]"/>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div class="d-flex gap-2 align-items-center">
          <div>
            <img
              :src="getTokenEntity(token0.symbol, 'short').icon"
              width="30"
            />
          </div>
          <div class="d-flex flex-column gap-1">
            <div class="text-black dark:!text-white">
              {{ parseFloat(token0.amount).toFixed(2) }} {{ token0.symbol }}
            </div>
            <div style="color: #a3a3a3">
              = ${{ (token0.amount * token0.price).toFixed(2) }}
            </div>
          </div>
        </div>

        <div>
          <div
            class="vr"
            style="
              height: 75px;
              margin-top: -15px;
              margin-bottom: -20px;
              border: 1px solid #00e0ff;
              filter: drop-shadow(0 0 0.3rem #00c9ff);
            "
          ></div>
        </div>

        <div class="d-flex gap-2 align-items-center">
          <div class="d-flex flex-column gap-1">
            <div class="text-black dark:!text-white">
              {{ parseFloat(token1.amount).toFixed(2) }} {{ token1.symbol }}
            </div>
            <div style="color: #a3a3a3">
              = ${{ (token1.amount * token1.price).toFixed(2) }}
            </div>
          </div>
          <div>
            <img
              :src="getTokenEntity(token1.symbol, 'short').icon"
              width="30"
            />
          </div>
        </div>
      </div>
      </div>
    </div>

    <hr class="compose_hr" />
    <div class="pool_info text-black dark:!text-white" v-if="poolInfo">
      <div class="d-flex justify-content-between mb-3">
        <span style="font-size: 16px" >{{ $t('pool_info') }}</span>
        <a
          :href="`${
            configService.getNetworkConfig(networkId).explorer
          }/address/${poolInfo.address}`"
          style="text-decoration: underline"
          >Address: {{ shorten(poolInfo.address) }}</a
        >
      </div>
      <div class="d-flex justify-content-between">
        <span>{{ $t('current_swap_fee') }}:</span>
        <span>{{ (poolInfo.fee / 1000).toFixed(2) }}%</span>
      </div>
      <div class="d-flex justify-content-between">
        <span>{{ $t('tickspacing') }}:</span>
        <span>{{ poolInfo.tickSpacing }}</span>
      </div>
      <div class="d-flex justify-content-between">
        <span>{{ $t('average') }} APR:</span>
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
  // background: #DCEEF605;
  border: 1px solid #00E0FF24;

  padding: 12px;
  border-radius: 16px;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  // color: #c1c8ce;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.concentrated_card {
  margin-top: 50px;
  // background: #DCEEF605;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  border: 1px solid #00E0FF24;
  border-radius: 16px;
  padding: 15px;
}

.compose_text {
  font-size: clamp(11px, 0.8vw, 15px);
  // color: white;
}

.range_chart_card {
  // background: #DCEEF605;

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
  
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  // color: #c1c8ce;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pair_avatars_manage_pool {
  width: 14px;
  margin-right: -2px;
}

.claim_button {
  background: #00E0FF;
  box-shadow: 0px 4px 4px 0px #00000040;
  border-radius: 12px;
  padding: 8px 12px;
  color: #02031C;
  font-weight: 500;
  font-family: 'Syne', sans-serif;


  &:hover {
    color: white;
    cursor: pointer;
  }
}

.details {
  &-el {
    display: flex;
    align-items: center;
    padding: 24px 32px;
    background: linear-gradient(
      0deg,
      rgba(43, 43, 43, 33%),
      rgba(43, 43, 43, 11.5%)
    );
    justify-content: space-between;
    border-bottom: 1px solid rgba(49, 56, 61, 0.81);
    color: #fff;

    &__circle {
      width: 10px;
      height: 10px;
      border-radius: 5px;
      margin-right: 8px;
    }
  }
}

.green {
  color: #03e9c0;

  .details-el__circle {
    background: #03e9c0;
    box-shadow: 0px 0px 10px 0px rgba(49, 216, 164, 0.5);
  }
}

.position_range_container {
  // background: #22222224;
  font-size: clamp(10px, 0.8vw, 14px);
  border-radius: 8px;
  box-shadow: 0px 4px 4px 0px #00000040;
  padding: 12px;
  // display: flex;
  // justify-content: space-between;
  // align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden
}
</style>
