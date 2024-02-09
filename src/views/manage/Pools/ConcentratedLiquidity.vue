<template>
 
  <MainCard>

    <TokenSelectModal
    :tokenSelectModal="tokenSelectModal"
    @tokenSelectModalOpen="tokenSelectModalOpen()"
    :possibleComposeTokens="notSelectedPossibleComposeTokens"
    @addToken="onAddToken"
  />
    <div class="d-flex gap-5">
      <div class="w-50">
        <div class="compose_text text-uppercase fw-bolder">
          CL Add Liquidity
        </div>
        <div class="compose_text text-secondary">
          Add Liquidity to Private Pools CL Pools
        </div>

        <div class="concentrated_card">
          <div class="compose_text mb-3">New CL Position</div>
          <div class="compose_text fw-light">Pair</div>
          <div class="d-flex gap-3">
            <!-- Tokens selector 1 separate comp-->
            <div @click="() => tokenSelectModalOpen()" class="selector_button">
              <img :src="not_found" />
              <svg
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.98255 6.46495L11.007 1.44044C11.187 1.26045 11.0596 0.952698 10.805 0.952698H0.756015C0.50147 0.952698 0.373993 1.26045 0.553983 1.44044L5.5785 6.46495C5.69007 6.57653 5.87098 6.57653 5.98255 6.46495Z"
                  fill="#EBEBEC"
                />
              </svg>
            </div>
            <!-- Tokens selector 2 separate comp -->
            <div @click="() => tokenSelectModalOpen()" class="selector_button">
              <img :src="not_found" />
              <svg
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.98255 6.46495L11.007 1.44044C11.187 1.26045 11.0596 0.952698 10.805 0.952698H0.756015C0.50147 0.952698 0.373993 1.26045 0.553983 1.44044L5.5785 6.46495C5.69007 6.57653 5.87098 6.57653 5.98255 6.46495Z"
                  fill="#EBEBEC"
                />
              </svg>
            </div>
          </div>
          <div v-if="concentratedLiquidityStep === 1">
            <div class="compose_text fw-light mt-3">Fee Tier</div>
            <div class="fee_tier_container">
              <div
                :class="
                  tier.selected
                    ? 'fee_tier_container_card fee_tier_container_card__selected'
                    : 'fee_tier_container_card'
                "
                v-for="(tier, i) in fee_tiers"
                :key="`tiers-${i}`"
                @click="selectTier()"
              >
                <div style="color: #c1c8ce">{{ tier.percent }}</div>
                <div style="color: #858c90">{{ tier.name }}</div>
              </div>
            </div>
          </div>
          <div class="compose_text fw-light mt-3 mb-2">Price Range</div>
          <div class="price_range_container">
            <div class="d-flex gap-3">
              <!-- Min per separate comp -->
              <div class="price_range_card">
                <div
                  class="d-flex justify-content-center w-100 position-relative"
                >
                  <div
                    class="d-flex flex-column justify-content-center align-items-center gap-3"
                  >
                    <div style="color: #c1c8ce">Min per</div>
                    <div
                      style="font-size: 20px; font-weight: 600; color: #c1c8ce"
                    >
                      0.0
                    </div>
                    <div
                      style="font-size: 12px; font-weight: 400; color: #858c90"
                    >
                      ≈ = $0
                    </div>
                  </div>
                  <div
                    style="
                      position: absolute;
                      right: 10px;
                      top: 0px;
                      color: #858c90;
                    "
                  >
                    0%
                  </div>
                </div>
              </div>
              <!-- Max per separate comp -->
              <div class="price_range_card">
                <div
                  class="d-flex justify-content-center w-100 position-relative"
                >
                  <div
                    class="d-flex flex-column justify-content-center align-items-center gap-3"
                  >
                    <div style="color: #c1c8ce">Max per</div>
                    <div
                      style="font-size: 20px; font-weight: 600; color: #c1c8ce"
                    >
                      0.0
                    </div>
                    <div
                      style="font-size: 12px; font-weight: 400; color: #858c90"
                    >
                      ≈ = $0
                    </div>
                  </div>
                  <div
                    style="
                      position: absolute;
                      right: 10px;
                      top: 0px;
                      color: #858c90;
                    "
                  >
                    0%
                  </div>
                </div>
              </div>
            </div>
            <div class="compose_text fw-light mt-3 mb-3">Range Type:</div>
            <div
              v-if="concentratedLiquidityStep === 2"
              class="fee_tier_container"
            >
              <div
                :class="
                  type.selected
                    ? 'fee_tier_container_card fee_tier_container_card__selected'
                    : 'fee_tier_container_card'
                "
                v-for="(type, i) in range_types"
                :key="`tiers-${i}`"
                @click="selectRange(type)"
              >
                <div style="color: #858c90">{{ type.name }}</div>
                <div style="color: #c1c8ce">{{ type.percent }}</div>

                <hr
                  style="
                    border: 1px solid #ffffff1c;
                    width: 100%;
                    margin: 10px -10px;
                  "
                />
                <div style="color: #858c90">{{ type.APR }}</div>
              </div>
            </div>
          </div>
          <div class="compose_text fw-light mt-3">Add Liquidity</div>
          <div class="price_range_container">
            <div class="d-flex flex-column gap-4 position-relative">
              <!-- Add liquidity to singe comp on refactor week -->
              <div
                class="d-flex"
                style="background: #020e12; border-radius: 8px"
              >
                <div
                  style="
                    width: 30%;
                    background: linear-gradient(
                      95.22deg,
                      #003e4f 0.03%,
                      #000000 133.56%
                    );
                    border-radius: 6px;
                    padding: 10px;
                    color: #c1c8ce;
                    font-size: 12px;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                  "
                >
                  <div>balance: 0.00</div>
                  <div class="max_button">Max</div>
                </div>
                <div>
                  <div class="d-flex flex-column gap-2 p-3">
                    <input
                      type="number"
                      style="
                        background: none;
                        border: none;
                        outline: none;
                        width: 180px;
                        color: #c1c8ce;
                        font-weight: 600;
                        font-size: 20px;
                      "
                      value="0.00"
                    />
                    <div style="color: #858c90; font-size: 12px">≈$0</div>
                  </div>
                </div>
              </div>
              <div
                class="d-flex"
                style="background: #020e12; border-radius: 8px"
              >
                <div
                  style="
                    width: 30%;
                    background: linear-gradient(
                      95.22deg,
                      #003e4f 0.03%,
                      #000000 133.56%
                    );
                    border-radius: 6px;
                    padding: 10px;
                    color: #c1c8ce;
                    font-size: 12px;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                  "
                >
                  <div>balance: 0.00</div>
                  <div class="max_button">Max</div>
                </div>
                <div>
                  <div class="d-flex flex-column gap-2 p-3">
                    <input
                      type="number"
                      style="
                        background: none;
                        border: none;
                        outline: none;
                        width: 180px;
                        color: #c1c8ce;
                        font-weight: 600;
                        font-size: 20px;
                      "
                      value="0.00"
                    />
                    <div style="color: #858c90; font-size: 12px">≈$0</div>
                  </div>
                </div>
              </div>
              <div class="add_liquidity_button">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_1807_18018)">
                    <g clip-path="url(#clip1_1807_18018)">
                      <g clip-path="url(#clip2_1807_18018)">
                        <path
                          d="M6.58 0.000427246C6.42536 0.000427246 6.3 0.125787 6.3 0.280427V6.30043H0.28C0.12536 6.30043 0 6.42579 0 6.58043V7.42043C0 7.57506 0.12536 7.70043 0.28 7.70043H6.3V13.7204C6.3 13.8751 6.42536 14.0004 6.58 14.0004H7.42C7.57463 14.0004 7.7 13.8751 7.7 13.7204V7.70043H13.72C13.8746 7.70043 14 7.57506 14 7.42043V6.58043C14 6.42579 13.8746 6.30043 13.72 6.30043H7.7V0.280427C7.7 0.125787 7.57463 0.000427246 7.42 0.000427246H6.58Z"
                          fill="#EBEBEC"
                        />
                      </g>
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_1807_18018">
                      <rect
                        width="14"
                        height="14"
                        fill="white"
                        transform="translate(0 0.000427246)"
                      />
                    </clipPath>
                    <clipPath id="clip1_1807_18018">
                      <rect
                        width="14"
                        height="14"
                        fill="white"
                        transform="translate(0 0.000427246)"
                      />
                    </clipPath>
                    <clipPath id="clip2_1807_18018">
                      <rect
                        width="14"
                        height="14"
                        fill="white"
                        transform="translate(0 0.000427246)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
          <div
            class="compose_text fw-light mt-5 d-flex justify-content-between"
          >
            <div>Slippage:</div>
            <div>2%</div>
          </div>

          <div
            class="my-3 d-flex justify-content-center position-relative"
            v-if="
              concentratedLiquidityStep === 3 || concentratedLiquidityStep === 4 || concentratedLiquidityStep === 5
            "
          >
            <div class="d-flex gap-2">
              <!-- First step marker -->
              <div class="position-relative">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="15"
                    cy="15"
                    r="14.5"
                    :stroke="
                      concentratedLiquidityStep === 3 ||
                      concentratedLiquidityStep === 4 ||
                      concentratedLiquidityStep === 5
                        ? '#00C9FF'
                        : 'white'
                    "
                  />
                </svg>
                <div
                  v-if="concentratedLiquidityStep === 3"
                  :class="
                    concentratedLiquidityStep === 3
                      ? 'step_number step_number_active'
                      : 'step_number'
                  "
                >
                  1
                </div>
                <div
                  v-else-if="concentratedLiquidityStep === 4"
                  class="step_number"
                >
                  <img :src="metamask" width="20" />
                </div>
                <div
                  v-else-if="concentratedLiquidityStep === 5"
                  class="step_number"
                >
                  <svg
                    width="15"
                    height="11"
                    viewBox="0 0 15 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.97 10.583L0 5.613L0.714 4.9L4.97 9.156L14.126 0L14.839 0.713L4.97 10.583Z"
                      fill="#00C9FF"
                    />
                  </svg>
                </div>
              </div>

              <!-- Second step marker -->
              <div class="position-relative">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="15"
                    cy="15"
                    r="14.5"
                    :stroke="
                      concentratedLiquidityStep === 5 ? '#00C9FF' : 'white'
                    "
                  />
                </svg>
                <div
                  :class="
                    concentratedLiquidityStep === 5
                      ? 'step_number step_number_active'
                      : 'step_number'
                  "
                >
                  2
                </div>
              </div>
            </div>
          </div>

          <button
            v-if="concentratedLiquidityStep === 1"
            :class="
              concentratedLiquidityStep === 1
                ? 'concentrated_button concentrated_button_disabled'
                : 'concentrated_button'
            "
          >
            No Tokens Selected
          </button>
          <button
            v-else-if="concentratedLiquidityStep === 2"
            :class="'concentrated_button'"
            @click="concentratedLiquidityStep = 3"
          >
            Add liquidity
          </button>
          <button
            v-else-if="concentratedLiquidityStep === 3"
            :class="'concentrated_button'"
            @click="concentratedLiquidityStep = 4"
          >
            Approve all tokens for adding liquidity
          </button>
          <button
            v-else-if="concentratedLiquidityStep === 4"
            :class="'concentrated_button'"
            @click="concentratedLiquidityStep = 5"
          >
            Confirming <span class="button_loader pl-2"></span>
          </button>
          <button
            v-else-if="concentratedLiquidityStep === 5"
            :class="'concentrated_button'"
          >
            Add liquidity
          </button>
        </div>
      </div>

      <div class="w-50">
        <ChartAndPoolInfo />
      </div>
    </div>
  </MainCard>
</template>

<script setup>
import MainCard from '@/UI/MainCard.vue'
import TokenSelectModal from '@/components/modals/TokenSelectModal.vue'
import ChartAndPoolInfo from '@/components/ComposePool/ChartAndPoolInfo.vue'
import not_found from '@/assets/icons/not_found.svg'
import { ref } from 'vue'
import metamask from '@/assets/icons/approveTokenSteps/metamask.svg'

const concentratedLiquidityStep = ref(1)
const tokenSelectModal = ref(false)
const fee_tiers = ref([
  {
    name: 'STABLE +',
    percent: '0.005%',
    selected: false,
  },
  {
    name: 'STABLE',
    percent: '0.01%',
    selected: true,
  },
  {
    name: 'BLUECHIP',
    percent: '0.025%',
    selected: false,
  },
  {
    name: 'BLUECHIP +',
    percent: '0.05%',
    selected: false,
  },
  {
    name: 'Moderately Volatile',
    percent: '0.3%',
    selected: false,
  },
  {
    name: 'Extremely Volatile',
    percent: '1%',
    selected: false,
  },
])
const range_types = ref([
  {
    name: 'Full Range',
    percent: '[-100%, ∞]',
    APR: 'APR: 0% ->0%',
    selected: false,
  },
  {
    name: 'Wide',
    percent: '[-12.5%, +12.5%]',
    APR: 'APR: 0% ->0%',
    selected: false,
  },
  {
    name: 'Narrow',
    percent: '[-7.5%, +7.5%]',
    APR: 'APR: 0% ->0%',
    selected: false,
  },
  {
    name: 'Aggressive',
    percent: '[-5%, +5%]',
    APR: 'APR: 0% ->0%',
    selected: false,
  },
])

function selectTier() {
  // fee_tiers.value.map((t) => (t.selected = false))
  concentratedLiquidityStep.value = 2
  // tier.selected = true
}
function selectRange(rng) {
  range_types.value.map((t) => (t.selected = false))
  rng.selected = true
}

const notSelectedPossibleComposeTokens = ref([
  {
    id: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    symbol: 'WBTC',
    address: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    totalBalanceNotional: '0.00001952',
    totalBalanceUSD: '1.068470890963960274330513342225105',
    name: '(PoS) Wrapped BTC',
    decimals: 8,
    price: 47222.03,
    value: 0,
    img: '/img/WBTC.eca8e68a.png',
    balance: 0.00127434,
    userBalance: '0.00127434',
  },
  {
    id: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    symbol: 'USDC',
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    totalBalanceNotional: '0.000001',
    totalBalanceUSD: '0.000001021935595196661545722609132119286',
    name: 'USD Coin (PoS)',
    decimals: 6,
    price: 1,
    value: 0,
    img: '/img/usdc.a30e9745.png',
    balance: 0,
    userBalance: '0.0',
  },
  {
    id: '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39',
    symbol: 'LINK',
    address: '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39',
    totalBalanceNotional: '14.385604333279320362',
    totalBalanceUSD: '0',
    name: 'ChainLink Token',
    decimals: 18,
    price: 18.34,
    value: 0,
    img: '/img/LINK.e7467690.png',
    balance: 2.829001173608001,
    userBalance: '2.82900117360800124',
  },
  {
    id: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    symbol: 'WETH',
    address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    totalBalanceNotional: '0.099894273406336505',
    totalBalanceUSD: '0',
    name: 'Wrapped Ether',
    decimals: 18,
    price: 2500.97,
    value: 0,
    img: '/img/ether.0689fe8b.png',
    balance: 0.015906589209726384,
    userBalance: '0.015906589209726383',
  },
  {
    id: '0xc3c7d422809852031b44ab29eec9f1eff2a58756',
    symbol: 'LDO',
    address: '0xc3c7d422809852031b44ab29eec9f1eff2a58756',
    totalBalanceNotional: '79.598370973775403445',
    totalBalanceUSD: '0',
    name: 'Lido DAO Token (PoS)',
    decimals: 18,
    price: 2.966,
    value: 0,
    img: '/img/LDO.0b0ef93c.png',
    balance: 19.460400929120247,
    userBalance: '19.46040092912024877',
  },
])

function tokenSelectModalOpen() {
  tokenSelectModal.value = !tokenSelectModal.value
}
</script>

<style lang="scss" scoped>
.compose_text {
  font-size: clamp(11px, 0.8vw, 15px);
  color: white;
}

.concentrated_card {
  margin-top: 50px;
  background: linear-gradient(152.97deg, #000000 0%, rgba(0, 0, 0, 0) 100%);
  border-radius: 15px;
  padding: 15px;
}

.selector_button {
  background: linear-gradient(95.22deg, #003e4f 0.03%, #000000 133.56%);
  border-radius: 6px;
  padding: 15px;
  width: 50%;
  display: flex;
  gap: 10px;
  align-items: center;
  &:hover {
    background: #003e4f;
    cursor: pointer;
  }
}
.price_range_card {
  background: linear-gradient(95.22deg, #003e4f 0.03%, #000000 133.56%);
  border-radius: 6px;
  padding: 15px;
  width: 50%;
  display: flex;
  gap: 10px;
  align-items: center;
}

.fee_tier_container {
  padding: 8px;
  border-radius: 9px;
  background: #020e128f;
  box-shadow: 0px 9px 12px 0px #00000029;
  width: 100%;
  display: flex;
  justify-content: space-between;
  &_card {
    width: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 15px 5px;
    background: #2f303230;
    font-family: Poppins;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    text-align: center;
    border-radius: 10px;
    cursor: pointer;
    &__selected {
      border: 1px solid #00c9ff;
    }
  }
}

.price_range_container {
  background: #020e128f;
  border-radius: 9px;
  box-shadow: 0px 9px 12px 0px #00000029;
  padding: 8px;
}

.max_button {
  border-radius: 6px;
  background: #07090c;
  padding: 4px 8px;
  cursor: pointer;
}

.add_liquidity_button {
  position: absolute;
  top: 70px;
  right: 20px;
  border-radius: 8px;
  background: linear-gradient(95.22deg, #02607a 0.03%, #000000 133.56%),
    linear-gradient(0deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16));
  height: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 15px;
  &:hover {
    background: #02607a;
    cursor: pointer;
  }
}

.concentrated_button {
  margin-top: 8px;
  padding: 8px;
  font-size: 12px;
  color: white;
  border: 0px;
  background: linear-gradient(89.27deg, #00c9ff 1.58%, #0094ff 100.04%);
  box-shadow: 0px 2px 4px -1px #0000000d;

  box-shadow: 0px 4px 6px -1px #0000000d;

  width: 100%;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  // transition-duration: 0.3s;
  text-shadow: 1px 1px 2px black;

  // &_disabled {
  //   background: gray;

  // }
  &:hover {
    color: #fff;
    background: #0094ff;
    box-shadow: 0px 12px 24px 0px rgba(#00c9ff, 0.2),
      0px 4px 8px 0px rgba(#00c9ff, 0.3);
  }
}

.step_number {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.4000000059604645px;
  text-align: center;
  color: white;

  &_active {
    color: #00c9ff;
  }
}

.button_loader {
  width: 17px;
  height: 17px;
  border: 2px solid #fff;
  border-bottom-color: #00c9ff;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  margin-left: 10px;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
