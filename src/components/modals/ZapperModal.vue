<template>
  <Modal v-if="isOpen" @close="$emit('onClose')">
    <template #body>
      <div>
        <div class="!text-black dark:!text-white text-[18px] font-bold">
          Zapper Trades
        </div>
        <div class="flex justify-center flex-col items-center">
          <div
            class="my-4 w-full border-[#00E0FF1F] border-[1px] bg-[#22222224] shadow-md rounded-2xl text-white"
          >
            <div
              class="flex justify-between px-3 border-b border-[#00e0ff1f] border-solid"
            >
              <div
                class="text-[13px] font-normal p-2 font-['Syne',_sans-serif]"
              >
                Trades
              </div>
              <div
                class="text-[13px] font-normal p-2 font-['Syne',_sans-serif]"
              >
                Slippage %
              </div>
            </div>
            <div
              class="flex justify-between items-center px-3"
              v-for="(token, index) in tradeTokens"
              :key="`pool-token-${index}`"
            >
              <div
                class="text-[13px] font-normal px-2 py-3 font-['Syne',_sans-serif]"
              >
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <CAvatar
                      :src="getTokenEntity(zapToken.symbol, 'short').icon"
                    />
                    <div class="!mr-1 dark:!text-white text-black">
                      {{ parseFloat(fromAmounts?.[index]).toFixed(8) }}
                    </div>
                    <img :src="ArrowLongRightIcon" />
                    <CAvatar
                      :src="getTokenEntity(token.symbol, 'short').icon"
                    />
                    <div class="dark:!text-white text-black">
                      {{ parseFloat(toAmounts?.[index]).toFixed(8) }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="text-[13px] font-normal p-2 font-['Syne',_sans-serif]"
              >
                {{ slippageSelected }}
              </div>
            </div>
          </div>

          <div class="zapper_button flex items-center gap-1 justify-center" @click="$emit('onAcceptTrade')">
            {{fetchingZapTrades ? 'Accepting' : 'Accept Trade'}} <span v-if="fetchingZapTrades" class="button_loader pl-2"></span>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

import Modal from '@/UI/Modal.vue'
import ArrowLongRightIcon from '@/assets/icons/arrow/arrow_long_right.svg'
import { getTokenEntity } from '@/lib/helpers/util'

const props = defineProps([
  'fetchingZapTrades',
  'isOpen',
  'zapToken',
  'slippageSelected',
  'tradeTokens',
  'fromAmounts',
  'toAmounts',
])
const emit = defineEmits(['onClose', 'onAcceptTrade'])
</script>

<style lang="scss" scoped>
.zapper_button {
  width: 100%;
  cursor: pointer;
  margin-top: 5px;
  border-radius: 30px;

  font-size: 12px;
  font-weight: 600;
  line-height: 24px;
  color: #02031c;
  text-align: center;
  padding: 6px;
  background: #00e0ff;

  box-shadow: 0px 4px 6px -1px #0000000d;

  &:hover {
    filter: drop-shadow(0 0 0.7rem #00c9ff);
    background: #00e0ff;
  }
}
</style>
