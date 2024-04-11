<template>
    <div @click="onHeaderClick" style="cursor: pointer" class="visible_head">
        <div class="d-flex align-items-center gap-2" style="margin-left: 0px">
            <div>
                <div>
                    <img :src="arrow_up" :width="10" :class="!visible ? 'toggle-down' : 'toggle-up'" />
                </div>
            </div>
            <div style="
                font-family: Poppins;
                color: white;
                width: 100%;
              ">
                <div class="d-flex align-items-baseline justify-content-between visible_head">
                    <div class="arbitrage_bot_sections_text ">
                        {{ headerTitle }}
                    </div>
                    <div v-if="!headerValue" class="totals_loader">
                        <ThreeDots />
                    </div>
                    <div v-else style="color: white; font-weight: 800; clamp(10px, 0.8vw, 14px)">
                        <span v-if="symbol === '₿'">
                          <img :src="btcSymbol" width="9" />
                        </span>
                        <span v-else-if="symbol === 'Ξ'">
                          <img :src="ethSymbol" width="9" />
                        </span>
                        <span v-else>{{ symbol }} </span> {{ headerValue < 1000 ? Number(headerValue).toFixed(currencyDecimals == 0 ?
                            2 : currencyDecimals) : numberToAposthrophe(Number(headerValue).toFixed(currencyDecimals == 0 ? 2
                                : currencyDecimals)) }} </div>
                    </div>
                </div>
            </div>
        </div>
</template>
<script setup>
import btcSymbol from '@/assets/images/tokens/btcSymbol.png'
import ethSymbol from '@/assets/images/tokens/ethSymbol.png'
import arrow_up from '@/assets/icons/arrow/arrow_up.svg'
import { defineProps, defineEmits } from 'vue'
import numberToAposthrophe from '@/lib/formatter/numberToAposthrophe'
import ThreeDots from '@/components/loaders/ThreeDots.vue'
const props = defineProps(["headerValue", "headerTitle", "visible", 'symbol', 'currencyDecimals']);
const emit = defineEmits(["headerClick", 'closeAllDrops'])

function onHeaderClick() {
    emit("closeAllDrops")
    emit("headerClick", !props.visible);
}


</script>