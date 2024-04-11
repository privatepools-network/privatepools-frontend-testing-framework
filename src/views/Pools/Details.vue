<template>
  <MainCard v-if="poolsLoader === true">
    <div class="d-flex justify-content-center align-items-center" style="height: 80vh">
      <LoaderPulse></LoaderPulse>
    </div>
  </MainCard>

  <MainCard v-else-if="!visibleDepositComponent && !visibleWithdrawComponent">
    <CRow class="mb-3 mt-4" v-if="pool && pool.tokens">
      <div class="mb-3 text-black dark:!text-white text-[20px] font-bold">
        Weighted Pool
      </div>
      <div class="d-flex align-items-center" style="justify-content: space-between">
        <!-- <div class="caption" style="font-size:clamp(10px, 0.9vw, 16px); font-weight: 700">
          {{ pool?.tokens?.map((tokenEntity) => tokenEntity.symbol).join('/') }}
        </div> -->
        {{ console.log('pool.tokens', pool.tokens) }}
        <div class="caption-row">
          <div v-for="(poolToken, poolTokenIndex) in pool.tokens" :key="`pool-token-${poolTokenIndex}`"
            class="big-chip dark:!bg-[#151515] bg-white">
            <CAvatar :src="getTokenEntity(poolToken.symbol, 'short').icon" class="big-chip__image" />
            <div class="big-chip__text text-black dark:!text-white">{{ poolToken.symbol }}</div>
            <div class="big-chip__text text-[#626262] dark:!text-white">{{ poolToken.weight }}%</div>
          </div>
          <div class="d-flex align-items-center gap-1 ml-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M13.9398 4.33428C13.197 4.60938 12.6132 5.23179 12.3552 6.02367L11.8737 7.50099C11.8668 7.52352 11.8471 7.53869 11.8249 7.53869C11.8027 7.53869 11.783 7.52352 11.7761 7.50099L11.2947 6.02367C11.0366 5.23175 10.4527 4.60932 9.70982 4.33428L8.32416 3.82111C8.30349 3.81345 8.2896 3.79268 8.2896 3.76935C8.2896 3.74602 8.30349 3.72525 8.32416 3.71759L9.70982 3.20442C10.4527 2.92938 11.0366 2.30695 11.2947 1.51503L11.7761 0.0376909C11.783 0.0152013 11.8027 0 11.8249 0C11.8471 0 11.8668 0.0152013 11.8737 0.0376909L12.3552 1.51503C12.6132 2.30691 13.197 2.92932 13.9398 3.20442L15.3255 3.71759C15.3461 3.72525 15.36 3.74602 15.36 3.76935C15.36 3.79268 15.3461 3.81345 15.3255 3.82111L13.9398 4.33428ZM7.84723 8.94374C6.81562 9.32589 6.00481 10.1903 5.64649 11.2902L4.97759 13.342C4.96777 13.3729 4.94057 13.3937 4.90997 13.3937C4.87937 13.3937 4.85217 13.3729 4.84235 13.342L4.17345 11.2902C3.81514 10.1903 3.00433 9.32589 1.97272 8.94374L0.0479334 8.23104C0.0192337 8.22035 0 8.19155 0 8.1591C0 8.12672 0.0192337 8.09792 0.0479334 8.08723L1.97272 7.37453C3.00434 6.99238 3.81514 6.12794 4.17345 5.02812L4.84235 2.97626C4.85217 2.94536 4.87937 2.92458 4.90997 2.92458C4.94057 2.92458 4.96777 2.94536 4.97759 2.97626L5.64649 5.02812C6.00481 6.12794 6.81562 6.99238 7.84723 7.37453L9.77203 8.08723C9.8007 8.09792 9.81997 8.12672 9.81997 8.1591C9.81997 8.19155 9.8007 8.22035 9.77203 8.23104L7.84723 8.94374ZM11.7776 14.1467C11.984 13.5132 12.4509 13.0153 13.0451 12.7951L14.1542 12.3846C14.1707 12.3785 14.1818 12.3619 14.1818 12.3432C14.1818 12.3245 14.1707 12.3079 14.1542 12.3018L13.0451 11.8913C12.4509 11.6711 11.984 11.1732 11.7776 10.5397L11.3923 9.35789C11.3872 9.3392 11.3711 9.3264 11.3529 9.3264C11.3347 9.3264 11.3186 9.3392 11.3135 9.35789L10.9292 10.5397C10.7226 11.1734 10.2552 11.6714 9.66067 11.8913L8.55258 12.3018C8.53606 12.3079 8.52493 12.3245 8.52493 12.3432C8.52493 12.3619 8.53606 12.3785 8.55258 12.3846L9.66067 12.7951C10.2552 13.015 10.7226 13.513 10.9292 14.1467L11.3135 15.3286C11.3186 15.3472 11.3347 15.36 11.3529 15.36C11.3711 15.36 11.3872 15.3472 11.3923 15.3286L11.7776 14.1467Z"
                fill="url(#paint0_linear_25_3105)" />
              <defs>
                <linearGradient id="paint0_linear_25_3105" x1="15.36" y1="-7.68" x2="1.74547" y2="10.1236"
                  gradientUnits="userSpaceOnUse">
                  <stop stop-color="#2775CA" />
                  <stop offset="1" stop-color="#00e0ff" />
                </linearGradient>
              </defs>
            </svg>
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.026 7.54902C10.0861 7.5099 10.1535 7.48318 10.2241 7.47042C10.2946 7.45767 10.3671 7.45915 10.4371 7.47477L16.4743 8.78202C16.6157 8.81273 16.7391 8.89831 16.8175 9.01995C16.8958 9.14159 16.9227 9.28936 16.8921 9.43079L15.5849 15.468C15.5501 15.6051 15.4634 15.7234 15.3431 15.7979C15.2229 15.8724 15.0784 15.8973 14.9401 15.8673C14.8019 15.8374 14.6806 15.755 14.6019 15.6374C14.5232 15.5198 14.4933 15.3763 14.5183 15.2371L15.7101 9.73313L10.2061 8.54134C10.0648 8.51064 9.94133 8.42506 9.86299 8.30342C9.78465 8.18177 9.7578 8.03401 9.78833 7.89258C9.80307 7.82238 9.83169 7.75582 9.8725 7.69683C9.91331 7.63783 9.9655 7.58758 10.026 7.54902Z"
                fill="#4E4E4E" />
              <path
                d="M7.49468 14.3746L16.0632 8.85626C16.185 8.77786 16.3329 8.75103 16.4744 8.78167C16.6159 8.81232 16.7395 8.89793 16.8179 9.01967C16.8963 9.14141 16.9231 9.28931 16.8925 9.43084C16.8618 9.57236 16.7762 9.69592 16.6545 9.77432L8.08593 15.2926C7.96419 15.371 7.81629 15.3979 7.67476 15.3672C7.53324 15.3366 7.40968 15.251 7.33128 15.1292C7.25287 15.0075 7.22604 14.8596 7.25669 14.718C7.28733 14.5765 7.37294 14.453 7.49468 14.3746Z"
                fill="#4E4E4E" />
            </svg>
          </div>
        </div>
        <!-- <CurrencySelector @updateCurrency="(newCurrency) => (currencySelected = newCurrency)" /> -->
      </div>
      <div class="d-flex justify-content-between align-items-center mt-3">
        <div>
          <Tabs :filterEye="false" :selectedTab="selectedOverallTab" :tabsOptions="['Overall view', 'My view']"
            @changeTab="changeSelectedOverallTab" />
        </div>
        <div class="rewards_button dark:!bg-[#22222224] !bg-[white]">Rewards</div>
      </div>
    </CRow>
    <div style="height: 34px" class="mb-5" v-else>
      <ThreeDots style="margin-left: 20px; margin-top: 10px"></ThreeDots>
    </div>


    <CRow class="mb-5" v-if="render">
      <PoolsDetailsChart :selectedOverallTab="selectedOverallTab" :changeToDepositView="changeToDepositView"
        :changeToWithdrawView="changeToWithdrawView" :poolTokenPrices="tokenPrices" :tokenPrices="historicalPrices"
        :pool="pool" :swapsData="poolSwapsData" :chainSelected="chainSelected.chain" :all_chart_data="chartData"
        :historical_tvl="historical_tvl" :symbol="currencySymbol" :currencySelected="currencySelected"
        :userBalance="balance" />
    </CRow>

    <div style="display: inline-block; margin-bottom: 24px">
      <Tabs :filterEye="true" :selectedTab="selectedTab" :tabsOptions="[
    'Pool Info',
    'Financial Statement',
    'Statistics',
    // 'Pairs & Tokens',
  ]" @changeTab="changeSelectedTab" />
    </div>
    <div style="display: flex; flex-direction: column" v-if="selectedTab == 'Pool Info'">
      <!--      <div class="mb-2" style="-->
      <!--        font-family: Poppins;-->
      <!--        color: white;-->

      <!--        font-size: clamp(10px, 0.9vw, 16px);-->
      <!--        font-weight: 700;-->
      <!--        line-height: 28px;-->
      <!--        letter-spacing: 0em;-->
      <!--      ">-->
      <!--        Pool Statistics-->
      <!--      </div>-->
      <div class="d-flex align-items-center gap-1">
        <Title :title="'Pool Statistics'"> </Title>
        <VTooltip :distance="0" :placement="'right'">
          <div style="cursor: help">
            <img :src="info" class="info_icon" />
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
                width: 400px;
              ">
              <div style="font-size: clamp(10px, 0.9vw, 16px)">Information</div>
              <div style="
                  display: flex;
                  flex-direction: column;
                  font-size: clamp(10px, 0.8vw, 14px);
                ">
                <div>
                  <b>Creation Date:</b> Indicates when the pool was established.
                </div>
                <div><b>24h Volume:</b> Peak and lowest trading volumes.</div>
                <div>
                  <b>Lifetime Stats:</b> Comprehensive historical data of the
                  pool.
                </div>
                <div>
                  <b>Number of Investors:</b> Total count of investors in the
                  pool.
                </div>
                <div>
                  <b>LP Symbol:</b> The liquidity pool's unique symbol
                  identifier.
                </div>
                <div>
                  <b>Contract Address:</b> Blockchain addresses linked to the
                  pool.
                </div>
              </div>
            </div>
          </template>
        </VTooltip>
      </div>

      <div class="d-flex">
        <div class="pool-section dark:!bg-[#22222224] !bg-[white]" v-if="pool && poolActivity" style="width: 70%">
          <div class="subsection">
            <div class="subsection__item dark:!bg-[#22222224] !bg-[white]">
              <div class="subsection__item__caption">Pool Creation</div>
              <div class="subsection__item__content">
                <div class="subsection__item__content__left text-[black] dark:!text-white">
                  Created
                </div>
                <div class="subsection__item__content__right text-[black] dark:!text-white">
                  <div class="subsection__item__content__right__top single">
                    {{ pool.createdAt }}
                  </div>
                  <div class="subsection__item__content__right__bottom">
                    {{ pool.timeAgo }}
                  </div>
                </div>
              </div>
            </div>
            <div class="subsection__item dark:!bg-[#22222224] !bg-[white]">
              <div class="subsection__item__caption">24h profit</div>
              <div class="subsection__item__content">
                <div class="subsection__item__content__left text-[black] dark:!text-white">All-time high</div>
                <div class="subsection__item__content__right text-[black] dark:!text-white">
                  <div class="subsection__item__content__right__top paired">
                    <div class="amount">
                      <CurrencySymbol :symbol="currencySymbol" />{{
    formatBigNumber(profitInfo.highest)
  }}
                    </div>
                    <!-- <div :class="`percentage-chip ${profitInfo.highestPercent > 0 ? '--positive' : ''
                      }`">
                      {{ formatBigNumber(profitInfo.highestPercent) }}%
                    </div> -->
                  </div>
                  <div class="subsection__item__content__right__bottom --bright">
                    {{ profitInfo.highestTime }} ({{
    profitInfo.highestTimeAgo
  }})
                  </div>
                </div>
              </div>
              <div class="subsection__item__content">
                <div class="subsection__item__content__left text-[black] dark:!text-white">All-time low</div>
                <div class="subsection__item__content__right text-[black] dark:!text-white">
                  <div class="subsection__item__content__right__top paired">
                    <div class="amount">
                      <CurrencySymbol :symbol="currencySymbol" />{{
    formatBigNumber(profitInfo.lowest)
  }}
                    </div>
                    <!-- <div :class="`percentage-chip ${profitInfo.lowestPercent > 0 ? '--positive' : ''
                      }`">
                      {{ formatBigNumber(profitInfo.lowestPercent) }}%
                    </div> -->
                  </div>
                  <div class="subsection__item__content__right__bottom --bright">
                    {{ profitInfo.lowestTime }} ({{ profitInfo.lowestTimeAgo }})
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="subsection">
            <div class="subsection__item dark:!bg-[#22222224] !bg-[white]">
              <div class="subsection__item__caption">Lifetime stats</div>
              <div class="subsection__item__content">
                <div class="subsection__item__content__left text-[black] dark:!text-white">Volume</div>
                <div class="subsection__item__content__right text-[black] dark:!text-white">
                  <div class="subsection__item__content__right__top single">
                    <CurrencySymbol :symbol="currencySymbol" />{{
    formatBigNumber(poolVolume, currencyDecimals)
  }}
                  </div>
                </div>
              </div>
              <div class="subsection__item__content">
                <div class="subsection__item__content__left text-[black] dark:!text-white">Fees</div>
                <div class="subsection__item__content__right text-[black] dark:!text-white">
                  <div class="subsection__item__content__right__top single">
                    <CurrencySymbol :symbol="currencySymbol" />{{
    formatBigNumber(poolFees, currencyDecimals)
  }}
                  </div>
                </div>
              </div>
              <div class="subsection__item__content">
                <div class="subsection__item__content__left text-[black] dark:!text-white">Trades</div>
                <div class="subsection__item__content__right text-[black] dark:!text-white">
                  <div class="subsection__item__content__right__top single">
                    {{ poolTrades }}
                  </div>
                </div>
              </div>
            </div>
            <div class="investors-number dark:!bg-[#22222224] !bg-[white]">
              <div class="investors-number__text text-[black] dark:!text-white" style="padding-right: 20%; white-space: nowrap">
                LP Symbol
              </div>
              <div class="investors-number__text text-[black] dark:!text-white">
                <div style="font-size: clamp(10px, 0.8vw, 14px); font-weight: 700">
                  {{
    pool?.tokens
      ?.map((tokenEntity) => tokenEntity.symbol)
      .join(' / ')
  }}
                </div>
              </div>
            </div>
            <div class="investors-number dark:!bg-[#22222224] !bg-[white]">
              <div class="investors-number__text text-[black] dark:!text-white">Number of investors</div>
              <div class="investors-number__text text-[black] dark:!text-white" style="font-size: clamp(10px, 0.8vw, 14px)">
                {{ pool.holdersCount }}
              </div>
            </div>
          </div>

          <div class="subsection">
            <div class="investors-number dark:!bg-[#22222224] !bg-[white]">
              <div class="investors-number__text text-[black] dark:!text-white">Factory Contract</div>
              <div class="investors-number__text text-[black] dark:!text-white">
                <div class="d-flex align-items-center gap-1" style="color: #0082a5">
                  <div>
                    {{
    pool?.factory?.substring(0, 6) +
    '....' +
    pool?.factory?.substring(pool?.factory?.length - 4)
  }}
                  </div>
                  <a target="_blank" :href="`${configService.getNetworkConfig(networkId).explorer
    }/address/${pool.factory}`">
                    <img :src="link" />
                  </a>
                </div>
              </div>
            </div>

            <div class="investors-number dark:!bg-[#22222224] !bg-[white]">
              <div class="investors-number__text text-[black] dark:!text-white">Pool Contract</div>
              <div class="investors-number__text text-[black] dark:!text-white">
                <div class="d-flex align-items-center gap-1" style="color: #0082a5">
                  <div>
                    {{
    pool?.id?.substring(0, 6) +
    '....' +
    pool?.id?.substring(pool?.id?.length - 4)
  }}
                  </div>
                  <a target="_blank" :href="scannerLink">
                    <img :src="link" />
                  </a>
                </div>
              </div>
            </div>

            <div class="investors-number dark:!bg-[#22222224] !bg-[white]">
              <div class="investors-number__text text-[black] dark:!text-white">Vault</div>
              <div class="investors-number__text text-[black] dark:!text-white">
                <div class="d-flex align-items-center gap-1" style="color: #0082a5">
                  <div>
                    {{
    configService
      .getNetworkConfig(networkId)
      .addresses.vault.substring(0, 6) +
    '....' +
    configService
      .getNetworkConfig(networkId)
      .addresses.vault.substring(
        configService.getNetworkConfig(networkId).addresses
          .vault.length - 4,
      )
  }}
                  </div>
                  <a target="_blank" :href="`${configService.getNetworkConfig(networkId).explorer
    }/address/${configService.getNetworkConfig(networkId).addresses.vault
    }`">
                    <img :src="link" />
                  </a>
                </div>
              </div>
            </div>

            <div class="investors-number dark:!bg-[#22222224] !bg-[white]">
              <div class="investors-number__text text-[black] dark:!text-white">Pool Owner</div>
              <div class="investors-number__text text-[black] dark:!text-white">
                <div class="d-flex align-items-center gap-1" style="color: #0082a5">
                  <div>
                    {{
    pool?.owner?.substring(0, 6) +
    '....' +
    pool?.owner?.substring(pool?.owner?.length - 4)
  }}
                  </div>
                  <a target="_blank" :href="`${configService.getNetworkConfig(networkId).explorer
    }/address/${pool.owner}`">
                    <img :src="link" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pool-section dark:!bg-[#22222224] !bg-[white]" v-else style="height: 330px; width: 70%">
          <LoaderPulse></LoaderPulse>
        </div>

        <div class="diagram-section dark:!bg-[#22222224] !bg-[white]" style="width: 28%" v-if="pool &&
    pool.tokens &&
    tokenPrices &&
    tokenWeights.length > 0 &&
    pool.id == router.currentRoute.value.params['id']
    ">
          <div class="d-flex align-items-center justify-content-between dark:!bg-[#22222224] !bg-[white]" style="
             
              padding: 8px;
              border-radius: 20px 20px 0px 0px;
            ">
            <div class="d-flex align-items-center gap-2">
              <div class="d-flex gap-2 text-[black] dark:!text-white">
                <div style="
                    font-weight: 500;
                    font-size: clamp(10px, 0.8vw, 14px);
                  ">
                  Assets Breakdown
                </div>
              </div>
            </div>
            <VTooltip :distance="0" :placement="'right'">
              <div style="cursor: help">
                <svg class="info_icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C13 7.71667
        12.904 7.479 12.712 7.287C12.52 7.095 12.2827 6.99933 12 7C11.7167 7 11.479 7.096 11.287 7.288C11.095 7.48
        10.9993 7.71733 11 8C11 8.28333 11.096 8.521 11.288 8.713C11.48 8.905 11.7173 9.00067 12 9ZM12 22C10.6167 22
        9.31667 21.7373 8.1 21.212C6.88333 20.6867 5.825 19.9743 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788
        15.9C2.26333 14.6833 2.00067 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31333 6.88333 4.02567 5.825
        4.925 4.925C5.825 4.025 6.88333 3.31267 8.1 2.788C9.31667 2.26333 10.6167 2.00067 12 2C13.3833 2 14.6833 2.26267
        15.9 2.788C17.1167 3.31333 18.175 4.02567 19.075 4.925C19.975 5.825 20.6877 6.88333 21.213 8.1C21.7383 9.31667
        22.0007 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6867 17.1167 19.9743 18.175 19.075 19.075C18.175
        19.975 17.1167 20.6877 15.9 21.213C14.6833 21.7383 13.3833 22.0007 12 22ZM12 20C14.2333 20 16.125 19.225 17.675
        17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4
        7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20
        12 20Z" class="dark:!fill-white fill-black"/>
                </svg>
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
                    width: 400px;
                  ">
                  <h6>Information</h6>
                  <div style="
                      display: flex;
                      flex-direction: column;
                      font-size: 13px;
                    ">
                    <div>
                      This pie chart illustrates the percentage breakdown of
                      assets within this pool. It provides a visual
                      representation of how different assets contribute to the
                      pool's overall composition.
                    </div>
                  </div>
                </div>
              </template>
            </VTooltip>
          </div>
          <div class="diagram-container dark:!bg-[#22222224] !bg-[white]">
            <apexchart :options="dynamicDonut" :series="dynamicDonut['series']" :height="270" :width="375" />
          </div>
        </div>
        <div class="diagram-section dark:!bg-[#22222224] !bg-[white]" v-else style="width: 28%; height: 330px">
          <LoaderPulse></LoaderPulse>
        </div>
      </div>

      <div class="mb-2" style="
          font-family: Poppins;
          color: white;
          margin-top: 40px;

          font-size: clamp(10px, 0.9vw, 16px);
          font-weight: 700;
          line-height: 28px;
          letter-spacing: 0em;
        ">
        Pool Analytics
      </div>
      <CRow id="pool-stats-row">
        <PoolsDetailsDiagrams v-if="assetsPerformance && poolTradesData && poolProfitsData"
          :tradesData="poolTradesData.tradesData" :tradesTimestamps="poolTradesData.tradesTimestamps"
          :profitsData="poolProfitsData.profitsData" :profitsTimestamps="poolProfitsData.profitsTimestamps"
          :symbol="currencySymbol" :decimals="currencyDecimals"
          :assetsPerformanceData="assetsPerformance.assetsPerformanceData" :assetsPerformanceTimestamps="assetsPerformance.assetsPerformanceTimestamps
    " :tokens="pool.tokens" />
        <div class="pool-section dark:!bg-[#22222224] !bg-[white]" v-else style="height: 330px; width: 70%">
          <LoaderPulse></LoaderPulse>
        </div>
      </CRow>
      <Title :title="'Pool Activity'"></Title>
      <PrivatePoolsTable :clActivity="clActivity" :wpActivity="joinExits" />
    </div>
    <PoolDetailsFinancialStatement v-else-if="selectedTab == 'Financial Statement' && pool"
      :poolSwapsData="poolSwapsData" :chainSelected="chainSelected" :historical_tvl="historical_tvl"
      :historicalPrices="historicalPrices" :poolId="poolId" :symbol="currencySymbol" :decimals="currencyDecimals">
    </PoolDetailsFinancialStatement>
    <PoolDetailsStatistics v-else-if="selectedTab == 'Statistics' && pool" :historical_tvl="historical_tvl" :tokensData="pool.tokens.map((t) => ({ ...t, Blockchain: chainSelected.name }))
    " :poolSwapsData="poolSwapsData" :chainSelected="chainSelected" :chartData="chartData"
      :historicalPrices="historicalPrices" :pool="pool" :tokenPairs="chainPairs" :symbol="currencySymbol"
      :decimals="currencyDecimals">
    </PoolDetailsStatistics>
    <!-- <div v-else-if="selectedTab === 'Pairs & Tokens'">
      <PoolDetailsTable :symbol="currencySymbol" :currencyDecimals="currencyDecimals" :currency="currency"
        :allTokensTableData="allTokensTableData" :allPairsTableData="allPairsTableData"
        :chainSelected="chainSelected" />
    </div> -->


    {{ console.log('pool!!!', pool) }}
  </MainCard>

</template>

<script setup>
import { ref, computed, onMounted, watch, defineAsyncComponent, watchEffect } from 'vue'
import { getTokenEntity } from '@/lib/helpers/util'
import PoolsDetailsChart from '@/components/PoolsDetails/PoolsDetailsChart.vue'
import {
  TitleComponent,
  LegendComponent,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  MarkPointComponent,
} from 'echarts/components'
import { BarChart, CandlestickChart, LineChart } from 'echarts/charts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import router from '@/router'
import { GetPoolActivity } from '@/composables/pools/usePoolActivity'
import { FormatPoolActivity } from '@/lib/formatter/poolActivityFormatter'
import { GetSinglePool } from '@/composables/pools/usePool.js'
import { GetPoolTokenPrices } from '@/composables/useTokenPrices'
import { GetPoolSwapsData } from '@/composables/pools/charts/usePoolSwapsData'
import { GetPoolHistoricValues } from '@/composables/pools/charts/usePoolHistoricValues'
import { formatBigNumber } from '@/lib/utils/index'
import { GetPool24hProfit } from '@/composables/pools/usePoolSwapsStats'
import { configService } from '@/services/config/config.service'
import { Network, networkId } from '@/composables/useNetwork'
import MainCard from '@/UI/MainCard.vue'
import Title from '@/UI/Title.vue'
import { useStore } from 'vuex'
import link from '@/assets/icons/link.svg'
import Table from '@/UI/Table'
import Tabs from '@/UI/Tabs'
import LoaderPulse from '@/components/loaders/LoaderPulse'
import Pagination from '@/components/Pool/Pagination.vue'
import PoolDetailsStatistics from '@/components/PoolsDetails/PoolDetailsStatistics'
import PoolDetailsFinancialStatement from '@/components/PoolsDetails/PoolDetailsFinancialStatement'
import arb from '@/assets/images/networks/arbitrum2.png'
import binance from '@/assets/icons/networks/binance.svg'
import polygon from '@/assets/images/networks/polygon.png'
import { GetHistoricalTvl } from '@/composables/pools/snapshots/usePoolHistoricalTvl'
import { addEmptyDays } from '@/lib/formatter/chart/chartFormatter'
import { FormatHistoricalTvl } from '@/lib/formatter/poolTvlFormatter'
import { FormatPoolBalances } from '@/lib/formatter/poolBalancesFormatter'
import { FormatTrackingInfoChartWTokens } from '@/lib/formatter/trackingInfoChartFormatter'
import { GetHistoricalTokenPrices } from '@/composables/balances/useHistoricalTokenPrices'
import { stringToColor, formatSimpleTimestamp } from '@/lib/utils/index'
import ThreeDots from '@/components/loaders/ThreeDots'
import { GetPoolHistoricalBalances } from '@/composables/pools/usePoolHistoricalBalances'
import { UseDiagramsData } from '@/composables/pools/charts/diagrams/useDiagramsData'
import { getTokensPricesForTimestamp } from '@/lib/formatter/financialStatement/financialStatementFormatter'
import { GetTokenPricesBySymbols } from '@/composables/balances/cryptocompare'
import {
  GetTokenPairs,
  updateTokenPrices,
} from '@/composables/pools/useTokenPairs'
import { DisplayNetwork } from '@/composables/useNetwork'
import { InitializeMetamask } from '@/lib/utils/metamask'
import PoolDetailsTable from '@/components/PoolsDetails/PoolDetailsTable.vue'
import { convertSwapsCurrency } from '@/composables/pools/usePoolSwapsStats'
import { CalculateJoinExitPrice } from '@/lib/formatter/financialStatement/financialStatementFormatter'
import CurrencySymbol from '@/components/TrackInfo/CurrencySymbol.vue'
import info from '@/assets/images/info.svg'
import { FormatAllTokensData } from '@/lib/formatter/trackTokensFormatter'
import { FormatAllPairsData } from '@/lib/formatter/trackPairsFormatter'
import { setPoolsTvls } from '@/composables/pools/usePools'
import { GetPoolShares } from "@/composables/pools/usePoolShares"
const store = useStore()
const trackCurrentNetwork = computed(() => {
  return store.getters.getCurrentNetwork
})
use([
  CanvasRenderer,
  CandlestickChart,
  TitleComponent,
  LineChart,
  BarChart,
  LegendComponent,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  MarkPointComponent,
])


const PoolsDetailsDiagrams = defineAsyncComponent(() =>
  import('@/components/PoolsDetailsDiagrams/index.vue'),
)


const clActivity = ref([
  {
    Actions: 'Swap',
    Details: [
      {
        action: 'Swap',
        ETH: '-0.00',
        USDT: '0.00',
      },
    ],
    Value: '0',
    Time: '1 month ago',
    Tx: '0x049538159d5f10f741626caaf6cef43a0c58f396286d96fa727116da20bdad5d',
    timestamp: '1708532754',
    chainId: 56,
    chain: 'Binance',
  },
  {
    Actions: 'Swap',
    Details: [
      {
        action: 'Swap',
        BTCB: '0.00',
        WBNB: '-0.02',
      },
    ],
    Value: '0',
    Time: '9 days ago',
    Tx: '0x085edbdad9c6d433d4cd3d006c088ada94f2994dd6a07cb0131827168833cd4e',
    timestamp: '1711363947',
    chainId: 56,
    chain: 'Binance',
  },
])
const joinExits = ref([
  {
    user: {
      id: '0x4bde150b69408dafbe4833f0d7b9689246a6597b',
    },
    amounts: [
      '13.465999999999999304',
      '0.001',
      '0.001',
      '0',
      '0.001',
      '0',
      '0.001',
      '0.001',
    ],
    pool: {
      tokens: [
        {
          symbol: 'Cake',
        },
        {
          symbol: 'AVAX',
        },
        {
          symbol: 'XRP',
        },
        {
          symbol: 'ETH',
        },
        {
          symbol: 'ADA',
        },
        {
          symbol: 'DOT',
        },
        {
          symbol: 'INJ',
        },
        {
          symbol: 'WBNB',
        },
      ],
    },
    valueUSD: '0',
    type: 'Join',
    timestamp: 1702503184,
    chain: 'Binance',
    chainId: 56,
  },
  {
    user: {
      id: '0x4bde150b69408dafbe4833f0d7b9689246a6597b',
    },
    amounts: [
      '7.554760289442242907',
      '3.770726094964460187',
      '0.006792699854304051',
      '1.176872358543111302',
    ],
    pool: {
      tokens: [
        {
          symbol: 'AVAX',
        },
        {
          symbol: 'SOL',
        },
        {
          symbol: 'BTCB',
        },
        {
          symbol: 'WBNB',
        },
      ],
    },
    valueUSD: '1137.184818600137953607662435191093',
    type: 'Exit',
    timestamp: 1702639931,
    chain: 'Binance',
    chainId: 56,
  },
  {
    user: {
      id: '0x4bde150b69408dafbe4833f0d7b9689246a6597b',
    },
    amounts: ['0.307402', '0.158687', '0.000289', '0.04967'],
    pool: {
      tokens: [
        {
          symbol: 'AVAX',
        },
        {
          symbol: 'SOL',
        },
        {
          symbol: 'BTCB',
        },
        {
          symbol: 'WBNB',
        },
      ],
    },
    valueUSD: '47.93505265238665018797586063640085',
    type: 'Exit',
    timestamp: 1702646626,
    chain: 'Binance',
    chainId: 56,
  },
  {
    user: {
      id: '0x4bde150b69408dafbe4833f0d7b9689246a6597b',
    },
    amounts: ['3.096000000000000085', '0', '0', '0'],
    pool: {
      tokens: [
        {
          symbol: 'AVAX',
        },
        {
          symbol: 'SOL',
        },
        {
          symbol: 'BTCB',
        },
        {
          symbol: 'WBNB',
        },
      ],
    },
    valueUSD: '41.84800387934665651679103821900545',
    type: 'Join',
    timestamp: 1702638092,
    chain: 'Binance',
    chainId: 56,
  },
  {
    user: {
      id: '0x4bde150b69408dafbe4833f0d7b9689246a6597b',
    },
    amounts: ['0.19', '1.8', '0.0003', '0.5'],
    pool: {
      tokens: [
        {
          symbol: 'SOL',
        },
        {
          symbol: 'DOT',
        },
        {
          symbol: 'BTCB',
        },
        {
          symbol: 'INJ',
        },
      ],
    },
    valueUSD: '0',
    type: 'Join',
    timestamp: 1702469234,
    chain: 'Binance',
    chainId: 56,
  },
  {
    user: {
      id: '0xdd2ee0c16f58dc53ebec021dae05cecf8051373f',
    },
    amounts: ['0.2', '3', '0.3', '0.005'],
    pool: {
      tokens: [
        {
          symbol: 'AVAX',
        },
        {
          symbol: 'USDT',
        },
        {
          symbol: 'SOL',
        },
        {
          symbol: 'WBNB',
        },
      ],
    },
    valueUSD: '3',
    type: 'Join',
    timestamp: 1702602127,
    chain: 'Binance',
    chainId: 56,
  },
  {
    user: {
      id: '0x4bde150b69408dafbe4833f0d7b9689246a6597b',
    },
    amounts: ['0.239010698854900089', '0.000005451740851665'],
    pool: {
      tokens: [
        {
          symbol: 'USDT',
        },
        {
          symbol: 'BTCB',
        },
      ],
    },
    valueUSD: '0.4730702492177080825503071512930907',
    type: 'Exit',
    timestamp: 1702647027,
    chain: 'Binance',
    chainId: 56,
  },
])

const selectedOverallTab = ref('My view')

function changeSelectedOverallTab(_new) {
  selectedOverallTab.value = _new
}
const render = ref(true)

// Checks when the cart changes from the store
watchEffect(() => {
  if (selectedOverallTab.value) {
    render.value = true
  } else {
    render.value = false
  }
})

const currencySelected = ref({ symbol: '$', code: 'USD' })
const currency = computed(() => currencySelected.value.code)
const currencySymbol = computed(() => currencySelected.value.symbol)
const currencyDecimals = computed(() =>
  currencySelected.value.code == 'USD' ? 2 : 5,
)

const currency_prices = ref(null)
const poolId = router.currentRoute.value.params['id']
const chainSelected = computed(() => {
  const chainSelectedCode = router.currentRoute.value.params['chainSelected']
  let _chainSelected
  if (chainSelectedCode == 'ETH') {
    _chainSelected = {
      name: 'Arbitrum',
      code: 'ETH',
      img: arb,
      chain: Network.ARBITRUM,
    }
  } else if (chainSelectedCode == 'BNB') {
    _chainSelected = {
      name: 'Binance',
      code: 'BNB',
      img: binance,
      chain: Network.BINANCE,
    }
  } else if (chainSelectedCode == 'MATIC') {
    _chainSelected = {
      name: 'Polygon',
      code: 'MATIC',
      img: polygon,
      chain: Network.POLYGON,
    }
  }
  return _chainSelected
})

const pool = ref(null)
const chartData = ref([])
const historicalPrices = ref([])
const historicSharesData = ref([])
const historicalData = ref([])
const poolActivity = ref(null)
const tokenPrices = ref(null)
const historical_tvl = ref([])

const poolFees = computed(() =>
  poolSwapsData.value
    ? poolSwapsData.value.reduce(
      (sum, value) => sum + parseFloat(value.gasFeeUsd),
      0,
    )
    : 0,
)
const poolVolume = computed(() =>
  poolSwapsData.value
    ? poolSwapsData.value.reduce(
      (sum, value) => sum + parseFloat(value.volumeUsd),
      0,
    )
    : 0,
)
const poolTrades = computed(() =>
  poolSwapsData.value ? poolSwapsData.value.length : 0,
)

const scannerLink = computed(() => {
  return trackCurrentNetwork.value.name === 'arbitrum'
    ? `${process.env.VUE_APP_EXPLORER_ARBITRUM
    }/address/${pool.value?.id?.substring(0, 42)}`
    : trackCurrentNetwork.value.name === 'bnb'
      ? `${process.env.VUE_APP_EXPLORER_BINANCE
      }/address/${pool.value?.id?.substring(0, 42)}`
      : trackCurrentNetwork.value.name === 'matic'
        ? `${process.env.VUE_APP_EXPLORER_POLYGON
        }/address/${pool.value?.id?.substring(0, 42)}`
        : process.env.VUE_APP_EXPLORER_ARBITRUM
})

const current_pool_token_prices = ref({})

onMounted(async () => {
  pool.value = await GetSinglePool(
    chainSelected.value.chain,
    poolId,
    currency.value,
  )
  console.log(pool.value)
  await SetNetworkData()
  console.log('done 2')
})
const unformattedPoolActivity = ref(null)
watch(unformattedPoolActivity, async () => {
  if (unformattedPoolActivity.value) {
    await SetAdditionalData(unformattedPoolActivity.value)
  }
})
watch(currency, async () => {
  unformattedPoolActivity.value = null
  chartData.value = []
  poolSwapsData.value = []
  historicalPrices.value = []
  historicSharesData.value = []
  historicalData.value = []
  poolActivity.value = null
  tokenPrices.value = null
  historical_tvl.value = []
  pool.value = (await setPoolsTvls([pool.value], currency.value))[0]
  await SetNetworkData()
})

const chainPairs = ref([])
const allTokensTableData = ref([])
const allPairsTableData = ref([])
async function SetNetworkData() {
  const network = chainSelected.value.chain
  let [
    _poolSwapsData,
    _poolHistoricalData,
    _historical_tvl,
    _poolActivity,
    _historicalBalances,
    _tokenPairs,
  ] = await InitPoolsInfo(poolId)
  console.log('done 1')
  historicalPrices.value = await GetHistoricalTokenPrices(
    Array.from(new Set([...pool.value.tokens.map((t) => t.symbol)])),
    true,
    500,
    currency.value,
  )
  if (!currency_prices.value)
    currency_prices.value = await GetTokenPricesBySymbols(['BTC', 'ETH'])
  _poolSwapsData = convertSwapsCurrency(
    _poolSwapsData,
    currency_prices.value,
    currency.value,
  )
  let token_symbols = pool.value.tokens.map((t) => t.symbol)
  let token_prices = getTokensPricesForTimestamp(
    token_symbols,
    historicalPrices.value,
    new Date().getTime() / 1000,
  )
  // update prices to the api solution
  updateTokenPrices([_tokenPairs], [network], token_prices)
  chainPairs.value = _tokenPairs.tokenPairs
    .filter((t) => {
      let [token0, token1] = t.id.split('-')
      let addresses = pool.value.tokens.map((_t) => _t.address)
      if (addresses.includes(token0) && addresses.includes(token1)) return true
      return false
    })
    .map((t) => ({
      ...t,
      Blockchain: DisplayNetwork[chainSelected.value.chain],
    }))
  let notFlattedTokensData = _tokenPairs.tokens
    .flat()
    .map((t) => ({ ...t, Blockchain: chainSelected.value.name }))
  poolSwapsData.value = _poolSwapsData
  historicalData.value = _poolHistoricalData
  historicSharesData.value = _poolHistoricalData
  let allPairsData = FormatAllPairsData(
    _tokenPairs,
    [..._poolSwapsData],
    network,
    currencyDecimals.value,
  )
  let allTokensData = FormatAllTokensData(
    notFlattedTokensData,
    [..._poolSwapsData],
    network,
    currencyDecimals.value,
  )
  allTokensTableData.value = allTokensData.filter(
    (item) => item['Volume All Time'] > 0,
  )
  allPairsTableData.value = allPairsData.filter(
    (item) => item['Volume All Time'] > 0,
  )
  let formatted_tokens_snapshots = FormatPoolBalances(_historicalBalances)
  let chart_data = FormatTrackingInfoChartWTokens(
    _poolSwapsData,
    network,
    pool.value.tokens,
  )
  chart_data.sort((a, b) => a.timestamp - b.timestamp)
  historical_tvl.value = _historical_tvl
  let formatted_tvl = FormatHistoricalTvl(_historical_tvl)
  formatChartData(formatted_tvl, formatted_tokens_snapshots, chart_data)
  chartData.value = addEmptyDays(chart_data)
  _poolActivity.forEach((item) => {
    let valueUsd = CalculateJoinExitPrice(
      null,
      item,
      historicalPrices.value,
      false,
    )
    if (valueUsd) item.valueUSD = valueUsd
  })
  unformattedPoolActivity.value = _poolActivity

  current_pool_token_prices.value = await GetTokenPricesBySymbols(
    pool.value.tokens.map((t) => t.symbol),
    currency.value,
  )
}

const balance = ref(0)

async function SetAdditionalData(_poolActivity) {
  tokenPrices.value = await GetPoolTokenPrices(
    tokens.value,
    chainSelected.value.chain,
  )
  poolActivity.value = FormatPoolActivity(
    _poolActivity,
    pool.value.tokens,
    historicalPrices.value,
    currencySymbol.value,
    currencyDecimals.value,
  )
  const provider = await InitializeMetamask()
  if (provider) {
    const address = await provider.getSigner().getAddress()
    const share = await GetPoolShares(pool.value.id, { value: address })
    if (share.percentage) {
      balance.value = pool.value.totalLiquidity / 100 * share.percentage
    }
  }
  console.log('DONE 3')
}

async function InitPoolsInfo(poolId) {
  return await Promise.all([
    GetPoolSwapsData(poolId, chainSelected.value.chain),
    GetPoolHistoricValues(poolId, chainSelected.value.chain),
    GetHistoricalTvl(chainSelected.value.chain, poolId, currency.value),
    GetPoolActivity(poolId, chainSelected.value.chain),
    GetPoolHistoricalBalances(chainSelected.value.chain, poolId),
    GetTokenPairs(chainSelected.value.chain),
  ])
}

function formatChartData(formatted_tvl, formatted_token_snapshots, chart_data) {
  let empty_token_profits = {}
  for (let i = 0; i < pool.value.tokens.length; i++) {
    empty_token_profits[pool.value.tokens[i].symbol] = 0
  }
  for (let i = 0; i < formatted_tvl.length; i++) {
    let filtered = chart_data.filter(
      (item) => item.Blockchain != '' && item.Date == formatted_tvl[i].Date,
    )
    if (filtered.length > 0) {
      for (let k = 0; k < filtered.length; k++) {
        filtered[k].TVL = { ...formatted_tvl[i] }
      }
    } else {
      let index = chart_data.findIndex(
        (item) => item.timestamp > formatted_tvl[i].timestamp,
      )
      let empty_tvl_element = {
        Date: formatted_tvl[i].Date,
        Blockchain: '',
        timestamp: formatted_tvl[i].timestamp,
        Profits: 0,
        'Token Profits': { ...empty_token_profits },
        Revenue: 0,
        'Gas Fees': 0,
        Assets: {},
        Volume: 0,
        Trades: 0,
      }
      empty_tvl_element['TVL'] = formatted_tvl[i]
      if (index == -1) {
        chart_data.push(empty_tvl_element)
      } else {
        chart_data.splice(index, 0, empty_tvl_element)
      }
    }
  }
  let tokens = Object.keys(formatted_token_snapshots).filter(
    (k) => k != 'timestamps' && k != 'Dates',
  )
  let lastIndex = 0
  for (let i = 0; i < chart_data.length; i++) {
    let index = formatted_token_snapshots.Dates.findLastIndex(
      (s) => s == chart_data[i].Date,
    )
    index = index == -1 ? lastIndex : index
    lastIndex = index
    for (let k = 0; k < tokens.length; k++) {
      chart_data[i].Assets[tokens[k]] =
        formatted_token_snapshots[tokens[k]][index]
    }
    if (!chart_data[i].TVL) {
      let prices = getTokensPricesForTimestamp(
        tokens,
        historicalPrices.value,
        chart_data[i].timestamp / 1000,
      )
      let tvl = 0
      for (let k = 0; k < tokens.length; k++) {
        let assetTvl = prices[tokens[k]] * chart_data[i].Assets[tokens[k]]
        tvl += assetTvl
      }
      chart_data[i].TVL = {
        Arbitrum: 0,
        Binance: 0,
        Polygon: 0,
        'All Chains': 0,
        Date: formatSimpleTimestamp(chart_data[i].timestamp),
        timestamp: chart_data[i].timestamp * 1000,
      }
      chart_data[i].TVL[chainSelected.value.name] = tvl
      chart_data[i].TVL['All chains'] = tvl
    }
    // if (!chart_data[i].TVL && !nearestTvl) {
    //   nearestTvl = { ...chart_data.find((d) => d.TVL != null).TVL }
    //   chart_data[i].TVL = { ...nearestTvl }
    // } else if (!chart_data[i].TVL) {
    //   chart_data[i].TVL = { ...nearestTvl }
    // }
    // nearestTvl = { ...chart_data[i].TVL }
  }
}

const selectedTab = ref('Pool Info')

function changeSelectedTab(_new) {
  selectedTab.value = _new
}

const periodsOfData = [
  {
    number: 86400000,
    title: '24H',
  },
  {
    number: 604800000,
    title: '7D',
  },
  {
    number: 2592000000,
    title: '1M',
  },
  {
    number: 31536000000,
    title: '1Y',
  },
  {
    number: 3153600000000,
    title: 'All Time',
  },
]

const activitiesModes = ['All', 'Deposit', 'Trade', 'Harvest', 'Withdraw']

const activitiesSelectedMode = ref(activitiesModes[0])
const actSelectedPeriodOfData = ref(periodsOfData[4])

function changeActivitiesMode(_new) {
  activitiesSelectedMode.value = _new
}

function changeActPeriodOfData(_new) {
  actSelectedPeriodOfData.value = _new
}

const filteredActivities = computed(() => {
  if (poolActivityData.value.length == 0) return []
  if (activitiesSelectedMode.value == 'All') {
    let activities = poolActivityData.value.filter(function (item) {
      return (
        new Date() - actSelectedPeriodOfData.value.number <=
        item.timestamp * 1000
      )
    })
    return activities
  } else {
    let activities = poolActivityData.value.filter(function (item) {
      return (
        new Date() - actSelectedPeriodOfData.value.number <=
        item.timestamp * 1000 && item.Actions == activitiesSelectedMode.value
      )
    })
    return activities
  }
})

const tokens = computed(() =>
  pool.value && pool.value.id == poolId && pool.value.tokens
    ? pool.value.tokens.map((t) => t.address)
    : [],
)

const tokenWeights = computed(() =>
  pool.value ? pool.value.tokens.map((t) => t.weight) : [],
)

const diagramsData = computed(() =>
  poolActivity.value && historicalPrices.value
    ? UseDiagramsData(
      poolSwapsData.value,
      historicalData.value.historicalBalances,
      pool.value.tokens,
      historicalPrices.value,
    )
    : null,
)
const poolSwapsData = ref([])

const poolTradesData = computed(() =>
  diagramsData.value ? diagramsData.value['trades'] : null,
)
const poolProfitsData = computed(() =>
  diagramsData.value ? diagramsData.value['profits'] : null,
)

// const historicValues = computed(() =>
//   historicalData.value ? historicalData.value.historicalValues : [],
// )

const assetsPerformance = computed(() =>
  diagramsData.value ? diagramsData.value['assetsPerformance'] : null,
)

console.log('VALUES - ', poolTradesData, poolProfitsData, assetsPerformance)
console.log(diagramsData)
//const lpInfo = ref({ tvl: 0, percentChange: 0 })
const profitInfo = ref(null)

watch(poolActivity, async () => {
  profitInfo.value = GetPool24hProfit(poolSwapsData.value)
})

const mountedModal = setInterval(() => {
  console.log('router.currentRoute.value', router.currentRoute.value)

  const onMountedActivity =
    router.currentRoute.value.params['onMountedActivity']
  if (onMountedActivity == 'deposit') {
    if (
      tokenPrices.value &&
      pool.value.tokens &&
      tokens.value.length > 0 &&
      poolActivity.value
    ) {
      changeToDepositView()
      clearInterval(mountedModal)
    }
  } else if (onMountedActivity == 'withdraw') {
    if (
      tokenPrices.value &&
      pool.value &&
      tokens.value.length > 0 &&
      pool.value.onchain &&
      poolActivity.value
    ) {
      changeToWithdrawView()
      clearInterval(mountedModal)
    }
  } else {
    clearInterval(mountedModal)
  }
}, 100)

const visibleDepositComponent = ref(false)
const visibleWithdrawComponent = ref(false)

const poolsLoader = ref(false)

const perPage = ref(25)
const currentPage = ref(1)

function changePage(args) {
  if (args.isEquating == false) {
    currentPage.value = currentPage.value + args.num
  } else {
    currentPage.value = args.num
  }
}

function changePerPage(v1) {
  perPage.value = Number(v1)
  currentPage.value = 1
}

function filterPoolActions(removeExcess = true) {
  const star = (currentPage.value - 1) * perPage.value
  const end = currentPage.value * perPage.value
  let result = poolActivity.value.slice(star, end)
  if (removeExcess)
    result = result.map(({ Actions, Details, Value, Time }) => {
      return { Actions, Details, Value, Time }
    })
  return result
}

const poolActivityData = computed(() => filterPoolActions(false))

const colors = ['#00C7FC', '#00DFEF', '#282D73', '#0099EA']
const dynamicDonut = computed(() => {
  let labels = pool.value.tokens.map((t) => t.symbol)
  let arrayOfColors = labels.map((s, i) =>
    i < colors.length ? colors[i] : stringToColor(s),
  )

  let balances = pool.value.tokens.map((t) =>
    historicalPrices.value
      ? t.balance * current_pool_token_prices.value[t.symbol]
      : 0,
  )
  console.log(balances)
  let total_balance = balances.reduce((sum, item) => sum + item, 0)
  let data = balances
    .map((b) => parseFloat((b / (total_balance / 100)).toFixed(2)))
    .filter((item) => !isNaN(item))
  console.log('DATA - ', data)
  return {
    series: data,
    chart: {
      type: 'donut',
    },
    data: data,
    labels: labels,
    legend: {
      show: false,
      fontSize: '14px',
      // fontFamily: 'Lato',
      fontWeight: 600,
      labels: {
        colors: 'white',
        useSeriesColors: false,
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
          size: '80%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '22px',
              fontFamily: 'Rubik',
              color: '#dfsda',
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '35px',
              fontFamily: 'Poppins',
              color: '#999',
              offsetY: 13,
              formatter: function (val) {
                return val
              },
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '18px',
              fontFamily: 'Poppins',
              fontWeight: 400,
              color: '#999',
              formatter: function () {
                return formatBigNumber(total_balance, 2)
              },
            },
          },
        },
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['#181C1F'],
    },
    tooltip: {
      enabled: true,
      // eslint-disable-next-line
      custom({ series, seriesIndex, dataPointIndex, w }) {
        // console.log("!!!", w.config.series[seriesIndex])
        return (
          '<div style="background: linear-gradient(rgba(89, 89, 89, 1), rgba(73, 73, 73, 0.45)); padding: 10px;">' +
          '<div  style="opacity:50%; font-size:clamp(10px, 0.9vw, 16px)">' +
          w.config.labels[seriesIndex] +
          '</div>' +
          '<div style="display:flex; flex-direction:column;">' +
          '<div style="font-size:clamp(8px, 0.9vw, 14px)">' +
          '<span>Pool Percentage: </span>' +
          w.config.series[seriesIndex] +
          '%' +
          '</div>' +
          '<div style="font-size:clamp(8px, 0.9vw, 14px)">Token Amount: ' +
          formatBigNumber(balances[seriesIndex]) +
          ' </div>' +
          '</div>'
        )
      },
    },
    responsive: [
      {
        breakpoint: 1700,
        options: {
          chart: {
            width: '100%',
            height: '100%',
          },
          legend: {
            //   position: 'bottom',
            show: false,
          },
        },
      },
      {
        breakpoint: 1400,
        options: {
          chart: {
            width: '100%',
            height: '100%',
          },
          legend: {
            show: false,
            position: 'bottom',

            fontSize: '8px',

            markers: {
              width: 8,
              height: 8,
            },
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    show: true,
                    fontSize: '14px',
                    fontFamily: 'Rubik',
                    color: '#dfsda',
                    offsetY: -10,
                  },
                  value: {
                    show: true,
                    fontSize: '20px',
                    fontFamily: 'Poppins',
                    color: '#999',
                    offsetY: 13,
                    formatter: function (val) {
                      return val
                    },
                  },
                  total: {
                    show: true,
                    label: 'Total',
                    fontSize: '12px',
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    color: '#999',
                    // formatter: function (w) {
                    //   return w.globals.seriesTotals.reduce((a, b) => {
                    //     return a + b
                    //   }, 0).toFixed(0)
                    // },
                  },
                },
              },
            },
          },
        },
      },
      {
        breakpoint: 992,
        options: {
          chart: {
            width: '100%',
            height: '100%',
          },
          legend: {
            //   position: 'bottom',
            // show: true
          },
        },
      },
    ],
  }
})

function changeToWithdrawView() {
  router.push({ name: "Pool Withdraw", params: { id: router.currentRoute.value.params['id'], chainSelected: router.currentRoute.value.params['chainSelected'] } })
  poolsLoader.value = true
  setTimeout(() => {
    poolsLoader.value = false
  }, 1200)
  visibleWithdrawComponent.value = !visibleWithdrawComponent.value
}
function changeToDepositView() {
  router.push({ name: "Pool Deposit", params: { id: router.currentRoute.value.params['id'], chainSelected: router.currentRoute.value.params['chainSelected'] } })
  poolsLoader.value = true
  setTimeout(() => {
    poolsLoader.value = false
  }, 1200)
  visibleDepositComponent.value = !visibleDepositComponent.value
}




// let poolsData = ref()
// let historicValues = ref()
// let historicTvl = ref()
// let defaultPools = ref()

// async function InitPoolsData(network) {
//   return await Promise.all([
//     GetPools(network, null, true, true),
//     GetPoolSwapsData(null, network),
//     GetPoolHistoricValues(null, network),
//     GetHistoricalTvl(network),
//   ])
// }

// onMounted(async () => {
//   const networks = [
//     process.env.VUE_APP_KEY_ARBITRUM ? Network.ARBITRUM : undefined,
//     process.env.VUE_APP_KEY_BINANCE ? Network.BINANCE : undefined,
//     process.env.VUE_APP_KEY_POLYGON ? Network.POLYGON : undefined,
//   ].filter((n) => n != undefined)

//   const networksInfo = await Promise.all(
//     networks.map((network) => InitPoolsData(network)),
//   )
//   poolsData.value = networks.map((n, index) => networksInfo[index][0]).flat()
//   poolSwapsData.value = networks
//     .map((n, index) => networksInfo[index][1])
//     .flat()
//   historicValues.value = networks
//     .map((n, index) => networksInfo[index][2])
//     .flat()
//   historicTvl.value = networks.map((n, index) => networksInfo[index][3]).flat()
//   let _defaultPools = FormatPoolsData(
//     poolsData.value,
//     poolSwapsData.value,
//     historicValues.value,
//     false,
//   )
//   console.log(_defaultPools)
//   FormatPoolsApr(_defaultPools, historicTvl.value, poolSwapsData.value)
//   defaultPools.value = _defaultPools
//   poolSwapsData.value = poolSwapsData.value.filter(
//     (t) => t.swaps[0].poolIdVault[0] == poolId,
//   )
// })
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

@mixin cells-widths {
  width: 150px;

  @media (max-width: $xxl) {
    width: 100px;
  }

  &:nth-child(1) {
    width: 200px;

    @media (max-width: $xxl) {
      width: 130px;
    }
  }

  &:nth-child(2) {
    width: 600px;

    @media (max-width: $xxl) {
      width: 300px;
    }
  }
}

:deep(.table-header-font-folder) {
  text-align: left !important;
  @include cells-widths;
}

.other {
  &-pools {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    &__el {
      width: 24%;
      border-radius: 20px;
      outline: 0.5px solid rgba(163, 164, 165, 0.2196078431);
      padding: 15px 15px;
      margin-bottom: 10px;
      cursor: pointer;

      @media (max-width: $xl) {
        width: 32%;
      }

      @media (max-width: $lg) {
        width: 49%;
      }
    }
  }
}

:deep(.pools-card__header) {
  margin-bottom: 0;
}

:deep(.pools-card__img) {
  width: 40px;

  &:not(:first-child) {
    margin-left: -25px;
  }

  svg {
    width: 30px;
    height: 30px;
    top: 5px;
  }
}

:deep(.pools-card__name) {
  font-size: 12px;
}

:deep(.pool-card__value) {
  @media (max-width: $xxl) {
    font-size: 6px;
  }
}

.table {
  &__header {
    display: flex;
    margin-bottom: 18px;
  }

  &-body {
    display: block;
    max-height: 500px;
    overflow-x: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
      background-color: #02120a;
      border-radius: 50px;
      margin-bottom: 10px;
    }

    &::-webkit-scrollbar {
      width: 8px !important;
      height: 8px !important;
      background: #02120a;
      border-radius: 50px;
    }

    &::-webkit-scrollbar-thumb {
      border: 2px solid #02120a;
      background: #00c9ff;
      border-radius: 21px;
    }
  }

  &-wrapper {
    padding: 0;
    border-radius: 20px;
    outline: 0.5px solid rgba(163, 164, 165, 0.2196078431);
    background: transparent;
    width: 100%;
    overflow-x: auto;
    margin-bottom: 30px;
  }

  &-row {
    border-color: transparent;
    width: 100%;
    display: table;
    table-layout: fixed;
  }

  &-cell {
    padding: 24px 0 24px 10px !important;
    width: fit-content;
    font-weight: 400;
    white-space: nowrap;
    font-size: 14px;
    overflow: visible;
    @include cells-widths;

    @media (max-width: $xxl) {
      font-size: clamp(10px, 1vw, 14px);
      padding: 12px 0 12px 10px !important;
    }

    &:first-child {
      padding: 24px 0 24px 45px !important;
      text-align: left;

      @media (max-width: $xxl) {
        padding: 12px 0 12px 15px !important;
      }
    }

    &:last-child {
      padding: 24px 10px 24px 10px !important;

      @media (max-width: $xxl) {
        padding: 12px 10px 12px 10px !important;
      }
    }
  }
}

.caption {
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0em;
  color: #ffffff;
  margin-right: 12px;
  width: fit-content;
}

.LiquidityPairPrice {
  height: 60vh;
  width: 100%;
}

.form-label {
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0em;
  color: #dbdbdb;
}

.pool-section {
  height: fit-content;
  width: fit-content;
  /* flex-grow: 1; */
  // border: 1px solid rgba(163, 164, 165, 0.1);
  border-radius: 15px;

  box-shadow: 0px 4px 4px 0px #00000040;
  border: 1px solid #ffffff0d;
  padding: 8px 12px 16px 12px;

  display: flex;
  gap: 30px;

  .subsection {
    flex: 1;
    display: flex;
    flex-direction: column;

    &__item {
   
      box-shadow: 0px 4px 4px 0px #00000040;

      border-radius: 8px;
      padding: 8px;

      &__caption {
        font-size: clamp(10px, 0.8vw, 14px);
        font-weight: 600;
        line-height: 24px;
        letter-spacing: 0em;
        color: #ffffff;

        margin-bottom: 8px;
      }

      &__content {
        display: flex;
        justify-content: space-between;

        &__left {
          width: 100px;
          text-align: left;
          font-size: clamp(10px, 0.8vw, 14px);
          font-weight: 400;
          line-height: 24px;
          letter-spacing: 0em;
     

          &.grayed {
            color: #c1c1d1;
          }
        }

        &__right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;

          &__top {
            &.single {
              font-size: clamp(8px, 0.7vw, 13px);
              font-weight: 400;
              line-height: 24px;
              letter-spacing: 0em;
      
            }

            &.paired {
              display: flex;
              align-items: center;
              justify-content: flex-end;

              .amount {
                font-size: clamp(8px, 0.7vw, 13px);
                font-weight: 400;
                line-height: 24px;
                letter-spacing: 0em;
            
              }

              .percentage-chip {
                margin-left: 16px;
                font-size: clamp(8px, 0.7vw, 13px);
                padding: 2px 4px 3px 4px;
                border-radius: 2px;
                background-color: #ff000029;
                color: #feb2b2;

                &.--positive {
                  background-color: #b7e69a29;
                  color: #17eb5f;
                }
              }
            }
          }

          &__bottom {
            font-size: clamp(7px, 0.6vw, 9px);
            font-weight: 400;
            line-height: 21px;
            letter-spacing: 0em;
            color: #777;

            &.--bright {
              color: #777;
            }
          }
        }

        &:not(:first-child) {
          padding: 8px 0 8px 10px;
        }

        &:nth-child(n + 3) {
          border-top: 1px solid #ffffff15;
        }
      }

      &:not(:first-child) {
        margin-top: 24px;
      }
    }

    &:nth-child(2) {
      justify-content: space-between;
    }

    &:nth-child(3) {
      justify-content: space-between;
    }
  }
}

.diagram-section {
  width: fit-content;
  height: auto;
  margin-left: 22px;
  flex-direction: column;
  // border: 1px solid rgba(163, 164, 165, 0.1);
  border-radius: 15px;
  // background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;
  border: 1px solid #ffffff0d;

  /* padding: 8px 12px 16px 12px; */

  .caption {
    color: #ffffff;
    font-size: 15px;
    letter-spacing: 0em;

    &__text {
      font-weight: 500;
      line-height: 23px;
    }

    &__amount {
      font-weight: 600;
      line-height: 18px;

      margin-top: 8px;
    }
  }

  .diagram-container {
    display: flex;
    justify-content: space-around;
    padding: 20px;
    height: 85%;
    border-radius: 15px;

    :deep(.apexcharts-inner) {
      filter: drop-shadow(0 0 0.35rem #00c9ff);
    }
  }
}

.positive {
  background-color: #b7e69a29 !important;
  color: #17eb5f !important;
}

.investors-number {
  display: flex;
  justify-content: space-between;
  border-radius: 8px;
  // background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;

  padding: 8px;

  &__text {
    font-size: clamp(10px, 0.8vw, 14px);
    font-weight: 600;
    line-height: 24px;
    letter-spacing: 0em;
 
  }
}

#tokens-row {
  margin-bottom: 62px;
}

.actions-cell {
  display: flex;
  align-items: center;

  &__text {
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    letter-spacing: 0em;
 
    margin-left: 12px;

    @media (max-width: $xxl) {
      font-size: 12px;
    }
  }
}

.details-cell {
  display: flex;
  flex-wrap: wrap;

  &__token-entity {
    display: flex;

    &:not(:last-child) {
      margin-right: 12px;
    }

    &__icon {
      height: 20px;
      width: 20px;
      margin-right: 8px;

      @media (max-width: $xxl) {
        margin-right: 4px;
      }
    }
  }
}

// :deep(.file-table-header-container) {
//   @include file-table-cells-max-widths;
// }

// :deep(.file-table-cell-container) {
//   @include file-table-cells-max-widths;
// }

.pool-information-bar {
  display: flex;

  background-color: #181c1f;
  border: 1px solid rgba(1, 180, 126, 0.35);
  border-radius: 5px;
  padding-top: 15px;
  padding-bottom: 15px;

  &__part {
    display: flex;
    flex-grow: 1;
    justify-content: space-between;

    &:first-child {
      border-right: 1px solid #00c9ff;
      padding-right: 28px;
    }

    &:nth-child(2) {
      padding-left: 60px;
      padding-right: 90px;
    }

    &__section {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      &__caption-text {
        font-size: 14px;
        font-weight: 600;
        line-height: 16px;
        letter-spacing: 0em;
        color: #00c9ff;
      }

      &__content-text {
        font-size: 34px;
        font-weight: 900;
        line-height: 60px;
        letter-spacing: 0em;
        color: #00c9ff;
      }

      @mixin large-text {
        font-size: 24px;
        font-weight: 300;
        line-height: 42px;
        letter-spacing: 0em;
        color: #ffffff;
      }

      @mixin small-text {
        font-size: 14px;
        font-weight: 300;
        line-height: 16px;
        letter-spacing: 0em;
        color: #ffffff;
      }

      &__price-text {
        @include large-text;
      }

      &__bottom-chip {
        background-color: #ff000029;
        color: #ff4646;
        font-size: 12px;
        font-weight: 700;
        line-height: 18px;
        letter-spacing: 0em;
        padding: 2px 4px 3px 4px;
        border-radius: 2px;
      }

      &__positive {
        background-color: #63de178f !important;
        color: #24be58 !important;
      }

      &__proportion {
        display: flex;
        align-items: flex-end;

        &__top {
          @include large-text;
        }

        &__bottom {
          @include small-text;

          margin-bottom: 8px;
          margin-left: 8px;
        }
      }

      &__bottom-proportion {
        @include small-text;

        margin-left: 24px;
      }
    }
  }
}

.pool-information-row {
  margin-bottom: 50px;
}

#pool-stats-row {
  margin-bottom: 50px;
}

.caption-row {
  flex-direction: row;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.big-chip {
  // background: #151515;

  padding-left: 5px;
  padding-right: 10px;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 4px 4px 0px #15151540;

  width: fit-content;
  display: flex;
  align-items: center;

  &__image {
    width: 1.5vw;
  }

  &__text {
    font-size: clamp(10px, 0.9vw, 14px);
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0em;
    // color: #ffffff;

    &:nth-child(2) {
      margin-left: 4px;
      margin-right: 16px;
    }
  }

  &:not(:first-child) {
    margin-left: 12px;
  }
}

.thin-buttons-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  margin-bottom: 16px;
}

.thin-button {
  color: #00c9ff;
  padding: 9px 22px;
  border-radius: 15.289px;
  background: linear-gradient(153deg, #000 0%, rgba(0, 0, 0, 0) 100%);
  backdrop-filter: blur(20.067087173461914px);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Poppins;
  font-size: clamp(10px, 0.8vw, 14px);
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0em;

  &:not(:first-child) {
    margin-left: 12px;
  }
}

.thin-button:hover {
  background-color: #00c9ff;
  color: white;
  filter: drop-shadow(0 0 0.3rem #00c9ff);
  cursor: pointer;
}

.diagram-container {
  border-width: 0px;

  .apexcharts-inner {
    filter: drop-shadow(0 0 0.55rem rgba(98, 104, 143, 1));
  }
}

.loader {
  font-size: 10px;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: mulShdSpin 1.1s infinite ease;
  transform: translateZ(0);
}

@keyframes mulShdSpin {

  0%,
  100% {
    box-shadow: 0em -2.6em 0em 0em #ffffff,
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
      2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
      0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.5),
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7);
  }

  12.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.7),
      1.8em -1.8em 0 0em #ffffff, 2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
      0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5);
  }

  25% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.5),
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7), 2.5em 0em 0 0em #ffffff,
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
      0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
  }

  37.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5),
      2.5em 0em 0 0em rgba(255, 255, 255, 0.7), 1.75em 1.75em 0 0em #ffffff,
      0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
  }

  50% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
      2.5em 0em 0 0em rgba(255, 255, 255, 0.5),
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.7), 0em 2.5em 0 0em #ffffff,
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
  }

  62.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
      2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.5),
      0em 2.5em 0 0em rgba(255, 255, 255, 0.7), -1.8em 1.8em 0 0em #ffffff,
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
  }

  75% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
      2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
      0em 2.5em 0 0em rgba(255, 255, 255, 0.5),
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.7), -2.6em 0em 0 0em #ffffff,
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
  }

  87.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
      2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
      0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.5),
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.7), -1.8em -1.8em 0 0em #ffffff;
  }
}

.rewards_button {
  // background: #22222224;
  border: 1px solid #00e0ff;
  box-shadow: 0px 4px 4px 0px #00000040;
  color: #00e0ff;
  padding: 4px 24px;
  font-family: Poppins;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  border-radius: 8px;
  text-align: center;
}
</style>
<style src="@vueform/slider/themes/default.css"></style>
@/composables/pools/usePoolActivity@/composables/pools/charts/usePoolTrades@/composables/pools/charts/useHistoricValues@/composables/pools/usePoolStats@/composables/pools/charts/usePoolAssetsPerformance@/composables/pools/charts/usePoolAssetsPerformance@/composables/pools/charts/usePoolHistoricValues@/lib/formatter/pool/poolActivityFormatter
@/composables/pools/charts/diagrams/usePoolTrades
