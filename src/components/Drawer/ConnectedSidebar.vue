<template>
  <div style="height: 92%; padding-top: 7px">
    <div class="d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center gap-2">
        <!-- <img :src="accountIcon" /> -->
        <span class="pulse_green !w-[12px] !h-[12px]"></span>
        <div class="address_text text-black dark:!text-white">
          {{ computedAddress }}
        </div>
      </div>
      <div class="d-flex align-items-center gap-3">
        <div>
          <div class="sidebar_settings_icon" @click="$emit('toggleSettings')">
            <SettingsIcon/>
          </div>
        </div>
        <div class="sidebar_exit_icon" @click="disconnectFromWallet">
          <ExitIcon/>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column h-100 gap-3 mt-3">
      <div class="d-flex flex-column">
        <div class="balance_text text-black dark:!text-white">
          <CounterAnimation
            :currency="false"
            :decimalPlaces="currencyDecimals"
            :value="
              parseFloat(
                sidebarData?.userBalance
                  ? sidebarData?.userBalance[`total${postfix}`]
                  : 0,
              ).toFixed(currencyDecimals)
            "
          />
        </div>
        <div
          class="balance_change"
          v-if="sidebarData?.userBalance?.total != null"
        >
          <svg
            :class="
              sidebarData?.userBalance?.balanceChange > 0 ? '' : 'rotate-180'
            "
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
          ({{ Number(sidebarData?.userBalance?.balanceChange).toFixed(1) }}%)
        </div>
      </div>

      <div class="d-flex gap-3">
        <div
          @click="sidebarTab = 'Tokens'"
          :class="sidebarTab === 'Tokens' ? 'tab selected_tab' : 'tab'"
        >
          {{ $t('tokens') }}
        </div>
        <div
          @click="sidebarTab = 'Pools'"
          :class="sidebarTab === 'Pools' ? 'tab selected_tab' : 'tab'"
        >
          {{ $t('pools') }}
        </div>
        <div
          @click="sidebarTab = 'Activity'"
          :class="sidebarTab === 'Activity' ? 'tab selected_tab' : 'tab'"
        >
          {{ $t('activity') }}
        </div>
      </div>
      {{
        console.log(
          'sidebarData?.userBalance?.tokens',
          sidebarData?.userBalance?.tokens,
        )
      }}
      <div
        v-if="sidebarTab === 'Tokens'"
        class="flex flex-col gap-2 overflow-auto h-full activity_container"
      >
      <div
          class="flex justify-center items-center pt-24"
          v-if="sidebarData?.userBalance?.tokens === null"
        >
          <LoaderPulse />
        </div>
      <div
          v-else-if="sidebarData?.userBalance?.tokens.length === 0"
          class="d-flex flex-column gap-2 justify-content-center align-items-center h-[100vh]"
        >
      
          <div class="text-black dark:!text-white">
            You don't have any tokens yet
          </div>
        </div>
        <div
          v-else-if="sidebarData?.userBalance?.tokens != null"
          v-for="(item, i) in sidebarData?.userBalance?.tokens.filter(
            (item) => item.usdAmount !== 0 && item.symbol !== 'BOOM',
          )"
          :key="`${i}-token`"
          class="p-2 d-flex align-items-center justify-content-between gap-2"
        >
          <div class="d-flex align-items-center gap-2">
            <img :src="getTokenEntity(item.symbol, 'short').icon" width="38" />
            <div class="d-flex flex-column">
              <div class="text-black dark:!text-white text-[12px]">
                {{ item.symbol }}
              </div>
              <div class="text-black dark:!text-[#8e8e8e] text-[10px]">
                {{ item.amount.toFixed(6) }} {{ item.symbol }}
              </div>
            </div>
          </div>
          <div>
            <div class="d-flex flex-column align-items-end">
              <div
                class="text-black dark:!text-white text-[12px] flex items-center"
              >
                <CurrencySymbol />
                {{ item[`${prefix}Amount`].toFixed(currencyDecimals) }}
              </div>

              <div
                class="d-flex align-items-center gap-1 text-black dark:!text-[#8e8e8e] text-[10px]"
              >
                <svg
                  :class="item.percentChange24h > 0 ? '' : 'rotate-180'"
                  width="7"
                  height="7"
                  viewBox="0 0 7 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_74_4052)">
                    <path
                      d="M5.44288 3.82129C5.75064 4.35474 5.36567 5.02152 4.74981 5.02172L1.60344 5.02356C0.986982 5.02415 0.601322 4.3566 0.909584 3.82268L2.48436 1.09508C2.79262 0.561153 3.56357 0.561368 3.87129 1.09553L5.44288 3.82129Z"
                      :fill="item.percentChange24h > 0 ? '#40B66B' : '#D22B2B'"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_74_4052">
                      <rect
                        width="5.12436"
                        height="5.12436"
                        fill="white"
                        transform="translate(4.4375 7) rotate(-150)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <!-- {{ item.percentChange }} -->
                {{ item.percentChange24h.toFixed(2) }}%
              </div>
            </div>
          </div>
        </div>
       
      </div>
      <div v-else-if="sidebarTab === 'Pools'" class="h-100">
        <div
          class="flex justify-center items-center pt-24"
          v-if="addressPools === null"
        >
          <LoaderPulse />
        </div>
        <div
          class="d-flex flex-column gap-2"
          v-else-if="addressPools.length > 0"
        >
          {{ console.log('addressPools', addressPools) }}
          <div
            v-for="(item, i) in addressPools"
            :key="`${i}-token`"
            class="p-2 d-flex align-items-center justify-content-between gap-2"
          >
            <div class="d-flex align-items-center gap-2">
              <!-- <img :src="getTokenEntity(item.img, 'short').icon" width="38" /> -->
              <img :src="defaultIcon" class="w-[35px]"/>

              <div class="flex items-center gap-1">
                <div class="flex-col">
                  <div class="flex items-center flex-wrap">
                    <div
                      class="text-black dark:!text-white text-[12px]"
                      :key="token.symbol + i"
                      v-for="(token, i) in item.tokens"
                    >
                    <span v-if="i !== 0">-</span>{{ token.symbol }}
                    </div>
                  </div>
                  <div class="text-black dark:!text-[#8e8e8e] text-[10px]">
                    {{ item.APR }}% APR
                  </div>
                </div>
                <div class="text-black dark:!text-[#8e8e8e] text-[10px]">
                  {{ item.img }}
                </div>
              </div>
            </div>
            <div>
              <div class="d-flex flex-column align-items-end">
                <div
                  class="text-black dark:!text-white text-[12px] font-['Roboto_Mono',_monospace]"
                >
                  ${{ item[`shareBalance${postfix_raw}`].toFixed(3) }}
                </div>
                <div
                  v-if="item.LiquidityType === 'WP'"
                  class="flex items-center gap-1 text-black dark:!text-[#8e8e8e] text-[10px]"
                >
                  <svg
                    :class="item.percentage > 0 ? '' : 'rotate-180'"
                    width="7"
                    height="7"
                    viewBox="0 0 7 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_74_4052)">
                      <path
                        d="M5.44288 3.82129C5.75064 4.35474 5.36567 5.02152 4.74981 5.02172L1.60344 5.02356C0.986982 5.02415 0.601322 4.3566 0.909584 3.82268L2.48436 1.09508C2.79262 0.561153 3.56357 0.561368 3.87129 1.09553L5.44288 3.82129Z"
                        :fill="item.percentage > 0 ? '#40B66B' : '#D22B2B'"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_74_4052">
                        <rect
                          width="5.12436"
                          height="5.12436"
                          fill="white"
                          transform="translate(4.4375 7) rotate(-150)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  {{ item.percentage.toFixed(2) }}%
                </div>
                <div
                  v-else
                  class="flex items-center gap-1 text-black dark:!text-[#8e8e8e] text-[10px]"
                >
                  On range
                  <svg
                    width="5"
                    height="5"
                    viewBox="0 0 5 5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="2.5" cy="2.5" r="2.5" fill="#40B66B" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else-if="addressPools.length === 0"
          class="d-flex flex-column gap-2 justify-content-center align-items-center h-100"
        >
          <svg
            width="74"
            height="72"
            viewBox="0 0 74 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 51.4851L9.664 48.0541C12.2844 46.7035 15.1774 46 18.1111 46C21.0448 46 23.9378 46.7035 26.5582 48.0541L28.5529 49.083C31.1733 50.4337 34.0663 51.1372 37 51.1372C39.9337 51.1372 42.8267 50.4337 45.4471 49.083L47.4418 48.0541C50.0622 46.7035 52.9552 46 55.8889 46C58.8226 46 61.7156 46.7035 64.336 48.0541L71 51.4851M3 69L9.664 65.5651C12.2844 64.2145 15.1774 63.511 18.1111 63.511C21.0448 63.511 23.9378 64.2145 26.5582 65.5651L28.5529 66.594C31.1733 67.9447 34.0663 68.6481 37 68.6481C39.9337 68.6481 42.8267 67.9447 45.4471 66.594L47.4418 65.5651C50.0622 64.2145 52.9552 63.511 55.8889 63.511C58.8226 63.511 61.7156 64.2145 64.336 65.5651L71 69"
              stroke="#1E5973"
              stroke-width="5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M37.5 18.525C48.2707 18.525 57 14.884 57 10.3974C57 5.91091 48.2707 2.2699 37.5 2.2699C26.7293 2.2699 18 5.91091 18 10.3974C18 14.884 26.7293 18.525 37.5 18.525ZM37.5 31.5199C30.058 31.5199 23.4768 29.7299 19.3254 26.9648C18.4799 27.8789 18 28.8615 18 29.8974C18 34.384 26.7293 38.025 37.5 38.025C48.2707 38.025 57 34.384 57 29.8974C57 28.8615 56.5201 27.8789 55.6746 26.9724C51.5232 29.7299 44.942 31.5199 37.5 31.5199ZM37.5 21.7699C30.058 21.7699 23.4768 19.9799 19.3254 17.2148C18.4799 18.1289 18 19.1115 18 20.1474C18 24.634 26.7293 28.275 37.5 28.275C48.2707 28.275 57 24.634 57 20.1474C57 19.1115 56.5201 18.1289 55.6746 17.2224C51.5232 19.9799 44.942 21.7699 37.5 21.7699Z"
              fill="#7D7D7D"
            />
          </svg>
          <div class="text-black dark:!text-white">
            {{ $t('no_pools_yet') }}
          </div>
          <div class="text-black dark:!text-white text-[12px] text-center">
            {{ $t('open_position_to_get_started') }}
          </div>
          <div @click="router.push('/pools/compose')" class="add_liq_btn_pools">
            <div class="d-flex gap-1">+ {{ $t('Create Pool') }}</div>
          </div>
        </div>
      </div>
      <div
        v-else-if="sidebarTab === 'Activity'"
        class="d-flex flex-column gap-2 overflow-auto activity_container"
      >
        <div
          class="flex justify-center items-center pt-24"
          v-if="addressActivity === null"
        >
          <LoaderPulse />
        </div>
        <div
          v-else-if="addressActivity.length === 0"
          class="d-flex flex-column gap-2 justify-content-center align-items-center h-[100vh]"
        >
      
          <div class="text-black dark:!text-white">
            {{ $t('No Activity yet') }}
          </div>
        </div>
        <div v-else>
          <div>
            <!-- {{ console.log('addressActivity', addressActivity) }} -->

            <div class="tab my-2" style="font-size: 12px">
              {{ $t('today') }}
            </div>
            <div class="d-flex flex-column gap-2">
              <a
                :href="`${configService.getNetworkConfig(56).explorer}/tx/${
                  item.hash
                }`"
                target="_blank"
                v-for="(item, i) in addressActivity.filter(
                  (el) => el.type == 'today',
                )"
                :key="`${i}-token`"
                class="p-2 d-flex align-items-center justify-content-between gap-2"
                style="text-decoration: none"
              >
                <div class="d-flex align-items-center gap-2">
                  <img :src="item.img" width="38" />
                  <div class="d-flex flex-column">
                    <div class="text-black dark:!text-white text-[12px]">
                      {{ item.label }}
                    </div>
                    <div class="text-black dark:!text-[#8e8e8e] text-[12px]">
                      {{ item.desc }}
                    </div>
                  </div>
                </div>
                <div>
                  <div class="d-flex flex-column align-items-end">
                    <div
                      class="text-black dark:!text-white text-[12px] whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {{ item.time }}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div>
            <div class="tab my-2" style="font-size: 12px">
              {{ $t('this_week') }}
            </div>
            <div class="d-flex flex-column gap-2">
              <a
                :href="`${configService.getNetworkConfig(56).explorer}/tx/${
                  item.hash
                }`"
                target="_blank"
                v-for="(item, i) in addressActivity.filter(
                  (el) => el.type == 'week',
                )"
                :key="`${i}-token`"
                class="p-2 d-flex align-items-center justify-content-between gap-2"
                style="text-decoration: none"
              >
                <div class="d-flex align-items-center gap-2">
                  <img :src="item.img" width="38" />
                  <div class="d-flex flex-column">
                    <div class="text-black dark:!text-white text-[12px]">
                      {{ item.label }}
                    </div>
                    <div class="text-black dark:!text-[#8e8e8e] text-[10px]">
                      {{ item.desc }}
                    </div>
                  </div>
                </div>
                <div>
                  <div class="d-flex flex-column align-items-end">
                    <div
                      class="text-black dark:!text-white text-[12px] whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {{ item.time }}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div>
            <div class="tab my-2" style="font-size: 12px">
              {{ $t('this_month') }}
            </div>
            <div class="d-flex flex-column gap-2">
              <a
                v-for="(item, i) in addressActivity.filter(
                  (el) => el.type == 'month',
                )"
                :key="`${i}-token`"
                target="_blank"
                :href="`${configService.getNetworkConfig(56).explorer}/tx/${
                  item.hash
                }`"
                class="p-2 d-flex align-items-center justify-content-between gap-2"
                style="text-decoration: none"
              >
                <div class="d-flex align-items-center gap-2">
                  <img :src="item.img" width="38" />
                  <div class="d-flex flex-column">
                    <div class="text-black dark:!text-white text-[12px]">
                      {{ item.label }}
                    </div>
                    <div class="text-black dark:!text-[#8e8e8e] text-[10px]">
                      {{ item.desc }}
                    </div>
                  </div>
                </div>
                <div>
                  <div class="d-flex flex-column align-items-end">
                    <div
                      class="text-black dark:!text-white text-[12px] whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {{ item.time }}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, computed, watch, onMounted } from 'vue'
import { defineEmits } from 'vue'
import defaultIcon from '@/assets/images/tokens/DEFAULT.png'
import { Network, networkId } from '@/composables/useNetwork'
import router from '@/router'
import { getTokenEntity } from '@/lib/helpers/util'
import { useWalletActivity } from '@/composables/wallet/useWalletActivity'
import { configService } from '@/services/config/config.service'
import { useWalletPools } from '@/composables/wallet/useWalletPools'
import { InitializeMetamask } from '@/lib/utils/metamask'
import { ethers } from 'ethers'
import { getSidebarData } from '@/composables/data/sidebarData'
import ThreeDots from '../loaders/ThreeDots.vue'
import LoaderPulse from '../loaders/LoaderPulse.vue'
import { Dropdown } from 'floating-vue'
import CounterAnimation from '@/UI/CounterAnimation.vue'
import CurrencySymbol from '@/components/TrackInfo/CurrencySymbol.vue'
import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'
import SettingsIcon from '@/components/Icons/SettingsIcon.vue'
import ExitIcon from '@/components/Icons/ExitIcon.vue'

const settingsStore = useSettings()

const { currentCurrency } = storeToRefs(settingsStore)
const currencyDecimals = computed(() =>
  currentCurrency.value == 'USD' ? 2 : 5,
)

const prefix = computed(() =>
  currentCurrency.value == 'USD' ? 'usd' : currentCurrency.value,
)
const postfix = computed(() =>
  currentCurrency.value == 'USD' ? '' : `_${currentCurrency.value}`,
)
const postfix_raw = computed(() =>
  currentCurrency.value == 'USD' ? 'Usd' : `${currentCurrency.value}`,
)

const props = defineProps(['isConnectedToWeb3', 'address'])
const emit = defineEmits(['toggleSettings', 'toggleToWallets', 'setAddress'])

const sidebarTab = ref('Tokens')
const sidebarData = ref({})

const tokensOptions = ref([])
const mockPools = ref([])
const addressActivity = ref(null)
const addressPools = ref(null)

const computedAddress = computed(() =>
  props.address
    ? props.address.substring(0, 6) +
      '....' +
      props.address.substring(props.address.length - 4)
    : '',
)
async function disconnectFromWallet() {
  localStorage.removeItem('address')
  await window.ethereum.request({
    method: 'eth_requestAccounts',
    params: [{ eth_accounts: {} }],
  })
  networkId.value = Network.NONE
  emit('setAddress', null)
  emit('toggleToWallets')
}

watch(props.address, async () => {
  await handlePortfolioData()
})

// const getBalance = async (address) => {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const balance = await provider.getBalance(address);

//     const balanceInEth = ethers.utils.formatEther(balance);
//     SidebarBalance.value = balanceInEth
//     console.log('balanceInEth',balanceInEth);
// }

onMounted(async () => {
  await handlePortfolioData()
})

async function handlePortfolioData() {
  if (props.address) {
    const [_activity, _pools, _sidebarData] = await Promise.all([
      useWalletActivity(props.address, networkId.value),
      useWalletPools(props.address, networkId.value),
      getSidebarData(props.address, 56),
    ])
    addressActivity.value = _activity
    addressPools.value = _pools
    sidebarData.value = _sidebarData
  }
}
</script>

<style lang="scss" scoped>
.sidebar_header {
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
  fill: #00c9ff;
}

.sidebar_exit_icon {
  cursor: pointer;
}

.sidebar_exit_icon:hover svg path {
  fill: #00c9ff;
}

.wallet_container_sidebar {
  // background: #10101099;
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

.address_text {
  font-size: 13px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0em;

  // color: #ffffff;
}

.balance_text {
  font-family: 'Roboto Mono', monospace;
  font-size: 34px;
  font-weight: 500;
  letter-spacing: 0em;
  // color: #ffffff;
}

.balance_change {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0em;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #898989;
}

.add_liq_btn {
  padding: 15px;
  display: flex;
  justify-content: center;
  background: #002c4499;
  border-radius: 20px;

  font-size: 19px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: center;
  color: #00e0ff;

  &:hover {
    background: #002c44cc;
    // filter: drop-shadow(0 0 0.6rem #2abcff91);
    cursor: pointer;
  }
}

.tab {
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0em;
  color: #898989;
  cursor: pointer;
}

.selected_tab {
  color: #00c9ff;
}

/* Scrollbar */
.activity_container::-webkit-scrollbar {
  height: 0px;
  width: 5px;
}

.activity_container::-webkit-scrollbar {
  background: transparent;
}

.activity_container::-webkit-scrollbar-thumb {
  background-color: #00e0ff;
  border-radius: 100px;
}
</style>
