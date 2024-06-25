<template>
  <div class="flex md:gap-1 gap-4  justify-between md:overflow-hidden overflow-y-auto">
    <div class="flex gap-4 ">
      <div class="overview_big_container bg-[#FFFFFF24] dark:!bg-[#22222224]" v-for="(item, i) in bigContainerMock"
        :key="`${i}-big-container`">
        {{ console.log('generalOverviewLoader', generalOverviewLoader) }}
        <LoaderPulse v-if="generalOverviewLoader" />
        <div v-else>
          <div class="flex justify-between items-center mb-10">
            <div>
              <div class="text_header dark:!text-[#ffffffb2] text-[#000000B2]">
                {{ item.name }}
              </div>
              <div class="text_value text-black dark:!text-white">
                {{
                  typeof item.value === 'string' ? item.value :
                  item.name.includes('Referral Tier')
                    ? `${parseFloat(item.value).toFixed(1)}%`
                    : `$${parseFloat(item.value)}`
                }}
              </div>
            </div>
            <div class="icon_container bg-white dark:!bg-[#22222224]">
              <img :src="item.icon" />
            </div>
          </div>

          <div>
            <div class="text_header dark:!text-[#ffffffb2] text-[#000000B2]">
              {{ item.description }}
            </div>
            <div class="text_value text-black dark:!text-white flex items-center gap-1">
              {{
                typeof item.value_2 === 'string' ? item.value_2 :
                item.name.includes('Referral Tier')
                  ? `${parseFloat(item.value_2).toFixed(1)}%`
                  : `$${parseFloat(item.value_2)}`
              }}
              <div class="flex items-center text-[8px] text-[#8E8E8E]">
                <svg :class="parseFloat(item.value_2) > 0
                  ? ''
                  : 'rotate-180'" width="7" height="7" viewBox="0 0 7 7" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_323_7059)">
                    <path
                      d="M5.443 3.82153C5.75076 4.35499 5.36579 5.02177 4.74993 5.02197L1.60356 5.02381C0.987104 5.0244 0.601444 4.35685 0.909706 3.82292L2.48448 1.09532C2.79275 0.561397 3.56369 0.561612 3.87141 1.09578L5.443 3.82153Z"
                      :fill="parseFloat(item.value_2) > 0
                        ? '#40B66B'
                        : '#D22B2B'
                        " />
                  </g>
                  <defs>
                    <clipPath id="clip0_323_7059">
                      <rect width="5.12436" height="5.12436" fill="white"
                        transform="translate(4.43781 7) rotate(-150)" />
                    </clipPath>
                  </defs>
                </svg>
                {{ item?.percentage?.toFixed(2) }}%
              </div>
            </div>
          </div>
     
        </div>
      </div>
    </div>
    <div class="flex gap-3 flex-col">
      <div class="overview_small_container bg-[#FFFFFF24] dark:!bg-[#22222224]" v-for="(item, i) in smallContainerMock"
        :key="`${i}-small`">
        <LoaderPulse v-if="generalOverviewLoader" />
        <div v-else class="flex justify-between items-center">
          <div>
            <div class="text_header dark:!text-[#ffffffb2] text-[#000000B2]">
              {{ item.name }}
            </div>
            <div class="text_value text-black dark:!text-white">
              {{
                typeof item.value === 'string' ? item.value :
                parseFloat(item.value)
                  .toFixed(3)
                  .replace(/(\.0+|0+)$/, '')
              }}
            </div>
          </div>
          <div class="icon_container bg-white dark:!bg-[#22222224]">
            <img :src="item.icon" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import LoaderPulse from '../loaders/LoaderPulse.vue'

import poolsIcon from '@/assets/icons/generalIcons/poolsIcon.svg'
import walletIcon from '@/assets/icons/generalIcons/walletIcon.svg'
import moneyIcon from '@/assets/icons/generalIcons/moneyIcon.svg'
import TotalProfitsIcon from '@/assets/icons/generalIcons/TotalProfits.svg'
import averageAPRIcon from '@/assets/icons/generalIcons/averageAPR.svg'
import myCodeIcon from '@/assets/icons/generalIcons/myCodeIcon.svg'
import d3logo from '@/assets/images/d3v.png'
import { defineProps, computed } from 'vue'
import { t } from 'i18next'

import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'


const settingsStore = useSettings();

const { currentCurrency } = storeToRefs(settingsStore)
// const postfix = computed(() => currentCurrency.value == "USD" ? "" : `_${currentCurrency.value}`)
// const isDark = useDark()

// const props = defineProps(['overview'])
const bigContainerMock = computed(() =>
 [
      {
        icon: TotalProfitsIcon,
        name: 'Referral Tier',
        value: 'Tier 1',
        description: `Revenue Share`,
        value_2: 0.1,

      },
      {
        icon: averageAPRIcon,
        name: 'TVL Referred',
        value: 2545,
        description: `TVL 24H`,
        value_2: 545,
        percentage: 5.15

      },
      {
        icon: moneyIcon,
        name: 'Total Returns',
        value: 235.56,
        description: `Returns 24H `,
        value_2: 35.5,
        percentage: 5.15

      },
      {
        icon: walletIcon,
        name: 'Total Referred Wallets',
        value: '14',
        description: `Returns 24H `,
        value_2: '7',
        percentage: 50.15

      },

    ]
   
)

const smallContainerMock = computed(() =>
 [
      {
        icon: myCodeIcon,
        name: 'My Code',
        value: 'Code2',
      },
      {
        icon: poolsIcon,
        name: 'Number of Pools',
        value: 20,
      },

    ]
    
)
</script>
<style lang="scss" scoped>
.overview_big_container {
  backdrop-filter: blur(10px);
  border: 1px solid #00e0ff61;
  border-radius: 30px;
  padding: 20px 30px;
  width: 16.5vw;
  box-shadow: 0px 4px 4px 0px #00000040;

  @media (min-width: 1950px) {
    width: 10.5vw;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
}

.overview_small_container {
  backdrop-filter: blur(10px);
  border: 1px solid #00e0ff61;
  border-radius: 30px;
  padding: 10px 30px;
  width: 14vw;
  height: fit-content;
  box-shadow: 0px 4px 4px 0px #00000040;

  @media (min-width: 1950px) {
    width: 10.5vw;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
}

.icon_container {
  // background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;

  border-radius: 16px;
  padding: 10px;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text_header {
  font-size: clamp(10px, 0.7vw, 13px);
  font-weight: 400;
  line-height: 17px;
  // color: #ffffffb2;
}

.text_value {
  font-family: 'Roboto Mono', monospace;
  font-size: clamp(18px, 1vw, 32px);
  font-weight: 700;
  line-height: 34px;
  // color: #ffffff;
}

:deep(.chartjs-tooltip) {
  display: none !important;
}
</style>
