<template>
  <div class="total_epoch">
    <div>Total Rewards This Epoch:</div>
    <div>0%</div>
  </div>
  <div class="concentrated_card" style="height: 90%">
    <div>
      <div class="compose_text mb-3">Price Range Overview</div>
    </div>

    <div class="range_chart_card">
      <div class="d-flex justify-content-center flex-column align-items-center" v-if="!tokensInitialized">
        <img :src="range_chart_icon" width="100" />
        <div class="compose_text mt-3">Your position will appear here.</div>
      </div>
      <div v-else class="w-100">
        <HistogramSlider style="padding: 0px 60px" :width="'100%'" :bar-height="180" :bar-gap="0" :bar-width="41"
          :bar-radius="0" gridNum="10" :prettify="prettify" :data="data" :drag-interval="true" :force-edges="false"
          :colors="['#4facfe', '#00C9FF']" :min="0" :max="price * 2" :forceEdges="true" />
      </div>
    </div>
    <div style="text-align: center; color: #7db0bc; margin-top: 10px" v-if="tokensInitialized">
      Current Price: {{ token0.symbol }} per {{ token1.symbol }}
    </div>

    <hr class="compose_hr" />
    <div class="pool_info" v-if="poolInfo">
      <div class="d-flex justify-content-between mb-3">
        <span style="font-size: 16px">Pool Info</span>
        <!--TODO: update etherscan link-->
        <a :href="`https://etherscan.io/address/${poolInfo.address}`" style="text-decoration: underline">Address: {{
          shorten(poolInfo.address) }}</a>
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
        <span>[ 51.1% -> 127% ]</span>
      </div>
      <div class="d-flex justify-content-between">
        <span>TVL:</span>
        <span>$345.56k</span>
      </div>
    </div>

    <hr class="compose_hr" />
  </div>
</template>
<script setup>
import range_chart_icon from '@/assets/icons/range_chart_icon.svg'
import HistogramSlider from "vue3-histogram-slider";
import "vue3-histogram-slider/dist/histogram-slider.css";
import { defineProps, computed } from 'vue'
import { shorten } from "@/lib/utils"
const props = defineProps(['concentratedLiquidityStep', 'minPriceRange', 'maxPriceRange', 'token0', 'token1', 'price', 'poolInfo'])
const step = computed(() => props.price < 10 ? 0.01 : props.price < 100 ? 0.1 : props.price < 1000 ? 1 : 10)
const data = computed(() => {
  let result = []
  let min = 0
  let max = props.price * 2
  for (let i = min; i < max; i += step.value) {
    result.push(i.toString())
  }
  console.log("RESULT - ", result)
  return result
})


const tokensInitialized = computed(() => props.token0.price && props.token1.price)

function prettify(ts) {
  return `${Number(ts).toFixed(2)}`;
}

</script>
<style lang="scss" scoped>
.total_epoch {
  background: linear-gradient(152.97deg, #000000 0%, rgba(0, 0, 0, 0) 100%);
  padding: 12px;
  border-radius: 15px;
  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  color: #c1c8ce;
  display: flex;
  justify-content: space-between;
}

.concentrated_card {
  margin-top: 50px;
  background: linear-gradient(152.97deg, #000000 0%, rgba(0, 0, 0, 0) 100%);
  border-radius: 15px;
  padding: 15px;
}

.compose_text {
  font-size: clamp(11px, 0.8vw, 15px);
  color: white;
}

.range_chart_card {
  border-radius: 8px;
  background: #07090c;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 120px 0px;
}

.compose_hr {
  border-bottom: 1px solid #00c9ff57;
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
</style>
