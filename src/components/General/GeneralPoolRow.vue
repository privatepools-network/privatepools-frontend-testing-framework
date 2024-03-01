<template>
    <div :class="`pools-row__wrapper${inactive ? '__inactive' : ''}`">
      <div class="pools-row" @click="isActions ? (visibleDetails = !visibleDetails) : false">
        <div class="pools-row__col">
          <div class="pools-row__info">
            <div class="pools-row__value">
              {{ index + 1 }}
            </div>
          </div>
        </div>
        <div class="pools-row__col d-flex align-items-center">
          <DataTableCellTokenNamePaired :value="pool['Pool Name']" style="margin-right: 10px;"/> <span class="pools-row__value">WLP-</span>
          <div class="pools-row__value" v-for="(item, i) in pool['Pool Weight'][0]" :key="`${i}-tokens`">
              <div class="d-flex gap-2 align-items-center">
                <span class="">{{ item.token }}/</span>
              </div>
          </div>
        </div>
     
        <div class="pools-row__col">
          <div class="pools-row__info">
            <div class="pools-row__value">
              {{ pool['Profit'] }}
            </div>
          </div>
        </div>
        <div class="pools-row__col">
          <div class="pools-row__info">
            <div class="pools-row__value">
              ${{ numberToAposthrophe(Number(pool['Revenue']).toFixed(0)) }}
            </div>
          </div>
        </div>
        <div class="pools-row__col">
          <div class="pools-row__info">
            <div class="pools-row__value">
              ${{ numberToAposthrophe(Number(pool['Trades']).toFixed(0)) }}
            </div>
          </div>
        </div>
      
  
        <div class="pools-row__col">
          <div class="pools-row__info">
            <div class="pools-row__value">
              ${{ numberToAposthrophe(Number(pool['Volume']).toFixed(0)) }}
            </div>
          </div>
        </div>

        <div class="pools-row__col">
          <div class="pools-row__info">
            <div class="pools-row__value">
              ${{ numberToAposthrophe(Number(pool['TVL']).toFixed(0)) }}
            </div>
          </div>
        </div>

        <div class="pools-row__col">
          <div class="pools-row__info">
            <div class="pools-row__value">
              ${{ numberToAposthrophe(Number(pool['Fees']).toFixed(0)) }}
            </div>
          </div>
        </div>
  
        <div class="pools-row__col">
          <div class="pools-row__info">
            <div class="pools-row__value">
              {{ Number(pool['APR']).toFixed(0) }}%
              <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M8.87855 4.65411C8.43073 4.92921 8.07876 5.55162 7.92322 6.34349L7.63295 7.82082C7.62878 7.84334 7.61689 7.85851 7.60351 7.85851C7.59012 7.85851 7.57823 7.84334 7.57407 7.82082L7.28383 6.34349C7.12825 5.55157 6.7762 4.92915 6.32834 4.65411L5.49294 4.14094C5.48048 4.13327 5.4721 4.1125 5.4721 4.08917C5.4721 4.06585 5.48048 4.04508 5.49294 4.03741L6.32834 3.52424C6.7762 3.2492 7.12825 2.62677 7.28383 1.83486L7.57407 0.357515C7.57823 0.335026 7.59012 0.319824 7.60351 0.319824C7.61689 0.319824 7.62878 0.335026 7.63295 0.357515L7.92322 1.83486C8.07876 2.62674 8.43073 3.24915 8.87855 3.52424L9.71399 4.03741C9.72642 4.04508 9.73479 4.06585 9.73479 4.08917C9.73479 4.1125 9.72642 4.13327 9.71399 4.14094L8.87855 4.65411ZM5.2054 9.26357C4.58345 9.64571 4.09462 10.5102 3.87859 11.61L3.47532 13.6618C3.4694 13.6928 3.453 13.7135 3.43455 13.7135C3.4161 13.7135 3.3997 13.6928 3.39378 13.6618L2.99051 11.61C2.77448 10.5102 2.28565 9.64571 1.66371 9.26357L0.503264 8.55086C0.485961 8.54018 0.474365 8.51138 0.474365 8.47893C0.474365 8.44654 0.485961 8.41774 0.503264 8.40706L1.66371 7.69435C2.28566 7.31221 2.77449 6.44776 2.99051 5.34794L3.39378 3.29608C3.3997 3.26519 3.4161 3.2444 3.43455 3.2444C3.453 3.2444 3.4694 3.26519 3.47532 3.29608L3.87859 5.34794C4.09462 6.44776 4.58345 7.31221 5.2054 7.69435L6.36585 8.40706C6.38314 8.41774 6.39475 8.44654 6.39475 8.47893C6.39475 8.51138 6.38314 8.54018 6.36585 8.55086L5.2054 9.26357ZM7.57499 14.4665C7.69943 13.833 7.98094 13.3351 8.33917 13.115L9.00781 12.7045C9.01777 12.6983 9.02448 12.6817 9.02448 12.663C9.02448 12.6444 9.01777 12.6277 9.00781 12.6216L8.33917 12.2111C7.98094 11.9909 7.69943 11.493 7.57499 10.8595L7.34271 9.67771C7.33962 9.65902 7.32994 9.64622 7.31894 9.64622C7.30794 9.64622 7.29826 9.65902 7.29517 9.67771L7.06347 10.8595C6.93892 11.4933 6.65713 11.9912 6.29871 12.2111L5.63065 12.6216C5.62069 12.6277 5.61398 12.6444 5.61398 12.663C5.61398 12.6817 5.62069 12.6983 5.63065 12.7045L6.29871 13.115C6.65713 13.3349 6.93892 13.8328 7.06347 14.4665L7.29517 15.6484C7.29826 15.667 7.30794 15.6798 7.31894 15.6798C7.32994 15.6798 7.33962 15.667 7.34271 15.6484L7.57499 14.4665Z"
                  fill="url(#paint0_linear_156_79)" />
                <defs>
                  <linearGradient id="paint0_linear_156_79" x1="9.73479" y1="-7.36018" x2="-3.98304" y2="3.45496"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#F21BF6" />
                    <stop offset="1" stop-color="#FED533" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
  
        <div class="pools-row__col" v-if="isActions">
          <div class="pools-row__dropdown" v-if="visibleDetails == false">
            Details
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 20 24" fill="none">
              <path
                d="M6.76644 9.7418L9.9998 12.9752L13.2331 9.7418C13.5581 9.4168 14.0831 9.4168 14.4081 9.7418C14.7331 10.0668 14.7331 10.5918 14.4081 10.9168L10.5831 14.7418C10.2581 15.0668 9.73313 15.0668 9.40813 14.7418L5.58311 10.9168C5.25811 10.5918 5.25811 10.0668 5.58311 9.7418C5.90811 9.42513 6.44144 9.4168 6.76644 9.7418Z"
                fill="white" />
            </svg>
          </div>
          <div class="pools-row__dropdown" :class="{ 'pools-row__dropdown_active': visibleDetails }" v-else>
            Hide
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 20 24" fill="none">
              <path
                d="M6.76644 9.7418L9.9998 12.9752L13.2331 9.7418C13.5581 9.4168 14.0831 9.4168 14.4081 9.7418C14.7331 10.0668 14.7331 10.5918 14.4081 10.9168L10.5831 14.7418C10.2581 15.0668 9.73313 15.0668 9.40813 14.7418L5.58311 10.9168C5.25811 10.5918 5.25811 10.0668 5.58311 9.7418C5.90811 9.42513 6.44144 9.4168 6.76644 9.7418Z"
                fill="white" />
            </svg>
          </div>
        </div>
      </div>
      <CCollapse :visible="visibleDetails">
        <div class="details-el">
          <div class="details-el__col flex-column gap-3">
            <div class="details-el__activity details-el__activity_deposit"
              @click="$emit('goToPoolDeposit', { index, onMountedActivity: 'deposit' })">
              Add {{ lp_name }} LP
            </div>
            <div class="details-el__activity details-el__activity_info"
              @click="pool['LiquidityType'] === 'CL' ? $emit('goToCLPool', { index, onMountedActivity: 'info' }) : $emit('goToPool', { index, onMountedActivity: 'info' })">
              SEE Pool info
              <svg style="margin-left: 5px" width="15" height="15" viewBox="0 0 15 15" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.4375 6.5625L13.125 1.875M13.125 1.875H10M13.125 1.875V5M13.125 8.75V11.875C13.125 12.2065 12.9933 12.5245 12.7589 12.7589C12.5245 12.9933 12.2065 13.125 11.875 13.125H3.125C2.79348 13.125 2.47554 12.9933 2.24112 12.7589C2.0067 12.5245 1.875 12.2065 1.875 11.875V3.125C1.875 2.79348 2.0067 2.47554 2.24112 2.24112C2.47554 2.0067 2.79348 1.875 3.125 1.875H6.25"
                  stroke="#8F8F8F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="details-el__activity details-el__activity_withdraw">
              <a :href="`${etherscan_link}/contract/${pool.address}`" target="_blank"> VIEW CONTRACT <img :src="etherscan"
                  style="margin-left: 5px" /></a>
            </div>
          </div>
          {{ console.log('pool!', pool) }}
          <div  class="liquidity_button_container">
            <div class="liquidity_button_text">no liquidity deposited</div>
            <div
              @click="pool['LiquidityType'] === 'CL' ? $emit('goToCL', { onMountedActivity: 'deposit' }) : $emit('goToPoolDeposit', { index, onMountedActivity: 'deposit' })"
              class="liquidity_button" :class="pool['LiquidityType'] === 'CL'
                ? 'liquidity_button_LP'
                : 'liquidity_button_WP'
                ">
              ADD LIQUIDITY
            </div>
          </div>
  
         
        </div>
      </CCollapse>
    </div>
  </template>
  <script setup>
  import { toRefs, defineProps, ref, computed } from 'vue'
  import { getTokenEntity } from '@/lib/helpers/util'
  import DataTableCellTokenNamePaired from '@/components/DataTable/Cell/TokenNamePaired.vue'
  import { configService } from '@/services/config/config.service'
  import { ReversedDisplayNetwork } from '@/composables/useNetwork'
  import numberToAposthrophe from '@/lib/formatter/numberToAposthrophe'
  import etherscan from '@/assets/icons/etherscan.svg'
  import router from '@/router'
  
  const props = defineProps({
    pool: Object,
    index: Number,
    inactive: Boolean,
    isActions: Boolean,
  })
  const { pool, index, inactive, isActions } = toRefs(props)
  
  const lp_name = computed(() => pool.value['Pool Name'][0].join("-"))
  const etherscan_link = computed(() => {
    return configService.getNetworkConfig(ReversedDisplayNetwork[pool.value.Blockchain]).explorer
  })
  
  const tokenEntities = computed(() => {
    let tokens = pool?.value['Pool Name']?.flat()
    let entities = tokens?.map((propValue) => getTokenEntity(propValue, 'short'))
    return entities
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
        width: 20px;
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
      border-bottom: 1px solid rgba(49, 56, 61, 0.81);
      cursor: pointer;
  
      @media all and (max-width: $lg) {
        min-width: 130%;
      }
  
      @media all and (max-width: $md) {
        min-width: 300%;
      }
  
      &:hover {
        background: linear-gradient(0deg,
            rgba(43, 43, 43, 0.33),
            rgba(43, 43, 43, 0.115));
      }
  
      &__col {
        display: flex;
        color: #fff;
        width: 18%;
  
        @media (max-width: $xxl) {
          width: 23%;
        }
  
        &:first-child {
          min-width: 145px;
  
          @media (max-width: $xl) {
            min-width: 250px;
          }
  
          @media (max-width: $lg) {
            min-width: 200px;
          }
        }
  
        &:nth-child(2) {
          min-width: 25%;
  
          @media (max-width: $xl) {
            min-width: 250px;
          }
  
          @media (max-width: $lg) {
            min-width: 200px;
          }
        }
  
        &:last-child {
          width: 10%;
        }
  
        &:not(:first-child) {
          // justify-content: center;
        }
  
        &:last-child {
          justify-content: start;
        }
      }
  
      &__value {
        font-size: 10px;
        font-weight: 400;
  
        @media (max-width: $xxl) {
          font-size: 10px;
        }
      }
  
      &__dropdown {
        cursor: pointer;
        display: flex;
  
        @media (max-width: $xxl) {
          font-size: 10px;
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
          opacity: 0.5;
        }
      }
  
      &:first-child {
        .pools-row__value {
          @media (max-width: $xxl) {
            font-size: 10px;
          }
        }
      }
    }
  }
  
  .details {
    &-el {
      display: flex;
      align-items: center;
      padding: 24px 32px;
      background: linear-gradient(0deg,
          rgba(43, 43, 43, 33%),
          rgba(43, 43, 43, 11.5%));
      justify-content: space-between;
      border-bottom: 1px solid rgba(49, 56, 61, 0.81);
      color: #fff;
  
      @media all and (max-width: $md) {
        width: 150%;
      }
  
      &__col {
        // width: 33%;
        display: flex;
        flex-direction: column;
  
        // &:first-child {
        //   flex-direction: column;
        //   gap: 9px;
        //   position: relative;
        //   min-width: 355px;
        //   width: 355px;
        //   @media (max-width: $xl) {
        //     min-width: 250px;
        //     width: 250px;
        //   }
        //   @media (max-width: $lg) {
        //     min-width: 200px;
        //     width: 200px;
        //   }
        //   .details-el__value {
        //     margin-left: 0;
        //   }
        //   // &:after {
        //   //   height: 100%;
        //   //   width: 1px;
        //   //   content: '';
        //   //   background: #a3a4a5;
        //   //   left: 120px;
        //   //   position: absolute;
        //   //   @media (max-width: $xxl) {
        //   //     left: 100px;
        //   //   }
        //   // }
        // }
        &:last-child {
          .details-el__value {
            font-weight: 400;
            color: #fff;
          }
        }
      }
  
      &__activity {
        font-family: Inter;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        // text-decoration: underline;
        display: flex;
        align-items: center;
        color: #8f8f8f;
        cursor: pointer;
      }
  
      &__circle {
        width: 10px;
        height: 10px;
        border-radius: 5px;
        margin-right: 8px;
      }
  
      &__title,
      &__value {
        font-size: 12px;
        font-weight: 600;
  
        @media (max-width: $xxl) {
          font-size: 10px;
          font-weight: 400;
        }
      }
  
      &__value {
        color: #00c9ff;
        margin-left: 5px;
        cursor: pointer;
  
        &:hover {
          color: #01b45e !important;
        }
      }
    }
  }
  
  .chip_token {
    border-radius: 16px;
    background: #22222224;
    box-shadow: 0px 4px 4px 0px #00000040;
  
    padding: 3px 5px;
  
    &_name {
      font-family: Inter;
      font-size: 12px;
      font-weight: 400;
      line-height: 24px;
      color: #FFFFFF;
    }
  
    &_weight {
      font-family: Inter;
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      color: #8F8F8F;
    }
  }
  
  .pool_type {
    padding: 4px;
    border-radius: 4px;
    font-size: 10px;
    font-family: Inter;
    font-weight: 600;
    line-height: 16px;
    letter-spacing: 0em;
  
    &_WP {
      background: linear-gradient(45deg, #2abdff 0%, #0e3e9b 100%);
    }
  
    &_CL {
      background: linear-gradient(45deg, #f7931a 0%, #40b66b 100%);
    }
  }
  
  .liquidity_button_container {
    background: #171717;
    padding: 10px 20px;
    border-radius: 20px;
    border: 1px solid #191919;
    box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  }
  
  .liquidity_button {
    border-radius: 12px;
    font-family: Inter;
    font-size: 12px;
    font-weight: 700;
    line-height: 21px;
    color: #ffffff;
    width: 40vw;
    padding: 10px;
    text-align: center;
  
    &_LP {
      background: linear-gradient(45deg, #f7931a 0%, #40b66b 100%);
      box-shadow: 0px 4px 8.899999618530273px 0px #5eb05e3b;
  
      &:hover {
        cursor: pointer;
        filter: drop-shadow(0 0 0.4rem #40b66b);
      }
    }
  
    &_WP {
      background: linear-gradient(45deg, #2abdff 0%, #0e3e9b 100%);
      box-shadow: 0px 4px 8.899999618530273px 0px #5eb05e3b;
  
      &:hover {
        cursor: pointer;
        filter: drop-shadow(0 0 0.4rem #2abdff);
      }
    }
  }
  
  .liquidity_button_text {
    font-family: Inter;
    font-size: 12px;
    font-weight: 400;
    line-height: 21px;
    color: #f0f0f0;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  
  .orange {
    color: #f9bc2d;
  
    .details-el__circle {
      background: #f9bc2d;
      box-shadow: 0px 0px 10px 0px rgba(249, 188, 45, 0.5);
    }
  }
  
  .purple {
    color: #2d5af9;
  
    .details-el__circle {
      background: #2d5af9;
      box-shadow: 0px 0px 10px 0px #2d59f979;
    }
  }
  
  .blue {
    color: #03a6e9;
  
    .details-el__circle {
      background: #03a6e9;
      box-shadow: 0px 0px 10px 0px rgba(0, 209, 255, 0.5);
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
    font-family: Inter;
    font-size: 10px;
    font-weight: 600;
    line-height: 21px;
    color: #ffffff;
    border: 1px solid #2abdff;
    padding: 6px 10px;
    border-radius: 20px;
    box-shadow: 0px 4px 8.899999618530273px 0px #2775ca33;
    text-transform: uppercase;
  
    &:hover {
      filter: drop-shadow(0 0 0.2rem #2abdff);
      background: #2abcffa4;
      cursor: pointer;
    }
  }
  </style>
  