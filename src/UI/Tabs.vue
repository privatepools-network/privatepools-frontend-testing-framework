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
  border: 1px solid #01B47E;
  display: flex;
  @media (max-width: $xxl) {
    padding: 2px;
  }
    &__el {
    color: #7EF6B2;
    padding: 3px 9px;
    font-size: 13px;
    @media (max-width: $xxl) {
      font-size: 10px;
      padding: 2px 6px;
    }
    &_active {
      color: #fff;
      border-radius: 20px;
      background: #01B47E;
    }
    &:hover {
      color: #fff;
      border-radius: 20px;
      background: darken(#01B47E, 10%);
      cursor: pointer;
    }
  }
}
</style>
