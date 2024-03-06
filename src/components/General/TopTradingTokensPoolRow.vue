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
        <div class="pools-row__col">
          <div class="pools-row__info">
            <div class="pools-row__value">
              <img :src="getTokenEntity(pool['Token'], 'short').icon" width="28" /> {{ pool['Token'] }} <span style="color: #FFFFFF4A;">({{ pool['Token'] }})</span>
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
              ${{ numberToAposthrophe(Number(pool['Volume']).toFixed(0)) }}
            </div>
          </div>
        </div>
        <div class="pools-row__col">
          <div class="pools-row__info">
            <div class="pools-row__value">
              $0
            </div>
          </div>
        </div>
  
  
  
      
      </div>
     
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
  <style lang="scss" scoped>
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
    width: 60vw;
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
  