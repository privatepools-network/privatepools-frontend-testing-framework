<template>
  <div class="portfolio-header">
    <div class="portfolio-header__title">
      <div class="mb-4 text-[22px] font-bold text-black dark:!text-white">
        {{ $t('my_portfolio') }}
      </div>
      <div class="flex items-center text-black dark:!text-white">
        <span>{{ $t('Wallet Balance') }}</span>
        <!-- <svg
          @click="isBalanceHidden = !isBalanceHidden"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="11"
          viewBox="0 0 14 11"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.99995 3.84912C6.08658 3.84912 5.34912 4.58658 5.34912 5.49995C5.34912 6.41333 6.08658 7.15079 6.99995 7.15079C7.91333 7.15079 8.65079 6.41333 8.65079 5.49995C8.65079 4.58658 7.91333 3.84912 6.99995 3.84912ZM4.47412 5.49995C4.47412 4.10333 5.60333 2.97412 6.99995 2.97412C8.39658 2.97412 9.52579 4.10333 9.52579 5.49995C9.52579 6.89658 8.39658 8.02579 6.99995 8.02579C5.60333 8.02579 4.47412 6.89658 4.47412 5.49995Z"
            class="fill-black dark:!fill-[#E1E1E1]"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1.31678 3.74815C2.71148 1.55577 4.75525 0.232422 6.99991 0.232422C9.24466 0.232422 11.2885 1.55589 12.6832 3.74844C13.0011 4.2468 13.1453 4.88518 13.1453 5.49701C13.1453 6.10883 13.0011 6.74721 12.6832 7.24557C11.2885 9.43812 9.24466 10.7616 6.99991 10.7616C4.75516 10.7616 2.7113 9.43812 1.3166 7.24557C0.998695 6.74721 0.854492 6.10883 0.854492 5.49701C0.854492 4.88506 0.99875 4.24656 1.31678 3.74815ZM6.99991 1.10742C5.12633 1.10742 3.33185 2.21062 2.05489 4.21807L2.05452 4.21865C1.84768 4.5427 1.72949 5.00657 1.72949 5.49701C1.72949 5.98745 1.84768 6.45131 2.05452 6.77537L2.05489 6.77594C3.33185 8.78339 5.12633 9.88659 6.99991 9.88659C8.87349 9.88659 10.668 8.78339 11.9449 6.77594L11.9453 6.77537C12.1521 6.45131 12.2703 5.98745 12.2703 5.49701C12.2703 5.00657 12.1521 4.5427 11.9453 4.21865L11.9449 4.21807C10.668 2.21062 8.87349 1.10742 6.99991 1.10742Z"
            class="fill-black dark:!fill-[#E1E1E1]"
          />
        </svg> -->
      </div>
    </div>
    
    <div class="flex items-center gap-1">
    <div class="portfolio-header__balance flex items-center text-black dark:!text-white"
      v-if="isBalanceHidden == false">

      <CounterAnimation :currency="''" :decimalPlaces="currencyDecimals"
        :value="currencyBalance.toFixed(currencyDecimals)" />

    </div>
    <div class="portfolio-header__balance text-black dark:!text-white" v-else>
      ${{ hiddenBalance }}
    </div>
    <div class="balance_change">
      <svg
        :class="sidebarData?.userBalance?.balanceChange > 0 ? '' : 'rotate-180'"
        width="11"
        height="11"
        viewBox="0 0 11 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_67_2314)">
          <path
            d="M8.55317 6.00527C9.03679 6.84355 8.43184 7.89135 7.46406 7.89166L2.51976 7.89456C1.55104 7.89549 0.945005 6.84648 1.42942 6.00745L3.90407 1.72123C4.38848 0.882201 5.59997 0.882539 6.08352 1.72194L8.55317 6.00527Z"
            :fill="
              sidebarData?.userBalance?.balanceChange > 0
                ? '#40B66B'
                : '#D22B2B'
            "
          />
        </g>
        <defs>
          <clipPath id="clip0_67_2314">
            <rect
              width="8.05256"
              height="8.05256"
              fill="white"
              transform="translate(6.97363 11) rotate(-150)"
            />
          </clipPath>
        </defs>
      </svg>
      <!-- ${{ Number(sidebarData?.userBalance?.totalYesterday).toFixed(2) }} -->
      ({{ sidebarData?.userBalance?.balanceChange ? Number(sidebarData?.userBalance?.balanceChange).toFixed(1) : 0 }}%)
    </div>
  </div>
  </div>

  <div class="portfolio-stats">
    <!-- <div class="portfolio-stats__el">
      <div class="portfolio-stats__info">
        <div class="portfolio-stats__title dark:!text-[#e1e1e1] text-black">
          {{ $t('my_rewards') }}
          <span class="portfolio-header__variation-period !text-white">
            24H
          </span>
        </div>
        <div class="portfolio-stats__amount portfolio-stats__amount_success flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path d="M6 0L11.1962 9H0.803848L6 0Z" fill="#2DC24E" />
          </svg>
          <span class="portfolio-header__amount-percents">${{ totalRewards }}</span>
        </div>
      </div>
    </div> -->

    <div class="portfolio-stats__el">
      <div v-if="performers.best" class="flex items-center">
        <img
          v-for="img in performers.best.tokens"
          :key="img"
          :src="getTokenEntity(img, 'short').icon"
          alt=""
          class="portfolio-stats__icon"
        />
      </div>

      <div class="portfolio-stats__info">
        <div class="portfolio-stats__title dark:!text-[#e1e1e1] text-black">
          {{ $t('best_performer') }}
        </div>
        <div
          class="portfolio-stats__amount portfolio-stats__amount_success flex items-center"
        >
          {{ console.log('performers.best', performers.best) }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="9"
            viewBox="0 0 12 9"
            fill="none"
          >
            <path d="M6 0L11.1962 9H0.803848L6 0Z" fill="#2DC24E" />
          </svg>
          <span v-if="performers.best" class="portfolio-header__amount-percents">{{
            performers.best.percent_diff.toFixed(2) }}% ({{
              formatBalanceVariation(performers.best.diff)
            }})</span>
          <span v-else-if="performers.best === undefined" class="portfolio-header__amount-percents">{{ $t('unavailable')
            }}
          </span>
          <div v-else class="mt-3">
            <ThreeDots></ThreeDots>
          </div>
        </div>
      </div>
    </div>
    <div class="portfolio-stats__el">
      <div v-if="performers.worst" class="flex items-center">
        <img
          v-for="img in performers.worst.tokens"
          :key="img"
          :src="getTokenEntity(img, 'short').icon"
          alt=""
          class="portfolio-stats__icon"
        />
      </div>
      <div class="portfolio-stats__info">
        <div class="portfolio-stats__title dark:!text-[#e1e1e1] text-black">
          {{ $t('worst_performer') }}
        </div>
        <div
          class="portfolio-stats__amount portfolio-stats__amount_danger flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="9"
            viewBox="0 0 12 9"
            fill="none"
          >
            <path d="M6 0L11.1962 9H0.803848L6 0Z" fill="#2DC24E" />
          </svg>
          <span v-if="performers.worst" class="portfolio-header__amount-percents">{{
            performers.worst.percent_diff.toFixed(2) }}% ({{
              formatBalanceVariation(performers.worst.diff)
            }})</span>
          <span v-else-if="performers.worst === undefined" class="portfolio-header__amount-percents">{{
            $t('unavailable') }}
          </span>
          <div v-else class="mt-3">
            <ThreeDots></ThreeDots>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getTokenEntity } from '@/lib/helpers/util'
import { ref, defineProps, computed, toRefs, onMounted } from 'vue'
import CurrencySymbol from '../TrackInfo/CurrencySymbol.vue'
import CountUp from 'vue-countup-v3'

import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'
import CounterAnimation from '@/UI/CounterAnimation.vue'
import { getSidebarData } from '@/composables/data/sidebarData'

const settingsStore = useSettings()

const sidebarData = ref([])

const { currentCurrency } = storeToRefs(settingsStore)

const currencySymbol = computed(() =>
  currentCurrency.value == 'USD' ? '$' : currentCurrency.value,
)
const currencyDecimals = computed(() =>
  currentCurrency.value == 'USD' ? 2 : 5,
)

const postfix = computed(() => currentCurrency.value == "USD" ? "" : `_${currentCurrency.value}`)
const postfix_raw = computed(() => currentCurrency.value == "USD" ? "Usd" : `${currentCurrency.value}`)

const props = defineProps(['account','performers', 'balanceUsd', 'balance_ETH', 'balance_BTC', 'rewardsData'])
const { balanceUsd, rewardsData } = toRefs(props)
const totalRewards = computed(() => rewardsData.value.filter((item) => item.pool != "0x0000000000000000000000000000000000000000").reduce((sum, value) => sum + value[`reward${postfix_raw.value}`], 0).toFixed(currencyDecimals.value))
const isBalanceHidden = ref(false)

const currencyBalance = computed(() =>
  currentCurrency.value == 'USD'
    ? balanceUsd.value
    : props[`balance${postfix.value}`],
)

const hiddenBalance = computed(() => {
  let balanceLength = currencyBalance.value
    .toFixed(currencyDecimals.value)
    .toString().length
  return Array(balanceLength).fill('*').join('')
})
const formattedBalanceVariation = computed(() => {
  return formatBalanceVariation(currencyBalance.value)
})

function formatBalanceVariation(variation) {
  if (variation < 0) {
    return variation
      .toFixed(currencyDecimals.value)
      .toString()
      .replace('-', `-${currencySymbol.value}`)
  } else {
    return variation
      .toFixed(currencyDecimals.value)
      .toString()
      .replace('', `+${currencySymbol.value}`)
  }
}

const balanceVariationInPercents = computed(() => {
  return formatVariationInPercents(currencyBalance.value, currencyBalance.value)
})

function formatVariationInPercents(variation, currentBalance) {
  if (variation < 0) {
    let positiveVariation = variation * -1
    let startBalance = currentBalance + positiveVariation
    return ((positiveVariation / startBalance) * 100)
      .toFixed(currencyDecimals.value)
      .toString()
      .replace('', '-')
  } else {
    let startBalance = currentBalance - variation
    return (startBalance / variation)
      .toFixed(currencyDecimals.value)
      .toString()
      .replace('', '+')
  }
}
onMounted(async () => {
  {
    {
      console.log('props.account', props.account)
    }
  }
  sidebarData.value = await getSidebarData(props.account, 56)
})
</script>
<style lang="scss" scoped>
.balance_change {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0em;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #898989;
}
</style>
