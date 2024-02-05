<template>
  <CCollapse :visible="visible">
    <div style="
        color: rgba(204, 204, 204, 1);
        margin-top: 10px;
        margin-bottom: 5px;
      ">
      <div class="d-flex flex-column gap-1" style="margin-top: -10px">
        <div v-for="token in filteredTokensData" :key="token.symbol"
          class="d-flex align-items-center justify-content-between"
          style="margin-left: 17px; font-size: clamp(10px, 0.8vw, 11px)">
          <div class="d-flex align-items-center gap-1">
            {{ getTokenAmountBySymbol(token.symbol) }} {{ token.symbol }}
            <div>
              <img :src="getTokenEntity(token.symbol, 'short').icon" width="10" />
            </div>
          </div>
          <div style="color: white; font-weight: 400">
            <span v-if="symbol === '₿'">
                    <img :src="btcSymbol" width="9" />
                  </span>
                  <span v-else-if="symbol === 'Ξ'">
                    <img :src="ethSymbol" width="9" />
                  </span>
                  <span v-else>{{ symbol }} </span
                  > {{
              token.value < 1 ? Number(token.value).toFixed(currencyDecimals == 0 ? 2 : currencyDecimals) :
              numberToAposthrophe(token.value, currencyDecimals == 0 ? 2 : currencyDecimals) }} </div>
          </div>
        </div>
      </div>
  </CCollapse>
</template>

<script setup>
import btcSymbol from '@/assets/images/tokens/btcSymbol.png'
import ethSymbol from '@/assets/images/tokens/ethSymbol.png'
import { defineProps, toRefs, computed } from 'vue'
import numberToAposthrophe from '@/lib/formatter/numberToAposthrophe'
import { getTokenEntity } from '@/lib/helpers/util'

const props = defineProps(['data', 'tokensAmountData', 'visible', 'symbol', 'currencyDecimals'])
const { data, tokensAmountData } = toRefs(props)
const filteredTokensData = computed(
  () =>
    tokensAmountData.value &&
    data.value &&
    data.value.filter((t) => t.value > 0).sort((a, b) => b.value - a.value),
)

function getTokenAmountBySymbol(symbol) {
  let value = tokensAmountData.value.find((t) => t.symbol == symbol).value
  return symbol === 'BTCB' || symbol === 'BTC' || symbol === 'WBTC'
    ? Number(value).toFixed(3)
    : value < 1000
      ? Number(value).toFixed(2)
      : numberToAposthrophe(Number(value).toFixed(0))
}
</script>
