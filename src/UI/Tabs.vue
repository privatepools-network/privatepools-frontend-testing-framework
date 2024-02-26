<template>
  <div class="tabs" v-if="tabsOptions[0].title">
    <div class="tabs__el" v-for="option in tabsOptions" :key="option" :class="{
            'tabs__el_active': option.number === selectedTab.number,
          }" @click="$emit('changeTab', option)">
      <div>{{ option.title }} 
</div>
    </div>
  </div>
  <div class="tabs" v-else>
    <div class="tabs__el" v-for="option in tabsOptions" :key="option" :class="{
            'tabs__el_active': option === selectedTab,
          }" @click="$emit('changeTab', option)">
      <div >{{ option }} <svg v-if="option === selectedTab && filterEye === true" width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.4229 5.28484C16.3997 5.23238 15.8372 3.98461 14.5868 2.73418C12.9207 1.06805 10.8162 0.1875 8.49999 0.1875C6.18374 0.1875 4.07933 1.06805 2.4132 2.73418C1.16277 3.98461 0.59765 5.23438 0.577064 5.28484C0.546858 5.35279 0.53125 5.42631 0.53125 5.50066C0.53125 5.57502 0.546858 5.64854 0.577064 5.71648C0.600306 5.76894 1.16277 7.01606 2.4132 8.26648C4.07933 9.93195 6.18374 10.8125 8.49999 10.8125C10.8162 10.8125 12.9207 9.93195 14.5868 8.26648C15.8372 7.01606 16.3997 5.76894 16.4229 5.71648C16.4531 5.64854 16.4687 5.57502 16.4687 5.50066C16.4687 5.42631 16.4531 5.35279 16.4229 5.28484ZM8.49999 9.75C6.45601 9.75 4.67035 9.00691 3.19214 7.54199C2.58562 6.93882 2.0696 6.25102 1.66015 5.5C2.06949 4.74891 2.58552 4.06109 3.19214 3.45801C4.67035 1.99309 6.45601 1.25 8.49999 1.25C10.544 1.25 12.3296 1.99309 13.8078 3.45801C14.4156 4.06095 14.9327 4.74876 15.3432 5.5C14.8644 6.39383 12.7785 9.75 8.49999 9.75ZM8.49999 2.3125C7.86957 2.3125 7.2533 2.49944 6.72911 2.84969C6.20493 3.19994 5.79638 3.69776 5.55513 4.2802C5.31387 4.86264 5.25075 5.50354 5.37374 6.12185C5.49673 6.74016 5.80031 7.30812 6.24609 7.7539C6.69187 8.19968 7.25983 8.50326 7.87814 8.62625C8.49646 8.74924 9.13736 8.68612 9.7198 8.44487C10.3022 8.20361 10.8001 7.79506 11.1503 7.27088C11.5006 6.7467 11.6875 6.13043 11.6875 5.5C11.6866 4.65489 11.3505 3.84465 10.7529 3.24707C10.1553 2.64949 9.3451 2.31338 8.49999 2.3125ZM8.49999 7.625C8.07971 7.625 7.66886 7.50037 7.31941 7.26687C6.96995 7.03337 6.69759 6.7015 6.53675 6.3132C6.37591 5.92491 6.33383 5.49764 6.41582 5.08543C6.49782 4.67322 6.7002 4.29458 6.99739 3.9974C7.29458 3.70021 7.67322 3.49782 8.08543 3.41583C8.49764 3.33384 8.9249 3.37592 9.3132 3.53676C9.70149 3.69759 10.0334 3.96996 10.2669 4.31941C10.5004 4.66887 10.625 5.07971 10.625 5.5C10.625 6.06359 10.4011 6.60409 10.0026 7.0026C9.60408 7.40112 9.06358 7.625 8.49999 7.625Z" fill="white"/>
</svg></div>
    </div>
  </div>

</template>

<script setup>
import {defineProps, toRefs} from 'vue'

const props = defineProps({
  selectedTab: String || Object,
  tabsOptions: Array,
  filterEye: Boolean
})

const {selectedTab, tabsOptions, filterEye} = toRefs(props)
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';
.tabs {
  padding: 4px;
  border-radius: 23px;
  background: none;
  gap: 10px;
  // border: 1px solid #00C9FF;
  display: flex;
  @media (max-width: $xxl) {
    padding: 2px;
  }
    &__el {
      background: #22222224;
      box-shadow: 0px 4px 4px 0px #00000040;

      border-radius: 20px;
    color: white;
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
