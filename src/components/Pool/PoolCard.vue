<template>
  <div class="card_view">
    <div :class="['card', { flipped: flippedCard }]">
      <div class="card__face card__face--front">
        <div class="flex justify-between flex-col h-full">
          <div>
            <div class="flex justify-between items-center mb-5">
              <img
                @click="flippedCard = true"
                v-if="!flippedCard"
                :src="cardInfoIcon"
                class="card_icon"
              />
              <div
                @click="
                  currentChainId === 56
                    ? pool['LiquidityType'] === 'CL'
                      ? $emit('goToCLPool', {
                          index,
                          onMountedActivity: 'info',
                        })
                      : $emit('goToPool', { index, onMountedActivity: 'info' })
                    : wrongChainCall()
                "
                class="card_type cursor-pointer"
              >
                <img :src="logoImage" width="15" />
                <div>
                  {{ pool['Pool Name'][0].length === 2 ? 'PAIR' : 'INDEX' }}
                </div>
              </div>
            </div>
            <div class="flex justify-center flex-col items-center mb-5">
              <div class="text-[16px] text-[#E6E6E6] font-semibold mb-2">
                {{ pool['Pool Name'][0].join('/') }}
              </div>
              <DataTableCellTokenNamePaired :value="pool['Pool Name']" />
              <div class="flex flex-wrap justify-center mt-1 gap-2">
                <div
                  v-for="(item, i) in pool['Pool Weight'][0]"
                  :key="`${i}-tokens`"
                >
                  <div
                    class="flex gap-1 items-center text-[#8D8D9E] font-bold text-xs"
                  >
                    <div class="">
                      {{ item.token }}
                    </div>
                    <div class="flex items-center">
                      <CounterAnimation
                        :currency="true"
                        :value="parseFloat(item?.weight).toFixed(0)"
                      />%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-center flex-col items-center mb-3">
              <div class="text-[#8D8D9E] text-[16px]">Total Value Lock</div>
              <div
                class="text-white font-bold text-[16px] font-['Roboto_Mono']"
              >
                <CounterAnimation
                  :currency="''"
                  :decimal-places="currencyDecimals"
                  :value="
                    Number(pool[`TVL${currency_underline}`]).toFixed(
                      currencyDecimals,
                    )
                  "
                />
              </div>
            </div>
            <div class="flex justify-center flex-col items-center mb-3">
              <div class="text-[#8D8D9E] text-[16px]">APR (24h)</div>
              <div
                class="text-white flex items-center font-bold text-[16px] font-['Roboto_Mono']"
              >
                <CounterAnimation
                  :currency="'%'"
                  :value="Number(pool['APR 24H']).toFixed(0)"
                />%
              </div>
            </div>
            <div class="flex justify-center flex-col items-center mb-3">
              <div class="text-[#8D8D9E] text-[16px]">Profits (24h)</div>
              <div
                class="text-white font-bold text-[16px] font-['Roboto_Mono']"
              >
                <CounterAnimation
                  :currency="''"
                  :decimal-places="currencyDecimals"
                  :value="
                    Number(pool[`profit24H${currency_underline}`]).toFixed(
                      currencyDecimals,
                    )
                  "
                />
              </div>
            </div>
          </div>

          <div>
            <div
              v-if="!userStakedPool"
              class="liquidity_button_container text-black dark:!text-white"
            >
              <div
                class="uppercase flex justify-center mt-5 mb-2 items-center text-xs gap-1 !text-[#f0f0f0]"
              >
                <svg
                  width="14"
                  height="13"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.915 1.38066C10.0825 -0.125586 7.9175 -0.125586 7.085 1.38066L0.526874 13.255C-0.278126 14.7125 0.776874 16.5 2.44187 16.5H15.5587C17.2237 16.5 18.2787 14.7125 17.4731 13.255L10.915 1.38066ZM9.78125 12.75C9.78125 12.9572 9.69894 13.156 9.55243 13.3025C9.40591 13.449 9.2072 13.5313 9 13.5313C8.7928 13.5313 8.59408 13.449 8.44757 13.3025C8.30106 13.156 8.21875 12.9572 8.21875 12.75C8.21875 12.5428 8.30106 12.3441 8.44757 12.1976C8.59408 12.0511 8.7928 11.9688 9 11.9688C9.2072 11.9688 9.40591 12.0511 9.55243 12.1976C9.69894 12.3441 9.78125 12.5428 9.78125 12.75ZM9 4.62504C9.16576 4.62504 9.32473 4.69089 9.44194 4.8081C9.55915 4.92531 9.625 5.08428 9.625 5.25004V10.25C9.625 10.4158 9.55915 10.5748 9.44194 10.692C9.32473 10.8092 9.16576 10.875 9 10.875C8.83424 10.875 8.67527 10.8092 8.55806 10.692C8.44085 10.5748 8.375 10.4158 8.375 10.25V5.25004C8.375 5.08428 8.44085 4.92531 8.55806 4.8081C8.67527 4.69089 8.83424 4.62504 9 4.62504Z"
                    fill="#F8F8F8"
                  />
                </svg>
                {{ $t('no_liquidity_deposited') }}
              </div>
              <div
                @click="
                  currentChainId === 56
                    ? pool['LiquidityType'] === 'CL'
                      ? $emit('goToCL', { index })
                      : $emit('goToPoolDeposit', {
                          index,
                          onMountedActivity: 'deposit',
                        })
                    : wrongChainCall()
                "
                class="liquidity_button !text-white uppercase"
                :class="
                  pool['LiquidityType'] === 'CL'
                    ? 'liquidity_button_LP'
                    : 'liquidity_button_WP'
                "
              >
                {{ $t('add_liquidity') }}
              </div>
            </div>
            <div
              v-else
              class="flex justify-between w-full items-start gap-1 md:flex-row flex-col liquidity_button_container text-black dark:!text-white"
            >
              <div
                class="details-el__col !flex items-center flex-col justify-center"
              >
                <div
                  v-if="pool['LiquidityType'] === 'CL'"
                  class="details-el__title d-flex gap-1 align-items-center orange w-fit px-2 py-1 rounded font-['Syne',_sans-serif] bg-[#DCEEF60D]"
                >
                  {{ $t('concentrated_liquidity_pool') }}
                </div>
                <div
                  v-else
                  class="details-el__title d-flex mb-2 gap-1 align-items-center blue w-fit px-2 py-1 xl:!text-[12px] text-[8px] rounded font-['Syne',_sans-serif] bg-[#DCEEF60D]"
                >
                  {{ $t('weighted_pool') }}
                  <!-- <div class="details-el__circle"></div> -->
                </div>

                <div class="flex items-center flex-col justify-between">
                  <div
                    v-if="pool['LiquidityType'] === 'WP'"
                    style="font-size: 9px; font-weight: 700"
                    class="flex items-center gap-1"
                  >
                    <div class="xl:!text-[12px] text-[8px] font-[700]">
                      <!-- {{ lp_name }} -->
                      Pool Name
                    </div>
                  </div>
                  <div v-else class="d-flex flex-column gap-2">
                    <div class="xl:!text-[12px] text-[8px] font-[700]">
                      <!-- {{ lp_name }} -->
                      Pool Name
                    </div>
                  </div>
                  <div
                    class="actions_button text-black dark:!text-white"
                    @click="
                      currentChainId === 56
                        ? $emit('goToPoolManage', {
                            index,
                            onMountedActivity: 'deposit',
                          })
                        : wrongChainCall()
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

              <div
                class="details-el__col !flex items-center flex-col justify-center"
              >
                <div
                  :class="pool['LiquidityType'] === 'CL' ? 'orange' : 'blue'"
                  class="details-el__title d-flex mb-2 gap-1 align-items-center w-fit px-2 xl:!text-[12px] text-[8px] py-1 rounded font-['Syne',_sans-serif] bg-[#DCEEF60D]"
                >
                  {{ $t('liquidity_added') }}
                </div>

                <div class="flex items-center flex-col justify-between">
                  <div class="d-flex flex-column gap-2">
                    <div
                      class="flex items-center xl:!text-[12px] text-[8px] font-[700] font-['Roboto_Mono',_monospace]"
                    >
                      <CounterAnimation
                        :currency="''"
                        :value="
                          userStakedPool[
                            `shareBalance${
                              currentCurrency == 'USD' ? 'Usd' : currentCurrency
                            }`
                          ]
                        "
                        :decimalPlaces="currencyDecimals"
                      />
                    </div>
                  </div>
                  <div
                    class="actions_button"
                    @click="
                      currentChainId === 56
                        ? pool['LiquidityType'] === 'CL'
                          ? $emit('goToCL', {
                              index,
                              onMountedActivity: 'withdraw',
                            })
                          : $emit('goToPoolWithdraw', {
                              index,
                              onMountedActivity: 'withdraw',
                            })
                        : wrongChainCall()
                    "
                  >
                    {{
                      pool['LiquidityType'] === 'CL'
                        ? t('add_new_position')
                        : t('withdraw')
                    }}
                  </div>
                </div>
              </div>

              <div
                class="details-el__col !flex items-center flex-col justify-center"
              >
                <div
                  class="details-el__title d-flex mb-2 gap-1 align-items-center blue w-fit px-2 py-1 xl:!text-[12px] text-[8px] rounded font-['Syne',_sans-serif] bg-[#DCEEF60D]"
                >
                  {{ $t('rewards') }}
                </div>

                <div class="flex items-center flex-col justify-between">
                  <div class="d-flex flex-column gap-2">
                    <div class="xl:!text-[12px] text-[8px] font-[700]">
                      ${{ total_rewards.toFixed(5) }}
                    </div>
                  </div>
                  {{
                    console.log(
                      'rewardsData[pool.address]',
                      rewardsData[pool.address],
                    )
                  }}
                  <div
                    v-if="rewardsData[pool.address] != null"
                    class="actions_button text-black dark:!text-[#00E0FF]"
                    @click="claimRewards(rewardsData[pool.address])"
                  >
                    {{ $t('Claim') }}
                  </div>
                </div>
              </div>
              <!-- <div class="details-el__col !flex items-center flex-col justify-center">
            <div
              class="details-el__title d-flex mb-2 gap-1 align-items-center blue xl:!text-[12px] text-[8px] w-fit px-2 py-1 rounded font-['Syne',_sans-serif] bg-[#DCEEF60D]"
            >
              {{ $t('Compounder') }}
              <div class="details-el__circle"></div>
            </div>

            <div
              class="flex items-center flex-col justify-between"
            >
              <div class="d-flex flex-column gap-2">
                <div class="xl:!text-[12px] text-[8px] font-[700]">$253.45</div>
              </div>
              <div
                class="actions_button text-black dark:!text-white"
                @click="
                  currentChainId === 56
                    ? $emit('goToPoolCompound', {
                        index,
                        onMountedActivity: 'compound',
                      })
                    : wrongChainCall()
                "
              >
                {{ $t('Compound') }}
              </div>
            </div>
          </div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="card__face card__face--back">
        <div class="flex justify-between flex-col h-full">
          <div>
            <div class="flex justify-between items-center mb-5">
              <img
                @click="flippedCard = false"
                :src="cardInfoBackIcon"
                class="card_icon"
              />
              <!-- <div class="card_type">
                <img :src="logoImage" width="15" />
                <div>
                  {{ pool['Pool Name'][0].length === 2 ? 'PAIR' : 'INDEX' }}
                </div>
              </div> -->
            </div>
            <div class="text-[#DCEEF6] font-medium text-lg my-2">
              Pool Composition
            </div>
            <div
              class="d-flex flex-column gap-1 text-xs"
              v-if="pool && pool.tokens"
            >
              <div
                v-for="token in pool.tokens"
                :key="token.symbol"
                class="d-flex align-items-center justify-content-between"
              >
                <div class="flex items-center gap-1 text-white">
                  {{ Number(token.balance).toFixed(2) }}
                  <span class="font-['Syne',_sans-serif]">
                    {{ token.symbol }}</span
                  >
                  <img
                    :src="getTokenEntity(token.symbol, 'short').icon"
                    width="10"
                  />
                </div>
                <div
                  class="text-black dark:!text-white flex items-center font-normal font-['Roboto_Mono',_monospace]"
                >
                  <CounterAnimation
                    :currency="''"
                    :value="token?.[`balance${currency}`]"
                    :decimal-places="currencyDecimals"
                  />
                </div>
              </div>
            </div>

            <div class="text-[#DCEEF6] font-medium text-lg my-2">Analytics</div>
            
           
            <div class="flex justify-between text-white text-[14px]">
              <div>APR 30d</div>
              <div>
                <CounterAnimation
                  :currency="'1'"
                  :value="Number(pool['APR 30D']).toFixed(0)"
                />
              </div>
            </div>
          
            <div class="flex justify-between text-white text-[14px]">
              <div>Profits 30d</div>
              <div>
                <CounterAnimation
                  :currency="''"
                  :decimal-places="currencyDecimals"
                  :value="
                    Number(pool[`profit30D${currency_underline}`]).toFixed(
                      currencyDecimals,
                    )
                  "
                />
              </div>
            </div>
         
            <div class="flex justify-between text-white text-[14px]">
              <div>Revenue 30d</div>
              <div>
                <CounterAnimation
                  :currency="''"
                  :decimal-places="currencyDecimals"
                  :value="
                    Number(pool[`revenue30D${currency_underline}`]).toFixed(
                      currencyDecimals,
                    )
                  "
                />
              </div>
            </div>
        
            <div class="flex justify-between text-white text-[14px]">
              <div>Volume 30d</div>
              <div>
                <CounterAnimation
                  :currency="''"
                  :decimal-places="currencyDecimals"
                  :value="
                    Number(pool[`Volume_30D${currency_underline}`]).toFixed(
                      currencyDecimals,
                    )
                  "
                />
              </div>
            </div>
            <div class="flex justify-between text-white text-[14px]">
              <div>Total Gas Fees</div>
              <div>
                <CounterAnimation
                  :currency="''"
                  :decimal-places="currencyDecimals"
                  :value="
                    Number(pool[`Fees${currency_underline}`]).toFixed(
                      currencyDecimals,
                    )
                  "
                />
              </div>
            </div>
            <div class="flex justify-between text-white text-[14px]">
              <div>Number of Trades</div>
              <div>
                <CounterAnimation
                  :currency="'1'"
                  :value="Number(pool.Trades).toFixed(0)"
                />
              </div>
            </div>

            <div class="text-[#DCEEF6] font-medium text-lg mt-4 mb-2">
              Addresses
            </div>
            <div class="flex justify-between text-white text-[14px]">
              <div>Factory Contract</div>
              <div class="flex items-center gap-2">
                {{
                  factory.substring(0, 6) +
                  '....' +
                  factory.substring(factory.length - 4)
                }}
                <a
                  :href="`https://bscscan.com/address/${factory}`"
                  target="_blank"
                >
                  <img :src="linkWhite"
                /></a>
              </div>
            </div>
            <div class="flex justify-between text-white text-[14px]">
              <div>Pool Contract</div>
              <div class="flex items-center gap-2">
                {{
                  pool?.address.substring(0, 6) +
                  '....' +
                  pool?.address.substring(pool?.address.length - 4)
                }}
                <a
                  :href="`https://bscscan.com/address/${pool?.address}`"
                  target="_blank"
                >
                  <img :src="linkWhite"
                /></a>
              </div>
            </div>
            <div class="flex justify-between text-white text-[14px]">
              <div>Vault</div>
              <div class="flex items-center gap-2">
                {{
                  vault.substring(0, 6) +
                  '....' +
                  vault.substring(vault.length - 4)
                }}
                <a
                  :href="`https://bscscan.com/address/${vault}`"
                  target="_blank"
                >
                  <img :src="linkWhite"
                /></a>
              </div>
            </div>

            <div class="text-[#DCEEF6] font-medium text-lg mt-4 mb-2">
              Pool creation
            </div>
            <div class="flex justify-between text-white text-[14px]">
              <div>Created</div>
              <div class="flex items-center gap-2">
                {{ pool.createdTimeDate }}
                {{ pool.createdTimeAgo }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { toRefs, defineProps, ref, computed } from 'vue'
import DataTableCellTokenNamePaired from '@/components/DataTable/Cell/TokenNamePaired.vue'
import { configService } from '@/services/config/config.service'
import { ReversedDisplayNetwork } from '@/composables/useNetwork'
import etherscan from '@/assets/icons/etherscan.svg'
import linkWhite from '@/assets/icons/linkWhite.svg'
import APRIcon from '@/assets/icons/sidebarIcons/rewards_icon.svg'
import CurrencySymbol from '@/components/TrackInfo/CurrencySymbol.vue'
import { iterationByTokensForMetamask } from '@/lib/utils/metamask'
import { useDark } from '@vueuse/core'
import binanceScanLight from '@/assets/icons/binanceScanLight.svg'
import { t } from 'i18next'
import { notify } from '@/composables/notify'
import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'
import CounterAnimation from '@/UI/CounterAnimation.vue'
import { useDevice } from '@/composables/adaptive/useDevice'
import { claimRewards } from '@/composables/portfolio/useRewards'
import cardInfoIcon from '@/assets/icons/cardInfo.svg'
import cardInfoBackIcon from '@/assets/icons/cardInfoBack.svg'
import logoImage from '@/assets/icons/sidebarIcons/walletPoolsImage.svg'
import { getTokenEntity } from '@/lib/helpers/util'
import { networkId } from '@/composables/useNetwork'
const { width } = useDevice()
const flippedCard = ref(false)
const settingsStore = useSettings()
const currentChainId = JSON.parse(
  localStorage.getItem('ethereumNetwork'),
)?.chainId

function wrongChainCall() {
  notify(
    'error',
    'Wrong chain',
    'Please connect to one of the available chains',
  )
  window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x38',
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        chainName: 'BNB Chain',
        nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18,
        },
        blockExplorerUrls: ['https://bscscan.com/'],
      },
    ],
  })
}

const { currentCurrency } = storeToRefs(settingsStore)

const currency_underline = computed(() =>
  currentCurrency.value == 'USD' ? '' : `_${currentCurrency.value}`,
)
const currency = computed(() =>
  currentCurrency.value == 'USD' ? 'Usd' : `${currentCurrency.value}`,
)
const currencyDecimals = computed(() =>
  currentCurrency.value == 'USD' ? 0 : 3,
)
const vault = computed(
  () => configService.getNetworkConfig(networkId.value).addresses.vault,
)
const factory = computed(
  () =>
    configService.getNetworkConfig(networkId.value).addresses
      .weightedPoolFactory,
)
const isDark = useDark()

const props = defineProps({
  pool: Object,
  index: Number,
  inactive: Boolean,
  isActions: Boolean,
  userPools: [],
  rewardsData: Object,
  filters: Object,
})

const { pool, index, inactive, isActions, userPools, filters, rewardsData } =
  toRefs(props)

const userStakedPool = computed(() =>
  userPools.value.find((item) => item.id == pool.value.id),
)

const total_rewards = computed(() =>
  rewardsData.value && rewardsData.value[pool.value.address]
    ? rewardsData.value[pool.value.address].formatted_rewards.reduce(
        (sum, value) => sum + value.rewardUsd,
        0,
      )
    : 0,
)
const lp_name = computed(() => pool.value['Pool Name'][0].join('-'))
const etherscan_link = computed(() => {
  return configService.getNetworkConfig(
    ReversedDisplayNetwork[pool.value.Blockchain],
  ).explorer
})
console.log(pool)

const visibleDetails = ref(false)
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.card_view {
  width: 24%;

  @media (max-width: 1400px) {
    width: 32%;
  }

  .card {
    width: 100%;
    height: 650px;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    position: relative;
    border-color: rgba(255, 255, 255, 0) !important;
    --cui-card-border-color: unset !important;
    --cui-card-bg: none !important;
    &.flipped {
      transform: rotateY(180deg);
    }

    .card__face {
      position: absolute;
      width: 100%;
      backface-visibility: hidden;
      background: #00000024;
      border: 1px solid rgba(0, 224, 255, 0.38);
      box-shadow: 0px 4px 8.9px 0px #000000b5;
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 20px;
      perspective: 1000px;
      height: 650px;
      -webkit-backface-visibility: hidden; /* Safari */
      -moz-backface-visibility: hidden; /* Firefox */
    }

    .card__face--front {
      transform: rotateY(0deg);
    }
    .card__face--back {
      transform: rotateY(180deg);
    }
  }
}

.card_icon {
  border: 0.5px solid #00e0ff;
  border-radius: 100%;
  box-shadow: 0px 0px 4.2px 0px #2abdff;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  cursor: pointer;
}

.card_type {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #00000024;
  border: 0.5px solid #00e0ff;
  box-shadow: 0px 0px 4.2px 0px #2abdff;
  border-radius: 36px;
  padding: 7px 14px;
  color: white;
  font-size: 10px;
}

.liquidity_button_text {
  font-size: 12px;
  font-weight: 400;
  line-height: 21px;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.green {
  color: #00dc3e;

  .details-el__circle {
    background: #00dc3e;
    box-shadow: 0px 0px 10px 0px rgba(249, 188, 45, 0.5);
  }
}

.orange {
  color: #fb800f;

  .details-el__circle {
    background: #fb800f;
    box-shadow: 0px 0px 10px 0px #2d59f979;
  }
}

.blue {
  color: #00e0ff;

  .details-el__circle {
    background: #00e0ff;
    box-shadow: 0px 0px 10px 0px #00e0ff;
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
  margin-top: 8px;
  font-size: 8px;
  font-weight: 600;
  line-height: 21px;
  box-shadow: 0px 4px 8.9px 0px #79797933;
  margin-left: 0px;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid white;
  text-transform: uppercase;

  &:hover {
    filter: drop-shadow(0 0 0.2rem #00e0ff);
    background: #2abcffa4;
    cursor: pointer;
  }
}

.liquidity_button {
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  line-height: 21px;
  font-family: 'Syne', sans-serif;
  color: #02031c !important;
  width: 100%;
  padding: 10px;
  text-align: center;
  border: 1px solid #02031c;

  @media (min-width: 1950px) {
    width: 40vw;
  }

  @media (max-width: 768px) {
    width: 100%;
  }

  &_LP {
    background: #00e0ff;

    &:hover {
      cursor: pointer;
      filter: drop-shadow(0 0 0.4rem #00e0ff);
    }
  }

  &_WP {
    background: #00e0ff;

    &:hover {
      cursor: pointer;
      filter: drop-shadow(0 0 0.4rem #00e0ff);
    }
  }
}

.liquidity_button_container {
  padding: 0px 0px !important;
  border-radius: 20px;

  @media all and (max-width: $md) {
    padding: 0px 0px !important;
  }
}
</style>
