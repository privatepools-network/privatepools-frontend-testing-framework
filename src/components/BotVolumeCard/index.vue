<template>
  <CCard
    class="card-row px-xxl-4 py-xxl-4 mb-xxl-4 px-2 py-2 mb-3 bot-volume__card"
  >
    <div class="d-flex justify-content-start align-items-center gap-3">
      <VTooltip :distance="0" :placement="'left'">
        <!-- <div>
          <div v-if="previousVolumeBsc + previousVolumeArb + previousVolumeMatic <
            volumeBsc + volumeArb + volumeMatic
            " class="bg-plus px-xxl-2 py-xxl-2 px-1 py-1">
            <CIcon icon="cil-arrow-top" class="bot_profit_icons" style="transform: rotate(45deg)" />
          </div>
          <div v-else-if="previousVolumeBsc + previousVolumeArb + previousVolumeMatic ===
            volumeBsc + volumeArb + volumeMatic
            " class="bg-equal px-xxl-2 py-xxl-2 px-1 py-1">
            <CIcon :icon="cilMinus" class="bot_profit_icons" />
          </div>
          <div v-else class="bg-minus px-xxl-2 py-xxl-2 px-1 py-1">
            <CIcon icon="cil-arrow-top" class="bot_profit_icons" style="transform: rotate(135deg)" />
          </div>
        </div> -->
        <template #popper>
          <div
            style="
              background: linear-gradient(
                rgba(89, 89, 89, 1),
                rgba(73, 73, 73, 0.45)
              );
              backdrop-filter: blur(10px);
              border-radius: 5px;
              padding: 10px;
            "
          >
            <div style="font-size: clamp(10px, 0.9vw, 16px)">
              {{ tooltipTitle }}
            </div>
            <div
              style="
                display: flex;
                flex-direction: column;
                font-size: clamp(10px, 0.8vw, 14px);
              "
            >
              <span v-if="isRightChain('Binance')">
                <span>
                  <img :src="binance" width="16" class="mr-2" /> Binance:
                </span>
                <div v-if="symbol === '₿'">
                  <img :src="btcSymbol" width="9" /> {{ volumeBsc }}
                </div>
                <div v-else-if="symbol === 'Ξ'">
                  <img :src="ethSymbol" width="9" /> {{ volumeBsc }}
                </div>
                <div v-else>{{ symbol }} {{ volumeBsc }}</div>

                <span
                  class="ml-3 fw-bold"
                  :class="
                    previousVolumeBsc < VolumeBsc
                      ? 'text-success'
                      : 'text-danger'
                  "
                >
                  ({{
                    previousVolumeBsc === 0
                      ? 0
                      : (
                          ((volumeBsc - previousVolumeBsc) /
                            previousVolumeBsc) *
                          100
                        ).toFixed(2)
                  }}%)
                </span>
              </span>

              <span v-if="isRightChain('Polygon')">
                <span
                  ><img :src="polygon" width="16" class="mr-2" />
                  Polygon: </span
                > <div v-if="symbol === '₿'">
                  <img :src="btcSymbol" width="9" /> {{ volumeMatic }}
                </div>
                <div v-else-if="symbol === 'Ξ'">
                  <img :src="ethSymbol" width="9" /> {{ volumeMatic }}
                </div>
                <div v-else>{{ symbol }} {{ volumeMatic }}</div>

                <span
                  class="ml-3 fw-bold"
                  :class="
                    previousVolumeMatic < volumeMatic
                      ? 'text-success'
                      : 'text-danger'
                  "
                >
                  ({{
                    previousVolumeMatic === 0
                      ? 0
                      : (
                          ((volumeMatic - previousVolumeMatic) /
                            previousVolumeMatic) *
                          100
                        ).toFixed(2)
                  }}%)
                </span>
              </span>

              <span v-if="isRightChain('Arbitrum')">
                <span
                  ><img :src="arb" width="16" class="mr-2" /> Arbitrum: </span
                ><div v-if="symbol === '₿'">
                  <img :src="btcSymbol" width="9" /> {{ volumeArb }}
                </div>
                <div v-else-if="symbol === 'Ξ'">
                  <img :src="ethSymbol" width="9" /> {{ volumeArb }}
                </div>
                <div v-else>{{ symbol }} {{ volumeArb }}</div>
                <span
                  class="ml-3 fw-bold"
                  :class="
                    previousVolumeArb < volumeArb
                      ? 'text-success'
                      : 'text-danger'
                  "
                >
                  ({{
                    previousVolumeArb === 0
                      ? 0
                      : (
                          ((volumeArb - previousVolumeArb) /
                            previousVolumeArb) *
                          100
                        ).toFixed(2)
                  }}%)
                </span>
              </span>
            </div>
          </div>
        </template>
      </VTooltip>

      <div class="d-flex justify-content-between align-items-center w-100">
        <div
          class="d-flex flex-column justify-content-center align-items-baseline w-100"
        >
          <div class="text-white" style="font-size: clamp(9px, 0.8vw, 14px)">
            {{ title }}
          </div>
          <div
            class="bot_text text-white fw-semibold d-flex align-items-center w-100 mt-1"
          >
            <div class="totals_loader" v-if="!isLoaded">
              <ThreeDots />
            </div>
            <div v-else class="me-3 fw-light bot_profit_value">
              <!-- {{ console.log(`${title} ${volumeBsc + volumeArb + volumeMatic}`) }} -->
              <div v-if="symbol === '₿'" class="d-flex align-items-center gap-1">
                  <img :src="btcSymbol" width="9" /> {{ numberToAposthrophe(
                  volumeBsc + volumeArb + volumeMatic,
                  currencyDecimals,
                ) }}
                </div>
                <div v-else-if="symbol === 'Ξ'" class="d-flex align-items-center gap-1">
                  <img :src="ethSymbol" width="9" /> {{ numberToAposthrophe(
                  volumeBsc + volumeArb + volumeMatic,
                  currencyDecimals,
                ) }}
                </div>
                <div v-else class="d-flex align-items-center gap-1">{{ symbol }} {{ numberToAposthrophe(
                  volumeBsc + volumeArb + volumeMatic,
                  currencyDecimals,
                ) }}</div>
            </div>

            <!-- <div v-if="!isLoaded" style="
              background: rgba(1, 180, 126, 0.25);
              padding: 8px 5px;
              margin-left: 8px;
              color: rgba(232, 233, 6, 1);
              font-size: clamp(9px, 0.8vw, 14px);
              border-radius: 4px;
              display: flex;
              justify-content: center;
            ">
            <div class="px-4">
              <ThreeDots />
            </div>
          </div> -->
            <div>
              <!-- <div v-if="previousVolumeBsc + previousVolumeArb + previousVolumeMatic ===
              volumeBsc + volumeArb + volumeMatic
              " style="
                background: rgba(255, 218, 6, 0.15);

                color: rgba(232, 233, 6, 1);
              " class="bot_profit_percents">
              0%
            </div> -->
              <!-- <div v-if="previousVolumeBsc + previousVolumeArb + previousVolumeMatic <
              volumeBsc + volumeArb + volumeMatic
              " style="
                background: rgba(1, 180, 126, 0.25);
                color: rgba(1, 180, 126, 1);
              " class="bot_profit_percents">
              {{
                previousVolumeBsc + previousVolumeArb + previousVolumeMatic ===
                0
                ? 0
                : (
                  ((volumeBsc +
                    volumeArb +
                    volumeMatic -
                    (previousVolumeBsc +
                      previousVolumeArb +
                      previousVolumeMatic)) /
                    (previousVolumeBsc +
                      previousVolumeArb +
                      previousVolumeMatic)) *
                  100
                ).toFixed(2)
              }}%
            </div> -->

              <!-- <div v-else-if="previousVolumeBsc + previousVolumeArb + previousVolumeMatic >
                volumeBsc + volumeArb + volumeMatic
                " style="
                color: rgba(248, 71, 71, 1);
                background: rgba(248, 71, 71, 0.25);
              " class="bot_profit_percents">
              {{
                (
                  ((volumeBsc +
                    volumeArb +
                    volumeMatic -
                    (previousVolumeBsc +
                      previousVolumeArb +
                      previousVolumeMatic)) /
                    (previousVolumeBsc +
                      previousVolumeArb +
                      previousVolumeMatic)) *
                  100
                ).toFixed(2)
              }}%
            </div> -->
            </div>
          </div>
        </div>
        <div
          @click="$emit('changeVisibleSystemProfitModal')"
          style="
            font-size: clamp(8px, 0.7vw, 12px);
            font-weight: 400;
            cursor: pointer;
            line-height: 20px;
            letter-spacing: 0em;
            color: #7ef6b2;
            width: 120px;
          "
        >
          More details
          <svg
            width="9"
            height="4"
            viewBox="0 0 9 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_6007_665)">
              <path
                d="M6.11499 1.5H0.109985V2.5H6.11499V4L8.10999 2L6.11499 0V1.5Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_6007_665">
                <rect
                  width="9"
                  height="4"
                  fill="white"
                  transform="translate(0.109985)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  </CCard>
</template>

<script setup>
import { defineProps, computed, defineEmits } from 'vue'
// import { cilMinus } from '@coreui/icons'
import ThreeDots from '@/components/loaders/ThreeDots.vue'
import arb from '@/assets/images/networks/arbitrum.png'
import polygon from '@/assets/images/networks/polygon.png'
import binance from '@/assets/icons/networks/binance.svg'
import numberToAposthrophe from '@/lib/formatter/numberToAposthrophe'
import btcSymbol from '@/assets/images/tokens/btcSymbol.png'
import ethSymbol from '@/assets/images/tokens/ethSymbol.png'

const props = defineProps([
  'previousVolumeBsc',
  'previousVolumeArb',
  'previousVolumeMatic',
  'volumeBsc',
  'volumeArb',
  'volumeMatic',
  'title',
  'tooltipTitle',
  'chainSelected',
  'symbol',
  'changeVisibleSystemProfitModal',
  'currencyDecimals',
])

defineEmits(['changeVisibleSystemProfitModal'])

//const { previousVolumeBsc, previousVolumeArb, previousVolumeMatic, volumeBsc, volumeArb, volumeMatic, chainSelected } = toRefs(props)
console.log('here')
function isRightChain(chain) {
  return (
    props.chainSelected.name == chain ||
    props.chainSelected.name.toLowerCase() == 'all chains'
  )
}

const isLoaded = computed(
  () =>
    (!process.env.VUE_APP_KEY_BINANCE || props.volumeBsc != undefined) &&
    (!process.env.VUE_APP_KEY_ARBITRUM || props.volumeArb != undefined) &&
    (!process.env.VUE_APP_KEY_POLYGON || props.volumeMatic != undefined),
)
const previousVolumeBsc = computed(() =>
  isRightChain('Binance') ? props.previousVolumeBsc : 0,
)
const previousVolumeArb = computed(() =>
  isRightChain('Arbitrum') ? props.previousVolumeArb : 0,
)
const previousVolumeMatic = computed(() =>
  isRightChain('Polygon') ? props.previousVolumeMatic : 0,
)

const volumeBsc = computed(() =>
  isRightChain('Binance') ? props.volumeBsc : 0,
)
const volumeArb = computed(() =>
  isRightChain('Arbitrum') ? props.volumeArb : 0,
)
const volumeMatic = computed(() =>
  isRightChain('Polygon') ? props.volumeMatic : 0,
)
console.log(props)
</script>
<style scoped lang="scss">
@import '@/styles/_variables.scss';

.bot_profit_icons {
  width: 2vw !important;
  height: 2vw !important;
  font-size: clamp(10px, 0.8vw, 14px) !important;
}

.bot_profit_percents {
  padding: 5px;
  font-size: clamp(7px, 0.6vw, 10px);
  border-radius: 4px;
}

.totals_loader {
  margin-left: 20px;
  margin-right: 30px;
}

.bot_profit_value {
  font-size: clamp(10px, 0.9vw, 20px);
}

@media (max-width: $md) {
  .bot_profit_value {
    font-size: 10px;
  }

  .bot_profit_icons {
    width: 25px !important;
    height: 25px !important;
    font-size: 12px !important;
  }

  .bot_profit_percents {
    background: rgba(248, 71, 71, 0.25);
    padding: 3px;
    font-size: 9px;
    border-radius: 4px;
  }
}
</style>
