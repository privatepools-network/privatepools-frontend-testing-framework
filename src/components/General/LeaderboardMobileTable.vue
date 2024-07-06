<template>
  <div
    v-for="(item, i) in filteredActivities"
    :key="`key${i}`"
    :class="`pools-row__wrapper`"
  >
    <div
    @click="$emit('changeToSpecificPortfolio')"
      :class="i + 1 === filteredActivities.length ? '!border-[#2ABDFF]' : ''"
      class="pools-row hover:!bg-[#66c5ff3d] dark:hover:!bg-[#4242421d]"
    >
      <div class="flex flex-col gap-8 w-full">
        <div class="flex items-center">
          <div class="pools-row__col text-black dark:!text-white">
            <div class="pools-row__info flex items-center flex-col">
              <div class="pools-row__value">
                <div class="actions-cell">
                  <img
                    v-if="item['Place'] === 1"
                    :src="firstPlace"
                    style="margin-top: -5px"
                  />
                  <img
                    v-else-if="item['Place'] === 2"
                    :src="secondPlace"
                    style="margin-top: -5px"
                  />
                  <img
                    v-else-if="item['Place'] === 3"
                    :src="thirdPlace"
                    style="margin-top: -5px"
                  />
                  <div
                    v-else
                    class="actions-cell__text dark:!text-white text-black"
                  >
                    {{ item['Place'] }}
                  </div>
                </div>
              </div>
              <div
                class="pools-row__value flex items-center text-xs text-[#8B968C] font-['Syne',_sans-serif]"
                v-if="
                  user_in_top &&
                  user_info &&
                  item['Wallet'].toLowerCase() == account.toLowerCase()
                "
              >
                My ranking
              </div>
            </div>
          </div>

          <div class="pools-row__col text-black dark:!text-white">
            <div class="pools-row__info flex items-center flex-col">
              <div class="pools-row__value flex items-center">Profit</div>
              <div class="pools-row__value">
                <div class="flex items-center font-['Roboto_Mono',_monospace]">
                  <CounterAnimation
                    :currency="''"
                    :value="Number(parseFloat(item[`Profit`]))"
                    :decimalPlaces="currencyDecimals"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="pools-row__col text-black dark:!text-white">
            <div class="pools-row__info flex items-center flex-col">
              <div class="pools-row__value flex items-center">№ Pools</div>
              <div class="pools-row__value flex items-center">
                <CounterAnimation
                  :currency="'№'"
                  :value="parseFloat(item[`Number of Pools`]).toFixed(0)"
                />
              </div>
            </div>
          </div>

          <div class="pools-row__col text-black dark:!text-white">
            <div class="pools-row__info flex items-center flex-col">
              <div class="pools-row__value flex items-center">Volume</div>
              <div class="pools-row__value flex items-center">
                <CounterAnimation
                  :currency="''"
                  :value="Number(item[`Traded Volume`]).toFixed(2)"
                />
              </div>
            </div>
          </div>

          <div class="pools-row__col text-black dark:!text-white">
            <div class="pools-row__info flex items-center flex-col">
              <div class="pools-row__value flex items-center">Gas Fees</div>
              <div class="pools-row__value flex items-center">
                <CounterAnimation
                  :currency="''"
                  :value="Number(item[`GasFees`]).toFixed(2)"
                />
              </div>
            </div>
          </div>

          <div class="pools-row__col text-black dark:!text-white">
            <div class="pools-row__info flex items-center flex-col">
              <div class="pools-row__value flex items-center">
                <svg
                  v-if="type === 'portfolios'"
                  width="7"
                  height="10"
                  viewBox="0 0 7 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.15586 7.97294L4.38923 4.73958L1.15586 1.50625C0.830859 1.18125 0.830859 0.656248 1.15586 0.331248C1.48086 0.00624847 2.00589 0.00624847 2.33089 0.331248L6.15589 4.15625C6.48089 4.48125 6.48089 5.00625 6.15589 5.33125L2.33089 9.15627C2.00589 9.48127 1.48086 9.48127 1.15586 9.15627C0.839193 8.83127 0.830859 8.29794 1.15586 7.97294Z"
                    fill="#1FC7D4"
                  />
                </svg>
                <svg
                v-else-if="type === 'referrals'"
                  width="13"
                  height="11"
                  viewBox="0 0 13 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.187 0H3.70908C3.56855 0 3.43377 0.0482886 3.3344 0.134243C3.23503 0.220197 3.17921 0.336776 3.17921 0.458333V2.75H0.529868C0.389338 2.75 0.254564 2.79829 0.155195 2.88424C0.0558253 2.9702 0 3.08678 0 3.20833V10.5417C0 10.6632 0.0558253 10.7798 0.155195 10.8658C0.254564 10.9517 0.389338 11 0.529868 11H9.00776C9.14829 11 9.28306 10.9517 9.38243 10.8658C9.4818 10.7798 9.53763 10.6632 9.53763 10.5417V8.25H12.187C12.3275 8.25 12.4623 8.20171 12.5616 8.11576C12.661 8.0298 12.7168 7.91322 12.7168 7.79167V0.458333C12.7168 0.336776 12.661 0.220197 12.5616 0.134243C12.4623 0.0482886 12.3275 0 12.187 0ZM8.47789 10.0833H1.05974V3.66667H8.47789V10.0833ZM11.6571 7.33333H9.53763V3.20833C9.53763 3.08678 9.4818 2.9702 9.38243 2.88424C9.28306 2.79829 9.14829 2.75 9.00776 2.75H4.23894V0.916667H11.6571V7.33333Z"
                    fill="#F8F8F8"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- User rate -->
  <div v-if="!user_in_top && account" :class="`pools-row__wrapper`">
    <div class="pools-row hover:!bg-[#66c5ff3d] dark:hover:!bg-[#4242421d]">
      <div class="flex flex-col gap-8 w-full">
        <div class="flex items-center">
          <div class="pools-row__col text-black dark:!text-white">
            <div
              class="pools-row__info flex items-center flex-col justify-center"
            >
              <div class="pools-row__value">
                <div class="actions-cell">
                  <div class="actions-cell__text dark:!text-white text-black">
                    {{ user_info.Place }}
                  </div>
                </div>
              </div>
              <div
                class="pools-row__value flex items-center text-xs text-[#8B968C] font-['Syne',_sans-serif]"
              >
                My ranking
              </div>
            </div>
          </div>

          <div class="pools-row__col text-black dark:!text-white">
            <div class="pools-row__info flex items-center flex-col">
              <div class="pools-row__value flex items-center">Profit</div>
              <div class="pools-row__value">
                <div class="flex items-center font-['Roboto_Mono',_monospace]">
                  <CurrencySymbol />
                  {{ numberToAposthrophe(user_info['Profit'], 2) }}
                </div>
              </div>
            </div>
          </div>

          <div class="pools-row__col text-black dark:!text-white">
            <div class="pools-row__info flex items-center flex-col">
              <div class="pools-row__value flex items-center">№ Pools</div>
              <div class="pools-row__value flex items-center">
                {{ user_info['Number of Pools'] }}
              </div>
            </div>
          </div>

          <div class="pools-row__col text-black dark:!text-white">
            <div class="pools-row__info flex items-center flex-col">
              <div class="pools-row__value flex items-center">Volume</div>
              <div class="pools-row__value flex items-center">
                <CurrencySymbol />
                {{ numberToAposthrophe(user_info['Traded Volume'], 2) }}
              </div>
            </div>
          </div>

          <div class="pools-row__col text-black dark:!text-white">
            <div class="pools-row__info flex items-center flex-col">
              <div class="pools-row__value flex items-center">Gas Fees</div>
              <div class="pools-row__value flex items-center">
                <CurrencySymbol />{{
                  numberToAposthrophe(user_info['Gas Fees'], 5)
                }}
              </div>
            </div>
          </div>

          <div class="pools-row__col text-black dark:!text-white">
            <div class="pools-row__info flex items-center flex-col">
              <div class="pools-row__value flex items-center">
                <svg
                  v-if="type === 'portfolios'"
                  width="7"
                  height="10"
                  viewBox="0 0 7 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.15586 7.97294L4.38923 4.73958L1.15586 1.50625C0.830859 1.18125 0.830859 0.656248 1.15586 0.331248C1.48086 0.00624847 2.00589 0.00624847 2.33089 0.331248L6.15589 4.15625C6.48089 4.48125 6.48089 5.00625 6.15589 5.33125L2.33089 9.15627C2.00589 9.48127 1.48086 9.48127 1.15586 9.15627C0.839193 8.83127 0.830859 8.29794 1.15586 7.97294Z"
                    fill="#1FC7D4"
                  />
                </svg>
                <svg
                v-else-if="type === 'referrals'"
                  width="13"
                  height="11"
                  viewBox="0 0 13 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.187 0H3.70908C3.56855 0 3.43377 0.0482886 3.3344 0.134243C3.23503 0.220197 3.17921 0.336776 3.17921 0.458333V2.75H0.529868C0.389338 2.75 0.254564 2.79829 0.155195 2.88424C0.0558253 2.9702 0 3.08678 0 3.20833V10.5417C0 10.6632 0.0558253 10.7798 0.155195 10.8658C0.254564 10.9517 0.389338 11 0.529868 11H9.00776C9.14829 11 9.28306 10.9517 9.38243 10.8658C9.4818 10.7798 9.53763 10.6632 9.53763 10.5417V8.25H12.187C12.3275 8.25 12.4623 8.20171 12.5616 8.11576C12.661 8.0298 12.7168 7.91322 12.7168 7.79167V0.458333C12.7168 0.336776 12.661 0.220197 12.5616 0.134243C12.4623 0.0482886 12.3275 0 12.187 0ZM8.47789 10.0833H1.05974V3.66667H8.47789V10.0833ZM11.6571 7.33333H9.53763V3.20833C9.53763 3.08678 9.4818 2.9702 9.38243 2.88424C9.28306 2.79829 9.14829 2.75 9.00776 2.75H4.23894V0.916667H11.6571V7.33333Z"
                    fill="#F8F8F8"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { toRefs, defineProps, defineEmits, ref, computed } from 'vue'
import firstPlace from '@/assets/icons/generalIcons/firstPlace.svg'
import secondPlace from '@/assets/icons/generalIcons/secondPlace.svg'
import thirdPlace from '@/assets/icons/generalIcons/thirdPlace.svg'
import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'
import CounterAnimation from '@/UI/CounterAnimation.vue'
import CurrencySymbol from '../TrackInfo/CurrencySymbol.vue'
import numberToAposthrophe from '@/lib/formatter/numberToAposthrophe'

const settingsStore = useSettings()

defineEmits('changeToSpecificPortfolio')


const { currentCurrency } = storeToRefs(settingsStore)
const currencyDecimals = computed(() =>
  currentCurrency.value == 'USD' ? 0 : 3,
)

const props = defineProps({
  filteredActivities: Array,
  user_in_top: Boolean,
  account: String,
  user_info: Object,
  type: String,
})
const { filteredActivities, user_in_top, account, user_info, type } =
  toRefs(props)
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
        width: 5% !important;
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
