<template>
  <MainCard>
    <Modal v-if="tokenSelectModal" @close="tokenSelectModalClose" size="lg">
      <template #body>
        <TokenSelectModal
          @tokenSelectModalClose="tokenSelectModalClose"
          :pairIndex="pairIndex"
          @updateToken="updateToken"
          :possibleComposeTokens="notSelectedPossibleComposeTokens"
          @addToken="onAddToken"
        />
      </template>
    </Modal>

    <div class="center_container">
      <div class="d-flex justify-content-end w-100 mb-4">
        <div class="back_button" @click="router.push('/pools')">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18"
              stroke="#FFFFFF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="#FFFFFF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <div class="d-flex gap-5">
        <div class="w-50">
          <div
            style="
              font-size: 20px;
              color: #ebebef;
              font-weight: 700;
              text-transform: uppercase;
            "
            class="compose_text text-uppercase fw-bolder"
          >
            CREATE A CL pool
          </div>
          <div class="compose_text text-secondary" style="font-size: 12px">
            Create a Private Pools CL Pool
          </div>

          <div class="concentrated_card">
            <div class="compose_text mb-3">New CL Position</div>
            <div class="compose_text fw-light">Pair</div>
            <div class="d-flex gap-3">
              <!-- Tokens selector 1 separate comp-->
              <div
                @click="() => tokenSelectModalOpen(1)"
                class="selector_button"
              >
                <img
                  :src="
                    getTokenEntity(pairToken1.symbol, 'short').icon ||
                    pairToken1.logoURI
                  "
                  width="24"
                />
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
                <h4 style="font-size: 21px; margin-bottom: 0; color: white">
                  {{ pairToken1.symbol }}
                </h4>
                <!-- Tokens selector 2 separate comp -->
              </div>
              <div
                @click="() => tokenSelectModalOpen(2)"
                class="selector_button"
              >
                <img
                  :src="
                    getTokenEntity(pairToken2.symbol, 'short').icon ||
                    pairToken2.logoURI
                  "
                  width="24"
                />
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
                <h4 style="font-size: 21px; margin-bottom: 0; color: white">
                  {{ pairToken2.symbol }}
                </h4>
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
                  @click="selectTier(i)"
                >
                  <div style="color: #c1c8ce">{{ tier.percent }}</div>
                  <div style="color: #858c90">{{ tier.name }}</div>
                </div>
              </div>
            </div>
            <div class="compose_text fw-light mt-3 mb-2">Price Range</div>
            <div class="price_range_container">
              <div class="d-flex gap-3 justify-content-between">
                <!-- Min per separate comp -->
                <div class="price_range_card">
                  <div
                    class="d-flex justify-content-center w-100 position-relative"
                  >
                    <div
                      class="d-flex flex-column justify-content-center align-items-center gap-3 p-4"
                    >
                      <div style="color: #c1c8ce">Min per</div>
                      <div
                        style="
                          font-size: 20px;
                          font-weight: 600;
                          color: #c1c8ce;
                        "
                      >
                        <input
                          v-if="!fullRangeSelected"
                          type="number"
                          style="
                            background: none;
                            border: none;
                            outline: none;
                            text-align: center;
                            color: #c1c8ce;
                            font-weight: 600;
                            font-size: 20px;
                          "
                          v-model="priceRange1"
                          @blur="adjustTokenPrices"
                        />
                        <input
                          v-else
                          disabled
                          type="number"
                          style="
                            background: none;
                            border: none;
                            outline: none;
                            text-align: center;
                            color: #c1c8ce;
                            font-weight: 600;
                            font-size: 20px;
                          "
                          value="0"
                        />
                      </div>
                      <div
                        style="
                          font-size: 12px;
                          font-weight: 400;
                          color: #858c90;
                        "
                      >
                        ≈ = ${{
                          !fullRangeSelected
                            ? ((pairToken1.price || 0) * priceRange1).toFixed(2)
                            : 0
                        }}
                      </div>
                    </div>
                    <div
                      style="
                        position: absolute;
                        left: 15px;
                        top: 5px;
                        color: #858c90;
                      "
                    >
                      {{
                        !fullRangeSelected
                          ? calculatePercentageDifference(
                              relativePrice,
                              priceRange1,
                            ).toFixed(2)
                          : 0
                      }}%
                    </div>
                    <!--TODO: implement decrement/increment logic based on next tick position-->
                    <div
                      v-if="concentratedLiquidityStep === 2"
                      style="
                        position: absolute;
                        top: 0;
                        right: 0;
                        height: 100%;
                        width: 8%;
                        background: #003e4f80;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: space-between;
                        border-radius: 0px 6px 6px 0px;
                      "
                      class="p-3 py-6"
                    >
                      <div
                        @click="incrementPriceRange(true)"
                        style="cursor: pointer; z-index: 10;"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14 7.99805H8V13.998H6V7.99805H0V5.99805H6V-0.00195312H8V5.99805H14V7.99805Z"
                            fill="#F8F8F8"
                          />
                        </svg>
                      </div>
                      <div
                        @click="decrementPriceRange(true)"
                        style="cursor: pointer; z-index: 10;"
                      >
                        <svg
                          width="14"
                          height="2"
                          viewBox="0 0 14 2"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14 1.99805H8H6H0V-0.00195312H6H8H14V1.99805Z"
                            fill="#F8F8F8"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Max per separate comp -->
                <div class="price_range_card">
                  <div
                    class="d-flex justify-content-center w-100 position-relative"
                  >
                    <div
                      class="d-flex flex-column justify-content-center align-items-center gap-3 p-4"
                    >
                      <div style="color: #c1c8ce">Max per</div>
                      <div
                        style="
                          font-size: 20px;
                          font-weight: 600;
                          color: #c1c8ce;
                        "
                      >
                        <input
                          type="number"
                          v-if="!fullRangeSelected"
                          style="
                            background: none;
                            border: none;
                            outline: none;
                            text-align: center;
                            color: #c1c8ce;
                            font-weight: 600;
                            font-size: 20px;
                          "
                          v-model="priceRange2"
                          @blur="adjustTokenPrices"
                        />
                        <input
                          v-else
                          disabled
                          type="text"
                          style="
                            background: none;
                            border: none;
                            outline: none;
                            text-align: center;
                            color: #c1c8ce;
                            font-weight: 600;
                            font-size: 20px;
                          "
                          value="∞"
                        />
                      </div>
                      <div
                        style="
                          font-size: 12px;
                          font-weight: 400;
                          color: #858c90;
                        "
                      >
                        ≈ = ${{
                          !fullRangeSelected
                            ? ((pairToken1.price || 0) * priceRange2).toFixed(2)
                            : '∞'
                        }}
                      </div>
                    </div>
                    <div
                      style="
                        position: absolute;
                        left: 15px;
                        top: 5px;
                        color: #858c90;
                      "
                    >
                      {{
                        !fullRangeSelected
                          ? calculatePercentageDifference(
                              relativePrice,
                              priceRange2,
                            ).toFixed(2)
                          : '∞'
                      }}%
                    </div>
                    <div
                      v-if="concentratedLiquidityStep === 2"
                      style="
                        position: absolute;
                        top: 0;
                        right: 0;
                        height: 100%;
                        width: 8%;
                        background: #003e4f80;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: space-between;
                        border-radius: 0px 6px 6px 0px;
                      "
                      class="p-3 py-6"
                    >
                      <div
                        @click="incrementPriceRange(false)"
                        style="cursor: pointer; z-index: 10;"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14 7.99805H8V13.998H6V7.99805H0V5.99805H6V-0.00195312H8V5.99805H14V7.99805Z"
                            fill="#F8F8F8"
                          />
                        </svg>
                      </div>
                      <div
                        @click="decrementPriceRange(false)"
                        style="cursor: pointer; z-index: 10;"
                      >
                        <svg
                          width="14"
                          height="2"
                          viewBox="0 0 14 2"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14 1.99805H8H6H0V-0.00195312H6H8H14V1.99805Z"
                            fill="#F8F8F8"
                          />
                        </svg>
                      </div>
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
                  <div
                    style="color: #c1c8ce; font-size: clamp(6px, 0.6vw, 10px)"
                  >
                    {{ type.percent }}
                  </div>

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
                  style="
                    background: #22222224;
                    box-shadow: 0px 4px 4px 0px #00000040;

                    border-radius: 16px;
                  "
                >
                  <div
                    style="
                      width: 30%;
                      background: #22222224;
                      box-shadow: 0px 4px 4px 0px #00000040;

                      border-radius: 16px;
                      padding: 10px;
                      color: #c1c8ce;
                      font-size: 12px;
                      display: flex;
                      align-items: flex-end;
                      justify-content: space-between;
                    "
                  >
                    <div
                      class="d-flex flex-column justify-content-around h-100"
                    >
                      <div class="d-flex align-items-center gap-2">
                        <img
                          :src="
                            getTokenEntity(pairToken1.symbol, 'short').icon ||
                            pairToken1.logoURI
                          "
                          width="24"
                        />

                        <h4
                          style="
                            font-size: 21px;
                            margin-bottom: 0;
                            color: white;
                          "
                        >
                          {{ pairToken1.symbol }}
                        </h4>
                      </div>
                      <div>
                        Balance:
                        {{
                          parseFloat(
                            (pairToken1.balance || 0) - depositAmount1,
                          ).toFixed(4)
                        }}
                      </div>
                    </div>
                    <div
                      class="max_button"
                      @click="depositAmount1 = pairToken1.balance"
                    >
                      Max
                    </div>
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
                        v-model="depositAmount1"
                        @blur="updateDepositAmount2"
                      />
                      <div style="color: #858c90; font-size: 12px">
                        ≈${{
                          (depositAmount1 * (pairToken1.price || 0)).toFixed(2)
                        }}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="d-flex"
                  style="
                    background: #22222224;
                    box-shadow: 0px 4px 4px 0px #00000040;

                    border-radius: 16px;
                  "
                >
                  <div
                    style="
                      width: 30%;
                      background: #22222224;
                      box-shadow: 0px 4px 4px 0px #00000040;

                      border-radius: 16px;
                      padding: 10px;
                      color: #c1c8ce;
                      font-size: 12px;
                      display: flex;
                      align-items: flex-end;
                      justify-content: space-between;
                    "
                  >
                    <div
                      class="d-flex flex-column justify-content-around h-100"
                    >
                      <div class="d-flex align-items-center gap-2">
                        <img
                          :src="
                            getTokenEntity(pairToken2.symbol, 'short').icon ||
                            pairToken2.logoURI
                          "
                          width="24"
                        />

                        <h4
                          style="
                            font-size: 21px;
                            margin-bottom: 0;
                            color: white;
                          "
                        >
                          {{ pairToken2.symbol }}
                        </h4>
                      </div>
                      <div>
                        Balance:
                        {{
                          parseFloat(
                            (pairToken2.balance || 0) - depositAmount2,
                          ).toFixed(4)
                        }}
                      </div>
                    </div>
                    <div
                      class="max_button"
                      @click="depositAmount2 = pairToken2.balance"
                    >
                      Max
                    </div>
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
                        v-model="depositAmount2"
                        @blur="updateDepositAmount1"
                      />
                      <div style="color: #858c90; font-size: 12px">
                        ≈${{
                          (depositAmount2 * (pairToken2.price || 0)).toFixed(2)
                        }}
                      </div>
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
              <div>0.5%</div>
            </div>

            <div
              class="my-3 d-flex justify-content-center position-relative"
              v-if="
                concentratedLiquidityStep === 3 ||
                concentratedLiquidityStep === 4 ||
                concentratedLiquidityStep === 5
              "
            >
              <div class="d-flex gap-2">
                <!-- First step marker -->
                <div class="position-relative flex items-center justify-center">
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
                    v-if="concentratedLiquidityStep === 2"
                    :class="
                      concentratedLiquidityStep === 2
                        ? 'step_number step_number_active'
                        : 'step_number'
                    "
                  >
                    1
                  </div>
                  <div
                    v-else-if="concentratedLiquidityStep === 3"
                    class="step_number"
                  >
                    <img :src="metamask" width="20" />
                  </div>
                  <div
                    v-else-if="concentratedLiquidityStep > 3"
                    class="step_number"
                  >
                    <img :src="checked_step_img" />
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
                        concentratedLiquidityStep === 4 || concentratedLiquidityStep === 5 ? '#00C9FF' : 'white'
                      "
                    />
                  </svg>
                  <div
                  v-if="concentratedLiquidityStep < 4"
                    :class="
                      concentratedLiquidityStep === 5 || concentratedLiquidityStep === 4
                        ? 'step_number step_number_active'
                        : 'step_number'
                    "
                  >
                    2
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
                    <img :src="checked_step_img" />
                  </div>
                </div>
              </div>
            </div>

            <button
              v-if="!tokensInitialized"
              :class="
                !tokensInitialized
                  ? 'concentrated_button concentrated_button_disabled'
                  : 'concentrated_button'
              "
            >
              No Tokens Selected
            </button>
            <button
              v-else-if="tokensInitialized && concentratedLiquidityStep < 3"
              :class="'concentrated_button'"
              @click="mintPosition"
            >
              Add liquidity
            </button>
            <button
              v-else-if="concentratedLiquidityStep === 3"
              :class="'concentrated_button'"
            >
              Approving all tokens for minting liquidity
            </button>
            <div
              v-else-if="concentratedLiquidityStep === 4"
              :class="'concentrated_button'"
            >
              Minting liquidity <span class="button_loader pl-2"></span>
            </div>
            <div
              v-else-if="concentratedLiquidityStep === 5"
              :class="'concentrated_button'"
            >
              Manage position
            </div>
          </div>
        </div>

        <div class="w-50">
          <ChartAndPoolInfo
            :token0="pairToken1"
            :token1="pairToken2"
            :minPriceRange="priceRange1"
            :maxPriceRange="priceRange2"
            :price="relativePrice"
            :concentratedLiquidityStep="concentratedLiquidityStep"
            :poolInfo="poolInfo"
            :tvl="poolTvl"
            :poolApr="poolApr"
          />
        </div>
      </div>
    </div>
  </MainCard>
</template>

<script setup>
import MainCard from '@/UI/MainCard.vue'
import TokenSelectModal from '@/components/modals/TokenSelectModal.vue'
import ChartAndPoolInfo from '@/components/ComposePool/ChartAndPoolInfo.vue'
import not_found from '@/assets/icons/not_found.svg'
import { ref, onMounted, watch, computed } from 'vue'
import metamask from '@/assets/icons/approveTokenSteps/metamask.svg'
import { fetchUniswapTokens } from '@/composables/tokens/useUniswapTokens'
import { networkId } from '@/composables/useNetwork'
import { GetTokenPriceUsd } from '@/composables/balances/cryptocompare'
import useBalance from '@/composables/useBalance'
import { getTokenEntity } from '@/lib/helpers/util'
import { ethers } from 'ethers'
import { calculatePercentageDifference } from '@/lib/utils'
import { useUniswapTvl } from '@/composables/concentrated-liquidity/useUniswapTvl'
import { useUniswapTvlSnapshots } from '@/composables/concentrated-liquidity/useUniswapTvlSnapshots'
import { fetchDataAndMerge } from '@/composables/pools/trades/fetch/useFetchTrades'
import {
  getPoolInfo,
  FEE_AMOUNTS,
  convertPairToken,
  adjustPrices,
  getDecrementLower,
  getDecrementUpper,
  getIncrementLower,
  getIncrementUpper,
  parseTicks,
  MintPosition,
  GetSecondAmount,
  GetPricesAtLimit,
} from '@/composables/concentrated-liquidity/cl'
import { useRoute } from 'vue-router'
import { CalculateAvgApr } from '@/composables/math/chartMath/trackingInfoMath'
import { usePool30dProfit } from '@/composables/pools/usePoolSwapsStats'
import router from '@/router'
import Modal from '@/UI/Modal.vue'
import checked_step_img from '@/assets/icons/CLIcons/checked_step.svg'


const route = useRoute()
const concentratedLiquidityStep = ref(1)
const feeTier = ref(0)
const tokenSelectModal = ref(false)
const pairIndex = ref(1)
const pairToken1 = ref({
  logoURI: not_found,
  symbol: '',
})

const pairToken2 = ref({
  logoURI: not_found,
  symbol: '',
})
const feeAmount = computed(() => FEE_AMOUNTS[feeTier.value])

const tokensInitialized = computed(
  () => pairToken1.value.address && pairToken2.value.address,
)

const convertedPairToken1 = computed(() =>
  pairToken1.value.symbol != ''
    ? convertPairToken(pairToken1.value, networkId.value)
    : null,
)
const convertedPairToken2 = computed(() =>
  pairToken2.value.symbol != ''
    ? convertPairToken(pairToken2.value, networkId.value)
    : null,
)

const depositAmount1 = ref(0)
const depositAmount2 = ref(0)

const priceRange1 = ref(0)
const priceRange2 = ref(0)

const mmProvider = computed(
  () => new ethers.providers.Web3Provider(window.ethereum),
)
const ticks = computed(() => {
  if (convertedPairToken1.value && convertedPairToken2.value) {
    return parseTicks(
      convertedPairToken1.value,
      convertedPairToken2.value,
      priceRange1.value,
      priceRange2.value,
      feeAmount.value,
    )
  }
  return null
})
const tickLower = computed(() => (ticks.value ? ticks.value.tickLower : 0))
const tickUpper = computed(() => (ticks.value ? ticks.value.tickUpper : 0))

const fee_tiers = ref([
  {
    name: 'STABLE',
    percent: '0.01%',
    selected: true,
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
    APR: '',
    APR_MIN: -100,
    APR_MAX: 100,
    selected: false,
  },
  {
    name: 'Wide',
    percent: '[-12.5%, +12.5%]',
    APR: '',
    APR_MIN: -12.5,
    APR_MAX: 12.5,
    selected: false,
  },
  {
    name: 'Narrow',
    percent: '[-7.5%, +7.5%]',
    APR: '',
    APR_MIN: -7.5,
    APR_MAX: 7.5,
    selected: false,
  },
  {
    name: 'Aggressive',
    percent: '[-5%, +5%]',
    APR: '',
    APR_MIN: -5,
    APR_MAX: 5,
    selected: false,
  },
])

const fullRangeSelected = computed(() => range_types.value[0].selected)
const relativePrice = computed(() =>
  pairToken1.value.price && pairToken2.value.price
    ? pairToken1.value.price / pairToken2.value.price
    : 0,
)

function selectTier(index) {
  // fee_tiers.value.map((t) => (t.selected = false))
  concentratedLiquidityStep.value = 2
  feeTier.value = index
  fee_tiers.value[index].selected = true
  // tier.selected = true
}
function selectRange(rng) {
  range_types.value.map((t) => (t.selected = false))
  if (rng.APR_MIN == -100) {
    let { lowerPrice, upperPrice } = GetPricesAtLimit(
      poolInfo.value,
      convertedPairToken1.value,
      convertedPairToken2.value,
      feeAmount.value,
    )
    priceRange1.value = lowerPrice
    priceRange2.value = upperPrice
  } else {
    priceRange1.value = (
      relativePrice.value +
      (relativePrice.value / 100) * rng.APR_MIN
    ).toFixed(6)
    priceRange2.value = (
      relativePrice.value +
      (relativePrice.value / 100) * rng.APR_MAX
    ).toFixed(6)
    adjustTokenPrices()
  }
  console.log(priceRange1.value)
  console.log(priceRange2.value)
  rng.selected = true
}

const notSelectedPossibleComposeTokens = ref([])
// function tokenSelectModalOpen(index) {
//   pairIndex.value = index
//   tokenSelectModal.value = !tokenSelectModal.value
// }

function tokenSelectModalClose() {
  tokenSelectModal.value = false
}
function tokenSelectModalOpen(index) {
  pairIndex.value = index
  tokenSelectModal.value = true
}

function updateToken(token, index) {
  if (index == 1) {
    pairToken1.value = token
  }
  if (index == 2) {
    pairToken2.value = token
  }
  if (pairToken1.value.address && pairToken2.value.address) {
    if (
      ethers.BigNumber.from(pairToken1.value.address).gt(
        pairToken2.value.address,
      )
    ) {
      let temp = pairToken2.value
      pairToken2.value = pairToken1.value
      pairToken1.value = temp
    }
  }
}

async function updateTokenInfo(token) {
  if (!mmProvider.value) {
    console.error('connect mm first')
    return
  }
  let price = await GetTokenPriceUsd(token.value.symbol)
  token.value.price = price
  let user = await mmProvider.value.getSigner().getAddress()
  let balance = await useBalance(token.value.address, mmProvider.value, user)
  token.value.balance = balance
  if (pairToken1.value.price && pairToken2.value.price) {
    priceRange1.value = relativePrice.value - (relativePrice.value / 100) * 5 // -5% difference
    priceRange2.value = relativePrice.value + (relativePrice.value / 100) * 5 // +5% difference
    adjustTokenPrices()
    poolInfo.value = await getPoolInfo(
      mmProvider.value,
      convertedPairToken1.value,
      convertedPairToken2.value,
      feeAmount.value,
    )
    console.log('POOL INFO - ', poolInfo.value)
  }
}

function incrementPriceRange(lower = true) {
  if (poolInfo.value) {
    adjustTokenPrices()
    if (lower) {
      priceRange1.value = getIncrementLower(
        tickLower.value,
        poolInfo.value,
        convertedPairToken1.value,
        convertedPairToken2.value,
        feeAmount.value,
      )
    } else {
      priceRange2.value = getIncrementUpper(
        tickUpper.value,
        poolInfo.value,
        convertedPairToken1.value,
        convertedPairToken2.value,
        feeAmount.value,
      )
    }
  }
}
function decrementPriceRange(lower = true) {
  if (poolInfo.value) {
    adjustTokenPrices()
    if (lower) {
      priceRange1.value = getDecrementLower(
        tickLower.value,
        poolInfo.value,
        convertedPairToken1.value,
        convertedPairToken2.value,
        feeAmount.value,
      )
    } else {
      priceRange2.value = getDecrementUpper(
        tickUpper.value,
        poolInfo.value,
        convertedPairToken1.value,
        convertedPairToken2.value,
        feeAmount.value,
      )
    }
  }
}

const poolInfo = ref(null)
const poolTvl = ref(0)
const poolSnapshots = ref([])
const trades = ref([])
const poolId = computed(() =>
  poolInfo.value ? poolInfo.value.address.toLowerCase() : '',
)
const poolApr = computed(() => {
  let formattedTvls = poolSnapshots.value.toReversed()
  formattedTvls = formattedTvls.map((item) => ({
    TVL: {
      'All Chains': parseFloat(item.totalValueLockedUSD),
      timestamp: item.timestamp,
    },
  }))
  let pool_trades = trades.value.filter((item) =>
    item.swaps[0].poolIdVault[0].includes(poolId.value),
  )
  let profit = usePool30dProfit(pool_trades).value
  return CalculateAvgApr(
    { Profits: profit },
    formattedTvls,
    'Monthly',
    'All Chains',
  )
})

function adjustTokenPrices() {
  if (pairToken1.value.price && pairToken2.value.price) {
    let newPrices = adjustPrices(
      convertedPairToken1.value,
      convertedPairToken2.value,
      priceRange1.value,
      priceRange2.value,
      feeAmount.value,
    )
    console.log(newPrices)
    console.log('NEW PRICES - ', newPrices.priceLower, newPrices.priceUpper)
    priceRange1.value = newPrices.priceLower.toSignificant(6)
    priceRange2.value = newPrices.priceUpper.toSignificant(6)
  }
}

async function mintPosition() {
  try {
    if (!mmProvider.value) {
      console.error('Connect MM first')
      return
    }
    let signer = mmProvider.value.getSigner()
    await MintPosition(
      signer,
      convertedPairToken1.value,
      convertedPairToken2.value,
      feeAmount.value,
      depositAmount1.value,
      depositAmount2.value,
      priceRange1.value,
      priceRange2.value,
      relativePrice.value,
      concentratedLiquidityStep,
    )
  } catch (e) {
    console.error('[MINT ERROR] Error happened during position minting')
  }
  concentratedLiquidityStep.value = 5
}

function updateDepositAmount2() {
  if (fullRangeSelected.value) return
  let newAmount = GetSecondAmount(
    poolInfo.value,
    convertedPairToken1.value,
    convertedPairToken2.value,
    priceRange1.value,
    priceRange2.value,
    depositAmount1.value,
    depositAmount2.value,
    feeAmount.value,
    true,
  )
  if (newAmount != null) depositAmount2.value = newAmount
}

function updateDepositAmount1() {
  if (fullRangeSelected.value) return
  let newAmount = GetSecondAmount(
    poolInfo.value,
    convertedPairToken1.value,
    convertedPairToken2.value,
    priceRange1.value,
    priceRange2.value,
    depositAmount1.value,
    depositAmount2.value,
    feeAmount.value,
    false,
  )
  if (newAmount != null) depositAmount1.value = newAmount
}

watch(pairToken1, async () => {
  await updateTokenInfo(pairToken1)
})
watch(pairToken2, async () => {
  await updateTokenInfo(pairToken2)
})

watch(feeAmount, async () => {
  poolInfo.value = await getPoolInfo(
    mmProvider.value,
    convertedPairToken1.value,
    convertedPairToken2.value,
    feeAmount.value,
  )
})

watch(poolInfo, async () => {
  let [tvl, snapshots] = await Promise.all([
    useUniswapTvl(poolId.value, networkId.value),
    useUniswapTvlSnapshots(poolId.value),
  ])
  poolTvl.value = tvl
  poolSnapshots.value = snapshots
})

onMounted(async () => {
  trades.value = await fetchDataAndMerge()
  if (route.query.fee) {
    let index = FEE_AMOUNTS.indexOf(parseInt(route.query.fee))
    if (index != -1) {
      selectTier(index)
    }
    await initPossibleComposeTokens()
  }
})

watch(networkId, async () => {
  await initPossibleComposeTokens()
})

async function initPossibleComposeTokens() {
  if (networkId.value) {
    notSelectedPossibleComposeTokens.value = await fetchUniswapTokens(
      networkId.value,
    )
    if (route.query.tokens.length == 2) {
      console.log('TOKENS - ', notSelectedPossibleComposeTokens)
      updateToken(
        notSelectedPossibleComposeTokens.value.find(
          (item) => item.address == route.query.tokens[0],
        ),
        1,
      )
      updateToken(
        (pairToken2.value = notSelectedPossibleComposeTokens.value.find(
          (item) => item.address == route.query.tokens[1],
        )),
        2,
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.center_container {
  background: #15151524;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  margin: 1% 5% 5% 5%;
  padding: 2.5%;
  border-radius: 16px;
}

.compose_text {
  font-size: clamp(11px, 0.8vw, 15px);
  color: white;
}

.concentrated_card {
  margin-top: 50px;
  background: #00000024;
  border: 1px solid #ffffff0d;
  border-radius: 16px;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

  padding: 15px;
}

.selector_button {
  background: #00000024;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

  border-radius: 16px;
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
  background: #00000024;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  border-radius: 16px;
  font-size: clamp(8px, 0.7vw, 14px);
  width: 45%;
  display: flex;
  gap: 10px;
  align-items: center;
}

.fee_tier_container {
  padding: 16px;
  border-radius: 16px;
  background: #00000024;

  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

  width: 100%;
  display: flex;
  justify-content: space-between;

  &_card {
    width: 23%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 15px 5px;
    background: #2f303230;
    font-family: Poppins;
    font-size: clamp(8px, 0.7vw, 12px);
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
  background: #00000024;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

  border-radius: 16px;
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

  display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

  &_active {
    color: #00c9ff;
  }
}

.back_button {
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background: #00000024;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  border: 1px solid #ffffff0d;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
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
