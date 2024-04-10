<template>
  <div class="d-flex align-items-center gap-3">
    <div v-click-away="onClickAway">
      <div
        class="filter_button bg-white dark:!bg-[#090909] text-black dark:!text-white w-[150px]"
        :style="
          selectTokenDropdownOpen === true
            ? 'border-radius: 16px 16px 0px 0px;'
            : ''
        "
        @click="selectTokenDropdownOpen = !selectTokenDropdownOpen"
      >
        <svg
          width="22"
          height="16"
          viewBox="0 0 22 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.005 0.00292969C17.08 0.00292969 22.005 2.68893 22.005 6.00293V10.0029C22.005 13.3169 17.08 16.0029 11.005 16.0029C5.038 16.0029 0.181005 13.4119 0.0100049 10.1799L0.00500488 10.0029V6.00293C0.00500488 2.68893 4.93001 0.00292969 11.005 0.00292969ZM11.005 12.0029C7.285 12.0029 3.995 10.9949 2.005 9.45293V10.0029C2.005 11.8849 5.888 14.0029 11.005 14.0029C16.015 14.0029 19.843 11.9729 20 10.1209L20.005 10.0029L20.006 9.45293C18.016 10.9949 14.726 12.0029 11.005 12.0029ZM11.005 2.00293C5.888 2.00293 2.005 4.12093 2.005 6.00293C2.005 7.88493 5.888 10.0029 11.005 10.0029C16.122 10.0029 20.005 7.88493 20.005 6.00293C20.005 4.12093 16.122 2.00293 11.005 2.00293Z"
            class="fill-black dark:!fill-[#F8F8F8]"
          />
        </svg>
        Select token
      </div>
      <div
        v-if="selectTokenDropdownOpen === true"
        class="select_token_dropdown bg-white dark:!bg-[#090909] text-black dark:!text-white"
      >
        <div v-for="(item, i) in optionsTokens" :key="`${i}-tokens-search`">
          <div
            @click="item.selected = !item.selected"
            class="select_token_dropdown_text d-flex justify-content-between align-items-center"
          >
            <div class="flex gap-1 items-center">
              <img :src="getTokenEntity(item.code, 'short').icon" width="17" />
              {{ item.name }}
            </div>
            <div>
              <div
                :class="
                  item.selected === true
                    ? 'checkbox_custom_selected'
                    : 'checkbox_custom'
                "
              >
                <svg
                  v-if="item.selected === true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-click-away="onClickAwayFilters">
      <div
        class="filter_button bg-white dark:!bg-[#090909] text-black dark:!text-white w-[150px]"
        :style="
          moreFiltersDropdownOpen === true
            ? 'border-radius: 16px 16px 0px 0px;'
            : ''
        "
        @click="moreFiltersDropdownOpen = !moreFiltersDropdownOpen"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.6666 2H1.33331L6.66665 8.30667V12.6667L9.33331 14V8.30667L14.6666 2Z"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="stroke-black dark:!stroke-[#F8F8F8]"

          />
        </svg>

        More filters
      </div>
      <div
        v-if="moreFiltersDropdownOpen === true"
        class="select_token_dropdown bg-white dark:!bg-[#090909] text-black dark:!text-white"
      >
        <div class="text-[13px] font-bold">
          Pool Type
        </div>
        <div v-for="(item, i) in optionsPoolType" :key="`${i}-pooltype-search`">
          <div
            @click="item.selected = !item.selected"
            class="select_token_dropdown_text d-flex justify-content-between align-items-center"
          >
            <div  class="flex gap-1 items-center">
              {{ item.name }}
            </div>
            <div>
              <div
                :class="
                  item.selected === true
                    ? 'checkbox_custom_selected'
                    : 'checkbox_custom'
                "
              >
                <svg
                  v-if="item.selected === true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="text-[13px] font-bold">
          Pool attributes
        </div>
        <div
          v-for="(item, i) in optionsPoolAttribute"
          :key="`${i}-pooltype-search`"
        >
          <div
            @click="item.selected = !item.selected"
            class="select_token_dropdown_text d-flex justify-content-between align-items-center"
          >
            <div  class="flex gap-1 items-center">
              {{ item.name }}
            </div>
            <div>
              <div
                :class="
                  item.selected === true
                    ? 'checkbox_custom_selected'
                    : 'checkbox_custom'
                "
              >
                <svg
                  v-if="item.selected === true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  style="margin-top: -11px"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
     <!-- <div class="flex items-center gap-2">
        <Toggler :toggle="hidePools"  :label="''" />
        <div class="dark:!text-white text-black" style="font-size: clamp(12px, 0.8vw, 16px)">
          Staked only
        </div>
      </div> -->
  </div>
</template>
<script setup>
import { getTokenEntity } from '@/lib/helpers/util';
import {ref, defineProps, defineEmits} from 'vue'
// import Toggler from '@/UI/Toggler.vue'


defineProps(['hidePools', 'optionsPoolType', 'optionsPoolAttribute', 'optionsTokens'])


const selectTokenDropdownOpen = ref(false)
const moreFiltersDropdownOpen = ref(false)

const onClickAway = (event) => {
  selectTokenDropdownOpen.value = false
}
const onClickAwayFilters = (event) => {
  moreFiltersDropdownOpen.value = false
}
</script>
<style lang="scss" scoped>


.checkbox_custom {
  width: 10px;
  height: 10px;
  border: 1px solid #1f1f1f;
}

.checkbox_custom_selected {
  width: 10px;
  height: 10px;
  border: 1px solid #1f1f1f;
  background: #00affe;
}

.filter_button {

  border-radius: 16px;
  border: 1px solid #3737374a;
  box-shadow: 0px 4px 4px 0px #15151540;
  cursor: pointer;
  padding: 8px 12px;
  
  font-family: Poppins;
  font-size: 14px;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 8px;
}

.select_token_dropdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 100;
  position: absolute;
  // background: black;
  padding: 11.5px;
  width: 150px;
  height: 160px;
  overflow-y: auto;
  font-family: Segoe UI;
  font-size: 13px;
  font-weight: 600;
  line-height: 19px;
  letter-spacing: 0em;
  // color: #ffffff;
  border-radius: 0px 0px 16px 16px;
  border: 1px solid #3737374a;
  box-shadow: 0px 4px 4px 0px #15151540;

  &_text {
    &:hover {
      color: #00c9ff;
      cursor: pointer;
    }
  }
}

/* Scrollbar */
.select_token_dropdown::-webkit-scrollbar {
  height: 0px;
  width: 4px;
}

.select_token_dropdown::-webkit-scrollbar {
  background: transparent;
}

.select_token_dropdown::-webkit-scrollbar-thumb {
  background-color: #00e0ff9e;
  border-radius: 8px;
}
</style>
