<template>
  <MainCard>
    <Modal v-if="zapperModal" @close="zapperModalClose">
      <template #body>
        <div class="modal_body_inside">
          <div class="!text-black dark:!text-white text-[18px] font-bold">
            Zapper Trades
          </div>
          <div class="flex justify-center flex-col items-center">
            <div
              class="my-4 w-full border-[#00E0FF1F] border-[1px] bg-[#22222224] shadow-md rounded-2xl text-white"
            >
              <div
                class="flex justify-between px-3"
                style="border-bottom: 1px solid #00e0ff1f"
              >
                <div
                  class="text-[13px] font-normal p-2 font-['Syne',_sans-serif]"
                >
                  Trades
                </div>
                <div
                  class="text-[13px] font-normal p-2 font-['Syne',_sans-serif]"
                >
                  Slippage %
                </div>
              </div>
              <div
                class="flex justify-between items-center px-3"
                v-for="(poolToken, poolTokenIndex) in tradeTokens"
                :key="`pool-token-${poolTokenIndex}`"
              >
                <div
                  class="text-[13px] font-normal px-2 py-3 font-['Syne',_sans-serif]"
                >
                  <div class="flex flex-col">
                    <div class="flex items-center gap-2">
                      <CAvatar
                        :src="getTokenEntity(zapToken.symbol, 'short').icon"
                        class="big-chip__image !w-8 !h-8"
                      />
                      <div
                        class="big-chip__text !mr-1 dark:!text-white text-black"
                      >
                        {{ parseFloat(fromAmounts[poolTokenIndex]).toFixed(5) }}
                      </div>
                      <svg
                        width="32"
                        height="22"
                        viewBox="0 0 32 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M29.5 11H2.5M29.5 11L20.5 2M29.5 11L20.5 20"
                          stroke="#F8F8F8"
                          stroke-width="4"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <CAvatar
                        :src="
                          getTokenEntity(
                            pool?.tokens.find(
                              (item) => item.address === poolToken.dstToken,
                            )?.symbol,
                            'short',
                          ).icon
                        "
                        class="big-chip__image !w-8 !h-8"
                      />

                      <div class="big-chip__text dark:!text-white text-black">
                        {{ parseFloat(toAmounts[poolTokenIndex]).toFixed(5) }}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="text-[13px] font-normal p-2 font-['Syne',_sans-serif]"
                >
                  {{ slippageSelected }}
                </div>
              </div>
            </div>

            <div class="zapper_button" @click="onAcceptTrade">Accept Trade</div>
          </div>
        </div>
      </template>
    </Modal>

    <div class="center_container dark:!bg-[#15151524] bg-white">
      <CRow class="mb-4">
        <div class="flex md:items-center items-start justify-between">
          <div class="caption-row">
            <div
              class="caption dark:!text-white text-black"
              style="font-size: clamp(10px, 0.9vw, 16px); font-weight: 700"
            >
              {{
                pool?.tokens?.map((tokenEntity) => tokenEntity.symbol).join('/')
              }}
            </div>

            <div class="flex flex-wrap">
              <div
                v-for="(poolToken, poolTokenIndex) in pool?.tokens"
                :key="`pool-token-${poolTokenIndex}`"
                class="big-chip dark:!bg-[#00000024] bg-white"
              >
                <CAvatar
                  :src="getTokenEntity(poolToken.symbol, 'short').icon"
                  class="big-chip__image"
                />
                <div class="big-chip__text dark:!text-white text-black">
                  {{ poolToken.symbol }}
                </div>
                <div class="big-chip__text dark:!text-white text-black">
                  {{ (poolToken.weight * 100).toFixed(0) }}%
                </div>
              </div>
            </div>
          </div>
          <div class="back_button" @click="router.go(-1)">
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
      </CRow>

      <!-- Loader -->
      <div
        v-if="Object.keys(balances).length === 0"
        class="my-24 flex justify-center items-center"
      >
        <BigLogoLoader />
      </div>
      <div v-else>
        <div class="flex justify-center md:flex-row flex-col gap-5">
          <div class="deposit_choose dark:!bg-[#00000024] bg-white">
            <div class="deposit_text dark:!text-white text-black my-1">
              <div
                v-if="approveStep !== 5"
                class="flex items-center justify-between p-2"
                @click="approveStep !== 0 ? approveStep-- : ''"
              >
                <div class="flex items-center gap-2">
                  <img
                    :src="arrow_back"
                    class="w-2 cursor-pointer"
                    v-if="approveStep !== 0"
                  />
                  <div class="text-[14px] text-white">Add Liquidity</div>
                </div>
                <div v-if="approveStep === 0" class="flex items-center gap-2">
                  <div
                    class="flex items-center bg-[#22222224] p-1 shadow-sm rounded-2xl"
                  >
                    <div
                      :class="
                        depositMethod == 'zap'
                          ? 'px-2 py-1 text-[14px] rounded-full cursor-pointer text-[#02031c] bg-[#00e0ff]'
                          : 'px-2 py-1 text-[14px] rounded-full cursor-pointer'
                      "
                      @click="depositMethod = 'zap'"
                    >
                      <span class="font-['Syne',_sans-serif] font-medium"
                        >Zap</span
                      >
                    </div>
                    <div
                      :class="
                        depositMethod == 'manual'
                          ? 'px-2 py-1 text-[14px] rounded-full cursor-pointer text-[#02031c] bg-[#00e0ff]'
                          : 'px-2 py-1 text-[14px] rounded-full cursor-pointer'
                      "
                      @click="depositMethod = 'manual'"
                    >
                      <span class="font-['Syne',_sans-serif] font-medium"
                        >Manual</span
                      >
                    </div>
                  </div>

                  <Dropdown :distance="4" :placement="'bottom-left'">
                    <div class="cursor-pointer hover:text-[#00e0ff]">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.5 11C14.5 11.4596 14.4095 11.9148 14.2336 12.3394C14.0577 12.764 13.7999 13.1499 13.4749 13.4749C13.1499 13.7999 12.764 14.0577 12.3394 14.2336C11.9148 14.4095 11.4596 14.5 11 14.5C10.5404 14.5 10.0852 14.4095 9.66061 14.2336C9.23597 14.0577 8.85013 13.7999 8.52513 13.4749C8.20012 13.1499 7.94231 12.764 7.76642 12.3394C7.59053 11.9148 7.5 11.4596 7.5 11C7.5 10.0717 7.86875 9.1815 8.52513 8.52513C9.1815 7.86875 10.0717 7.5 11 7.5C11.9283 7.5 12.8185 7.86875 13.4749 8.52513C14.1313 9.1815 14.5 10.0717 14.5 11Z"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M20.011 13.0973C20.533 12.9563 20.794 12.8853 20.897 12.7513C21 12.6163 21 12.4003 21 11.9673V10.0333C21 9.60032 21 9.38332 20.897 9.24932C20.794 9.11532 20.533 9.04433 20.011 8.90433C18.061 8.37832 16.84 6.33932 17.343 4.40132C17.482 3.86832 17.551 3.60132 17.485 3.44532C17.419 3.28932 17.229 3.18132 16.85 2.96632L15.125 1.98632C14.753 1.77632 14.567 1.67032 14.4 1.69232C14.233 1.71432 14.044 1.90232 13.667 2.27932C12.208 3.73432 9.794 3.73432 8.334 2.27932C7.957 1.90332 7.769 1.71532 7.602 1.69232C7.435 1.67032 7.249 1.77532 6.877 1.98732L5.152 2.96632C4.772 3.18132 4.582 3.28932 4.517 3.44632C4.451 3.60132 4.52 3.86832 4.658 4.40132C5.161 6.33932 3.94 8.37832 1.989 8.90433C1.467 9.04433 1.206 9.11432 1.103 9.24932C1 9.38432 1 9.60032 1 10.0333V11.9673C1 12.4003 1 12.6173 1.103 12.7513C1.206 12.8853 1.467 12.9563 1.989 13.0973C3.939 13.6233 5.16 15.6623 4.657 17.5993C4.518 18.1323 4.449 18.3993 4.515 18.5553C4.581 18.7113 4.771 18.8193 5.15 19.0353L6.875 20.0133C7.247 20.2253 7.433 20.3303 7.6 20.3083C7.767 20.2863 7.956 20.0983 8.333 19.7213C9.793 18.2643 12.209 18.2643 13.669 19.7213C14.046 20.0973 14.234 20.2853 14.401 20.3083C14.568 20.3303 14.754 20.2253 15.127 20.0133L16.851 19.0343C17.231 18.8193 17.421 18.7113 17.486 18.5543C17.551 18.3973 17.483 18.1323 17.345 17.5993C16.841 15.6623 18.061 13.6233 20.011 13.0973Z"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <template #popper>
                      <div class="settings_popup bg-white dark:!bg-[#02031C]">
                        <h4
                          class="text-[12px] text-black dark:!text-[#626262] mb-[10px]"
                        >
                          {{ $t('Settings') }}
                        </h4>

                        <div class="mb-[10px]">
                          <div
                            class="text-[12px] flex items-center gap-1 dark:text-white"
                          >
                            Slippage Tolerance (%)
                            <svg
                              width="9"
                              height="9"
                              viewBox="0 0 9 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4.5 8.25C2.42888 8.25 0.75 6.57113 0.75 4.5C0.75 2.42888 2.42888 0.75 4.5 0.75C6.57113 0.75 8.25 2.42888 8.25 4.5C8.25 6.57113 6.57113 8.25 4.5 8.25ZM4.125 5.625V6.375H4.875V5.625H4.125ZM4.875 5.00812C5.17638 4.91729 5.4351 4.72123 5.60406 4.45565C5.77302 4.19007 5.84096 3.87265 5.79553 3.56117C5.75009 3.2497 5.59429 2.96491 5.3565 2.75867C5.11872 2.55243 4.81477 2.43845 4.5 2.4375C4.19657 2.43748 3.9025 2.54256 3.6678 2.73487C3.4331 2.92719 3.27225 3.19486 3.21263 3.49237L3.94838 3.63975C3.96925 3.53529 4.01937 3.4389 4.09289 3.36181C4.16641 3.28471 4.2603 3.23008 4.36366 3.20426C4.46701 3.17845 4.57557 3.18252 4.67671 3.21599C4.77784 3.24946 4.86739 3.31096 4.93494 3.39334C5.00248 3.47572 5.04525 3.57558 5.05826 3.68132C5.07126 3.78705 5.05398 3.8943 5.00841 3.99059C4.96285 4.08689 4.89088 4.16826 4.80087 4.22525C4.71087 4.28224 4.60653 4.31249 4.5 4.3125C4.40054 4.3125 4.30516 4.35201 4.23484 4.42234C4.16451 4.49266 4.125 4.58804 4.125 4.6875V5.25H4.875V5.00812Z"
                                fill="#F8F8F8"
                              />
                            </svg>
                          </div>
                        </div>
                        <div
                          class="bg-[#22222224] text-[12px] dark:text-white shadow-sm rounded-md"
                        >
                          <div class="flex gap-3">
                            <div
                              class="flex flex-col items-center justify-start cursor-pointer"
                              @click="
                                ;(slippageSelected = 'Auto'), (slippage = 1)
                              "
                              :class="
                                slippageSelected === 'Auto'
                                  ? 'text-[#00e0ff]'
                                  : ''
                              "
                            >
                              <div>Auto</div>
                              <div>-</div>
                            </div>
                            <div
                              class="flex flex-col items-center justify-start cursor-pointer"
                              @click="
                                ;(slippageSelected = 'High'), (slippage = 2)
                              "
                              :class="
                                slippageSelected === 'High'
                                  ? 'text-[#00e0ff]'
                                  : ''
                              "
                            >
                              <div>High</div>
                              <div>2</div>
                            </div>
                            <div
                              class="flex flex-col items-center justify-start cursor-pointer"
                              @click="
                                ;(slippageSelected = 'Medium'), (slippage = 0.5)
                              "
                              :class="
                                slippageSelected === 'Medium'
                                  ? 'text-[#00e0ff]'
                                  : ''
                              "
                            >
                              <div>Medium</div>
                              <div>0.5</div>
                            </div>
                            <div
                              class="flex flex-col items-center justify-start cursor-pointer"
                              @click="
                                ;(slippageSelected = 'Low'), (slippage = 0.1)
                              "
                              :class="
                                slippageSelected === 'Low'
                                  ? 'text-[#00e0ff]'
                                  : ''
                              "
                            >
                              <div>Low</div>
                              <div>0.1</div>
                            </div>
                            <svg
                              width="1"
                              height="45"
                              viewBox="0 0 1 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <line
                                x1="0.900977"
                                y1="25"
                                x2="0.9"
                                y2="3.90625e-06"
                                stroke="white"
                                stroke-width="0.2"
                              />
                            </svg>

                            <div
                              class="flex flex-col items-center justify-start cursor-pointer"
                              @click="slippageSelected = 'Custom'"
                              :class="
                                slippageSelected === 'Custom'
                                  ? 'text-[#00e0ff]'
                                  : ''
                              "
                            >
                              <div>Custom</div>
                              <div>
                                <input
                                  class="token-input !p-0 w-[40px] h-[12px] dark:!text-[#A8A8A8] text-black"
                                  style="
                                    font-size: clamp(10px, 0.8vw, 14px);
                                    font-weight: 500;
                                    text-align: center;
                                  "
                                  type="number"
                                  :placeholder="'%'"
                                  :value="slippage"
                                  @input="(e) => (slippage = e.target.value)"
                                />
                              </div>
                            </div>
                          </div>
                          <div class="flex items-center mt-3 gap-1">
                            <div
                              class="bg-[#FFFFFF] cursor-pointer rounded-2xl dark:text-[#0F0F0F] py-1 px-3 font-medium"
                              @click="slippageSelected = 'Auto'"
                            >
                              Reset Default
                            </div>
                            <!-- <div
                              class="bg-[#00E0FF] cursor-pointer rounded-2xl dark:text-[#05061B] py-1 px-3 font-medium"
                            >
                              Save
                            </div> -->
                          </div>
                        </div>
                      </div>
                    </template>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div v-if="approveStep === 0">
              <div class="deposit_network_text dark:!text-white text-black">
                {{ chainSelected }}
              </div>

              <div
                class="d-flex justify-content-between dark:!bg-[#00000024] bg-white currency_container"
                v-if="depositMethod !== 'zap'"
              >
                <CurrencySelector
                  @updateCurrency="
                    (newCurrency) => (currencySelected = newCurrency)
                  "
                />
                <div>
                  <input
                    class="token-input dark:!text-[#A8A8A8] text-black font-['Roboto_Mono',_monospace]"
                    style="
                      font-size: clamp(10px, 0.8vw, 14px);
                      font-weight: 500;
                      text-align: right;
                    "
                    type="tel"
                    :placeholder="0"
                    @input="(e) => onCurrencyInput(e)"
                  />
                </div>
              </div>

              <div
                class="d-flex flex-column gap-2"
                v-if="
                  balances != {} &&
                  lastTokenPrices != {} &&
                  lineNumbers.length > 0
                "
              >
                <div v-if="depositMethod == 'zap'">
                  <div class="modal_stake_token dark:!bg-[#15151524] bg-white">
                    <div>
                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        {{ console.log('pool?.tokens', pool?.tokens) }}
                        <TokenSelector
                          :tokens="pool?.tokens"
                          :token-selected="zapToken"
                          @update-token="
                            (selectedToken, selectedIndex) => (
                              (zapToken = selectedToken),
                              (zapTokenIndex = selectedIndex)
                            )
                          "
                        />
                        <input
                          class="token-input dark:!text-[#A8A8A8] text-black font-['Roboto_Mono',_monospace]"
                          style="
                            font-size: clamp(10px, 0.8vw, 14px);
                            font-weight: 500;
                            text-align: right;
                          "
                          :value="
                            lineNumbers[zapTokenIndex] > 0
                              ? lineNumbers[zapTokenIndex] / 1000
                              : lineNumbers[zapTokenIndex]
                          "
                          @input="(e) => onTokenInput(e, zapTokenIndex)"
                          type="number"
                        />
                      </div>
                      <div>
                        <div
                          class="modal_balance_slider dark:!text-white text-black"
                        >
                          <div
                            class="value-label font-['Roboto_Mono',_monospace]"
                            ref="inputRefLabel"
                          >
                            {{ $t('balance') }}:
                            <span
                              class="fw-bold font-['Roboto_Mono',_monospace]"
                              >{{
                                RemainingBalance(zapToken, zapTokenIndex)
                              }}</span
                            ><span
                              @click="
                                () =>
                                  OnMaxClick(zapTokenIndex, zapToken.address)
                              "
                              class="fw-bold bg-transparent pl-1"
                              style="cursor: pointer"
                            >
                              {{ $t('max') }}</span
                            >
                          </div>
                          <div class="font-['Roboto_Mono',_monospace]">
                            {{ currencySelected.symbol
                            }}{{
                              (
                                (lineNumbers[zapTokenIndex] / 1000) *
                                lastTokenPrices[zapToken.address]
                              ).toFixed(3)
                            }}
                          </div>
                        </div>
                        <div class="mt-2">
                          <Slider
                            @change="
                              (value) =>
                                OnSliderValueChange(zapTokenIndex, value)
                            "
                            :tooltips="false"
                            :min="0"
                            :max="maxBalances[zapToken.address] * 1000"
                            :step="1"
                            v-model="lineNumbers[zapTokenIndex]"
                            lazy="false"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else-if="depositMethod == 'manual'">
                  <div
                    class="modal_stake_token dark:!bg-[#15151524] bg-white"
                    v-for="(token, tokenIndex) in pool?.tokens"
                    :key="`deposit-token-${token.address}`"
                  >
                    <div>
                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <div
                          class="modal_stake_token_inner_name dark:!text-white text-black dark:!bg-[#4c4c4c24] bg-white"
                        >
                          <img
                            :src="getTokenEntity(token.symbol, 'short').icon"
                            width="20"
                          />
                          {{ token.symbol }}
                          {{ (token.weight * 100).toFixed(0) }}%
                        </div>
                        <input
                          class="token-input dark:!text-[#A8A8A8] text-black font-['Roboto_Mono',_monospace]"
                          style="
                            font-size: clamp(10px, 0.8vw, 14px);
                            font-weight: 500;
                            text-align: right;
                          "
                          :value="
                            lineNumbers[tokenIndex] > 0
                              ? lineNumbers[tokenIndex] / 1000
                              : lineNumbers[tokenIndex]
                          "
                          @input="(e) => onTokenInput(e, tokenIndex)"
                          type="number"
                        />
                      </div>
                      <div>
                        <div
                          class="modal_balance_slider dark:!text-white text-black"
                        >
                          <div
                            class="value-label font-['Roboto_Mono',_monospace]"
                            ref="inputRefLabel"
                          >
                            {{ $t('balance') }}:
                            <span
                              class="fw-bold font-['Roboto_Mono',_monospace]"
                              >{{ RemainingBalance(token, tokenIndex) }}</span
                            ><span
                              @click="
                                () => OnMaxClick(tokenIndex, token.address)
                              "
                              class="fw-bold bg-transparent pl-1"
                              style="cursor: pointer"
                            >
                              {{ $t('max') }}</span
                            >
                          </div>
                          <div class="font-['Roboto_Mono',_monospace]">
                            {{ currencySelected.symbol
                            }}{{
                              (
                                (lineNumbers[tokenIndex] / 1000) *
                                lastTokenPrices[token.address]
                              ).toFixed(3)
                            }}
                          </div>
                        </div>
                        <div class="mt-2">
                          <Slider
                            @change="
                              (value) => OnSliderValueChange(tokenIndex, value)
                            "
                            :tooltips="false"
                            :min="0"
                            :max="maxBalances[token.address] * 1000"
                            :step="1"
                            v-model="lineNumbers[tokenIndex]"
                            lazy="false"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="modal_total_container mt-4">
                    <table
                      style="
                        width: 100%;
                        border-collapse: separate;
                        border-spacing: 0;
                        overflow: hidden;
                      "
                      class="dark:!text-white text-black"
                    >
                      <tr
                        style="
                          border: 1px solid rgba(163, 164, 165, 0.2);
                          border-top-left-radius: 15px;
                        "
                      >
                        <td
                          class="w-25 fw-bold"
                          style="
                            border-right: 1px solid rgba(163, 164, 165, 0.2);
                            /* border-bottom: 1px solid rgba(163, 164, 165, 0.2); */
                            padding: 8px;
                          "
                        >
                          {{ $t('total') }}
                        </td>
                        <td
                          style="
                            padding: 8px;
                            /* border-bottom: 1px solid rgba(163, 164, 165, 0.2); */
                          "
                        >
                          <div
                            class="d-flex justify-content-between align-items-center"
                          >
                            <div
                              class="w-25 fw-bold font-['Roboto_Mono',_monospace]"
                            >
                              {{ currencySelected.symbol }}{{ fiatTotal }}
                            </div>
                            <div
                              class="optimize bg-[#FFFFFF] hover:!bg-blue-500 text-black font-semibold border-0"
                              @click="OnAllMaxClick"
                            >
                              {{ $t('max') }}
                            </div>
                          </div>
                        </td>
                      </tr>
                      <!-- <tr>
                        <td style="
                            border-right: 1px solid rgba(163, 164, 165, 0.2);
                            padding: 8px;
                          " class="w-25">
                          {{ $t('value_loss') }}
                        </td>
                        <td style="padding: 8px">
                          <div class="flex justify-between items-center">
                            <div class="flex items-center gap-1">
                              <div class="font-['Roboto_Mono',_monospace]">
                                {{ priceImpactFormatted }}%
                              </div>
                              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_1904_24663)">
                                  <path
                                    d="M6.78125 11.4932C9.54267 11.4932 11.7812 9.25459 11.7812 6.49316C11.7812 3.73174 9.54267 1.49316 6.78125 1.49316C4.01983 1.49316 1.78125 3.73174 1.78125 6.49316C1.78125 9.25459 4.01983 11.4932 6.78125 11.4932Z"
                                    stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M6.78125 8.49316V6.49316" stroke="white" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                  <path d="M6.78125 4.49316H6.78625" stroke="white" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                </g>
                                <defs>
                                  <clipPath id="clip0_1904_24663">
                                    <rect width="12" height="12" fill="white" transform="translate(0.78125 0.493164)" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                            <div class="optimize dark:!bg-[#02031C]" @click="OnOptimizeClick">
                              {{ $t('optimize') }}
                            </div>
                          </div>
                        </td>
                      </tr> -->
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="approveStep > 0 && approveStep < 5">
              <DepositModalV2
                @zapperModalOpen="zapperModalOpen"
                :pool="pool"
                :visibleDepositModal="visibleDepositModal"
                @changeVisibleDepositOpen="changeVisibleDepositClose"
                :total="
                  lineNumbers.reduce(
                    (sum, current, index) =>
                      sum + (current / 1000) * lastTokenPrices[tokens[index]],
                    0,
                  )
                "
                :account="account"
                :valueLoss="priceImpactFormatted"
                :bptOut="bptOut"
                :weeklyYield="totalWeeklyYield"
                :fiatTotal="fiatTotal"
                :tokens="
                  depositMethod === 'zap'
                    ? [
                        {
                          ...zapToken,
                          depositAmount: formattedLineNumbers[zapTokenIndex],
                          usdAmount:
                            formattedLineNumbers[zapTokenIndex] *
                            lastTokenPrices[zapToken.address],
                        },
                      ]
                    : pool?.tokens?.map((t, i) => ({
                        ...t,
                        depositAmount: formattedLineNumbers[i],
                        usdAmount:
                          formattedLineNumbers[i] * lastTokenPrices[t.address],
                      }))
                "
                :approveStep="approveStep"
                :depositMethod="depositMethod"
                @changeApproveStep="changeApproveStep"
                @explode="explode"
                @addedTXHash="addedTXHash"
              />
            </div>
            <div v-else-if="approveStep === 5">
              <div class="py-4 flex flex-col items-center justify-center mb-5">
                <ConfettiExplosion
                  v-if="confettiVisible"
                  :particleSize="8"
                  :duration="5000"
                  :colors="['#00E0FF', '#00c9ff', '#2E3191', '#41BBC7']"
                />
                <div class="text-[20px] text-white font-medium mb-3">
                  Liquidity added!
                </div>
                <svg
                  @click="explode"
                  class="mb-3"
                  width="74"
                  height="74"
                  viewBox="0 0 74 74"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M36.9987 0.333008C16.7587 0.333008 0.332031 16.7597 0.332031 36.9997C0.332031 57.2397 16.7587 73.6663 36.9987 73.6663C57.2387 73.6663 73.6654 57.2397 73.6654 36.9997C73.6654 16.7597 57.2387 0.333008 36.9987 0.333008ZM27.062 52.7297L13.8987 39.5663C13.5592 39.2269 13.29 38.8239 13.1062 38.3803C12.9225 37.9368 12.828 37.4614 12.828 36.9813C12.828 36.5013 12.9225 36.0259 13.1062 35.5824C13.29 35.1388 13.5592 34.7358 13.8987 34.3963C14.2382 34.0569 14.6412 33.7876 15.0847 33.6039C15.5282 33.4202 16.0036 33.3256 16.4837 33.3256C16.9638 33.3256 17.4392 33.4202 17.8827 33.6039C18.3262 33.7876 18.7292 34.0569 19.0687 34.3963L29.6654 44.9563L54.892 19.7297C55.5776 19.0441 56.5075 18.6589 57.477 18.6589C58.4466 18.6589 59.3764 19.0441 60.062 19.7297C60.7476 20.4153 61.1328 21.3451 61.1328 22.3147C61.1328 23.2842 60.7476 24.2141 60.062 24.8997L32.232 52.7297C31.8928 53.0696 31.4899 53.3393 31.0463 53.5233C30.6028 53.7073 30.1272 53.802 29.647 53.802C29.1668 53.802 28.6913 53.7073 28.2477 53.5233C27.8042 53.3393 27.4012 53.0696 27.062 52.7297Z"
                    fill="#00E0FF"
                  />
                </svg>
                <div class="text-[15px] text-[#888888] font-medium">
                  Successfully added liquidity.
                </div>
              </div>

              <div class="flex justify-evenly mb-3">
                <a
                  :href="`https://bscscan.com/tx/${txHash}`"
                  class="text-decoration-none"
                  target="_blank"
                >
                  <div class="compose_pool_connect_wallet flex items-center">
                    Receipt
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_558_15327)">
                        <path
                          d="M10.5 7.58333V11.0833C10.5 11.3928 10.3771 11.6895 10.1583 11.9083C9.9395 12.1271 9.64275 12.25 9.33333 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V4.66667C1.75 4.35725 1.87292 4.0605 2.09171 3.84171C2.3105 3.62292 2.60725 3.5 2.91667 3.5H6.41667"
                          stroke="#05061B"
                          stroke-width="1.16667"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M8.75 1.75H12.25V5.25"
                          stroke="#05061B"
                          stroke-width="1.16667"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M5.83203 8.16667L12.2487 1.75"
                          stroke="#05061B"
                          stroke-width="1.16667"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_558_15327">
                          <rect width="14" height="14" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </a>
                <a
                  :href="`/pools/details/${poolId}/BNB/info`"
                  class="text-decoration-none"
                >
                  <div class="compose_pool_connect_wallet">View Pool</div>
                </a>
              </div>
            </div>

            <div
              class="compose_pool_connect_wallet"
              v-if="approveStep === 0"
              @click="approveStep = 1"
            >
              {{ $t('preview') }}
            </div>
          </div>

          <!-- WALLET IN SEPARATE COMPONENT -->
          <div
            class="dark:!text-white text-black dark:!bg-[#00000024] bg-white wallet_deposit"
          >
            <div class="fw-bold p-3" style="border-bottom: 1px solid #4f4f4f57">
              {{ $t('my_wallet') }}
            </div>
            <div
              class="d-flex flex-column p-2 dark:!text-[#dddddd] text-black"
              style="font-size: clamp(10px, 0.8vw, 14px)"
              v-if="
                balances != {} &&
                lastTokenPrices != {} &&
                lineNumbers.length > 0
              "
            >
              <div
                class="d-flex justify-content-between align-items-center"
                v-for="(token, index) in pool?.tokens"
                :key="`wallet-${index}`"
              >
                <div>
                  <img
                    :src="getTokenEntity(token.symbol, 'short').icon"
                    width="23"
                    class="p-1"
                  />
                </div>
                <div class="font-['Roboto_Mono',_monospace]">
                  {{ parseFloat(balances[token.address]).toFixed(2) }} ({{
                    (
                      balances[token.address] * lastTokenPrices[token.address]
                    ).toFixed(2)
                  }}$)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainCard>
</template>
<script setup>
import MainCard from '@/UI/MainCard.vue'
import DepositModalV2 from '@/components/modals/DepositModalV2.vue'
import { getTokenEntity } from '@/lib/helpers/util'
import BigLogoLoader from '@/components/loaders/BigLogoLoader.vue'
import { nextTick, ref } from 'vue'
import Slider from '@vueform/slider'
import CurrencySelector from '@/UI/CurrencySelector.vue'
import { onMounted, toRef, computed } from 'vue'
import { usePoolActionBalances } from '@/composables/balances/usePoolActionBalances'
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue'
import 'vue3-toastify/dist/index.css'
import arrow_back from '@/assets/icons/arrow/arrow_back.svg'
import ConfettiExplosion from 'vue-confetti-explosion'

import useInvestFormMath from '@/composables/math/investMath/useInvestMath'
import { bnum } from '@/lib/utils'
import router from '@/router'
import Modal from '@/UI/Modal.vue'
import { getSinglePoolDetails } from '@/composables/data/detailsData'
import TokenSelector from '@/UI/TokenSelector.vue'
import { Dropdown } from 'floating-vue'
import {
  useTrades,
  useZapper,
} from '@/composables/poolActions/deposit/useZapper'

const zapperModal = ref(false)
const tradeTokens = ref([])
const tradeDatas = ref([])
const fromAmounts = ref([])
const toAmounts = ref([])
async function zapperModalOpen() {
  const {
    oneInchDatas,
    oneInchDescs,
    fromAmounts: amountsIn,
    toAmounts: amountsOut,
  } = await useTrades(
    pool.value,
    zapToken.value.address,
    formattedLineNumbers.value[zapTokenIndex.value],
    slippage.value,
  )

  tradeDatas.value = oneInchDatas
  tradeTokens.value = oneInchDescs
  fromAmounts.value = amountsIn
  toAmounts.value = amountsOut

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  })
  zapperModal.value = true
}
function zapperModalClose() {
  zapperModal.value = false
}

async function onAcceptTrade() {
  await useZapper(
    pool.value,
    zapToken.value.address,
    formattedLineNumbers.value[zapTokenIndex.value],
    tradeDatas.value,
    tradeTokens.value,
  )
}

const poolId = router.currentRoute.value.params['id']
const pool = ref(null)
const approveStep = ref(0)
const depositMethod = ref('zap')
const slippageSelected = ref('Auto')
const slippage = ref(1)

const confettiVisible = ref(false)

const explode = async () => {
  confettiVisible.value = false
  await nextTick()
  confettiVisible.value = true
}

function changeApproveStep(step) {
  approveStep.value = step
}
const tokens = ref([])
const currencySelected = ref({ name: 'USD', code: 'USD', symbol: '$' })
const lineNumbers = ref([])
const balances = ref({})

const allLastTokenPrices = ref({})
const lastTokenPrices = computed(
  () => allLastTokenPrices.value[currencySelected.value.code],
)

const usdValues = computed(() => {
  if (lineNumbers.value.length > 0) {
    return pool.value.tokens.map(
      (t) => balances.value[t.address] * lastTokenPrices.value[t.address],
    )
  }
  return []
})
const leastBalanceIndex = computed(() => {
  const minValue = Math.min(...usdValues.value)
  let index = usdValues.value.indexOf(minValue)
  return index == -1 ? 0 : index
})

const leastBalanceValue = computed(() => {
  if (usdValues.value.length > 0) {
    return usdValues.value[leastBalanceIndex.value]
  }
  return 0
})

const maxBalances = computed(() => {
  const result = {}
  let iterator = 0
  for (const [key] of Object.entries(balances.value)) {
    if (iterator != leastBalanceIndex.value) {
      let toOptimizeUsdAmount =
        (leastBalanceValue.value /
          pool.value.tokens[leastBalanceIndex.value].weight) *
        pool.value.tokens[iterator].weight
      result[key] = toOptimizeUsdAmount / lastTokenPrices.value[key]
    } else {
      result[key] = leastBalanceValue.value / lastTokenPrices.value[key]
    }
    iterator++
  }
  return result
})
// hardcoded tx
const txHash = ref('')

function addedTXHash(hash) {
  txHash.value = hash
}

const formattedLineNumbers = computed(() =>
  lineNumbers.value.map((ln) => ln / 1000),
)
const { priceImpact, fullAmounts, bptOut } = useInvestFormMath(
  pool,
  pool.value ? pool.value.tokens : [],
  balances,
  formattedLineNumbers,
  true,
)

const amountMap = computed(() => {
  const amountMap = {}
  fullAmounts.value.forEach((amount, i) => {
    amountMap[tokens.value[i]] = parseFloat(amount)
  })
  return amountMap
})

const fiatAmountMap = computed(() => {
  if (Object.keys(lastTokenPrices.value).length > 0) {
    const fiatAmountMap = {}
    Object.keys(amountMap.value).forEach((address) => {
      fiatAmountMap[address] =
        lastTokenPrices.value[address] * amountMap.value[address]
    })
    return fiatAmountMap
  }
  return {}
})
const fiatTotal = computed(() =>
  parseFloat(
    lineNumbers.value.reduce(
      (sum, current, index) =>
        sum + (current / 1000) * lastTokenPrices.value[tokens.value[index]],
      0,
    ),
  ).toFixed(3),
)

const priceImpactFormatted = computed(() =>
  priceImpact.value ? (priceImpact.value * 100).toFixed(1) : 0,
)
// const totalWeeklyYield = computed(() =>
//   weeklyYieldForAPR(`${pool.apr.total}`),
// )
const account = ref('')

const zapToken = ref()
const zapTokenIndex = ref()

onMounted(async () => {
  pool.value = await getSinglePoolDetails(56, poolId, true)
  tokens.value = pool.value.tokens.map((t) => t.address)
  zapToken.value = pool.value.tokens[0]
  zapTokenIndex.value = 0
  const {
    balances: _balances,
    account: _account,
    lineNumbers: _lineNumbers,
    lastTokenPrices: _lastTokenPrices,
  } = await usePoolActionBalances(tokens.value, pool.value.tokens, 56)

  balances.value = _balances
  account.value = _account
  lineNumbers.value = _lineNumbers
  allLastTokenPrices.value = _lastTokenPrices
})

// function weeklyYieldForAPR(apr) {
//   return bnum(apr).times(fiatTotal.value).div(52).toString()
// }

let lastDepositChanged = ref(0)
function OnSliderValueChange(index, value) {
  if (balances.value[tokens.value[index].address] * 1000 < value) {
    lineNumbers.value[index] =
      balances.value[tokens.value[index].address] * 1000
  }
  lineNumbers.value[index] = value
  if (value > 0) lastDepositChanged.value = index
  OnOptimizeClick()
}

function OnAllMaxClick() {
  for (let i = 0; i < tokens.value.length; i++) {
    OnMaxClick(i, tokens.value[i])
  }
}
function OnMaxClick(index, address) {
  OnSliderValueChange(index, balances.value[address] * 1000)
}

// WETH-60/USDT-40

// 600$ worth of WETH
// 1000$ / 100 * 40

// 60-40 = +20%

function OnOptimizeClick() {
  if (lastDepositChanged.value == -1) return
  let token = tokens.value[lastDepositChanged.value]
  let usdAmount =
    (lineNumbers.value[lastDepositChanged.value] / 1000) *
    lastTokenPrices.value[token]
  usdAmount = Math.min(usdAmount, leastBalanceValue.value)
  for (let i = 0; i < lineNumbers.value.length; i++) {
    // let toOptimize = pool.value.tokens[i]
    // let weightDiff = toOptimize.weight / pool.value.tokens[lastDepositChanged.value].weight
    // let sumDiff = usdAmount * weightDiff
    // let toOptimizeUsdAmount = usdAmount + sumDiff
    // let newValue = toOptimizeUsdAmount / lastTokenPrices.value[tokens.value[i]]
    let toOptimizeUsdAmount =
      (usdAmount / pool.value.tokens[lastDepositChanged.value].weight) *
      pool.value.tokens[i].weight
    let newValue =
      toOptimizeUsdAmount / lastTokenPrices.value[pool.value.tokens[i].address]
    lineNumbers.value[i] = newValue * 1000
  }
}

const totalWeeklyYield = computed(() => pool.value['30dAPR'])

function onTokenInput(event, tokenIndex) {
  let result_value = event.target.value
  console.log(result_value)
  if (parseFloat(result_value) != 0) {
    result_value = parseFloat(event.target.value) * 1000
  }
  if (isNaN(parseFloat(result_value))) {
    result_value = 0
  }
  lineNumbers.value[tokenIndex] = result_value
}

const visibleDepositModal = ref(false)

function changeVisibleDepositOpen() {
  // let areBiggerThanZero = true

  let areBiggerThanZero = lineNumbers.value.some(function (ele) {
    return ele <= 0
  })

  if (areBiggerThanZero) {
    toast(Toast, {
      closeOnClick: true,
      theme: 'dark',
      type: 'warning',
      autoClose: 5000,
      closeButton: false,
      position: toast.POSITION.TOP_RIGHT,
      data: {
        header_text: 'Impossible to Deposit!',
        toast_text:
          'Please make sure that you have an input amount for every token!',
        tx_link: '',
        speedUp: '',
      },
    })
  } else {
    visibleDepositModal.value = true
  }
}

function changeVisibleDepositClose() {
  visibleDepositModal.value = false
}

function RemainingBalance(token, index) {
  let value1 = balances.value[token.address] * 1000
  let value2 = parseFloat(lineNumbers.value[index])
  let diff = (value1 - value2) / 1000
  return diff < 0 && diff > -1 ? 0 : diff.toFixed(4)
}

function onCurrencyInput(e) {
  let possibleAmount =
    (e.target.value /
      lastTokenPrices.value[tokens.value[leastBalanceIndex.value]]) *
    pool.value.tokens[leastBalanceIndex.value].weight
  lineNumbers.value[leastBalanceIndex.value] =
    parseFloat(
      balances.value[pool.value.tokens[leastBalanceIndex.value].address],
    ) >= possibleAmount
      ? possibleAmount * 1000
      : balances.value[pool.value.tokens[leastBalanceIndex.value].address] *
        1000
  lastDepositChanged.value = leastBalanceIndex.value
  OnOptimizeClick()
}
</script>
<style lang="scss" scoped>
.center_container {
  // background: #15151524;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  margin: 1% 12% 12% 12%;
  padding: 2.5%;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  @media (max-width: 768px) {
    margin: 0%;
  }
}

.caption-row {
  flex-direction: row;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: start;
    width: 90%;
  }
}

.big-chip {
  padding-left: 8px;
  padding-right: 10px;
  padding-top: 3px;
  padding-bottom: 3px;
  width: fit-content;
  display: flex;
  align-items: center;
  border-radius: 16px;
  // background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;

  backdrop-filter: blur(20.067087173461914px);

  &__image {
    width: 1.4vw;
    @media (max-width: 768px) {
      width: 15px;
    }
  }

  &__text {
    font-size: clamp(10px, 0.9vw, 14px);
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0em;
    font-family: 'Roboto Mono', monospace;

    &:nth-child(2) {
      margin-left: 4px;
      margin-right: 16px;
    }
  }

  &:not(:first-child) {
    margin-left: 12px;
  }
}

.currency_container {
  // background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;

  padding: 10px;
  border-radius: 16px;
  margin-top: 20px;
  margin-bottom: 20px;
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

.deposit_choose {
  padding: 10px;
  width: 40%;
  border-radius: 16px;
  // background: #00000024;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  @media (max-width: 768px) {
    width: 100%;
  }
}

.wallet_deposit {
  border-radius: 16px;
  font-size: clamp(10px, 0.8vw, 14px);
  height: fit-content;
  width: 250px;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  border: 1px solid #ffffff0d;
  @media (max-width: 768px) {
    width: 100%;
  }
}

.token-input {
  background-color: transparent;
  border: none;
  outline: none;
}

.deposit_network_text {
  font-size: 9px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  // color: #b6b6b6;
}

.deposit_text {
  font-size: clamp(11px, 0.8vw, 15px);
  // color: white;
}

.modal_stake_token {
  padding: 15px;
  border-radius: 16px;
  // background: #15151524;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
}

.modal_balance_slider {
  margin-top: 20px;
  // color: white;
  font-size: clamp(10px, 0.8vw, 14px);
  display: flex;
  justify-content: space-between;
}

.modal_stake_token_inner_name {
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 17px;
  // background: rgba(76, 76, 76, 0.14);
  // color: white;
  font-size: clamp(10px, 0.8vw, 14px);
  padding: 4px 12px;
}

.modal_total_container {
  border: 1px solid rgba(163, 164, 165, 0.2);
  border-radius: 15px;
  font-size: clamp(10px, 0.8vw, 14px);
}

.optimize {
  border: 1px solid #00e0ff;
  font-size: 10px;
  color: #00e0ff;
  padding: 4px 7px;
  border-radius: 16px;

  &:hover {
    background: #22222271;
    cursor: pointer;
  }
}

:deep(.multiselect__option) {
  background: #000000 !important;
  color: white !important;
  min-height: 5px !important;
  padding: 0px !important;
}

:deep(.multiselect__content-wrapper) {
  border-color: rgb(0 0 0) !important;
}

:deep(.multiselect__tags) {
  background: none !important;
  border-color: rgba(180, 1, 1, 0) !important;
  border-radius: 20px;
  padding: 0px 34px 0 8px !important;
  min-height: 10px;
}

.settings_popup {
  // width: 200px;
  border-radius: 16px;
  box-shadow: 0px 4px 8.9px 0px #02031cb5;

  z-index: 1000;
  display: flex;
  flex-direction: column;
  border: 0.5px solid #dceef60d;
  padding: 13px 8px;
  color: #fff;
  position: relative;
}

.zapper_button {
  width: 100%;
  cursor: pointer;
  margin-top: 5px;
  border-radius: 30px;

  font-size: 12px;
  font-weight: 600;
  line-height: 24px;
  color: #02031c;
  text-align: center;
  padding: 6px;
  background: #00e0ff;

  box-shadow: 0px 4px 6px -1px #0000000d;

  &:hover {
    filter: drop-shadow(0 0 0.7rem #00c9ff);
    background: #00e0ff;
  }
}
</style>
