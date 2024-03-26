<template>
  <div :class="`pools-row__wrapper${inactive ? '__inactive' : ''}`">
    <div
      class="pools-row"
      @click="isActions ? (visibleDetails = !visibleDetails) : false"
    >
      <div
        class="pools-row__col text-black dark:!text-white justify-content-start"
      >
        <DataTableCellTokenNamePaired :value="pool['Pool Name']" />
      </div>

      <div
        class="pools-row__col text-black dark:!text-white justify-content-start"
      >
        <div
          class="pools-row__info"
          style="
            display: flex !important;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
          "
        >
          <div
            class="pools-row__value"
            v-for="(item, i) in pool['Pool Weight'][0]"
            :key="`${i}-tokens`"
          >
            <div class="d-flex gap-2 chip_token align-items-center  !bg-[#EAF0F6] dark:!bg-[#22222224]">
              <span class="chip_token_name text-black dark:!text-white">{{ item.token }}</span>
              <span class="chip_token_weight text-[#475569] dark:!text-[#8f8f8f]">{{ item.weight }}</span>
            </div>
          </div>
          <div
            class="pool_type text-white"
            :class="
              pool['LiquidityType'] === 'CL' ? 'pool_type_CL' : 'pool_type_WP'
            "
          >
            {{ pool['LiquidityType'] === 'CL' ? 'CLP' : 'WLP' }}
          </div>
        </div>
      </div>

      <div class="pools-row__col text-black dark:!text-white">
        <div class="pools-row__info">
          <div class="pools-row__value">
            {{ pool['ROI'] }}
          </div>
        </div>
      </div>

      <div class="pools-row__col text-black dark:!text-white">
        <div class="pools-row__info">
          <div class="pools-row__value">
            ${{ numberToAposthrophe(Number(pool['TVL']).toFixed(0)) }}
          </div>
        </div>
      </div>

      <div class="pools-row__col text-black dark:!text-white">
        <div class="pools-row__info">
          <div class="pools-row__value">
            ${{ numberToAposthrophe(Number(pool['Volume']).toFixed(0)) }}
          </div>
        </div>
      </div>

      <div class="pools-row__col text-black dark:!text-white">
        <div class="pools-row__info">
          <div class="pools-row__value flex">
            {{ Number(pool['APR']).toFixed(0) }}%
            <img :src="APRIcon" />
          </div>
        </div>
      </div>

      <div class="pools-row__col !justify-center text-black dark:!text-white" v-if="isActions">
        <div class="pools-row__dropdown" v-if="visibleDetails == false">
          Details
     
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
             
          >
            <path
              d="M1.6263 0.741797L4.85966 3.97516L8.09299 0.741797C8.41799 0.416797 8.943 0.416797 9.26799 0.741797C9.59299 1.0668 9.59299 1.59183 9.26799 1.91683L5.44299 5.74183C5.11799 6.06683 4.59299 6.06683 4.26799 5.74183L0.442969 1.91683C0.117969 1.59183 0.117969 1.0668 0.442969 0.741797C0.767969 0.42513 1.3013 0.416797 1.6263 0.741797Z"
            
              class="fill-black dark:!fill-white"
            />
          </svg>
        </div>
        <div
          class="pools-row__dropdown"
          :class="{ 'pools-row__dropdown_active': visibleDetails }"
          v-else
        >
          Hide
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="rotate-180"
          >
            <path
              d="M1.6263 0.741797L4.85966 3.97516L8.09299 0.741797C8.41799 0.416797 8.943 0.416797 9.26799 0.741797C9.59299 1.0668 9.59299 1.59183 9.26799 1.91683L5.44299 5.74183C5.11799 6.06683 4.59299 6.06683 4.26799 5.74183L0.442969 1.91683C0.117969 1.59183 0.117969 1.0668 0.442969 0.741797C0.767969 0.42513 1.3013 0.416797 1.6263 0.741797Z"
            
              class="fill-black dark:!fill-white"
            />
          </svg>
        </div>
      </div>
    </div>
    <CCollapse :visible="visibleDetails">
      <div class="details-el">
        <div class="details-el__col flex-column gap-3">
          <div
            class="details-el__activity text-black dark:!text-white hover:!text-[#03a6e9]"
            @click="
              $emit('goToPoolDeposit', { index, onMountedActivity: 'deposit' })
            "
          >
            Add {{ lp_name }} LP
          </div>
          <div
            class="details-el__activity text-black dark:!text-white hover:!text-[#03a6e9]"
            @click="
              pool['LiquidityType'] === 'CL'
                ? $emit('goToCLPool', { index, onMountedActivity: 'info' })
                : $emit('goToPool', { index, onMountedActivity: 'info' })
            "
          >
            SEE Pool info
            <svg
              style="margin-left: 5px"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.4375 6.5625L13.125 1.875M13.125 1.875H10M13.125 1.875V5M13.125 8.75V11.875C13.125 12.2065 12.9933 12.5245 12.7589 12.7589C12.5245 12.9933 12.2065 13.125 11.875 13.125H3.125C2.79348 13.125 2.47554 12.9933 2.24112 12.7589C2.0067 12.5245 1.875 12.2065 1.875 11.875V3.125C1.875 2.79348 2.0067 2.47554 2.24112 2.24112C2.47554 2.0067 2.79348 1.875 3.125 1.875H6.25"
                stroke="#8F8F8F"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="details-el__activity text-black dark:!text-white hover:!text-[#03a6e9]">
            <a
              :href="`${etherscan_link}/contract/${pool.address}`"
              target="_blank"
              class="flex items-center gap-1 !text-black dark:!text-white hover:!text-[#03a6e9]"
            >
              VIEW CONTRACT <img :src="etherscan" style="margin-left: 5px"
            /></a>
          </div>
        </div>
        {{ console.log('pool!', pool) }}
        <div
          v-if="pool['Liquidity'] === '0.00000' || pool['Liquidity'] === '0'"
          class="liquidity_button_container text-black dark:!text-white !bg-white dark:!bg-[#171717]"
        >
          <div class="liquidity_button_text !text-black dark:!text-white">no liquidity deposited</div>
          <div
            @click="
              pool['LiquidityType'] === 'CL'
                ? $emit('goToCL', { onMountedActivity: 'deposit' })
                : $emit('goToPoolDeposit', {
                    index,
                    onMountedActivity: 'deposit',
                  })
            "
            class="liquidity_button"
            :class="
              pool['LiquidityType'] === 'CL'
                ? 'liquidity_button_LP'
                : 'liquidity_button_WP'
            "
          >
            ADD LIQUIDITY
          </div>
        </div>

        <div
          v-else
          class="d-flex gap-5 align-items-center liquidity_button_container text-black dark:!text-white !bg-white dark:!bg-[#171717]"
        >
          <div class="details-el__col">
            <div
              v-if="pool['LiquidityType'] === 'CL'"
              class="details-el__title d-flex gap-1 align-items-center orange"
            >
              Concentrated liquidity Pool
              <div class="details-el__circle"></div>
            </div>
            <div
              v-else
              class="details-el__title d-flex gap-1 align-items-center purple"
            >
              Weighted Pool
              <div class="details-el__circle"></div>
            </div>

            <div style="font-size: 18px; font-weight: 700">
              {{ lp_name }} LP
            </div>
            <div style="font-size: 9px; font-weight: 700">
              {{
                pool['LiquidityType'] === 'CL'
                  ? 'Number of positions: 2'
                  : '50% AAVE and 50% wstETH'
              }}
            </div>
            <div class="d-flex align-items-end justify-content-between mt-3">
              <div
                v-if="pool['LiquidityType'] === 'WP'"
                style="font-size: 9px; font-weight: 700"
                class="flex items-center gap-1"
              >
                APR: {{ pool.APR }}%
                <svg
                  width="15"
                  height="10"
                  viewBox="0 0 15 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.4123 2.90888C10.9481 3.08081 10.5832 3.46982 10.422 3.96474L10.121 4.88807C10.1167 4.90215 10.1044 4.91163 10.0905 4.91163C10.0766 4.91163 10.0643 4.90215 10.06 4.88807L9.75911 3.96474C9.59783 3.46979 9.23287 3.08078 8.76859 2.90888L7.90255 2.58815C7.88963 2.58335 7.88095 2.57037 7.88095 2.55579C7.88095 2.54121 7.88963 2.52824 7.90255 2.52344L8.76859 2.20271C9.23287 2.03081 9.59783 1.6418 9.75911 1.14685L10.06 0.223508C10.0643 0.209452 10.0766 0.199951 10.0905 0.199951C10.1044 0.199951 10.1167 0.209452 10.121 0.223508L10.422 1.14685C10.5832 1.64177 10.9481 2.03078 11.4123 2.20271L12.2784 2.52344C12.2913 2.52824 12.3 2.54121 12.3 2.55579C12.3 2.57037 12.2913 2.58335 12.2784 2.58815L11.4123 2.90888ZM7.60447 5.78979C6.95971 6.02863 6.45296 6.56891 6.22901 7.25631L5.81095 8.53871C5.80481 8.55803 5.78781 8.57099 5.76868 8.57099C5.74956 8.57099 5.73256 8.55803 5.72642 8.53871L5.30836 7.25631C5.08441 6.56891 4.57766 6.02863 3.9329 5.78979L2.72991 5.34435C2.71197 5.33767 2.69995 5.31967 2.69995 5.29939C2.69995 5.27915 2.71197 5.26115 2.72991 5.25447L3.9329 4.80903C4.57766 4.57019 5.08441 4.02991 5.30836 3.34252L5.72642 2.06011C5.73256 2.0408 5.74956 2.02781 5.76868 2.02781C5.78781 2.02781 5.80481 2.0408 5.81095 2.06011L6.22901 3.34252C6.45296 4.02991 6.95971 4.57019 7.60447 4.80903L8.80747 5.25447C8.82539 5.26115 8.83743 5.27915 8.83743 5.29939C8.83743 5.31967 8.82539 5.33767 8.80747 5.34435L7.60447 5.78979ZM10.061 9.04163C10.19 8.64571 10.4818 8.33451 10.8532 8.19691L11.5463 7.94035C11.5566 7.93651 11.5636 7.92611 11.5636 7.91443C11.5636 7.90279 11.5566 7.89239 11.5463 7.88855L10.8532 7.63199C10.4818 7.49439 10.19 7.18319 10.061 6.78727L9.82015 6.04863C9.81695 6.03695 9.80691 6.02895 9.79551 6.02895C9.78411 6.02895 9.77407 6.03695 9.77087 6.04863L9.53067 6.78727C9.40155 7.18335 9.10943 7.49455 8.73787 7.63199L8.04531 7.88855C8.03499 7.89239 8.02803 7.90279 8.02803 7.91443C8.02803 7.92611 8.03499 7.93651 8.04531 7.94035L8.73787 8.19691C9.10943 8.33435 9.40155 8.64555 9.53067 9.04163L9.77087 9.78031C9.77407 9.79195 9.78411 9.79995 9.79551 9.79995C9.80691 9.79995 9.81695 9.79195 9.82015 9.78031L10.061 9.04163Z"
                    fill="url(#paint0_linear_157_1422)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_157_1422"
                      x1="12.3"
                      y1="-4.60005"
                      x2="3.79087"
                      y2="6.52723"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#F21BF6" />
                      <stop offset="1" stop-color="#FED533" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div v-else class="d-flex flex-column gap-2">
                <div style="font-size: 9px; font-weight: 700">~- USD</div>
                <div style="font-size: 9px; font-weight: 700">
                  - AAVE - wstETH
                </div>
              </div>
              <div
                class="actions_button text-black dark:!text-white"
                @click="
                  pool['LiquidityType'] === 'CL'
                    ? router.push('/pools/concentrated_pool/add/withdraw')
                    : $emit('goToPoolDeposit', {
                        index,
                        onMountedActivity: 'deposit',
                      })
                "
              >
                {{
                  pool['LiquidityType'] === 'CL'
                    ? 'Manage Position'
                    : 'Add liquidity'
                }}
              </div>
            </div>
          </div>
          <div class="d-flex" style="height: 100px">
            <div class="vr" style="border: 1px solid #383838"></div>
          </div>
          <div class="details-el__col">
            <div class="details-el__title d-flex gap-1 align-items-center blue">
              Liquidity Added
              <div class="details-el__circle"></div>
            </div>
            <div style="font-size: 18px; font-weight: 700">$-</div>
            <div style="font-size: 9px; font-weight: 700">
              - LP-{{ lp_name }}
            </div>
            <div
              class="d-flex align-items-end justify-content-between mt-3 gap-3"
            >
              <div class="d-flex flex-column gap-2">
                <div style="font-size: 9px; font-weight: 700">~- USD</div>
                <div style="font-size: 9px; font-weight: 700">
                  - AAVE - wstETH
                </div>
              </div>
              <div
                class="actions_button text-black dark:!text-white"
                @click="
                  pool['LiquidityType'] === 'CL'
                    ? $emit('goToCL', { onMountedActivity: 'withdraw' })
                    : $emit('goToPoolWithdraw', {
                        index,
                        onMountedActivity: 'withdraw',
                      })
                "
              >
                {{
                  pool['LiquidityType'] === 'CL'
                    ? 'Add New Position'
                    : 'WITHDRAW'
                }}
              </div>
            </div>
          </div>
          <div class="d-flex" style="height: 100px">
            <div class="vr" style="border: 1px solid #383838"></div>
          </div>
          <div class="details-el__col">
            <div
              class="details-el__title d-flex gap-1 align-items-center green"
            >
              Rewards
              <div class="details-el__circle"></div>
            </div>
            <div style="font-size: 18px; font-weight: 700">
              $-
              <svg
                width="22"
                height="15"
                viewBox="0 0 22 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M16.7381 4.36344C16.0572 4.62134 15.522 5.20486 15.2856 5.94724L14.8442 7.33223C14.8379 7.35335 14.8198 7.36757 14.7994 7.36757C14.7791 7.36757 14.761 7.35335 14.7547 7.33223L14.3134 5.94724C14.0769 5.20481 13.5416 4.62129 12.8606 4.36344L11.5904 3.88234C11.5715 3.87515 11.5588 3.85568 11.5588 3.83381C11.5588 3.81194 11.5715 3.79247 11.5904 3.78529L12.8606 3.30419C13.5416 3.04634 14.0769 2.46281 14.3134 1.72039L14.7547 0.335384C14.761 0.3143 14.7791 0.300049 14.7994 0.300049C14.8198 0.300049 14.8379 0.3143 14.8442 0.335384L15.2856 1.72039C15.522 2.46278 16.0572 3.04629 16.7381 3.30419L18.0083 3.78529C18.0272 3.79247 18.04 3.81194 18.04 3.83381C18.04 3.85568 18.0272 3.87515 18.0083 3.88234L16.7381 4.36344ZM11.1533 8.68481C10.2076 9.04307 9.46437 9.85349 9.13591 10.8846L8.52276 12.8082C8.51375 12.8372 8.48882 12.8566 8.46077 12.8566C8.43272 12.8566 8.40779 12.8372 8.39878 12.8082L7.78563 10.8846C7.45717 9.85349 6.71393 9.04307 5.76829 8.68481L4.0039 8.01665C3.97759 8.00663 3.95996 7.97963 3.95996 7.94921C3.95996 7.91885 3.97759 7.89185 4.0039 7.88183L5.76829 7.21367C6.71394 6.85541 7.45717 6.04499 7.78563 5.01391L8.39878 3.09029C8.40779 3.06133 8.43272 3.04184 8.46077 3.04184C8.48882 3.04184 8.51375 3.06133 8.52276 3.09029L9.13591 5.01391C9.46437 6.04499 10.2076 6.85541 11.1533 7.21367L12.9177 7.88183C12.9439 7.89185 12.9616 7.91885 12.9616 7.94921C12.9616 7.97963 12.9439 8.00663 12.9177 8.01665L11.1533 8.68481ZM14.7561 13.5626C14.9453 12.9687 15.3733 12.5019 15.918 12.2955L16.9346 11.9106C16.9498 11.9049 16.96 11.8893 16.96 11.8718C16.96 11.8543 16.9498 11.8387 16.9346 11.8329L15.918 11.4481C15.3733 11.2417 14.9453 10.7749 14.7561 10.181L14.4029 9.07307C14.3982 9.05555 14.3835 9.04355 14.3668 9.04355C14.3501 9.04355 14.3353 9.05555 14.3306 9.07307L13.9783 10.181C13.789 10.7751 13.3605 11.2419 12.8156 11.4481L11.7998 11.8329C11.7847 11.8387 11.7745 11.8543 11.7745 11.8718C11.7745 11.8893 11.7847 11.9049 11.7998 11.9106L12.8156 12.2955C13.3605 12.5016 13.789 12.9684 13.9783 13.5626L14.3306 14.6706C14.3353 14.688 14.3501 14.7 14.3668 14.7C14.3835 14.7 14.3982 14.688 14.4029 14.6706L14.7561 13.5626Z"
                  fill="url(#paint0_linear_157_1467)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_157_1467"
                    x1="18.04"
                    y1="-6.89995"
                    x2="5.204"
                    y2="9.51256"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#F21BF6" />
                    <stop offset="1" stop-color="#FED533" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div style="font-size: 9px; font-weight: 700">
              - LP-{{ lp_name }}
            </div>
            <div
              class="d-flex align-items-end justify-content-between mt-3 gap-3"
            >
              <div class="d-flex flex-column gap-2">
                <div style="font-size: 9px; font-weight: 700">~- USD</div>
                <div style="font-size: 9px; font-weight: 700">
                  - AAVE - wstETH
                </div>
              </div>
              <div class="actions_button text-black dark:!text-white">HARVEST</div>
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
import APRIcon from '@/assets/icons/APRIcon.svg'
import arrow_up from '@/assets/icons/arrow/arrow_up.svg'

const props = defineProps({
  pool: Object,
  index: Number,
  inactive: Boolean,
  isActions: Boolean,
})
const { pool, index, inactive, isActions } = toRefs(props)

const lp_name = computed(() => pool.value['Pool Name'][0].join('-'))
const etherscan_link = computed(() => {
  return configService.getNetworkConfig(
    ReversedDisplayNetwork[pool.value.Blockchain],
  ).explorer
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
      background: linear-gradient(
        0deg,
        rgba(43, 43, 43, 0.33),
        rgba(43, 43, 43, 0.115)
      );
    }

    &__col {
      display: flex;
      // color: #fff;
      width: 18%;
      justify-content: center;

      @media (max-width: $xxl) {
        width: 23%;
      }

      &:first-child {
        min-width: 185px;

        @media (max-width: $xl) {
          min-width: 250px;
        }

        @media (max-width: $lg) {
          min-width: 200px;
        }
      }

      &:nth-child(2) {
        min-width: 30%;

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
    }

    &__value {
      font-size: 13px;
      font-weight: 400;

      @media (max-width: $xxl) {
        font-size: 10px;
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
      .pools-row__value {
        @media (max-width: $xxl) {
          font-size: 12px;
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
    background: linear-gradient(
      0deg,
      rgba(43, 43, 43, 33%),
      rgba(43, 43, 43, 11.5%)
    );
    justify-content: space-between;
    border-bottom: 1px solid rgba(49, 56, 61, 0.81);
    color: #fff;

    @media all and (max-width: $md) {
      width: 150%;
    }

    &__col {
      display: flex;
      flex-direction: column;

      &:last-child {
        .details-el__value {
          font-weight: 400;
          // color: #fff;
        }
      }
    }

    &__activity {
      font-family: Inter;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      // color: #8f8f8f;
      cursor: pointer;
      &:hover {
        color: #03a6e9;
        & svg path {
          stroke: #03a6e9;
        }
      }
    }

    &__circle {
      width: 10px;
      height: 10px;
      border-radius: 5px;
      margin-right: 8px;
      animation: blink 2s infinite;
    }
    @keyframes blink {
      0% {
        opacity: 0.5;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0.5;
      }
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
  // background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;

  padding: 3px 5px;

  &_name {
    font-family: Inter;
    font-size: 12px;
    font-weight: 400;
    line-height: 24px;
    // color: #ffffff;
  }

  &_weight {
    font-family: Inter;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    // color: #8f8f8f;
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
  // background: #171717;
  padding: 10px 20px;
  border-radius: 20px;
  // border: 1px solid #191919;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
}

.liquidity_button {
  border-radius: 12px;
  font-family: Inter;
  font-size: 12px;
  font-weight: 700;
  line-height: 21px;
  // color: #ffffff;
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
  // color: #f0f0f0;
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
  // color: #ffffff;
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
