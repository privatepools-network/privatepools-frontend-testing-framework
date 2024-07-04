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
          <div
            @click="
              currentParticles === 'on'
                ? handleChangeParticles('off')
                : handleChangeParticles('on')
            "
          >
            <span v-if="currentParticles === 'on'">On</span
            ><span v-else>Off</span>
          </div>
        </div>
        <!-- <ThemeToggler /> -->
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
            {{ currentCurrency }}
            <img :src="arrow_right" />
          </div>
        </div>
        <div
          class="settings_text text-black dark:!text-white flex items-center justify-between"
        >
          <div class="flex items-center gap-1">
            {{ $t('Private Pools Pro') }}
            <svg
              width="26"
              height="15"
              viewBox="0 0 26 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="26" height="15" rx="4" fill="#00E0FF" />
              <path
                d="M3.07322 10V4.816H5.71322C6.34789 4.816 6.83322 4.936 7.16922 5.176C7.51055 5.41067 7.68122 5.752 7.68122 6.2C7.68122 6.488 7.61455 6.71733 7.48122 6.888C7.35322 7.05333 7.16922 7.17867 6.92922 7.264C6.68922 7.344 6.40655 7.39467 6.08122 7.416L6.11322 7.368C6.34789 7.37333 6.56922 7.39467 6.77722 7.432C6.99055 7.464 7.17722 7.52267 7.33722 7.608C7.50255 7.69333 7.63055 7.81333 7.72122 7.968C7.81722 8.11733 7.86522 8.312 7.86522 8.552C7.86522 8.872 7.78522 9.136 7.62522 9.344C7.46522 9.552 7.24389 9.712 6.96122 9.824C6.67855 9.93067 6.35322 9.98933 5.98522 10H3.07322ZM3.98522 9.224H5.84922C6.19589 9.224 6.46522 9.16533 6.65722 9.048C6.84922 8.92533 6.94522 8.736 6.94522 8.48C6.94522 8.27733 6.88655 8.13067 6.76922 8.04C6.65189 7.944 6.49989 7.88267 6.31322 7.856C6.13189 7.82933 5.93722 7.816 5.72922 7.816H3.98522V9.224ZM3.98522 7.056H5.65722C6.00389 7.056 6.27055 6.99733 6.45722 6.88C6.64922 6.75733 6.74522 6.56533 6.74522 6.304C6.74522 6.048 6.64922 5.86667 6.45722 5.76C6.27055 5.648 6.02522 5.592 5.72122 5.592H3.98522V7.056ZM9.73522 7.792V9.216H13.3752V10H8.82322V4.816H13.3672V5.6H9.73522V7.04H12.7112V7.792H9.73522ZM13.9995 4.816H18.9755V5.6H13.9995V4.816ZM16.0395 5.504H16.9435V10H16.0395V5.504ZM20.0823 8.784V8.008H23.1703V8.784H20.0823ZM18.8823 10L21.1463 4.816H22.1223L24.4023 10H23.4183L21.4343 5.32H21.8343L19.8583 10H18.8823Z"
                fill="#02031C"
              />
            </svg>
          </div>

          <Toggler :toggle="currentVersion === 'lite' ? false : true" :label="''" @change="handleChangeVersion(currentVersion === 'lite' ? 'pro' : 'lite')"/>
        </div>
      </div>
      <div
        v-if="settingsState === 'Language'"
        class="overflow-auto languages_container"
      >
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
            <img :src="currency.img" class="w-4" />
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

const { currentCurrency, currentLanguage, currentParticles, currentVersion } =
  storeToRefs(settingsStore)

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

defineEmits(['toggleToWallets'])
const HideSmallBalances = ref(true)

const settingsState = ref('Main')

const handleChangeCurrency = (cur) => {
  settingsStore.updateCurrency(cur)
}
const handleChangeLanguage = (lang) => {
  i18next.changeLanguage(lang.symbol)
  settingsStore.updateLanguage(lang.name)
}
const handleChangeParticles = (prop) => {
  settingsStore.updateParticles(prop)
}
const handleChangeVersion = (prop) => {
  settingsStore.updateVersion(prop)
  window.location.reload()
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
