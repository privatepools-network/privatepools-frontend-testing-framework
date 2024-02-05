<template>
  <div class="selector">
    <div class="tokens-selector" @click="isSelectorOpened=!isSelectorOpened">
      <div class="tokens-selector__icon"><img :src="getTokenEntity(tokenSelected.symbol, 'short').icon"/></div>
      <div class="tokens-selector__selected-item-text">{{ tokenSelected.symbol }}</div>
      <div class="tokens-selector__dropdown-icon">
        <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.8125 1.40625L4.8125 5.40625L8.8125 1.40625" stroke="white" stroke-width="1.33333"
                stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
    <div class="selector-options" v-show="isSelectorOpened" >
      <div style="display: flex; align-items: center" v-for="item in tokens" :key="item.name" class="selector-options__el" @click="tokenSelected = item, $emit('updateToken', item), isSelectorOpened = false">
        <img style="width: 20px; height: 20px; margin-right: 5px" :src="getTokenEntity(item.symbol, 'short').icon" /><span class="text-white"> {{ item.name }}</span>
        <span style="color: rgba(108, 114, 132, 1); margin-left: 2.5px">({{ item.symbol }})</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, toRefs, defineProps} from "vue";
import { getTokenEntity } from '@/lib/helpers/util';

const props = defineProps({
  tokens: Array,
  tokenSelected: Object
})
const {tokens, tokenSelected} = toRefs(props)
const isSelectorOpened = ref(false)

</script>
<style lang="scss" scoped>
.selector {
  position: relative;
  &-options {
    position: absolute;
    background: rgb(15, 17, 19) !important;
    z-index: 100;
    border-radius: 10px;
    padding: 10px;
    max-height: 300px;
    overflow-y: auto;
    top: 45px;
    &::-webkit-scrollbar {
      width: 0;
    }
    &__el {
      padding: 8px 8px;
      cursor: pointer;
      &:hover {
        background: rgb(27, 30, 33) !important;
      }
    }
  }
}
.tokens-selector {
  display: flex;
  align-items: center;
  cursor: pointer;
  &__icon {
    height: 42px;
    width: 42px;
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
    font-size: 16px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0em;
    color: #ffffff;

    margin-right: 8px;
  }
}
</style>
