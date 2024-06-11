<template>
  <div class="selector">
    <div class="tokens-selector" @click="isSelectorOpened = !isSelectorOpened">
      <div class="tokens-selector__icon">
        <img :src="getTokenEntity(tokenSelected.symbol, 'short').icon" />
      </div>
      <div class="tokens-selector__selected-item-text">
        {{ tokenSelected.symbol }}
      </div>
      <div class="tokens-selector__dropdown-icon">
        <svg
          width="10"
          height="7"
          viewBox="0 0 10 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.8125 1.40625L4.8125 5.40625L8.8125 1.40625"
            stroke="white"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <div class="selector-options" v-show="isSelectorOpened">
      <div
        style="display: flex; align-items: center"
        v-for="(item, i) in tokens"
        :key="item.name"
        class="selector-options__el"
        @click="$emit('updateToken', item, i), (isSelectorOpened = false)"
      >
        <img
          style="width: 20px; height: 20px; margin-right: 5px"
          :src="getTokenEntity(item.symbol, 'short').icon"
        /><span class="text-white"> {{ item.name }}</span>
        <span class="dark:text-white font-['Syne',_sans-serif] text-[12px]">{{
          item.symbol
        }}</span>
        <span class="dark:text-white font-['Syne',_sans-serif] text-[12px] ml-1"
          >({{ item?.percentage?.toFixed(0) }}%)</span
        >
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { getTokenEntity } from '@/lib/helpers/util'

const props = defineProps({
  tokens: Array,
  tokenSelected: Object,
})

defineEmits(['updateToken'])

const isSelectorOpened = ref(false)
</script>
<style lang="scss" scoped>
.selector {
  position: relative;
  &-options {
    position: absolute;
    background: #02031c !important;
    // backdrop-filter: blur(10px);
    z-index: 100;
    border-radius: 10px;
    // padding: 2px;
    max-height: 300px;
    width: 140px;
    overflow-y: auto;
    top: 32px;
    &::-webkit-scrollbar {
      width: 0;
    }
    &__el {
      padding: 8px 8px;
      font-size: 12px;
      cursor: pointer;
      &:hover {
        background: #00e1ff48 !important;
      }
    }
  }
}
.tokens-selector {
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 0.5px solid #00e0ff69;
  padding: 4px 10px;
  border-radius: 16px;
  &__icon {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-color: #ffffffde;

    display: flex;
    justify-content: space-around;
    align-items: center;

    margin-right: 8px;
    img {
      width: 100%;
    }
  }

  &__selected-item-text {
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0em;
    color: #ffffff;

    margin-right: 8px;
  }
}
</style>
