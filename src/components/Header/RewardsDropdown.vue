<template>
  <Dropdown :distance="4" :placement="'bottom-center'">
    <div class="button_drop text-black dark:!text-white p-2 flex">
      <img :src="rewards_icon" />
      {{ console.log('rewards!', rewards) }}
      <div v-if="width > 768" class="flex items-center">
        <CurrencySymbol />
        <div v-if="rewards.length === 0" class="scale-50 px-3"><LoaderPulse /></div>
        <div v-else>
          {{ totalRewards }}
        </div>
      </div>
    </div>
    <template #popper>
      <div class="header__popup bg-white dark:!bg-[#02031C]">
        <h4 class="text-[14px] text-black dark:!text-[#626262] mb-[10px]">
          {{ $t('rewards') }}
        </h4>
        <div
          class="rewards_inside bg-[white] dark:!bg-[#22222224] text-black dark:!text-white"
        >
          <!-- <div
            class="text-[12px] font-['Syne',_sans-serif] text-black dark:!text-[#626262] flex items-center justify-between"
          >
            {{ $t('pending_rewards') }}
            <svg
              @click="openRewardsDropdown = !openRewardsDropdown"
              :class="`${
                openRewardsDropdown ? 'rotate-45' : 'rotate-90'
              } transition-all cursor-pointer`"
              width="10"
              height="10"
              viewBox="0 0 7 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.27805 1.02713L3.27626 5.58143"
                stroke="#00E0FF"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1.05859 3.30542L5.60823 3.30363"
                stroke="#00E0FF"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div> -->
          <div class="flex items-center gap-1">
            <CurrencySymbol />{{ totalRewards }}
            <img :src="rewards_icon" width="16" />
          </div>
          <!-- <div
            v-if="openRewardsDropdown"
            class="flex flex-col gap-1"
            v-for="(item, i) in rewards"
            :key="`${i}-rewards`"
          >
            <div class="flex items-center gap-1">
              <img
                class="w-3 h-3"
                :src="computedTokenImage(item.symbol)"
                :title="item.symbol"
              />
              <div class="text-[10px] font-['Roboto_Mono',_monospace]">
                {{ item.value }}
              </div>
              <div class="text-[10px] font-['Roboto_Mono',_monospace]">
                {{ item.symbol }}
              </div>
              <div class="text-[10px] font-['Roboto_Mono',_monospace]">
                ({{ item[`${postfix_raw_lower}Value`] }})
              </div>
            </div>
          </div> -->
        </div>
        <div
          class="rewards_inside bg-[white] dark:!bg-[#22222224] text-black dark:!text-white"
        >
          <div
            class="text-[12px] font-['Syne',_sans-serif] text-black dark:!text-[#626262]"
          >
            {{ $t('total_staked') }}
          </div>
          <div class="flex"><CurrencySymbol />{{ userTotalStaked }}</div>
          <div
            class="text-[10px] font-['Syne',_sans-serif] text-black dark:!text-[#626262]"
          >
            {{ `in ${userPools.length} pool(s)` }}
          </div>
        </div>

        <!-- <div
          class="rewards_inside bg-[white] dark:!bg-[#22222224] text-black dark:!text-white"
        >
          <div
            class="text-[12px] font-['Syne',_sans-serif] text-black dark:!text-[#626262] flex items-center gap-1"
          >
            {{ $t('Auto Compounder') }}
            <VTooltip :distance="0" :placement="'top'">
              <div style="cursor: help">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.66699 3.6596C3.66699 3.5712 3.70211 3.48641 3.76462 3.4239C3.82714 3.36139 3.91192 3.32627 4.00033 3.32627C4.08873 3.32627 4.17352 3.36139 4.23603 3.4239C4.29854 3.48641 4.33366 3.5712 4.33366 3.6596V5.6596C4.33366 5.74801 4.29854 5.83279 4.23603 5.8953C4.17352 5.95782 4.08873 5.99293 4.00033 5.99293C3.91192 5.99293 3.82714 5.95782 3.76462 5.8953C3.70211 5.83279 3.66699 5.74801 3.66699 5.6596V3.6596ZM4.00033 2.0166C3.91192 2.0166 3.82714 2.05172 3.76462 2.11423C3.70211 2.17674 3.66699 2.26153 3.66699 2.34993C3.66699 2.43834 3.70211 2.52312 3.76462 2.58564C3.82714 2.64815 3.91192 2.68327 4.00033 2.68327C4.08873 2.68327 4.17352 2.64815 4.23603 2.58564C4.29854 2.52312 4.33366 2.43834 4.33366 2.34993C4.33366 2.26153 4.29854 2.17674 4.23603 2.11423C4.17352 2.05172 4.08873 2.0166 4.00033 2.0166Z"
                    fill="#626262"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.00033 0.666504C2.15933 0.666504 0.666992 2.15884 0.666992 3.99984C0.666992 5.84084 2.15933 7.33317 4.00033 7.33317C5.84133 7.33317 7.33366 5.84084 7.33366 3.99984C7.33366 2.15884 5.84133 0.666504 4.00033 0.666504ZM1.33366 3.99984C1.33366 4.70708 1.61461 5.38536 2.11471 5.88546C2.6148 6.38555 3.29308 6.6665 4.00033 6.6665C4.70757 6.6665 5.38585 6.38555 5.88594 5.88546C6.38604 5.38536 6.66699 4.70708 6.66699 3.99984C6.66699 3.29259 6.38604 2.61432 5.88594 2.11422C5.38585 1.61412 4.70757 1.33317 4.00033 1.33317C3.29308 1.33317 2.6148 1.61412 2.11471 2.11422C1.61461 2.61432 1.33366 3.29259 1.33366 3.99984Z"
                    fill="#626262"
                  />
                </svg>
              </div>
              <template #popper>
                <div class="tooltip_container">
                  <div style="font-size: clamp(10px, 0.9vw, 16px)">
                    {{ $t('information') }}
                  </div>
                  <div class="tooltip_container_text">
                    The auto-compounder is a feature designed to maximize your
                    earnings by automatically reinvesting your rewards on a
                    daily basis.
                  </div>
                </div>
              </template>
            </VTooltip>
          </div>
          <div class="flex">
            <div class="flex items-center gap-2">
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  class="sr-only peer"
                  :value="autoCompounderState"
                  @click="autoCompounderState = !autoCompounderState"
                  :checked="autoCompounderState"
                />
                <div
                  class="relative w-7 h-4 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800/50 dark:bg-[#282828] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-[#2ABDFF]"
                ></div>
              </label>
            </div>
          </div>
          <div
            class="text-[10px] font-['Syne',_sans-serif] text-black dark:!text-[#626262]"
          >
            Available in 2 pool(s)
          </div>
        </div> -->
        {{ console.log('rewardsData', rewardsData) }}
        <div
          class="rewards_button_dropdown"
          :class="totalRewards <= 0 ? '!bg-gray-600 !drop-shadow-none' : ''"
          @click="() => (totalRewards <= 0 ? '' : claimRewards(rewardsData))"
        >
          {{ $t('Claim rewards') }}
        </div>
      </div>
    </template>
  </Dropdown>
</template>
<script setup>
import { Dropdown } from 'floating-vue'
import rewards_icon from '@/assets/icons/sidebarIcons/rewards_icon.svg'
import { ref, onMounted, computed } from 'vue'
import computedTokenImage from '@/composables/useComputedTokenImage'
import { InitializeMetamask } from '@/lib/utils/metamask'
import { ethers } from 'ethers'
import { getHeaderData } from '@/composables/data/headerData'
import CurrencySymbol from '@/components/TrackInfo/CurrencySymbol.vue'
import rewards_abi from '@/lib/abi/Rewards.json'
import { claimRewards } from '@/composables/portfolio/useRewards'
import { getUserPools } from '@/composables/data/portfolioData'
import { getPoolsRewards } from '@/composables/data/rewardsData'
import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'
import { useDevice } from '@/composables/adaptive/useDevice'
// import info from '@/assets/images/info.svg'
import LoaderPulse from '../loaders/ThreeDots.vue'

const autoCompounderState = ref(false)

const settingsStore = useSettings()
const { width } = useDevice()

const { currentCurrency } = storeToRefs(settingsStore)

const postfix = computed(() =>
  currentCurrency.value == 'USD' ? '' : `_${currentCurrency.value}`,
)
const postfix_raw = computed(() =>
  currentCurrency.value == 'USD' ? 'Usd' : `${currentCurrency.value}`,
)
const postfix_raw_lower = computed(() =>
  currentCurrency.value == 'USD' ? 'usd' : `${currentCurrency.value}`,
)
const currencyDecimals = computed(() =>
  currentCurrency.value == 'USD' ? 2 : 5,
)
const openRewardsDropdown = ref(false)

const rewards = ref([])
const rewardsData = ref({})
const totalRewards = computed(() =>
  rewards.value
    .filter((item) => item.pool != '0x0000000000000000000000000000000000000000')
    .reduce((sum, value) => sum + value[`reward${postfix_raw.value}`], 0)
    .toFixed(currencyDecimals.value),
)
const userPools = ref([])
const userTotalStaked = computed(() =>
  userPools.value
    .reduce((sum, pool) => sum + pool[`shareBalance${postfix_raw.value}`], 0)
    .toFixed(currencyDecimals.value),
)
onMounted(async () => {
  const mmProvider = await InitializeMetamask()
  if (mmProvider) {
    const address = await mmProvider.getSigner().getAddress()
    userPools.value = await getUserPools(56, address)
    rewardsData.value = await getPoolsRewards(address)
    console.log('REWARDS - ', rewardsData.value)
    rewards.value = Object.values(rewardsData.value).flatMap(
      (item) => item.formatted_rewards,
    )
  }
})
</script>
<style lang="scss" scoped>
.rewards_inside {
  border-radius: 2px;
  // background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;
  padding: 5px;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  // color: white;
  margin-bottom: 6px;
}

.rewards_button_dropdown {
  display: flex;
  align-items: center;

  justify-content: center;
  cursor: pointer;
  margin-top: 16px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  line-height: 24px;
  color: #000000;
  text-align: center;
  padding: 8px;
  background: #00e0ff;

  &:hover {
    filter: drop-shadow(0 0 0.3rem #00e0ff);
  }
}

.button_drop {
  height: 40px;

  font-family: 'Roboto Mono', monospace;

  border: 1px solid #2abdff;
  // box-shadow: 0px 4px 4px 0px #00000040;

  border-radius: 100px;
  padding: 8px 25px;
  font-size: clamp(10px, 0.8vw, 15px);
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: center;
  // color: white;

  display: flex;
  align-items: center;
  gap: 8px;
  @media (max-width: 768px) {
    border: 0px;
  }
  &:hover {
    background: #2abcff36;

    cursor: pointer;
  }
}

.rewards_numbers {
  font-family: 'Roboto Mono', monospace;
}
</style>
