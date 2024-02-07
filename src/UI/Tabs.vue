<template>
  <div class="tabs" v-if="tabsOptions[0].title">
    <div class="tabs__el" v-for="option in tabsOptions" :key="option" :class="{
            'tabs__el_active': option.number === selectedTab.number,
          }" @click="$emit('changeTab', option)">
      <div>{{ option.title }}</div>
    </div>
  </div>
  <div class="tabs" v-else>
    <div class="tabs__el" v-for="option in tabsOptions" :key="option" :class="{
            'tabs__el_active': option === selectedTab,
          }" @click="$emit('changeTab', option)">
      <div >{{ option }}</div>
    </div>
  </div>

</template>

<script setup>
import {defineProps, toRefs} from 'vue'

const props = defineProps({
  selectedTab: String || Object,
  tabsOptions: Array
})

const {selectedTab, tabsOptions} = toRefs(props)
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';
.tabs {
  padding: 4px;
  border-radius: 23px;
  background: linear-gradient(152.97deg, #000000 0%, rgba(0, 0, 0, 0) 100%);

  // border: 1px solid #00C9FF;
  display: flex;
  @media (max-width: $xxl) {
    padding: 2px;
  }
    &__el {
    color: #0082A5;
    padding: 3px 9px;
    font-size: 13px;
    @media (max-width: $xxl) {
      font-size: 10px;
      padding: 2px 6px;
    }
    &_active {
      color: #fff;
      border-radius: 20px;
      background: linear-gradient(152.97deg, #001D24 0%, #00C9FF 100%);

    }
    &:hover {
      color: #fff;
      border-radius: 20px;
      background: darken(#00C9FF, 10%);
      cursor: pointer;
    }
  }
}
</style>
