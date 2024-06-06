<template>
  <div :class="`pools-row__wrapper${inactive ? '__inactive' : ''}`">
    <div
      class="pools-row hover:!bg-[#66c5ff3d] dark:hover:!bg-[#4242421d]"
    >
    <div class="flex flex-col gap-8 w-full">
     
      <div class="flex">
        <div class="pools-row__col text-black dark:!text-white">
          <div class="pools-row__info flex items-center">
            <!-- <div class="pools-row__value flex items-center"></div> -->
            <div class="pools-row__value flex items-center">
              <CounterAnimation
                :currency="true"
                :value="index + 1"
              />
            </div>
          </div>
        </div>

        <div class="pools-row__col text-black dark:!text-white">
          <div class="pools-row__info flex items-center flex-col">
            <div class="pools-row__value">
              <img :src="getTokenEntity(pool.symbol, 'short').icon" width="28" class="img_bg" />
            </div>
          </div>
        </div>

        <div class="pools-row__col text-black dark:!text-white">
          <div class="pools-row__info  flex items-center flex-col">
            <div class="pools-row__value flex items-center">TVL</div>
            <div class="pools-row__value">
              <div class="flex items-center font-['Roboto_Mono',_monospace]">
                <CounterAnimation
                  :currency="''"
                  :value="
                    Number(parseFloat(pool[`tvl${postfix}`]))
                  "
                  :decimalPlaces="currencyDecimals"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="pools-row__col text-black dark:!text-white">
          <div class="pools-row__info  flex items-center flex-col">
            <div class="pools-row__value flex items-center">Volume</div>
            <div class="pools-row__value flex items-center">
              <CounterAnimation
                :currency="''"
                :value="
                  parseFloat(pool[`volume${postfix}`]).toFixed(0)
                "
              />%

            </div>
          </div>
        </div>

        
        <div class="pools-row__col text-black dark:!text-white">
          <div class="pools-row__info  flex items-center flex-col">
            <div class="pools-row__value flex items-center">Profit</div>
            <div class="pools-row__value flex items-center">
              <CounterAnimation
                :currency="''"
                :value="
                  Number(pool[`profit${postfix}`]).toFixed(2)
                "
              />

            </div>
          </div>
        </div>

      
      </div>
    </div>
    </div>
  </div>
</template>
<script setup>
import { toRefs, defineProps, ref, computed } from 'vue'
import DataTableCellTokenNamePaired from '@/components/DataTable/Cell/TokenNamePaired.vue'


import { t } from 'i18next'
import { getTokenEntity } from '@/lib/helpers/util'

import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'
import CounterAnimation from '@/UI/CounterAnimation.vue'

const settingsStore = useSettings()


const { currentCurrency } = storeToRefs(settingsStore)
const currencyDecimals = computed(() =>
  currentCurrency.value == 'USD' ? 0 : 3,
)

const props = defineProps({
  pool: Object,
  index: Number,
  inactive: Boolean,
  isActions: Boolean,
})
const { pool, index, inactive, isActions } = toRefs(props)



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
    padding: 14px 12px;
    border-bottom: 1px solid rgba(49, 56, 61, 0.568);
    cursor: pointer;
    min-width: 100% !important;

    &:hover {
      // background: linear-gradient(
      //   0deg,
      //   rgba(43, 43, 43, 0.33),
      //   rgba(43, 43, 43, 0.115)
      // );
    }

    &__col_tokens {
      display: flex;
      // color: #fff;
      width: 100% !important;
      min-width: auto !important;
      justify-content: center;

    }
    &__col {
      display: flex;
      // color: #fff;
      width: 20% !important;
      min-width: auto !important;
      justify-content: center;

     

      // &:first-child {
      //   width: 100% !important;
      // }
      &:last-child {
        width: 5%;
      }
    }

    &__value {
      font-size: clamp(10px, 1vw, 14px);
      font-weight: 400;
      font-family: 'Roboto Mono', monospace;
    }

    &__dropdown {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;

      svg {
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

.liquidity_button {
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  line-height: 21px;
  font-family: 'Syne', sans-serif;
  color: #ffffff;
  width: 100%;
  padding: 10px;
  text-align: center;

  // @media (min-width: 1950px) {
  //   width: 40vw;
  // }

  &_LP {
    background: #fb800f;
    // box-shadow: 0px 4px 8.899999618530273px 0px #5eb05e3b;

    &:hover {
      cursor: pointer;
      filter: drop-shadow(0 0 0.4rem #fb800f);
    }
  }

  &_WP {
    background: #00dc3e;
    // box-shadow: 0px 4px 8.899999618530273px 0px #5eb05e3b;

    &:hover {
      cursor: pointer;
      filter: drop-shadow(0 0 0.4rem #00dc3e);
    }
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
  font-size: 10px;
  font-weight: 600;
  line-height: 21px;
  // color: #ffffff;
  box-shadow: 0px 4px 8.9px 0px #79797933;
  margin-left: 20px;
  padding: 6px 10px;
  border-radius: 20px;
  border: 1px solid #dceef6;
  text-transform: uppercase;

  &:hover {
    filter: drop-shadow(0 0 0.2rem #00e0ff);
    background: #2abcffa4;
    cursor: pointer;
  }
}
</style>
