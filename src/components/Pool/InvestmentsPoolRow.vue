<template>
  <div :class="`pools-row__wrapper${inactive ? '__inactive' : ''}`">
    <div class="pools-row hover:!bg-[#66c5ff3d] dark:hover:!bg-[#4242421d]"
      @click="isActions ? (visibleDetails = !visibleDetails) : false">
      <div class="pools-row__col text-black dark:!text-white justify-content-start">
        <DataTableCellTokenNamePaired :value="pool['Name']" />
      </div>

      <div class="pools-row__col text-black dark:!text-white">
        <div class="pools-row__info">
          <div class="pools-row__value flex items-center gap-1">
            <img :src="APRIcon" />
            {{ pool['AVG APR'] }}%
          </div>
        </div>
      </div>
      <!-- TOTAL RETURNS -->
      <!-- <div class="pools-row__col text-black dark:!text-white">
        <div class="pools-row__info">
          <div class="pools-row__value">
            -
          </div>
        </div>
      </div> -->
      <div class="pools-row__col text-black dark:!text-white">
        <div class="pools-row__info">
          <div class="pools-row__value flex items-center">
            <CurrencySymbol />
            {{
            numberToAposthrophe(
            pool[`shareBalance${postfix_raw}`],
            currencyDecimals,
            )
            }}
          </div>
        </div>
      </div>
      <div class="pools-row__col text-black dark:!text-white">
        <div class="pools-row__info">
          <div class="pools-row__value">
            {{ pool['% of Pool'].toFixed(3) }}%
          </div>
        </div>
      </div>

      <!-- REWARDS -->
      <!-- <div class="pools-row__col text-black dark:!text-white">
        <div class="pools-row__info">
          <div class="pools-row__value">
            -
          </div>
        </div>
      </div> -->

      <div class="pools-row__col text-black dark:!text-white">
        <div class="pools-row__info">
          <div class="pools-row__value">
            <div class="flex items-center font-['Roboto_Mono',_monospace]">
              <CurrencySymbol />
              {{
              numberToAposthrophe(
              Number(
              currentCurrency == 'USD'
              ? pool['TVL']
              : pool[`TVL_${currentCurrency}`],
              ),
              currencyDecimals,
              )
              }}
            </div>
          </div>
        </div>
      </div>

      <div class="pools-row__col text-black dark:!text-white">
        <div class="pools-row__info">
          <div class="pools-row__value">
            <div class="flex items-center font-['Roboto_Mono',_monospace]">
              <CurrencySymbol />{{
              numberToAposthrophe(
              Number(
              currentCurrency == 'USD'
              ? pool['Volume']
              : pool[`Volume_${currentCurrency}`],
              ),
              currencyDecimals,
              )
              }}
            </div>
          </div>
        </div>
      </div>

      <div class="pools-row__col !justify-center text-black dark:!text-white" v-if="isActions">
        <div class="pools-row__dropdown" v-if="visibleDetails == false">
          {{ $t('details') }}

          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.6263 0.741797L4.85966 3.97516L8.09299 0.741797C8.41799 0.416797 8.943 0.416797 9.26799 0.741797C9.59299 1.0668 9.59299 1.59183 9.26799 1.91683L5.44299 5.74183C5.11799 6.06683 4.59299 6.06683 4.26799 5.74183L0.442969 1.91683C0.117969 1.59183 0.117969 1.0668 0.442969 0.741797C0.767969 0.42513 1.3013 0.416797 1.6263 0.741797Z"
              class="fill-black dark:!fill-white" />
          </svg>
        </div>
        <div class="pools-row__dropdown" :class="{ 'pools-row__dropdown_active': visibleDetails }" v-else>
          {{ $t('hide') }}
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="rotate-180">
            <path
              d="M1.6263 0.741797L4.85966 3.97516L8.09299 0.741797C8.41799 0.416797 8.943 0.416797 9.26799 0.741797C9.59299 1.0668 9.59299 1.59183 9.26799 1.91683L5.44299 5.74183C5.11799 6.06683 4.59299 6.06683 4.26799 5.74183L0.442969 1.91683C0.117969 1.59183 0.117969 1.0668 0.442969 0.741797C0.767969 0.42513 1.3013 0.416797 1.6263 0.741797Z"
              class="fill-black dark:!fill-white" />
          </svg>
        </div>
      </div>
    </div>
    <CCollapse :visible="visibleDetails">
      <div class="details-el">
        <div class="details-el__col flex-column gap-3 font-['Syne',_sans-serif]">
          <!--<div class="details-el__activity text-black dark:!text-white hover:!text-[#03a6e9]"
            @click="addTokenToMetamask(pool.address, lp_name)">
            {{ $t('add') }} {{ lp_name }}
          </div>-->
          <div class="details-el__activity text-black dark:!text-white hover:!text-[#03a6e9]" @click="
              pool['LiquidityType'] === 'CL'
                ? $emit('goToCLPool', { index, onMountedActivity: 'info' })
                : $emit('goToPool', { index, onMountedActivity: 'info' })
            ">
            {{ $t('see_pool_info') }}
            <svg style="margin-left: 5px" width="15" height="15" viewBox="0 0 15 15" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.4375 6.5625L13.125 1.875M13.125 1.875H10M13.125 1.875V5M13.125 8.75V11.875C13.125 12.2065 12.9933 12.5245 12.7589 12.7589C12.5245 12.9933 12.2065 13.125 11.875 13.125H3.125C2.79348 13.125 2.47554 12.9933 2.24112 12.7589C2.0067 12.5245 1.875 12.2065 1.875 11.875V3.125C1.875 2.79348 2.0067 2.47554 2.24112 2.24112C2.47554 2.0067 2.79348 1.875 3.125 1.875H6.25"
                stroke="#8F8F8F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="details-el__activity text-black dark:!text-white hover:!text-[#03a6e9]">
            <a :href="`${etherscan_link}/token/${pool.address}`" target="_blank"
              class="flex items-center gap-1 !text-black dark:!text-white hover:!text-[#03a6e9]">
              {{ $t('view_contract') }}
              <img :src="isDark ? etherscan : binanceScanLight" style="margin-left: 5px" /></a>
          </div>
        </div>
        <div v-if="!userStakedPool" class="liquidity_button_container text-black dark:!text-white">
          <div class="liquidity_button_text flex items-center gap-1 !text-black dark:!text-white">
            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.915 1.38066C10.0825 -0.125586 7.9175 -0.125586 7.085 1.38066L0.526874 13.255C-0.278126 14.7125 0.776874 16.5 2.44187 16.5H15.5587C17.2237 16.5 18.2787 14.7125 17.4731 13.255L10.915 1.38066ZM9.78125 12.75C9.78125 12.9572 9.69894 13.156 9.55243 13.3025C9.40591 13.449 9.2072 13.5313 9 13.5313C8.7928 13.5313 8.59408 13.449 8.44757 13.3025C8.30106 13.156 8.21875 12.9572 8.21875 12.75C8.21875 12.5428 8.30106 12.3441 8.44757 12.1976C8.59408 12.0511 8.7928 11.9688 9 11.9688C9.2072 11.9688 9.40591 12.0511 9.55243 12.1976C9.69894 12.3441 9.78125 12.5428 9.78125 12.75ZM9 4.62504C9.16576 4.62504 9.32473 4.69089 9.44194 4.8081C9.55915 4.92531 9.625 5.08428 9.625 5.25004V10.25C9.625 10.4158 9.55915 10.5748 9.44194 10.692C9.32473 10.8092 9.16576 10.875 9 10.875C8.83424 10.875 8.67527 10.8092 8.55806 10.692C8.44085 10.5748 8.375 10.4158 8.375 10.25V5.25004C8.375 5.08428 8.44085 4.92531 8.55806 4.8081C8.67527 4.69089 8.83424 4.62504 9 4.62504Z"
                fill="#F8F8F8" />
            </svg>
            {{ $t('no_liquidity_deposited') }}
          </div>
          <div @click="
              pool['LiquidityType'] === 'CL'
                ? $emit('goToCL', { index })
                : $emit('goToPoolDeposit', {
                    index,
                    onMountedActivity: 'deposit',
                  })
            " class="liquidity_button !text-white uppercase" :class="
              pool['LiquidityType'] === 'CL'
                ? 'liquidity_button_LP'
                : 'liquidity_button_WP'
            ">
            {{ $t('add_liquidity') }}
          </div>
        </div>

        <div v-else
          class="flex md:items-center items-start gap-4 md:flex-row flex-col liquidity_button_container text-black dark:!text-white">
          <div class="details-el__col">
            <div v-if="pool['LiquidityType'] === 'CL'"
              class="details-el__title d-flex gap-1 align-items-center orange w-fit px-2 py-1 rounded font-['Syne',_sans-serif] bg-[#DCEEF60D]">
              {{ $t('concentrated_liquidity_pool') }}
              <div class="details-el__circle"></div>
            </div>
            <div v-else
              class="details-el__title d-flex gap-1 align-items-center blue w-fit px-2 py-1 rounded font-['Syne',_sans-serif] bg-[#DCEEF60D]">
              {{ $t('weighted_pool') }}
              <div class="details-el__circle"></div>
            </div>

            <div class="d-flex align-items-end justify-content-between mt-4">
              <div v-if="pool['LiquidityType'] === 'WP'" style="font-size: 9px; font-weight: 700"
                class="flex items-center gap-1">
                <div class="text-[18px] font-[700]">
                  {{ lp_name }}
                </div>
              </div>
              <div v-else class="d-flex flex-column gap-2">
                <div class="text-[18px] font-[700]">
                  {{ lp_name }}
                </div>
              </div>
              <div class="actions_button text-black dark:!text-white" @click="
                  $emit('goToPoolManage', {
                    index,
                    onMountedActivity: 'deposit',
                  })
                ">
                {{
                pool['LiquidityType'] === 'CL'
                ? 'Manage Position'
                : 'Add liquidity'
                }}
              </div>
            </div>
          </div>

          <div class="flex h-[100px]" v-if="width > 768">
            <div class="vr" style="border: 1px solid #383838"></div>
          </div>
          <svg v-else width="356" height="2" viewBox="0 0 356 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="-0.000976562" y1="1.01147" x2="356" y2="1.01147" stroke="url(#paint0_linear_820_14698)"
              stroke-opacity="0.22" stroke-dasharray="8 8" />
            <defs>
              <linearGradient id="paint0_linear_820_14698" x1="-0.000976563" y1="2.01147" x2="356" y2="2.01147"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="#F9F9F9" stop-opacity="0.12" />
                <stop offset="1" stop-color="white" />
              </linearGradient>
            </defs>
          </svg>

          <div class="details-el__col">
            <div :class="pool['LiquidityType'] === 'CL' ? 'orange' : 'blue'"
              class="details-el__title d-flex gap-1 align-items-center w-fit px-2 py-1 rounded font-['Syne',_sans-serif] bg-[#DCEEF60D]">
              {{ $t('liquidity_added') }}
              <div class="details-el__circle"></div>
            </div>

            <div class="d-flex align-items-end justify-content-between mt-4 gap-3">
              <div class="d-flex flex-column gap-2">
                <div class="text-[18px] font-[700] font-['Roboto_Mono',_monospace]">
                  <CurrencySymbol />
                  {{
                  numberToAposthrophe(
                  pool[`shareBalance${postfix_raw}`],
                  currencyDecimals,
                  )
                  }}
                </div>
              </div>
              <div class="actions_button" @click="
                  pool['LiquidityType'] === 'CL'
                    ? $emit('goToCL', { index, onMountedActivity: 'withdraw' })
                    : $emit('goToPoolWithdraw', {
                        index,
                        onMountedActivity: 'withdraw',
                      })
                ">
                {{
                pool['LiquidityType'] === 'CL'
                ? t('add_new_position')
                : t('withdraw')
                }}
              </div>
            </div>
          </div>
          <div class="flex h-[100px]" v-if="width > 768">
            <div class="vr" style="border: 1px solid #383838"></div>
          </div>
          <svg v-else width="356" height="2" viewBox="0 0 356 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="-0.000976562" y1="1.01147" x2="356" y2="1.01147" stroke="url(#paint0_linear_820_14698)"
              stroke-opacity="0.22" stroke-dasharray="8 8" />
            <defs>
              <linearGradient id="paint0_linear_820_14698" x1="-0.000976563" y1="2.01147" x2="356" y2="2.01147"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="#F9F9F9" stop-opacity="0.12" />
                <stop offset="1" stop-color="white" />
              </linearGradient>
            </defs>
          </svg>
          <div class="details-el__col">
            <div
              class="details-el__title d-flex gap-1 align-items-center blue w-fit px-2 py-1 rounded font-['Syne',_sans-serif] bg-[#DCEEF60D]">
              {{ $t('rewards') }}
              <div class="details-el__circle"></div>
            </div>

            <div class="d-flex align-items-end justify-content-between mt-4 gap-3">
              <div class="d-flex flex-column gap-2">
                <div class="text-[18px] font-[700]">${{total_rewards.toFixed(5)}}</div>
              </div>
              <div class="actions_button text-black dark:!text-[#00E0FF]"
                @click="claimRewards(rewardsData[pool.address])">
                {{ $t('claim') }}
              </div>
            </div>
          </div>
          <div class="details-el__col">
            <div
              class="details-el__title d-flex gap-1 align-items-center blue w-fit px-2 py-1 rounded font-['Syne',_sans-serif] bg-[#DCEEF60D]"
            >
              {{ $t('Compounder') }}
              <div class="details-el__circle"></div>
            </div>

            <div
              class="d-flex align-items-end justify-content-between mt-4 gap-3"
            >
              <div class="d-flex flex-column gap-2">
                <div class="text-[18px] font-[700]">${{ total_rewards.toFixed(5) }}</div>
              </div>
              <div
                class="actions_button text-black dark:!text-white"
                @click="
                     $emit('goToPoolCompound', {
                        index,
                        onMountedActivity: 'compound',
                      })
                    
                "
              >
                {{ $t('Compound') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CCollapse>
  </div>
</template>
<script setup>
import { toRefs, defineProps, ref, computed } from 'vue'
import DataTableCellTokenNamePaired from '@/components/DataTable/Cell/TokenNamePaired.vue'
import { configService } from '@/services/config/config.service'
import { ReversedDisplayNetwork } from '@/composables/useNetwork'
import numberToAposthrophe from '@/lib/formatter/numberToAposthrophe'
import etherscan from '@/assets/icons/etherscan.svg'
import router from '@/router'
import APRIcon from '@/assets/icons/sidebarIcons/rewards_icon.svg'
import arrow_up from '@/assets/icons/arrow/arrow_up.svg'
import CurrencySymbol from '@/components/TrackInfo/CurrencySymbol.vue'
import { addTokenToMetamask } from '@/lib/utils/metamask'
import { useDark } from '@vueuse/core'
import binanceScanLight from '@/assets/icons/binanceScanLight.svg'
import { t } from 'i18next'


import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'
import { useDevice } from '@/composables/adaptive/useDevice'
import { claimRewards } from "@/composables/portfolio/useRewards"
const settingsStore = useSettings()
const { width } = useDevice()
const { currentCurrency } = storeToRefs(settingsStore)

const postfix_raw = computed(() =>
  currentCurrency.value == 'USD' ? 'Usd' : currentCurrency.value,
)
const currencyDecimals = computed(() =>
  currentCurrency.value == 'USD' ? 0 : 3,
)
const isDark = useDark()

const props = defineProps({
  pool: Object,
  index: String,
  inactive: Boolean,
  isActions: Boolean,
  userPools: [],
  rewardsData:Object,
})

const { pool, index, inactive, isActions, userPools,rewardsData } = toRefs(props)
const total_rewards = computed(() => rewardsData.value && rewardsData.value[pool.value.address] ? rewardsData.value[pool.value.address].formatted_rewards.reduce((sum, value) => sum + value.rewardUsd, 0) : 0)

const userStakedPool = computed(() =>
  userPools.value.find((item) => item.id == pool.value.id),
)
const lp_name = computed(() => pool.value['Name'].join('-'))
const etherscan_link = computed(() => {
  return configService.getNetworkConfig(ReversedDisplayNetwork['Binance'])
    .explorer
})

const visibleDetails = ref(false)
</script>
<style lang="scss">
@import '@/styles/_variables.scss';

.token-name-container {
  padding-left: 0px !important;

  .short {
    @media (max-width: $xxl) {
      font-size: 10px !important;
    }
  }

  .pair_avatars {
    @media (max-width: $xxl) {
      width: 35px;
    }

    &:not(:first-child) {
      margin-left: -10px;
    }
  }
}

.pools {
  &-row {
    display: flex;
    align-items: center;
    padding: 24px 32px;
    border-bottom: 1px solid rgba(49, 56, 61, 0.568);
    cursor: pointer;

    @media all and (max-width: $lg) {
      min-width: 130%;
    }

    @media all and (max-width: $md) {
      min-width: 300%;
    }

    &:hover {
      // background: linear-gradient(
      //   0deg,
      //   rgba(43, 43, 43, 0.33),
      //   rgba(43, 43, 43, 0.115)
      // );
    }

    &__col {
      display: flex;
      // color: #fff;
      width: 22% !important;
      justify-content: center;

      @media (max-width: $xxl) {
        width: 23%;
      }

      &:first-child {
        // min-width: 185px;

        // @media (max-width: $xl) {
        //   min-width: 250px;
        // }

        // @media (max-width: $lg) {
        //   min-width: 200px;
        // }
      }

      // &:last-child {
      //   width: 10%;
      // }
    }

    &__value {
      font-size: clamp(10px, 1vw, 14px);
      font-weight: 400;
      font-family: 'Roboto Mono', monospace;

      @media (max-width: $xxl) {
        // font-size: 10px;
      }
    }

    &__dropdown {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;

      @media (max-width: $xxl) {
        font-size: 12px;
      }

      svg {
        @media (max-width: $xxl) {
          width: 14px;
          height: 14px;
        }
      }

      &_active {
        svg {
          transform: rotate(180deg);
        }
      }
    }

    &__wrapper {
      &:last-child {
        .pools-row {
          border-bottom: none;
        }
      }

      &__inactive {
        // opacity: 0.5;
      }
    }

    &:first-child {
      // .pools-row__value {
      //   @media (max-width: $xxl) {
      //     font-size: 12px;
      //   }
      // }
    }
  }
}

.chip_token {
  border-radius: 16px;
  // background: #22222224;
  // box-shadow: 0px 4px 4px 0px #00000040;
  border: 0.5px solid #dceef633;

  padding: 3px 7px;

  &_name {
    font-size: 12px;
    font-weight: 400;
    line-height: 24px;
    // color: #ffffff;
  }

  &_weight {
    font-family: 'Roboto Mono', monospace;

    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    // color: #8f8f8f;
  }
}



.liquidity_button_text {
  font-size: 12px;
  font-weight: 400;
  line-height: 21px;
  // color: #f0f0f0;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.green {
  color: #00dc3e;

  .details-el__circle {
    background: #00dc3e;
    box-shadow: 0px 0px 10px 0px rgba(249, 188, 45, 0.5);
  }
}

.orange {
  color: #fb800f;

  .details-el__circle {
    background: #fb800f;
    box-shadow: 0px 0px 10px 0px #2d59f979;
  }
}

.blue {
  color: #00E0FF;

  .details-el__circle {
    background: #00E0FF;
    box-shadow: 0px 0px 10px 0px #00E0FF;
  }
}

.green {
  color: #03e9c0;

  .details-el__circle {
    background: #03e9c0;
    box-shadow: 0px 0px 10px 0px rgba(49, 216, 164, 0.5);
  }
}

.actions_button {
  font-size: 10px;
  font-weight: 600;
  line-height: 21px;
  // color: #ffffff;
  box-shadow: 0px 4px 8.9px 0px #79797933;
  margin-left: 20px;
  padding: 6px 20px;
  border-radius: 20px;
  border: 1px solid #00E0FF;
  text-transform: uppercase;

  &:hover {
    filter: drop-shadow(0 0 0.2rem #00e0ff);
    background: #2abcffa4;
    cursor: pointer;
  }
}
</style>
