<template>
  <Dropdown :distance="4" :placement="'bottom-left'">
    <div class="cursor-pointer hover:text-[#00e0ff]">
      <SettingIcon />
    </div>
    <template #popper>
      <div
        class="flex flex-col z-[1000] shadow-[#02031cb5] shadow-md rounded-2xl bg-[#02031C] border-1 border-[#dceef60d] relative text-white px-2 py-3 text-center"
      >
        <h4 class="text-[12px] text-black dark:!text-[#626262] mb-[10px]">
          {{ $t('Settings') }}
        </h4>

        <div class="mb-[10px]">
          <div class="text-[12px] flex items-center gap-1 dark:text-white">
            Slippage Tolerance (%)
            <img :src="QuestionIcon" />
          </div>
        </div>
        <div
          class="bg-[#22222224] text-[12px] dark:text-white shadow-sm rounded-md"
        >
          <div class="flex gap-3">
            <div
              v-for="(item, index) in SLIPPAGE_SETTINGS"
              :key="index"
              class="flex flex-col items-center justify-start cursor-pointer"
              :class="slippageText === item.text && 'text-[#00e0ff]'"
              @click="$emit('changeSlippage', item.text, item.value)"
            >
              <div>{{ item.text }}</div>
              <div>{{ item.value }}</div>
            </div>
            <img :src="DivideIcon" />
            <div
              class="flex flex-col items-center justify-start cursor-pointer"
              :class="slippageText === 'Custom' && 'text-[#00e0ff]'"
              @click="$emit('changeSlippage', 'Custom', slippageValue)"
            >
              <div>Custom</div>
              <div>
                <input
                  class="bg-transparent border-none outline-none p-0 w-[40px] h-[12px] text-[#A8A8A8] text-center font-medium"
                  style="font-size: clamp(10px, 0.8vw, 14px)"
                  type="number"
                  :placeholder="'%'"
                  :value="slippageValue"
                  @input="
                    (e) => $emit('changeSlippage', 'Custom', e.target.value)
                  "
                />
              </div>
            </div>
          </div>
          <div class="flex items-center mt-3 gap-1">
            <div
              class="bg-[#FFFFFF] cursor-pointer rounded-2xl dark:text-[#0F0F0F] py-1 px-3 font-medium"
              @click="$emit('changeSlippage', 'Auto', undefined)"
            >
              Reset Default
            </div>
          </div>
        </div>
      </div>
    </template>
  </Dropdown>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { Dropdown } from 'floating-vue'

import SettingIcon from '@/assets/icons/setting.vue'
import QuestionIcon from '@/assets/icons/question.svg'
import DivideIcon from '@/assets/icons/divide.svg'

const SLIPPAGE_SETTINGS = [
  { text: 'Auto', value: '-' },
  { text: 'High', value: 2 },
  { text: 'Medium', value: 0.5 },
  { text: 'Low', value: 0.1 },
]

const props = defineProps(['slippageText', 'slippageValue'])
const emit = defineEmits(['changeSlippage'])
</script>
