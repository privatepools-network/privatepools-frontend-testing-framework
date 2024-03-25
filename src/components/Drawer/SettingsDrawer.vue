<template>
  <div style="height: 92%">
    <div class="d-flex align-items-center">
      <div class="sidebar_settings_icon" style="margin-right: 35%" @click="
        settingsState === 'Language' || settingsState === 'Currency'
          ? (settingsState = 'Main')
          : $emit('toggleToWallets')
        ">
        <img :src="arrow_back_sidebar" />
      </div>
      <div class="sidebar_header">{{ settingsState === 'Language' ? 'Language' : settingsState === 'Currency' ? 'Currency'
        : 'Settings' }} </div>
    </div>
    <div class="d-flex flex-column justify-content-between h-100 gap-3 mt-3">
      <div v-if="settingsState === 'Main'">
        <div class="settings_text flex items-center justify-between">
          <div>Hide small balances</div>
          
            <Toggler :toggle="HideSmallBalances" :label="''"/>
        </div>
        <ThemeToggler/>
        <div class="d-flex justify-content-between align-items-center settings_text" @click="settingsState = 'Language'">
          <div>Language</div>
          <div class="cursor-pointer flex items-center gap-1">
            English
            <img :src="arrow_right"/>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center settings_text" @click="settingsState = 'Currency'">
          <div>Currency</div>
          <div class="cursor-pointer flex items-center gap-1">
            USD
            <img :src="arrow_right"/>
          </div>
        </div>
      </div>
      <div v-if="settingsState === 'Language'">
        <div class="d-flex justify-content-between align-items-center settings_text" style="cursor: pointer"
          v-for="language in languages" :key="language">
          <div>{{ language.nativeName }}</div>
          <div>
          <img :src="check_icon" />
          </div>
        </div>
      </div>
      <div v-if="settingsState === 'Currency'">
        <div class="d-flex justify-content-between align-items-center settings_text" style="cursor: pointer">
          <div class="d-flex align-items-center gap-1">
           <img :src="usa" />
            USD
          </div>
          <div>
            <img :src="check_icon" />
          </div>
        </div>
      </div>
      <div class="wallet_bottom_text">Version: v1.0.0</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { defineEmits } from 'vue'
import languages from "@/assets/localization/languages"
import arrow_back_sidebar from "@/assets/icons/arrow/arrow_back_sidebar.svg"
import arrow_right from "@/assets/icons/arrow/arrow_right.svg"
import check_icon from "@/assets/icons/sidebarIcons/check_icon.svg"
import usa from "@/assets/icons/sidebarIcons/flags/usa.svg"
import Toggler from "@/UI/Toggler.vue"
import ThemeToggler from "@/UI/ThemeToggler.vue"

defineEmits(['toggleToWallets'])
const HideSmallBalances = ref(true)
const settingsState = ref('Main')
</script>
<style lang="scss" scoped>
.sidebar_header {
  font-family: Inter;
  font-size: 14px;
  font-weight: 600;
  line-height: 44px;
  letter-spacing: 0px;
  color: #ffffff;
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
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  color: #717a8c;
}

.wallet_bottom_text {
  font-family: Inter;
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
  font-family: Inter;
  font-size: 13px;
  font-weight: 400;
  line-height: 44px;
  letter-spacing: 0px;
  color: #ffffff;
}
</style>
