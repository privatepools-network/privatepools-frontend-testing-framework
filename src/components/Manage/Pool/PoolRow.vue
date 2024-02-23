<template>
  <div :class="`pools-row__wrapper${inactive ? '__inactive' : ''}`">
    <div
      class="pools-row"
      @click="isActions ? (visibleDetails = !visibleDetails) : false"
    >
      <div class="pools-row__col">
        <DataTableCellTokenNamePaired :value="pool['Pool Name']" />
      </div>
      <div class="pools-row__col">
        <div
          class="pools-row__info"
          style="display: flex !important; align-items: center; gap: 6px"
        >
          <div
            class="pools-row__value"
            v-for="(item, i) in pool['Pool Weight'][0]"
            :key="`${i}-tokens`"
          >
            <div class="d-flex gap-2 chip_token align-items-center">
              <span class="chip_token_name">{{ item.token }}</span>
              <span class="chip_token_weight">{{ item.weight }}</span>
            </div>
          </div>
          <div
            class="pool_type"
            :class="
              pool['LiquidityType'] === 'CL' ? 'pool_type_CL' : 'pool_type_WP'
            "
          >
            {{ pool['LiquidityType'] === 'CL' ? 'CLP' : 'WLP' }}
          </div>
        </div>
      </div>
      <div class="pools-row__col">
        <div class="pools-row__info">
          <div class="pools-row__value">
            {{ pool['ROI'] }}
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
            {{ Number(pool['APR']).toFixed(0) }}%
            <svg
              width="10"
              height="16"
              viewBox="0 0 10 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.87855 4.65411C8.43073 4.92921 8.07876 5.55162 7.92322 6.34349L7.63295 7.82082C7.62878 7.84334 7.61689 7.85851 7.60351 7.85851C7.59012 7.85851 7.57823 7.84334 7.57407 7.82082L7.28383 6.34349C7.12825 5.55157 6.7762 4.92915 6.32834 4.65411L5.49294 4.14094C5.48048 4.13327 5.4721 4.1125 5.4721 4.08917C5.4721 4.06585 5.48048 4.04508 5.49294 4.03741L6.32834 3.52424C6.7762 3.2492 7.12825 2.62677 7.28383 1.83486L7.57407 0.357515C7.57823 0.335026 7.59012 0.319824 7.60351 0.319824C7.61689 0.319824 7.62878 0.335026 7.63295 0.357515L7.92322 1.83486C8.07876 2.62674 8.43073 3.24915 8.87855 3.52424L9.71399 4.03741C9.72642 4.04508 9.73479 4.06585 9.73479 4.08917C9.73479 4.1125 9.72642 4.13327 9.71399 4.14094L8.87855 4.65411ZM5.2054 9.26357C4.58345 9.64571 4.09462 10.5102 3.87859 11.61L3.47532 13.6618C3.4694 13.6928 3.453 13.7135 3.43455 13.7135C3.4161 13.7135 3.3997 13.6928 3.39378 13.6618L2.99051 11.61C2.77448 10.5102 2.28565 9.64571 1.66371 9.26357L0.503264 8.55086C0.485961 8.54018 0.474365 8.51138 0.474365 8.47893C0.474365 8.44654 0.485961 8.41774 0.503264 8.40706L1.66371 7.69435C2.28566 7.31221 2.77449 6.44776 2.99051 5.34794L3.39378 3.29608C3.3997 3.26519 3.4161 3.2444 3.43455 3.2444C3.453 3.2444 3.4694 3.26519 3.47532 3.29608L3.87859 5.34794C4.09462 6.44776 4.58345 7.31221 5.2054 7.69435L6.36585 8.40706C6.38314 8.41774 6.39475 8.44654 6.39475 8.47893C6.39475 8.51138 6.38314 8.54018 6.36585 8.55086L5.2054 9.26357ZM7.57499 14.4665C7.69943 13.833 7.98094 13.3351 8.33917 13.115L9.00781 12.7045C9.01777 12.6983 9.02448 12.6817 9.02448 12.663C9.02448 12.6444 9.01777 12.6277 9.00781 12.6216L8.33917 12.2111C7.98094 11.9909 7.69943 11.493 7.57499 10.8595L7.34271 9.67771C7.33962 9.65902 7.32994 9.64622 7.31894 9.64622C7.30794 9.64622 7.29826 9.65902 7.29517 9.67771L7.06347 10.8595C6.93892 11.4933 6.65713 11.9912 6.29871 12.2111L5.63065 12.6216C5.62069 12.6277 5.61398 12.6444 5.61398 12.663C5.61398 12.6817 5.62069 12.6983 5.63065 12.7045L6.29871 13.115C6.65713 13.3349 6.93892 13.8328 7.06347 14.4665L7.29517 15.6484C7.29826 15.667 7.30794 15.6798 7.31894 15.6798C7.32994 15.6798 7.33962 15.667 7.34271 15.6484L7.57499 14.4665Z"
                fill="url(#paint0_linear_156_79)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_156_79"
                  x1="9.73479"
                  y1="-7.36018"
                  x2="-3.98304"
                  y2="3.45496"
                  gradientUnits="userSpaceOnUse"
                >
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="24"
            viewBox="0 0 20 24"
            fill="none"
          >
            <path
              d="M6.76644 9.7418L9.9998 12.9752L13.2331 9.7418C13.5581 9.4168 14.0831 9.4168 14.4081 9.7418C14.7331 10.0668 14.7331 10.5918 14.4081 10.9168L10.5831 14.7418C10.2581 15.0668 9.73313 15.0668 9.40813 14.7418L5.58311 10.9168C5.25811 10.5918 5.25811 10.0668 5.58311 9.7418C5.90811 9.42513 6.44144 9.4168 6.76644 9.7418Z"
              fill="white"
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
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="24"
            viewBox="0 0 20 24"
            fill="none"
          >
            <path
              d="M6.76644 9.7418L9.9998 12.9752L13.2331 9.7418C13.5581 9.4168 14.0831 9.4168 14.4081 9.7418C14.7331 10.0668 14.7331 10.5918 14.4081 10.9168L10.5831 14.7418C10.2581 15.0668 9.73313 15.0668 9.40813 14.7418L5.58311 10.9168C5.25811 10.5918 5.25811 10.0668 5.58311 9.7418C5.90811 9.42513 6.44144 9.4168 6.76644 9.7418Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </div>
    <CCollapse :visible="visibleDetails">
      <div class="details-el">
        <div class="details-el__col flex-column gap-3">
          <div
            class="details-el__activity details-el__activity_deposit"
            @click="$emit('goToPool', { index, onMountedActivity: 'deposit' })"
          >
            Add AAVE-wstETH LP
          </div>
          <div
            class="details-el__activity details-el__activity_info"
            @click="$emit('goToPool', { index, onMountedActivity: 'info' })"
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
          <div class="details-el__activity details-el__activity_withdraw">
            VIEW CONTRACT <img :src="etherscan" style="margin-left: 5px" />
          </div>
        </div>

        <div v-if="pool['Liquidity'] === 0" class="liquidity_button_container">
          <div class="liquidity_button_text">no liquidity deposited</div>
          <div
          @click="router.push('/pools/compose')"
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
          class="d-flex gap-5 align-items-center liquidity_button_container"
        >
          <div class="details-el__col">
            <div v-if="pool['LiquidityType'] === 'CL'"
              class="details-el__title d-flex gap-1 align-items-center orange">
              Out of range
              <div class="details-el__circle"></div>
            </div>
            <div v-else class="details-el__title d-flex gap-1 align-items-center purple">
              
            
              Weighted Pool
              <div class="details-el__circle"></div>
            </div>

            <div style="font-size: 18px; font-weight: 700">AAVE-wstETH LP</div>
            <div style="font-size: 9px; font-weight: 700">
              Min 125.808 / Max 126.394 AAVE per wstETH
            </div>
            <div class="d-flex align-items-end justify-content-between mt-3">
              <div style="font-size: 9px; font-weight: 700">
                APR: 27.5%
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
              <div class="actions_button" @click="$emit('goToPool', { index, onMountedActivity: 'deposit' })">Add liquidity</div>
            </div>
          </div>
          <div class="d-flex" style="height: 100px">
            <div class="vr" style="border: 1px solid #383838"></div>
          </div>
          <div class="details-el__col">
            <div
              class="details-el__title d-flex gap-1 align-items-center blue"
            >
            Liquidity Added
              <div class="details-el__circle"></div>
            </div>
            <div style="font-size: 18px; font-weight: 700">AAVE-wstETH LP</div>
            <div style="font-size: 9px; font-weight: 700">
              0.04567443 LP-AAVE-wstETH
            </div>
            <div class="d-flex align-items-end justify-content-between mt-3 gap-3">
              <div class="d-flex flex-column gap-2">
              <div style="font-size: 9px; font-weight: 700">
                ~545.45 USD
              </div>
              <div style="font-size: 9px; font-weight: 700">0.22 AAVE  0.22 wstETH</div></div>
              <div class="actions_button" @click="$emit('goToPool', { index, onMountedActivity: 'withdraw' })">WITHDRAW</div>
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
            <div style="font-size: 18px; font-weight: 700">$253.45 <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.7381 4.36344C16.0572 4.62134 15.522 5.20486 15.2856 5.94724L14.8442 7.33223C14.8379 7.35335 14.8198 7.36757 14.7994 7.36757C14.7791 7.36757 14.761 7.35335 14.7547 7.33223L14.3134 5.94724C14.0769 5.20481 13.5416 4.62129 12.8606 4.36344L11.5904 3.88234C11.5715 3.87515 11.5588 3.85568 11.5588 3.83381C11.5588 3.81194 11.5715 3.79247 11.5904 3.78529L12.8606 3.30419C13.5416 3.04634 14.0769 2.46281 14.3134 1.72039L14.7547 0.335384C14.761 0.3143 14.7791 0.300049 14.7994 0.300049C14.8198 0.300049 14.8379 0.3143 14.8442 0.335384L15.2856 1.72039C15.522 2.46278 16.0572 3.04629 16.7381 3.30419L18.0083 3.78529C18.0272 3.79247 18.04 3.81194 18.04 3.83381C18.04 3.85568 18.0272 3.87515 18.0083 3.88234L16.7381 4.36344ZM11.1533 8.68481C10.2076 9.04307 9.46437 9.85349 9.13591 10.8846L8.52276 12.8082C8.51375 12.8372 8.48882 12.8566 8.46077 12.8566C8.43272 12.8566 8.40779 12.8372 8.39878 12.8082L7.78563 10.8846C7.45717 9.85349 6.71393 9.04307 5.76829 8.68481L4.0039 8.01665C3.97759 8.00663 3.95996 7.97963 3.95996 7.94921C3.95996 7.91885 3.97759 7.89185 4.0039 7.88183L5.76829 7.21367C6.71394 6.85541 7.45717 6.04499 7.78563 5.01391L8.39878 3.09029C8.40779 3.06133 8.43272 3.04184 8.46077 3.04184C8.48882 3.04184 8.51375 3.06133 8.52276 3.09029L9.13591 5.01391C9.46437 6.04499 10.2076 6.85541 11.1533 7.21367L12.9177 7.88183C12.9439 7.89185 12.9616 7.91885 12.9616 7.94921C12.9616 7.97963 12.9439 8.00663 12.9177 8.01665L11.1533 8.68481ZM14.7561 13.5626C14.9453 12.9687 15.3733 12.5019 15.918 12.2955L16.9346 11.9106C16.9498 11.9049 16.96 11.8893 16.96 11.8718C16.96 11.8543 16.9498 11.8387 16.9346 11.8329L15.918 11.4481C15.3733 11.2417 14.9453 10.7749 14.7561 10.181L14.4029 9.07307C14.3982 9.05555 14.3835 9.04355 14.3668 9.04355C14.3501 9.04355 14.3353 9.05555 14.3306 9.07307L13.9783 10.181C13.789 10.7751 13.3605 11.2419 12.8156 11.4481L11.7998 11.8329C11.7847 11.8387 11.7745 11.8543 11.7745 11.8718C11.7745 11.8893 11.7847 11.9049 11.7998 11.9106L12.8156 12.2955C13.3605 12.5016 13.789 12.9684 13.9783 13.5626L14.3306 14.6706C14.3353 14.688 14.3501 14.7 14.3668 14.7C14.3835 14.7 14.3982 14.688 14.4029 14.6706L14.7561 13.5626Z" fill="url(#paint0_linear_157_1467)"/>
<defs>
<linearGradient id="paint0_linear_157_1467" x1="18.04" y1="-6.89995" x2="5.204" y2="9.51256" gradientUnits="userSpaceOnUse">
<stop stop-color="#F21BF6"/>
<stop offset="1" stop-color="#FED533"/>
</linearGradient>
</defs>
</svg>
</div>
            <div style="font-size: 9px; font-weight: 700">
              0.04567443 LP-AAVE-wstETH
            </div>
            <div class="d-flex align-items-end justify-content-between mt-3 gap-3">
              <div class="d-flex flex-column gap-2">
              <div style="font-size: 9px; font-weight: 700">
                ~545.45 USD
              </div>
              <div style="font-size: 9px; font-weight: 700">0.22 AAVE  0.22 wstETH</div></div>
              <div class="actions_button">HARVEST</div>
            </div>
          </div>
        </div>
      </div>
    </CCollapse>
  </div>
</template>
<script setup>
import { toRefs, defineProps, ref, computed } from 'vue'
import { getTokenEntity } from '@/lib/helpers/util'
import { shortenLabel } from '@/lib/utils/index'
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
      background: linear-gradient(0deg, rgba(43, 43, 43, 0.33), rgba(43, 43, 43, 0.115));
    }
    &__col {
      display: flex;
      color: #fff;
      width: 18%;
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
        min-width: 40%;
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
      font-size: 13px;
      font-weight: 400;
      @media (max-width: $xxl) {
        font-size: 10px;
      }
    }
    &__dropdown {
      cursor: pointer;
      display: flex;
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
        opacity: 0.5;
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
  border-radius: 8px;
  background: #e1e1e1;
  box-shadow: 0px 4px 4px 0px #00000040;
  padding: 3px 5px;
  &_name {
    font-family: Inter;
    font-size: 12px;
    font-weight: 400;
    line-height: 24px;
    color: #0f172a;
  }
  &_weight {
    font-family: Inter;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: #475569;
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
  background: linear-gradient(0deg, #0f0f0f, #0f0f0f),
    linear-gradient(0deg, #191919, #191919);
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
  color: #2D5AF9;
  .details-el__circle {
    background: #2D5AF9;
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
  color: #03E9C0;
  .details-el__circle {
    background: #03E9C0;
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
