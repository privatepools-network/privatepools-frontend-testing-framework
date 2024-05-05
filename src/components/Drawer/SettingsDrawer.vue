<template>
  <div style="height: 92%">
    <div class="d-flex align-items-center">
      <div
        class="sidebar_settings_icon"
        style="margin-right: 35%"
        @click="
          settingsState === 'Language' || settingsState === 'Currency'
            ? (settingsState = 'Main')
            : $emit('toggleToWallets')
        "
      >
        <svg
          width="17"
          height="15"
          viewBox="0 0 17 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.20801 7.5L15.7913 7.5M1.20801 7.5L7.45801 1.25M1.20801 7.5L7.45801 13.75"
            class="stroke-black dark:!stroke-white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="sidebar_header text-black dark:!text-white">
        {{
          settingsState === 'Language'
            ? $t('language')
            : settingsState === 'Currency'
            ? $t('currency')
            : $t('settings')
        }}
      </div>
    </div>
    <div class="d-flex flex-column justify-content-between h-100 gap-3 mt-3">
      <div v-if="settingsState === 'Main'">
        <div
          class="settings_text text-black dark:!text-white flex items-center justify-between"
        >
          <div>{{ $t('hide_small_balances') }}</div>

          <Toggler :toggle="HideSmallBalances" :label="''" />
        </div>
        <div
          class="settings_text text-black dark:!text-white flex items-center justify-between"
        >
          <div>Particles</div>
          <div @click="$emit('handleHideParticles')"><span v-if="!HideParticles">On</span><span v-else>Off</span></div>
        </div>
        <ThemeToggler />
        <div
          class="d-flex justify-content-between align-items-center settings_text text-black dark:!text-white"
          @click="settingsState = 'Language'"
        >
          <div>{{ $t('language') }}</div>
          <div class="cursor-pointer flex items-center gap-1">
            {{ currentLanguage }}
            <img :src="arrow_right" />
          </div>
        </div>
        <div
          class="d-flex justify-content-between align-items-center settings_text text-black dark:!text-white"
          @click="settingsState = 'Currency'"
        >
          <div>{{ $t('currency') }}</div>
          <div class="cursor-pointer flex items-center gap-1">
            {{currentCurrency}}
            <img :src="arrow_right" />
          </div>
        </div>
      </div>
      <div v-if="settingsState === 'Language'" class="overflow-auto languages_container">
        <div
          class="flex justify-between items-center mb-2 settings_text px-2 rounded-lg hover:bg-[#00c8ff15] text-black dark:!text-white"
          style="cursor: pointer"
          v-for="language in languages"
          :key="language"
          @click="handleChangeLanguage(language)"

        >
          <div>{{ language.nativeName }}</div>
          <div v-if="currentLanguage === language.name">
            <img :src="check_icon" />
          </div>
        </div>
      </div>
      <div v-if="settingsState === 'Currency'">
        <div
          class="flex justify-between items-center mb-2 settings_text px-2 rounded-lg hover:bg-[#00c8ff15] text-black dark:!text-white"
          style="cursor: pointer"
          v-for="currency in currencyList"
          :key="currency"
          @click="handleChangeCurrency(currency.symbol)"
        >
          <div class="flex items-center gap-1">
            <img :src="currency.img" class="w-4"/>
            {{ currency.symbol }}
          </div>
          <div v-if="currentCurrency === currency.symbol">
            <img :src="check_icon" />
          </div>
        </div>
      </div>
      <div class="wallet_bottom_text">{{ $t('version') }}: v1.0.0</div>
    </div>
  </div>
  {{ console.log('currentLanguage', currentLanguage) }}
</template>
<script setup>
import { ref } from 'vue'
import { defineEmits, defineProps } from 'vue'
import languages from '@/assets/localization/languages'
import arrow_back_sidebar from '@/assets/icons/arrow/arrow_back_sidebar.svg'
import arrow_right from '@/assets/icons/arrow/arrow_right.svg'
import check_icon from '@/assets/icons/sidebarIcons/check_icon.svg'
import usa from '@/assets/icons/sidebarIcons/flags/usa.svg'
import Toggler from '@/UI/Toggler.vue'
import ThemeToggler from '@/UI/ThemeToggler.vue'
import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'
import btcSymbol from '@/assets/images/tokens/btcSymbol.png'
import ethSymbol from '@/assets/images/tokens/ethSymbol.png'
import i18next from 'i18next'

const settingsStore = useSettings()

const { currentCurrency, currentLanguage } = storeToRefs(settingsStore)

const currencyList = [
  {
    symbol: 'USD',
    img: usa,
  },
  {
    symbol: 'BTC',
    img: btcSymbol,
  },
  {
    symbol: 'ETH',
    img: ethSymbol,
  },
]

defineProps(['HideParticles'])
defineEmits(['toggleToWallets', 'handleHideParticles'])
const HideSmallBalances = ref(true)

const settingsState = ref('Main')

const handleChangeCurrency = (cur) => {
  settingsStore.updateCurrency(cur)
}
const handleChangeLanguage = (lang) => {
  i18next.changeLanguage(lang.symbol)
  settingsStore.updateLanguage(lang.name)
}
</script>
<style lang="scss" scoped>
.sidebar_header {
  
  font-size: 14px;
  font-weight: 600;
  line-height: 44px;
  letter-spacing: 0px;
  // color: #ffffff;
}

.sidebar_settings_icon {
  cursor: pointer;
}

.sidebar_settings_icon:hover svg path {
  stroke: #00c9ff;
}

.wallet_container_sidebar {
  background: #10101099;
  border-radius: 20px;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 15px 22px;

  &:hover {
    cursor: pointer;
    background: #1313134d;
  }
}

.wallet_text {
  
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  color: #717a8c;
}

.wallet_bottom_text {
  
  font-size: 13px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0em;
  color: #747474;
}

.wallet_link {
  cursor: pointer;
  text-decoration: underline;
  color: #747474;
}

.settings_text {
  
  font-size: 13px;
  font-weight: 400;
  line-height: 44px;
  letter-spacing: 0px;
  cursor: pointer;
}

/* Scrollbar */
.languages_container::-webkit-scrollbar {
  height: 0px;
  width: 4px;
}

.languages_container::-webkit-scrollbar {
  background: transparent;
}

.languages_container::-webkit-scrollbar-thumb {
  background-color: #00e0ff9e;
  border-radius: 8px;
}
</style>
