<template>
  <MainCard>
    {{ console.log('notSelectedPossibleComposeTokens', notSelectedPossibleComposeTokens) }}
    <TokenSelectModal :tokenSelectModal="tokenSelectModal" @tokenSelectModalOpen="tokenSelectModalOpen(0)"
      :possibleComposeTokens="notSelectedPossibleComposeTokens" @updateToken="(token) =>
      (tokensData[tokenSelectIndex] = {
        ...token,
        weight: tokensData[tokenSelectIndex].weight,
      })
        " @addToken="onAddToken" />
    <div class="d-flex justify-content-around">
      <div class="d-flex flex-column gap-4 w-25">
        <ComposePoolSteps :activeStep="activeStep" />
        <TokenPrices :tokenPrices="removeDuplicates(tokensData, 'symbol')" :activeStep="activeStep" />
      </div>
      <div class="compose_choose">
        <div class="compose_network_text">{{ DisplayNetwork[networkId] }}</div>
        <div class="compose_text my-1" v-if="activeStep === 1">
          Choose tokens & weights
        </div>

        <div class="compose_text my-1" v-else-if="activeStep === 2">
          <svg style="cursor: pointer" width="16" height="16" viewBox="0 0 16 16" fill="none"
            xmlns="http://www.w3.org/2000/svg" @click="activeStep = 1">
            <path d="M10 4L6 8L10 12" stroke="white" stroke-width="1.33333" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>

          Preview new weighted pool
        </div>
        <div class="compose_text my-1" v-else-if="activeStep === 3">
          <svg style="cursor: pointer" width="16" height="16" viewBox="0 0 16 16" fill="none"
            xmlns="http://www.w3.org/2000/svg" @click="activeStep = 2">
            <path d="M10 4L6 8L10 12" stroke="white" stroke-width="1.33333" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>

          Add initial liquidity
        </div>

        <div class="compose_text my-1" v-else-if="activeStep === 4">
          <svg style="cursor: pointer" width="16" height="16" viewBox="0 0 16 16" fill="none"
            xmlns="http://www.w3.org/2000/svg" @click="activeStep = 1">
            <path d="M10 4L6 8L10 12" stroke="white" stroke-width="1.33333" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>

          Swap
        </div>

        <div v-if="activeStep === 1" class="compose_choose_inner_container">
          <div class="d-flex justify-content-between">
            <div class="compose_text">Token</div>
            <div class="compose_text">Weight</div>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-3" v-for="(token, index) in tokensData"
            :key="token.symbol">
            <div class="compose_token_btn" style="cursor: pointer" @click="() => tokenSelectModalOpen(index)">
              <img :src="getTokenEntity(token.symbol).icon" width="25" class="p-1" />
              {{ token.symbol }}
              <div style="margin-left: 20px">
                <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.61035 1L5.61035 5L9.61035 1" stroke="white" stroke-width="1.33333" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <input type="number" class="compose_text weight_input" style="font-size: 14px; text-align: right"
                v-model="token.weight" /><span style="color: white">%</span>
              <div class="delete_token" style="cursor: pointer"
                @click="tokensData = tokensData.filter((t) => t != token)">
                <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_d_1807_17197)">
                    <rect x="4.29932" y="2.98547" width="26" height="26" rx="13" fill="#0F303B"
                      shape-rendering="crispEdges" />
                    <g clip-path="url(#clip0_1807_17197)">
                      <path d="M11.2993 11.9855H12.6326H23.2993" stroke="#00C9FF" stroke-width="1.33333"
                        stroke-linecap="round" stroke-linejoin="round" />
                      <path
                        d="M21.9659 11.9855V21.3188C21.9659 21.6724 21.8254 22.0116 21.5754 22.2616C21.3253 22.5117 20.9862 22.6522 20.6326 22.6522H13.9659C13.6123 22.6522 13.2731 22.5117 13.0231 22.2616C12.773 22.0116 12.6326 21.6724 12.6326 21.3188V11.9855M14.6326 11.9855V10.6522C14.6326 10.2985 14.773 9.95939 15.0231 9.70934C15.2731 9.45929 15.6123 9.31882 15.9659 9.31882H18.6326C18.9862 9.31882 19.3253 9.45929 19.5754 9.70934C19.8254 9.95939 19.9659 10.2985 19.9659 10.6522V11.9855"
                        stroke="#00C9FF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M15.9661 15.3188V19.3188" stroke="#00C9FF" stroke-width="1.33333" stroke-linecap="round"
                        stroke-linejoin="round" />
                      <path d="M18.6326 15.3188V19.3188" stroke="#00C9FF" stroke-width="1.33333" stroke-linecap="round"
                        stroke-linejoin="round" />
                    </g>
                  </g>
                  <defs>
                    <filter id="filter0_d_1807_17197" x="0.299316" y="0.985474" width="34" height="34"
                      filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha" />
                      <feOffset dy="2" />
                      <feGaussianBlur stdDeviation="2" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1807_17197" />
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1807_17197" result="shape" />
                    </filter>
                    <clipPath id="clip0_1807_17197">
                      <rect width="16" height="16" fill="white" transform="translate(9.29932 7.98547)" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          <div class="mt-3">
            <button class="add_token_btn" @click="
              tokensData.push({
                ...notSelectedPossibleComposeTokens[0],
                weight: 0,
              })
              ">
              Add token
            </button>
          </div>
          <div class="d-flex justify-content-between mt-5 mb-1">
            <div class="compose_text">Total allocated</div>
            <div class="compose_text" v-if="tokensData && tokensData.length > 0 && tokensData[0].symbol">
              {{
                tokensData
                  .filter((td) => td.weight != '')
                  .reduce((sum, value) => sum + parseFloat(value.weight), 0)
              }}%
            </div>
          </div>
          <CProgress class="" :thin="true">
            <CProgressBar style="background-color: #00C9FF;" :value="tokensData.reduce(
              (sum, value) => sum + parseFloat(value.weight),
              0,
            )
              " />
          </CProgress>
        </div>

        <div v-if="activeStep === 4" class="compose_choose_inner_container mb-5">
          <div class="d-flex justify-content-between">
            <div class="compose_text">Preview Trade</div>
          </div>
          <div class="d-flex" v-for="swap in displaySwaps" :key="`${swap.fromToken.symbol}-${swap.toToken.symbol}`">
            <div class="d-flex">
              <div>
                <img :src="getTokenEntity(swap.fromToken.symbol, 'short').icon" width="40" class="p-1" />
              </div>
              <div style="margin-left: -10px">
                <img :src="getTokenEntity(swap.toToken.symbol, 'short').icon" width="40" class="p-1" />
              </div>
            </div>
            <div class="d-flex flex-column" style="font-size: clamp(10px, 0.8vw, 14px); color: white">
              <div class="d-flex align-items-center">
                <div>
                  {{
                    swap.amountIn >= 0.0001
                    ? parseFloat(swap.amountIn).toFixed(4)
                    : `>0.0001`
                  }}
                  {{ swap.fromToken.symbol }}
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="#00C9FF" />
                </svg>

                <div>
                  {{
                    swap.amountOut >= 0.0001
                    ? parseFloat(swap.amountOut).toFixed(4)
                    : `>0.0001`
                  }}
                  {{ swap.toToken.symbol }}
                </div>
              </div>
              <div>${{ MIN_USD_SWAP }}</div>
            </div>
          </div>
        </div>
        <div v-else-if="activeStep === 3" class="d-flex flex-column gap-2">
          <div class="modal_stake_token" v-for="(token, tokenIndex) in tokensData"
            :key="`deposit-token-${token.address}`">
            <div>
              <div class="d-flex justify-content-between align-items-center">
                <div class="modal_stake_token_inner_name">
                  <img :src="getTokenEntity(token.symbol, 'short').icon" width="20" />
                  {{ token.symbol }} {{ token.weight }}%
                </div>
                <input class="token-input" v-if="lineNumbers.length > 0" style="
                    color: rgb(168, 168, 168);
                    font-size: clamp(10px, 0.8vw, 14px);
                    font-weight: 500;
                    text-align: right;
                  " :value="lineNumbers[tokenIndex] > 0
                    ? lineNumbers[tokenIndex] / 1000
                    : lineNumbers[tokenIndex]
                    " @input="(e) => onTokenInput(e, tokenIndex)" type="number" />
              </div>
              <div>
                <div class="modal_balance_slider">
                  <div class="value-label" ref="inputRefLabel">
                    Balance:
                    <span class="fw-bold" v-if="lineNumbers.length > 0">{{
                      RemainingBalance(token, tokenIndex)
                    }}</span><span @click="() => OnMaxClick(tokenIndex)" class="fw-bold bg-transparent"
                      style="cursor: pointer">
                      Max</span>
                  </div>
                  <div style="rgba(51, 51, 51, 1)">
                    ${{
                      ((lineNumbers[tokenIndex] / 1000) * token.price).toFixed(
                        2,
                      )
                    }}
                  </div>
                </div>
                <div class="mt-2">
                  <Slider v-if="lineNumbers.length > 0" @change="(value) => OnSliderValueChange(tokenIndex, value)"
                    :tooltips="false" :min="0" :max="token.balance * 1000" :step="1" v-model="lineNumbers[tokenIndex]"
                    lazy="false" />
                </div>
              </div>
            </div>
          </div>
          <div class="compose_text d-flex align-items-center gap-2 mt-1">
            Auto optimize liquidity
            <div style="cursor: pointer">
              <CFormSwitch size="lg" v-model="autoOptimizeLiq" id="hideZeroOpportunities" />
            </div>
          </div>
          <div>
            <div class="modal_total_container mt-4">
              <table style="
                  color: white;
                  width: 100%;
                  border-collapse: separate;
                  border-spacing: 0;
                  overflow: hidden;
                ">
                <tr style="
                    border: 1px solid rgba(163, 164, 165, 0.2);
                    border-top-left-radius: 15px;
                  ">
                  <td class="w-25 fw-bold" style="
                      border-right: 1px solid rgba(163, 164, 165, 0.2);
                      border-bottom: 1px solid rgba(163, 164, 165, 0.2);
                      padding: 8px;
                    ">
                    Total
                  </td>
                  <td style="
                      padding: 8px;
                      border-bottom: 1px solid rgba(163, 164, 165, 0.2);
                    ">
                    <div v-if="lineNumbers.length > 0" class="d-flex justify-content-between align-items-center">
                      <div class="w-25 fw-bold">
                        ${{ totalFiat.toFixed(4) }}
                      </div>
                      <div style="
                          background: rgba(59, 97, 65, 0.5);
                          padding: 4px 7px;
                          border-radius: 20px;
                        " @click="OnAllMaxClick">
                        Max
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <div v-else-if="activeStep === 2">
          <div class="compose_third_step">
            <div class="compose_text">Tokens and initial seed liquidity</div>
            <hr class="compose_hr" />
            <div>
              <div>
                <div v-for="(token, index) in tokensData" :key="`tokens-key-${index}`"
                  class="d-flex align-items-center justify-content-between p-1 gap-2 compose_text">
                  <div class="d-flex align-items-center">
                    <img :src="getTokenEntity(token.symbol, 'short').icon" width="40" class="p-1" />
                    <div class="d-flex flex-column">
                      <div>{{ token.weight }}% {{ token.symbol }}</div>
                      <div>Initial weight: {{ token.weight }}</div>
                    </div>
                  </div>
                  <div class="d-flex flex-column align-items-end text-white">
                    <div>{{ token.symbol }}</div>
                    <!-- <div>${{ token.usdAmount }}</div> -->
                  </div>
                </div>
              </div>
              <hr class="compose_hr" />
              <!-- <div class="d-flex justify-content-between mt-2">
                <div class="compose_text">Total</div>
                <div class="compose_text">$2.88</div>
              </div> -->
            </div>

            <div style="
                border: 1px solid rgba(163, 164, 165, 0.2);
                border-radius: 20px;
                color: white;
                font-size: clamp(10px, 0.8vw, 14px);
              " class="my-4">
              <div class="fw-bold p-2" style="border-bottom: 1px solid rgba(163, 164, 165, 0.2)">
                Summary
              </div>
              <div class="d-flex flex-column p-2" style="
                  font-size: clamp(10px, 0.8vw, 14px);
                  color: rgba(221, 221, 221, 1);
                ">
                <div class="d-flex justify-content-between align-items-center">
                  <div>Pool name:</div>
                  <div class="d-flex gap-1">
                    {{
                      tokensData.map((t) => `${t.weight}${t.symbol}`).join('-')
                    }}
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <div>Pool symbol:</div>
                  <div class="d-flex gap-1">
                    {{
                      tokensData.map((t) => `${t.weight}${t.symbol}`).join('-')
                    }}
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <div>Pool type:</div>
                  <div class="d-flex gap-1">Weighted</div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <div>Swap fee:</div>
                  <div class="d-flex gap-1">1.00%</div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <div>Swap fee manager:</div>
                  <div class="d-flex gap-1">Darkpool</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="my-3 d-flex justify-content-center position-relative" v-if="activeStep === 4 || activeStep === 2">
          <div class="d-flex gap-2">
            <VTooltip :distance="0" :placement="'top'">
              <div class="position-relative">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="15" cy="15" r="14.5" :stroke="activeStep === 2 ? '#00C9FF' : 'white'" />
                </svg>
                <div v-if="activeStep != 2 || (!mmActive && activeStep == 2)" :class="activeStep === 2
                  ? 'step_number step_number_active'
                  : 'step_number'
                  ">
                  1
                </div>
                <div v-else-if="activeStep === 2 && mmActive" class="step_number">
                  <img :src="metamask" width="20" />
                </div>
              </div>
              <template #popper>
                <div style="
                    background: linear-gradient(
                      rgba(89, 89, 89, 0.75),
                      rgba(73, 73, 73, 0.15)
                    );
                    backdrop-filter: blur(10px);
                    padding: 10px;
                    border-radius: 4px;
                    width: 300px;
                  ">
                  <div style="
                      display: flex;
                      flex-direction: column;
                      font-size: clamp(10px, 0.8vw, 14px);
                    ">
                    You must approve tokens to add liquidity for this token on
                    Dark Pool. Approvals are required once per token , per
                    wallet.
                  </div>
                </div>
              </template>
            </VTooltip>
            <div class="position-relative">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="14.5" :stroke="activeStep === 3 ? '#00C9FF' : 'white'" />
              </svg>
              <div v-if="activeStep != 3 || (!mmActive && activeStep == 3)" :class="activeStep === 3
                ? 'step_number step_number_active'
                : 'step_number'
                ">
                2
              </div>
              <div v-else-if="activeStep === 3 && mmActive" class="step_number">
                <img :src="metamask" width="20" />
              </div>
            </div>
            <div class="position-relative">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="14.5" :stroke="activeStep === 4 ? '#00C9FF' : 'white'" />
              </svg>
              <div :class="activeStep === 4
                ? 'step_number step_number_active'
                : 'step_number'
                " v-if="activeStep != 4 || (!mmActive && activeStep == 4)">
                3
              </div>
              <div v-else-if="activeStep === 4 && mmActive" class="step_number">
                <img :src="metamask" width="20" />
              </div>
            </div>
          </div>
        </div>

        <button class="compose_pool_connect_wallet" v-if="activeStep === 1" @click="onStep1Click"
          :disabled="!isPoolReady">
          {{ account == '' ? 'Connect wallet' : 'Next step' }}
        </button>
        <div class="compose_pool_connect_wallet" v-else-if="activeStep === 2" @click="CreateNewPool">
          Preview
        </div>
        <div class="compose_pool_connect_wallet" v-else-if="activeStep === 3" @click="JoinNewPool">
          Approve tokens for adding liquidity
        </div>
        <div class="compose_pool_connect_wallet" v-if="activeStep === 4" @click="SwapNewPoolTokens">
          Swap Tokens
        </div>
      </div>

      <div class="compose_chart">
        <div class="compose_text">Pool summary</div>
        <hr class="compose_hr" />
        <div class="chart_container">
          <!-- <LoaderPulse v-if="data.series.length === 0" /> -->
          {{ console.log('dynamicDonut.series', dynamicDonut.series[0]) }}
          <div v-if="dynamicDonut.series[0] !== 0">
            <apexchart v-if="tokensData && tokensData.length > 0 && tokensData[0].symbol" :series="dynamicDonut.series"
              :options="dynamicDonut" />
          </div>
          <div v-else class="d-flex flex-column text-white align-items-center justify-content-center">
            <svg style="filter: drop-shadow(0 0 0.7rem #00C9FF);" fill="#00C9FF" version="1.1" id="Capa_1"
              xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="70px" height="70px"
              viewBox="0 0 869.959 869.958" xml:space="preserve">
              <g>
                <path d="M146.838,484.584c10.271,10.395,23.804,15.6,37.347,15.6c13.329,0,26.667-5.046,36.897-15.155
		c20.625-20.379,20.825-53.62,0.445-74.245l-41.688-42.191h423.78c88.963,0,161.34,72.376,161.34,161.339v4.32
		c0,43.096-16.782,83.61-47.255,114.084c-20.503,20.502-20.503,53.744,0,74.246c10.251,10.251,23.688,15.377,37.123,15.377
		c13.435,0,26.872-5.125,37.123-15.377c50.305-50.306,78.009-117.188,78.009-188.331v-4.32c0-71.142-27.704-138.026-78.009-188.331
		c-50.306-50.305-117.189-78.009-188.331-78.009h-424.99l42.25-41.747c20.625-20.379,20.825-53.62,0.445-74.245
		c-20.376-20.624-53.618-20.825-74.244-0.445L15.601,277.068c-9.905,9.787-15.517,23.107-15.6,37.03
		c-0.084,13.924,5.367,27.31,15.154,37.215L146.838,484.584z" />
              </g>
            </svg>
            Add some weight
          </div>
        </div>
        <div class="d-flex justify-content-center flex-column align-items-center">
          <div class="compose_text">
            In your wallet <img :src="info" class="info_icon" />
          </div>
          <div v-if="tokensData.length > 0 && tokensData[0].symbol" class="compose_text">
            ${{
              removeDuplicates(tokensData, 'symbol')
                .map((t) => t.balance * t.price)
                .reduce((sum, value) => sum + value, 0)
                .toFixed(2)
            }}
          </div>
        </div>
      </div>
    </div>
  </MainCard>
  <!-- <div class="" v-if="visibleNetworkModal && visibleNetworkModal != 'closed'">
    <Warning :NetworkUnsupported="NetworkUnsupported" :closable="true" @closeWarning="closeWarning"></Warning>
  </div> -->
</template>

<script setup>
import MainCard from '@/UI/MainCard.vue'
import { ref, computed, watch, onMounted } from 'vue'
import ComposePoolSteps from '@/components/ComposePool/ComposePoolSteps.vue'
import TokenPrices from '@/components/ComposePool/TokenPrices.vue'
import info from '@/assets/images/info.svg'
import Slider from '@vueform/slider'
import metamask from '@/assets/icons/approveTokenSteps/metamask.svg'
import TokenSelectModal from '@/components/modals/TokenSelectModal.vue'
import { getTokenEntity } from '@/lib/helpers/util'
import { GetPossibleComposeTokens } from '@/composables/poolActions/compose/usePossibleComposeTokens'
import { PoolCreatorService } from '@/services/pool-creator.service'
import { DisplayNetwork, networkId } from '@/composables/useNetwork'
import { InitializeMetamask } from '@/lib/utils/metamask'
import { configService } from '@/services/config/config.service'
import { ethers } from 'ethers'
import { useApproveTokens } from '@/composables/poolActions/deposit/useApproveTokens'
import useBalance from '@/composables/useBalance'
import erc20abi from '@/lib/abi/ERC20.json'
import { GetFilteredTokenPrices } from '@/composables/useTokenPrices'
import { SingleSwap } from '@/composables/admin/swap/useSingleSwap'
import {
  generatePairCombinations,
  stringToColor,
  removeDuplicates,
  formatNotificationDate,
} from '@/lib/utils'
import { GetTokenPriceUsd } from '@/composables/balances/cryptocompare'
import { useJoinPool } from '@/composables/poolActions/deposit/useJoinPool'
import { GetDisplayStringError } from '@/lib/utils/balancer/helpers/displayError'
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue'
import 'vue3-toastify/dist/index.css'
var emitter = require('tiny-emitter/instance')
//import { InitBalancer } from '@/composables/math/withdrawMath/balancer.sdk';

const possibleComposeTokens = ref([])
const autoOptimizeLiq = ref(true)
const mmActive = ref(false)
const visibleNetworkModal = ref(false)
const activeStep = ref(1)

function changeVisibleNetworkModal() {
  visibleNetworkModal.value = !visibleNetworkModal.value
}

const lineNumbers = ref([])
const formattedLineNumbers = computed(() =>
  lineNumbers.value.map((ln) => ln / 1000),
)
let lastDepositChanged = ref(0)

const isOptimizeChanging = ref(false)

const popupType = ref('error')
const popupText = ref('Error happened!')
const popupSubText = ref('')
const popupLink = ref('')
const notify = () => {
  toast(Toast, {
    closeOnClick: true,
    theme: 'dark',
    type: popupType.value,
    autoClose: 5000,
    closeButton: false,
    position: toast.POSITION.TOP_RIGHT,
    data: {
      header_text: popupText.value,
      toast_text: popupSubText.value,
      tx_link: popupLink.value,
    },
  })
}
function SetErrorTxPopup(subtext) {
  popupType.value = 'error'
  popupText.value = 'Error happened!'
  popupSubText.value = subtext
  popupLink.value = ``
}
function SetSuccessTxPopup(hash, subtext) {
  let conf = configService.getNetworkConfig(networkId.value)
  popupType.value = 'success'
  popupText.value = 'Tx confirmed!'
  popupSubText.value = subtext
  popupLink.value = `${conf.explorer}/tx/${hash}`
}

function OnLineNumberChange(index) {
  if (isOptimizeChanging.value) {
    return
  }
  lastDepositChanged.value = index
  if (autoOptimizeLiq.value) {
    OptimizeValue()
  }
  isOptimizeChanging.value = false
}

function OptimizeValue() {
  if (lastDepositChanged.value == -1) return
  let token = tokensData.value[lastDepositChanged.value]
  let usdAmount =
    (lineNumbers.value[lastDepositChanged.value] / 1000) * token.price
  for (let i = 0; i < lineNumbers.value.length; i++) {
    if (i != lastDepositChanged.value) {
      let newValue = usdAmount / tokensData.value[i].price
      // if (newValue > tokensData.value[i].balance)
      //   newValue = tokensData.value[i].balance
      lineNumbers.value[i] = newValue * 1000
    }
  }
}

function OnSliderValueChange(index, value) {
  console.log(value)
  let balance = tokensData.value[index].balance * 1000
  if (balance < value) {
    lineNumbers.value[index] = balance
  } else {
    lineNumbers.value[index] = value
  }
  console.log(lineNumbers.value[index] - balance)
  OnLineNumberChange(index)
}
function OnMaxClick(index) {
  OnSliderValueChange(index, tokensData.value[index].balance * 1000)
}

function OnAllMaxClick() {
  if (autoOptimizeLiq.value) {
    let sorted = [...tokensData.value].sort(
      (a, b) => a.balance * a.price - b.balance * b.price,
    )
    OnMaxClick(tokensData.value.findIndex((t) => t.symbol == sorted[0].symbol))
  } else {
    for (let i = 0; i < tokensData.value.length; i++) {
      OnMaxClick(i, tokensData.value[i])
    }
  }
}

const NetworkUnsupported = ref(false)
const networksSupported = ref(null)

const account = ref('')

onMounted(async () => {
  if (window.ethereum !== undefined && networkId.value > 0) {
    let provider = new ethers.providers.Web3Provider(window.ethereum)
    networksSupported.value = await provider.getNetwork()
  }

  if (
    window.ethereum === undefined ||
    window.ethereum?._state?.accounts?.length === 0 ||
    !localStorage.getItem('isConnectedToWeb3')
  ) {
    NetworkUnsupported.value = false
    changeVisibleNetworkModal()
  }
  console.log(networksSupported.value)
  if (
    window.ethereum !== undefined &&
    networkId.value > 0 &&
    window.ethereum?._state?.accounts?.length !== 0 &&
    networksSupported.value.chainId !== 42161 &&
    networksSupported.value.chainId !== 56 &&
    networksSupported.value.chainId !== 137
  ) {
    NetworkUnsupported.value = true
    changeVisibleNetworkModal()
    return
  }
  await InitTokens()
  account.value = await (await InitializeMetamask()).getSigner().getAddress()
})

const createdPoolId = ref('')

const poolCreationLink = ref('')

const tokensData = ref(
  possibleComposeTokens.value.length > 0
    ? [possibleComposeTokens.value[0]]
    : [],
)
const totalFiat = computed(() =>
  lineNumbers.value.reduce(
    (sum, current, index) =>
      sum + (current / 1000) * tokensData.value[index].price,
    0,
  ),
)
const notSelectedPossibleComposeTokens = computed(() =>
  possibleComposeTokens.value.length > 0
    ? possibleComposeTokens.value.filter(
      (t) => !tokensData.value.find((td) => td.symbol == t.symbol),
    )
    : [],
)
const summarizedWeight = computed(() =>
  tokensData.value.reduce((sum, value) => sum + parseFloat(value.weight), 0),
)
const isPoolReady = computed(
  () =>
    tokensData.value.length > 1 &&
    summarizedWeight.value <= 100 &&
    ((tokensData.value.length % 2 == 1 && summarizedWeight.value >= 99) ||
      summarizedWeight.value == 100),
)
console.log('sum - ', summarizedWeight)
console.log('pool - ', isPoolReady)
watch(networkId, async () => {
  console.log('HERE' - networkId.value)

  networksSupported.value = { chainId: networkId.value }
  if (networkId.value <= 0) networksSupported.value = false
  else networksSupported.value = true
  await InitTokens()
})

async function InitTokens() {
  possibleComposeTokens.value = await GetPossibleComposeTokens(true)
  tokensData.value = [{ weight: 0, ...possibleComposeTokens.value[0] }]
}

async function onAddToken(value) {
  let address = value.toLowerCase()
  let isAlreadyIn = tokensData.value.find((item) => item.id == address)
  if (isAlreadyIn) return
  if (ethers.utils.isAddress(address)) {
    let network_id = networkId.value
    let config = configService.getNetworkConfig(network_id)
    if (config) {
      let provider = new ethers.providers.JsonRpcProvider(config.rpc)
      let token_contract = new ethers.Contract(address, erc20abi, provider)
      let tokenInfo = await checkErc20(token_contract)
      if (tokenInfo) {
        let provider = await InitializeMetamask()
        let account = await provider.getSigner().getAddress()
        let balance = await useBalance(address, provider, account)
        // let tokenOnProtocolInfo = await GetSingleToken(network_id, address)
        possibleComposeTokens.value = [
          {
            balance,
            price: tokenInfo.price,
            decimals: tokenInfo.decimals,
            img: getTokenEntity(tokenInfo.symbol, 'short').icon,
            value: 0,
            symbol: tokenInfo.symbol,
            name: tokenInfo.name,
            id: address,
            address: address,
          },
          ...possibleComposeTokens.value,
        ]
      }
    }
  }
}

function RemainingBalance(token, index) {
  let value1 = parseFloat(token.balance * 1000)
  let value2 = parseFloat(lineNumbers.value[index])
  let diff = (value1 - value2) / 1000
  return diff < 0 && diff > -1 ? 0 : diff.toFixed(4)
}

async function checkErc20(contract) {
  try {
    let promises = [contract.symbol(), contract.name(), contract.decimals()]
    let results = await Promise.all(promises)
    let price = await GetTokenPriceUsd(results[0])
    return { symbol: results[0], name: results[1], decimals: results[2], price }
  } catch (e) {
    return null
  }
}

async function onStep1Click() {
  if (account.value == '') {
    account.value = await (await InitializeMetamask()).getSigner().getAddress()
  } else {
    activeStep.value = 2
  }
}

async function CreateNewPool() {
  let poolCreateService = new PoolCreatorService(networkId.value)
  mmActive.value = true
  let provider = await InitializeMetamask()
  account.value = await provider.getSigner().getAddress()
  let tx = await poolCreateService.createWeightedPool(
    provider,
    tokensData.value.map((t) => `${t.weight}${t.symbol}`).join('-'),
    tokensData.value.map((t) => `${t.weight}${t.symbol}`).join('-'),
    '1',
    tokensData.value,
  )
  if (tx && !tx.error) {
    let receipt = await provider.getTransactionReceipt(tx.hash)
    const { poolId: _poolId } =
      await poolCreateService.getPoolDataFromTransaction(provider, receipt)
    SetSuccessTxPopup(tx.hash, 'Pool successfully created')
    createdPoolId.value = _poolId
    poolCreationLink.value = `${configService.getNetworkConfig(networkId.value).explorer
      }/tx/${tx.hash}`
    lineNumbers.value = tokensData.value.map(() => 0)
    activeStep.value = 3
  } else {
    setTxError(tx)
  }
  notify()
  console.log('CREATE RESULT - ', tx)
  mmActive.value = false
}

async function JoinNewPool() {
  mmActive.value = true
  let tokenAddresses = tokensData.value.map((t) => t.address)
  let success = await useApproveTokens(
    tokenAddresses,
    formattedLineNumbers.value,
    account.value,
  )
  if (!success) {
    SetErrorTxPopup('Approve was cancelled')
    notify()
    return
  }

  let tx = await useJoinPool(
    { onchain: { totalSupply: '0' }, id: createdPoolId.value },
    tokensData.value,
    formattedLineNumbers.value,
    account.value,
    0,
  )
  if (tx.error) {
    setTxError(tx)
    notify()
    return
  }
  await tx.wait()
  SetSuccessTxPopup(tx.hash, 'Tokens successfully deposited')
  notify()
  activeStep.value = 4
  emitter.emit('addNotification', {
    type: 'Deposit',
    value: `${totalFiat.value.toFixed(4)} USD - ${formatNotificationDate(
      new Date().getTime(),
    )}`,
    status: 'Success',
    hash: tx.hash,
    network: DisplayNetwork[networkId.value],
  })
  mmActive.value = false
  finishedSwaps.value = []
}

const existingTokenPrices = ref([])

watch(activeStep, async () => {
  if (activeStep.value === 4) {
    let addresses = tokensData.value.map((t) => t.address)
    existingTokenPrices.value = await GetFilteredTokenPrices(
      addresses,
      addresses,
    )
  }
})

const MIN_USD_SWAP = 0.01
const swaps = computed(() => {
  let _swaps = []
  if (activeStep.value === 4) {
    let addresses = tokensData.value.map((t) => t.address)
    let combinations = generatePairCombinations(addresses).map((t) =>
      t.split('/'),
    )
    combinations = combinations.filter(
      ([token0, token1]) =>
        !existingTokenPrices.value.find(
          (t) =>
            (t.pricingAsset == token0 && t.asset == token1) ||
            (t.pricingAsset == token1 && t.asset == token0),
        ),
    )
    _swaps = combinations.map(([token0, token1]) => {
      let token0Info = tokensData.value.find((t) => t.address == token0)
      let token1Info = tokensData.value.find((t) => t.address == token1)
      return {
        fromToken: token0Info,
        toToken: token1Info,
        amountIn: (MIN_USD_SWAP / token0Info.price).toFixed(
          token0Info.decimals,
        ),
        amountOut: (MIN_USD_SWAP / token1Info.price).toFixed(
          token1Info.decimals,
        ),
      }
    })
  }
  return _swaps
})
const finishedSwaps = ref([])

const displaySwaps = computed(() =>
  swaps.value.filter((s) => !finishedSwaps.value.includes(s)),
)

async function SwapNewPoolTokens() {
  mmActive.value = true

  let provider = await InitializeMetamask()
  let signer = provider.getSigner()
  let config = configService.getNetworkConfig(networkId.value)
  let _swaps = [...swaps.value]
  for (let i = 0; i < _swaps.length; i++) {
    let swap = _swaps[i]
    // DELETE LATER
    //createdPoolId.value = "0x65157300dd3d59c45e53b69faffdd04b6eb0a3e900010000000000000000000c"

    let tx = await SingleSwap(
      signer,
      config.addresses.vault,
      createdPoolId.value,
      {
        address: swap.fromToken.address,
        decimals: swap.fromToken.decimals,
      },
      { address: swap.toToken.address, decimals: swap.toToken.decimals },
      swap.amountIn,
    )
    if (tx && !tx.error) {
      SetSuccessTxPopup(tx.hash, 'Tokens successfully swapped')
      console.log('SUCESS - ', tx)
      finishedSwaps.value.push(swap)
    } else if (tx.error) {
      setTxError(tx)
    }
  }
  notify()
  mmActive.value = false
}

function setTxError(e) {
  let errorCode = e.error.data.message
  SetErrorTxPopup(GetDisplayStringError(errorCode))
}

function onTokenInput(event, tokenIndex) {
  let result_value = event.target.value
  console.log(result_value)
  if (parseFloat(result_value) != 0) {
    result_value = parseFloat(event.target.value) * 1000
  }
  if (isNaN(parseFloat(result_value))) {
    result_value = 0
  }
  OnSliderValueChange(tokenIndex, result_value)
}

const tokenSelectModal = ref(false)
const tokenSelectIndex = ref(0)
function tokenSelectModalOpen(index) {
  tokenSelectIndex.value = index
  tokenSelectModal.value = !tokenSelectModal.value
}

const dynamicDonut = computed(() => {
  let arrayOfColors = tokensData.value.map((t) => stringToColor(t.symbol))
  let labels = tokensData.value.map((t) => t.symbol)
  let series = tokensData.value.map((t) => t.weight)
  return {
    chart: {
      type: 'donut',
      width: '80%',
      height: '80%',
    },
    series,
    colors: arrayOfColors,
    labels: labels,
    legend: {
      show: false,
      width: 125,
      fontSize: '12px',
      // fontFamily: 'Lato',
      fontWeight: 600,
      offsetX: 5,
      labels: {
        // colors: arrayOfColors,
        useSeriesColors: true,
      },
      markers: {
        fillColors: arrayOfColors,
      },
    },
    dataLabels: {
      enabled: false,
    },

    fill: {
      opacity: 1,
      colors: arrayOfColors,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '50%',
          background: 'transparent',
        },
      },
    },
    stroke: {
      show: true,
      width: 0.5,
      colors: ['#181C1F'],
    },
    tooltip: {
      enabled: true,
      // eslint-disable-next-line
      custom({ series, seriesIndex, dataPointIndex, w }) {
        console.log('!!!', w.globals.labels[seriesIndex])
        return (
          '<div style="background: linear-gradient(rgba(89, 89, 89, 1), rgba(73, 73, 73, 0.45)); color:white; padding: 10px;">' +
          '<div style="font-size:clamp(10px, 0.9vw, 16px)">' +
          '</div>' +
          '<div style="display:flex; flex-direction:column; font-size: clamp(10px, 0.8vw, 14px)">' +
          '<div style="display:flex; align-items: center">' +
          w.globals.labels[seriesIndex] +
          ': ' +
          series[seriesIndex] +
          ' ' +
          (series[seriesIndex] === 1 ? '%' : '%') +
          '</div>' +
          '</div>' +
          '</div>'
        )
      },
    },
  }
})
</script>

<style lang="scss" scoped>
.compose_choose {
  height: fit-content;
  padding: 10px;
  width: 35%;
  border-radius: 15.289px;
  background: linear-gradient(153deg, #000 0%, rgba(0, 0, 0, 0.00) 100%);
  backdrop-filter: blur(20.067087173461914px);
}

.modal_total_container {
  border: 1px solid rgba(163, 164, 165, 0.2);
  border-radius: 15px;
  font-size: clamp(10px, 0.8vw, 14px);
}

.compose_hr {
  border-bottom: 1px solid #00C9FF57;
  margin: 0px;
  margin-top: 5px;
  margin-right: -10px;
  margin-left: -10px;
}

.token-input {
  background-color: transparent;
  border: none;
  outline: none;
}

.compose_third_step {
  padding: 10px;
  width: 100%;
  height: fit-content;
  background: linear-gradient(90.52deg,
      rgba(53, 185, 192, 0.05) 0.36%,
      rgba(53, 185, 192, 0.02) 0.36%);
  border: 1px solid #00C9FF2f;
  border-radius: 10px;
}

.compose_chart {
  padding: 10px;
  width: 25%;
  height: fit-content;
  border-radius: 15.289px;
  background: linear-gradient(153deg, #000 0%, rgba(0, 0, 0, 0.00) 100%);
  backdrop-filter: blur(20.067087173461914px);
}

.chart_container {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0px;
  // border-radius: 20px;
  padding: 5px 0px;
  height: 260px;

  :deep(.apexcharts-inner) {
    filter: drop-shadow(0 0 0.3rem #00C9FF);
  }
}

.add_token_btn {
  padding: 4px 16px;
  background: none;
  border: 1px solid #bfdbfeab;
  border-radius: 8px;
  font-size: clamp(10px, 0.8vw, 14px);
  font-weight: 400;
  letter-spacing: -0.4000000059604645px;
  text-align: center;
  color: #00C9FF;
}

.add_token_btn:hover {
  filter: drop-shadow(0 0 0.3rem #00C9FF);
  cursor: pointer;
  background: linear-gradient(89deg, #00C9FF 1.58%, #0094FF 100.04%);
  color: white;
}

.compose_choose_inner_container {
  padding: 10px;
  width: 100%;
  border-radius: 9px;
  background: rgba(18, 24, 27, 0.56);
  box-shadow: 0px 9px 12px 0px rgba(0, 0, 0, 0.16);
  backdrop-filter: blur(21px);
}

.compose_pool_connect_wallet {
  margin-top: 8px;
  padding: 8px;
  font-size: 12px;
  color: white;
  border: 0px;
  border-radius: 8px;
  background: linear-gradient(89deg, #00C9FF 1.58%, #0094FF 100.04%);
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.05), 0px 4px 6px -1px rgba(0, 0, 0, 0.05);
  width: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  // transition-duration: 0.3s;

  &:hover {
    color: #fff;
    opacity: 0.9;
  }
}

.compose_network_text {
  font-size: 9px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  color: #b6b6b6;
}

.compose_text {
  font-size: clamp(11px, 0.8vw, 15px);
  color: white;
}

.compose_token_btn {
  display: flex;
  align-items: center;
  border-radius: 8px;
  font-size: clamp(11px, 0.8vw, 15px);
  color: white;
  padding: 10px;
  height: 30px;
  border-radius: 6px;
  background: linear-gradient(95deg, #003E4F 0.03%, #000 133.56%);
}

.compose_token_btn:hover {
  cursor: pointer;
  opacity: 0.9;
}

.modal_stake_token {
  border: 1px solid rgba(163, 164, 165, 0.2);
  border-radius: 20px;
  padding: 15px;
}

.modal_balance_slider {
  margin-top: 20px;
  color: white;
  font-size: clamp(10px, 0.8vw, 14px);
  display: flex;
  justify-content: space-between;
}

.modal_stake_token_inner_name {
  background-color: rgba(59, 97, 65, 0.14);
  border-radius: 17px;
  color: white;
  font-size: clamp(10px, 0.8vw, 14px);
  padding: 4px 12px;
}

.circle_active {
  stroke: #00C9FF;
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
    color: #00C9FF;
  }
}

.weight_input {
  background: none;
  outline: none;
  border: none;
}

.delete_token:hover svg path {
  stroke: rgb(253, 24, 24);
}
</style>
