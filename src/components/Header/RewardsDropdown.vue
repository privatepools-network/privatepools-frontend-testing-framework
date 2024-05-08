<template>
  <Dropdown :distance="4" :placement="'bottom-center'">
    <div
      class="button_drop dark:!bg-[#02031C] bg-[#DCEEF6] text-black dark:!text-white p-2"
    >
      <img :src="rewards_icon" />

      $1.23
    </div>
    <template #popper>
      <div class="header__popup bg-white dark:!bg-[#02031C]">
        <h4 class="text-[14px] text-black dark:!text-[#626262] mb-[10px]">
          {{ $t('rewards') }}
        </h4>
        <div
          class="rewards_inside bg-[white] dark:!bg-[#22222224] text-black dark:!text-white"
        >
          <div
            class="text-[12px] font-['Syne',_sans-serif] text-black dark:!text-[#626262] flex items-center justify-between"
          >
            {{ $t('pending_rewards') }}
            <svg
              @click="openRewardsDropdown = !openRewardsDropdown"
              :class="`${openRewardsDropdown ? 'rotate-45' : 'rotate-90'} transition-all cursor-pointer`"
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
          </div>
          <div class="flex items-center gap-1">
            $1.23
            <img :src="rewards_icon" width="16" />
          </div>
          <div v-if="openRewardsDropdown" class="flex flex-col gap-1" v-for="item, i in rewardsMock" :key="`${i}-rewards`">
            <div class="flex items-center gap-1">
              <img
                class="w-3 h-3"
                :src="computedTokenImage(item.symbol)"
                :title="item.symbol"
              />
              <div class="text-[10px] font-['Roboto_Mono',_monospace]">{{item.value}}</div>
              <div class="text-[10px] font-['Roboto_Mono',_monospace]">{{item.symbol}}</div>
              <div class="text-[10px] font-['Roboto_Mono',_monospace]">({{item.usdValue}})</div>
            </div>
          </div>
        </div>
        <div
          class="rewards_inside bg-[white] dark:!bg-[#22222224] text-black dark:!text-white"
        >
          <div
            class="text-[12px] font-['Syne',_sans-serif] text-black dark:!text-[#626262]"
          >
            {{ $t('total_staked') }}
          </div>
          <div>$234.34</div>
          <div
            class="text-[10px] font-['Syne',_sans-serif] text-black dark:!text-[#626262]"
          >
            {{ $t('in 2 pool(s)') }}
          </div>
        </div>
        <div class="rewards_button_dropdown">{{ $t('Claim rewards') }}</div>
      </div>
    </template>
  </Dropdown>
</template>
<script setup>
import { Dropdown } from 'floating-vue'
import rewards_icon from '@/assets/icons/sidebarIcons/rewards_icon.svg'
import { ref } from 'vue';
import computedTokenImage from '@/composables/useComputedTokenImage'

const openRewardsDropdown = ref(false)

const rewardsMock = [
  {
    symbol: 'BTC',
    value: '0.345',
    usdValue: '$1084.45',
  },
  {
    symbol: 'ETH',
    value: '0.645',
    usdValue: '$484.45',
  },
  {
    symbol: 'AVAX',
    value: '1.235',
    usdValue: '$384.45',
  },
  {
    symbol: 'DOGE',
    value: '22',
    usdValue: '$10.45',
  },
]

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

  &:hover {
    background: #2abcff36;

    cursor: pointer;
  }
}
.rewards_numbers {
  font-family: 'Roboto Mono', monospace;
}
</style>
