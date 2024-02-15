<template>
  <div style="height: 92%">
    <div class="d-flex align-items-center">
      <div
        class="sidebar_settings_icon"
        style="margin-right: 35%"
        @click="$emit('toggleToWallets')"
      >
        <svg
          width="17"
          height="15"
          viewBox="0 0 17 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.2085 7.5L15.7918 7.5M1.2085 7.5L7.4585 1.25M1.2085 7.5L7.4585 13.75"
            stroke="#F8F8F8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="sidebar_header">Settings</div>
    </div>
    <div class="d-flex flex-column justify-content-between h-100 gap-3 mt-3">
      <div>
      <div
        class="d-flex justify-content-between align-items-center settings_text"
      >
        <div>Hide small balances</div>
        <div style="cursor: pointer">
          <CFormSwitch
            style="background-color: #00c9ff"
            size="lg"
            v-model="HideSmallBalances"
            id="HideSmallBalances"
          />
        </div>
      </div>
      <div
        class="d-flex justify-content-between align-items-center settings_text"
      >
        <div>Language</div>
        <div style="cursor: pointer">
          English
          <svg
            width="6"
            height="11"
            viewBox="0 0 6 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.08333 9.04168L4.625 5.50001L1.08333 1.95834"
              stroke="#898989"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <div
        class="d-flex justify-content-between align-items-center settings_text"
      >
        <div>Currency</div>
        <div style="cursor: pointer">
          USD
          <svg
            width="6"
            height="11"
            viewBox="0 0 6 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.08333 9.04168L4.625 5.50001L1.08333 1.95834"
              stroke="#898989"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
      <div class="wallet_bottom_text">
        By connecting a wallet, you agree to Private Pools
        <a class="wallet_link">Terms of Service</a> and consent to its
        <a class="wallet_link">Privacy Policy.</a>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { defineEmits } from 'vue'

defineEmits(['toggleToWallets'])
const HideSmallBalances = ref(true)
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
