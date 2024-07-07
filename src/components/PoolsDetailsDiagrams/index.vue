<template>
  <CContainer class="diagrams-container">
    <CRow class="diagram-row !mx-0">
      <CCol xl="4" class="md:mb-0 mb-4">
        <div
          v-if="
            assetsPerformanceData[assetsPerformanceRangeOption] &&
            assetsPerformanceTimestamps[assetsPerformanceRangeOption]
          "
          class="d-flex flex-column gap-2 chart_card dark:!bg-[#22222224] !bg-[white]"
        >
          <div
            class="d-flex justify-content-between text-black dark:!text-white"
          >
            <div class="d-flex align-items-center gap-2">
              <div class="diagrams_title">
                {{ $t('Assets Performance') }}
              </div>
              <VTooltip :distance="0" :placement="'top'">
                <div style="cursor: help">
                  <svg
                    class="info_icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C13 7.71667
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
        12 20Z"
                      class="dark:!fill-white fill-black"
                    />
                  </svg>
                </div>
                <template #popper>
                  <div class="tooltip_container">
                    <h6 style="font-size: clamp(10px, 0.9vw, 16px)">
                      {{ $t('information') }}
                    </h6>
                    <div class="tooltip_container_text">
                      <div>
                        This chart offers a historical perspective on the values
                        of assets deposited in the pool. It allows you to track
                        the performance and fluctuations of the assets over
                        time.
                      </div>
                    </div>
                  </div>
                </template>
              </VTooltip>
            </div>
            <div class="d-flex gap-2">
              <div
                style="cursor: pointer; font-size: clamp(10px, 0.8vw, 14px)"
                class="text-black dark:!text-white"
                :style="{
                  color:
                    opt == assetsPerformanceRangeOption
                      ? '#00C9FF !important'
                      : '',
                }"
                v-for="opt in advancedRangeOptions"
                :key="`trade-${opt}-range-option`"
                @click="assetsPerformanceRangeOption = opt"
              >
                {{ opt }}
              </div>
            </div>
          </div>

          <div>
            <apexchart
              :options="chartOptions0"
              :series="assetsPerformanceData[assetsPerformanceRangeOption]"
            />
          </div>
        </div>
        <div
          v-else
          style="height: 350px"
          class="chart_card dark:!bg-[#22222224] !bg-[white]"
        >
          <LoaderPulse />
        </div>
      </CCol>
      {{
        console.log(
          'router.currentRoute.value.path',
          router.currentRoute.value.path.includes('CLdetails'),
        )
      }}
      <!-- <CCol xl="4" v-if="router.currentRoute.value.path.includes('CLdetails')">
        <div
          v-if="
            tradesData[tradeRangeOption] && tradesTimestamps[tradeRangeOption]
          "
          class="d-flex flex-column gap-2 chart_card dark:!bg-[#22222224] !bg-[white]"
        >
          <div
            class="d-flex justify-content-between text-black dark:!text-white"
          >
            <div class="d-flex align-items-center gap-2">
              <div class="diagrams_title">Pool {{ $t('distribution') }}</div>
              <VTooltip :distance="0" :placement="'top'">
                <div style="cursor: help">
                  <svg
                    class="info_icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C13 7.71667
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
        12 20Z"
                      class="dark:!fill-white fill-black"
                    />
                  </svg>
                </div>
                <template #popper>
                  <div
class="tooltip_container"
                  >
                    <h6 style="font-size: clamp(10px, 0.9vw, 16px)">
                      {{ $t('information') }}
                    </h6>
                    <div
                    class="tooltip_container_text"
                    >
                      <div>
                        This bar chart visually presents the number of trades
                        executed by this pool during a specific time frame. It
                        offers a clear and concise overview of the pool's
                        trading activity.
                      </div>
                    </div>
                  </div>
                </template>
              </VTooltip>
            </div>
            <div class="d-flex gap-1">
              <div
                class="pool_disturb_actions dark:!bg-[#22222224] bg-white text-black dark:!text-white"
              >
                +
              </div>
              <div
                class="pool_disturb_actions dark:!bg-[#22222224] bg-white text-black dark:!text-white"
              >
                -
              </div>
            </div>
          </div>

          <div>
            <apexchart
              :options="chartOptionsCLPool1"
              :series="[
                // {
                //   name: 'Trades',
                //   data: tradesData[tradeRangeOption],
                // },
                {
                  name: 'BAL',
                  data: [7, 15, 21, 47, 52, 33, 21, 12],
                },
                {
                  name: 'USDC',
                  data: [13, 23, 27, 55, 33, 27, 23, 21],
                },
              ]"
            />
          </div>
        </div>
        <div
          v-else
          style="height: 350px"
          class="chart_card dark:!bg-[#22222224] !bg-[white]"
        >
          <LoaderPulse />
        </div>
      </CCol> -->
      <CCol xl="4" class="md:mb-0 mb-4">
        <div
          v-if="
            tradesData[tradeRangeOption] && tradesTimestamps[tradeRangeOption]
          "
          class="d-flex flex-column gap-2 chart_card dark:!bg-[#22222224] !bg-[white]"
        >
          <div
            class="d-flex justify-content-between text-black dark:!text-white"
          >
            <div class="d-flex align-items-center gap-2">
              <div class="diagrams_title">{{ $t('trades') }}</div>
              <VTooltip :distance="0" :placement="'top'">
                <div style="cursor: help">
                  <svg
                    class="info_icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C13 7.71667
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
        12 20Z"
                      class="dark:!fill-white fill-black"
                    />
                  </svg>
                </div>
                <template #popper>
                  <div class="tooltip_container">
                    <h6 style="font-size: clamp(10px, 0.9vw, 16px)">
                      {{ $t('information') }}
                    </h6>
                    <div class="tooltip_container_text">
                      <div>
                        This bar chart visually presents the number of trades
                        executed by this pool during a specific time frame. It
                        offers a clear and concise overview of the pool's
                        trading activity.
                      </div>
                    </div>
                  </div>
                </template>
              </VTooltip>
            </div>
            <div class="d-flex gap-3">
              <div class="d-flex gap-2">
                <div
                  style="cursor: pointer; font-size: clamp(10px, 0.8vw, 14px)"
                  class="text-black dark:!text-white"
                  :style="{
                    color: opt == tradeRangeOption ? '#00C9FF !important' : '',
                  }"
                  v-for="opt in rangeOptions"
                  :key="`trade-${opt}-range-option`"
                  @click="tradeRangeOption = opt"
                >
                  {{ opt }}
                </div>
              </div>
              <div class="d-flex gap-2">
                <div style="cursor: pointer" @click="tradesType = 'curve'">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 28 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.557356 16.9682L0.426194 16.839C0.291092 16.7062 0.183908 16.5485 0.110775 16.3749C0.0376434 16.2012 0 16.0151 0 15.8271C0 15.6391 0.0376434 15.453 0.110775 15.2793C0.183908 15.1057 0.291092 14.948 0.426194 14.8152L9.30147 6.05968C9.4363 5.92662 9.59645 5.82105 9.77275 5.74903C9.94905 5.677 10.138 5.63993 10.3289 5.63993C10.5198 5.63993 10.7088 5.677 10.8851 5.74903C11.0614 5.82105 11.2215 5.92662 11.3563 6.05968L16.151 10.7819L25.4635 0.476247C25.5957 0.331333 25.7564 0.214426 25.9359 0.132644C26.1154 0.050862 26.3099 0.0059171 26.5076 0.00054587C26.7053 -0.00482536 26.902 0.0294893 27.0858 0.101401C27.2696 0.173312 27.4366 0.281316 27.5767 0.418834C28.1159 0.964259 28.1451 1.82546 27.635 2.38524L17.1858 13.9683C17.0545 14.1147 16.8942 14.233 16.7146 14.3157C16.535 14.3985 16.34 14.4439 16.1418 14.4493C15.9437 14.4547 15.7465 14.4199 15.5625 14.347C15.3786 14.2741 15.2118 14.1648 15.0726 14.0258L10.3362 9.36094L2.61222 16.9682C2.4774 17.1012 2.31725 17.2068 2.14095 17.2788C1.96465 17.3509 1.77566 17.3879 1.58479 17.3879C1.39392 17.3879 1.20493 17.3509 1.02863 17.2788C0.852328 17.2068 0.692181 17.1012 0.557356 16.9682ZM2.61222 25.5802L10.3362 17.9729L15.0726 22.6377C15.6701 23.2262 16.632 23.1975 17.1858 22.5803L27.635 10.9972C28.1451 10.4374 28.1159 9.57624 27.5767 9.03081C27.4366 8.89329 27.2696 8.78529 27.0858 8.71338C26.902 8.64147 26.7053 8.60715 26.5076 8.61252C26.3099 8.6179 26.1154 8.66284 25.9359 8.74462C25.7564 8.8264 25.5957 8.94331 25.4635 9.08823L16.151 19.3939L11.3563 14.6717C11.2215 14.5386 11.0614 14.433 10.8851 14.361C10.7088 14.289 10.5198 14.2519 10.3289 14.2519C10.138 14.2519 9.94905 14.289 9.77275 14.361C9.59645 14.433 9.4363 14.5386 9.30147 14.6717L0.426194 23.4272C0.291092 23.56 0.183908 23.7177 0.110775 23.8913C0.0376434 24.065 0 24.2511 0 24.4391C0 24.6271 0.0376434 24.8132 0.110775 24.9868C0.183908 25.1605 0.291092 25.3182 0.426194 25.451L0.557356 25.5802C1.12572 26.1399 2.05843 26.1399 2.61222 25.5802Z"
                      :fill="tradesType == 'curve' ? '#00C9FF' : 'white'"
                    />
                  </svg>
                </div>
                <div style="cursor: pointer" @click="tradesType = 'bar'">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 29 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.45 26C1.03917 26 0.694555 25.8613 0.416155 25.584C0.137755 25.3067 -0.000961649 24.9638 5.0173e-06 24.5555C5.0173e-06 24.1463 0.139205 23.803 0.417605 23.5257C0.696005 23.2483 1.04014 23.1101 1.45 23.1111H27.55C27.9608 23.1111 28.3054 23.2498 28.5838 23.5271C28.8622 23.8044 29.001 24.1473 29 24.5555C29 24.9648 28.8608 25.3081 28.5824 25.5854C28.304 25.8628 27.9599 26.001 27.55 26H1.45ZM3.625 21.6667C3.02084 21.6667 2.50705 21.4558 2.08365 21.034C1.66025 20.6122 1.44904 20.1009 1.45 19.5V13.7222C1.45 13.1204 1.6617 12.6086 2.0851 12.1868C2.5085 11.765 3.0218 11.5546 3.625 11.5556C4.22917 11.5556 4.74295 11.7664 5.16635 12.1882C5.58975 12.61 5.80097 13.1213 5.8 13.7222V19.5C5.8 20.1018 5.5883 20.6137 5.1649 21.0354C4.7415 21.4572 4.2282 21.6676 3.625 21.6667ZM10.875 21.6667C10.2708 21.6667 9.75705 21.4558 9.33365 21.034C8.91025 20.6122 8.69903 20.1009 8.7 19.5V6.5C8.7 5.89815 8.9117 5.38633 9.3351 4.96456C9.7585 4.54278 10.2718 4.33237 10.875 4.33334C11.4792 4.33334 11.993 4.54422 12.4164 4.966C12.8398 5.38778 13.051 5.89911 13.05 6.5V19.5C13.05 20.1018 12.8383 20.6137 12.4149 21.0354C11.9915 21.4572 11.4782 21.6676 10.875 21.6667ZM18.125 21.6667C17.5208 21.6667 17.007 21.4558 16.5837 21.034C16.1602 20.6122 15.949 20.1009 15.95 19.5V10.8333C15.95 10.2315 16.1617 9.71967 16.5851 9.29789C17.0085 8.87611 17.5218 8.6657 18.125 8.66667C18.7292 8.66667 19.2429 8.87756 19.6663 9.29933C20.0897 9.72111 20.301 10.2324 20.3 10.8333V19.5C20.3 20.1018 20.0883 20.6137 19.6649 21.0354C19.2415 21.4572 18.7282 21.6676 18.125 21.6667ZM25.375 21.6667C24.7708 21.6667 24.257 21.4558 23.8336 21.034C23.4102 20.6122 23.199 20.1009 23.2 19.5V2.16667C23.2 1.56482 23.4117 1.053 23.8351 0.631225C24.2585 0.209448 24.7718 -0.000959672 25.375 3.2903e-06C25.9792 3.2903e-06 26.4929 0.210892 26.9163 0.63267C27.3397 1.05445 27.551 1.56578 27.55 2.16667V19.5C27.55 20.1018 27.3383 20.6137 26.9149 21.0354C26.4915 21.4572 25.9782 21.6676 25.375 21.6667Z"
                      :fill="tradesType == 'bar' ? '#00C9FF' : 'white'"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <apexchart
              :options="chartOptions1"
              :series="[
                {
                  name: 'Trades',
                  data: tradesData[tradeRangeOption],
                },
              ]"
            />
          </div>
        </div>
        <div
          v-else
          style="height: 350px"
          class="chart_card dark:!bg-[#22222224] !bg-[white]"
        >
          <LoaderPulse />
        </div>
      </CCol>

      <CCol
        xl="4"
        class="md:mb-0 mb-4"
        v-if="router.currentRoute.value.path.includes('CLdetails')"
      >
        <div
          v-if="
            profitsData[profitRangeOption] &&
            profitsTimestamps[profitRangeOption]
          "
          class="d-flex flex-column gap-2 chart_card dark:!bg-[#22222224] !bg-[white]"
        >
          <div
            class="d-flex justify-content-between text-black dark:!text-white"
          >
            <div class="d-flex align-items-center gap-2">
              <div class="diagrams_title">{{ $t('ranges_traded') }}</div>

              <VTooltip :distance="0" :placement="'top'">
                <div style="cursor: help">
                  <svg
                    class="info_icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C13 7.71667
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
        12 20Z"
                      class="dark:!fill-white fill-black"
                    />
                  </svg>
                </div>
                <template #popper>
                  <div class="tooltip_container">
                    <h6 style="font-size: clamp(10px, 0.9vw, 16px)">
                      {{ $t('information') }}
                    </h6>
                    <div class="tooltip_container_text">
                      <div>
                        This bar chart visually represents the profit generated
                        by this pool over a specified period. It provides a
                        clear and intuitive way to understand the pool's
                        financial performance.
                      </div>
                    </div>
                  </div>
                </template>
              </VTooltip>
            </div>
            <div class="d-flex gap-3">
              <div
                style="cursor: pointer; font-size: clamp(10px, 0.8vw, 14px)"
                class="text-black dark:!text-white"
                :style="{
                  color: opt == profitRangeOption ? '#00C9FF !important' : '',
                }"
                v-for="opt in rangeOptions"
                :key="`trade-${opt}-range-option`"
                @click="profitRangeOption = opt"
              >
                {{ opt }}
              </div>
            </div>
          </div>

          <div>
            <apexchart
              :options="chartOptionsCLPool2"
              :series="[
                {
                  name: 'Range',
                  data: [1, 2, 3, 4, 5, 4],
                },
              ]"
            />
          </div>
        </div>
        <div
          v-else
          style="height: 350px"
          class="chart_card dark:!bg-[#22222224] !bg-[white]"
        >
          <LoaderPulse />
        </div>
      </CCol>
      <CCol v-else class="md:mb-0 mb-4" xl="4">
        <div
          v-if="
            profitsData[profitRangeOption] &&
            profitsTimestamps[profitRangeOption]
          "
          class="d-flex flex-column gap-2 chart_card dark:!bg-[#22222224] !bg-[white]"
        >
          <div
            class="d-flex justify-content-between text-black dark:!text-white"
          >
            <div class="d-flex align-items-center gap-2">
              <div class="diagrams_title">{{ $t('profit_generated') }}</div>

              <VTooltip :distance="0" :placement="'top'">
                <div style="cursor: help">
                  <svg
                    class="info_icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C13 7.71667
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
        12 20Z"
                      class="dark:!fill-white fill-black"
                    />
                  </svg>
                </div>
                <template #popper>
                  <div class="tooltip_container">
                    <h6 style="font-size: clamp(10px, 0.9vw, 16px)">
                      {{ $t('information ') }}
                    </h6>
                    <div class="tooltip_container_text">
                      <div>
                        This bar chart visually represents the profit generated
                        by this pool over a specified period. It provides a
                        clear and intuitive way to understand the pool's
                        financial performance.
                      </div>
                    </div>
                  </div>
                </template>
              </VTooltip>
            </div>
            <div class="d-flex gap-3">
              <div
                style="cursor: pointer; font-size: clamp(10px, 0.8vw, 14px)"
                class="text-black dark:!text-white"
                :style="{
                  color: opt == profitRangeOption ? '#00C9FF !important' : '',
                }"
                v-for="opt in rangeOptions"
                :key="`trade-${opt}-range-option`"
                @click="profitRangeOption = opt"
              >
                {{ opt }}
              </div>
            </div>
          </div>

          <div>
            <apexchart
              :options="chartOptions2"
              :series="[
                {
                  name: 'Net Profit',
                  data: profitsData[profitRangeOption],
                },
              ]"
            />
          </div>
        </div>
        <div
          v-else
          style="height: 350px"
          class="chart_card dark:!bg-[#22222224] !bg-[white]"
        >
          <LoaderPulse />
        </div>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script setup>
import { ref, defineProps, computed, toRefs } from 'vue'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
import { formatBigNumber } from '@/lib/utils/index'
import { getTokenEntity } from '@/lib/helpers/util'
import router from '@/router'

const props = defineProps([
  'tradesData',
  'tradesTimestamps',
  'profitsData',
  'profitsTimestamps',
  'assetsPerformanceData',
  'assetsPerformanceTimestamps',
  'tokens',
  'symbol',
  'decimals',
])

const {
  tradesData,
  tradesTimestamps,
  profitsTimestamps,
  profitsData,
  assetsPerformanceData,
  assetsPerformanceTimestamps,
  tokens,
} = toRefs(props)

const tradesType = ref('bar')

const barOptions = {
  chart: {
    type: 'bar',
    height: 274,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 5,
      columnWidth: '60%',
      borderRadiusApplication: 'end',
    },
  },
  colors: ['#777'],
  stroke: {
    show: true,
    width: 0,
    colors: ['#777'],
  },
}

const curveOptions = {
  chart: {
    height: 274,
    type: 'line',
    toolbar: {
      show: false,
    },
  },
  stroke: {
    width: [3, 3, 3],
    curve: 'straight',
    dashArray: [5, 5, 5],
  },
}

const tradesOptions = computed(() =>
  tradesType.value == 'bar' ? barOptions : curveOptions,
)
const tradeRangeOption = ref('D')

const profitRangeOption = ref('D')

const assetsPerformanceRangeOption = ref('D')
//const percentageRangeOption = ref('D')

const rangeOptions = ['D', 'W', 'M', 'Y', 'SD']
const advancedRangeOptions = ['1H', 'D', 'W', 'M', 'Y', 'SD']

console.log(assetsPerformanceData)
const chartOptions0 = computed(() => {
  return {
    chart: {
      height: 250,
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    colors: router.currentRoute.value.path.includes('CLdetails')
      ? ['#FB800F', '#803D00', '#F07E07', '#FF9B40']
      : ['#FA5173', '#01B47E', '#77aaff', '#FFD700'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
      // curve: 'straight',
      // dashArray: [5, 5, 5],
    },

    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: 'rgba(97, 94, 131, 1)',
      },
      fontSize: '10px',
      tooltipHoverFormatter: function (val, opts) {
        return (
          val +
          ` ${
            assetsPerformanceData.value[
              `${assetsPerformanceRangeOption.value}_tokens`
            ][opts.seriesIndex].data[opts.dataPointIndex]
          } ` +
          ' - ' +
          opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
          ''
        )
      },
      markers: {
        width: 10,
        height: 10,
      },
    },
    markers: {
      size: 0,
      hover: {
        sizeOffset: 6,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#777',
          fontSize: '10px',
          fontWeight: 400,
        },
      },
    },
    xaxis: {
      labels: {
        hideOverlappingLabels: true,
        rotate: 0,
        style: {
          colors: '#777',
          fontSize: '10px',
          fontWeight: 400,
        },
      },
      // tooltip: {
      //   enabled: false
      // },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      categories:
        assetsPerformanceTimestamps.value[assetsPerformanceRangeOption.value],
    },
    tooltip: {
      theme: false,
      trigger: 'axis',
      confine: true,
      y: {
        formatter: (val, opt) => {
          return `${props.symbol}${val} (${
            assetsPerformanceData.value[
              `${assetsPerformanceRangeOption.value}_tokens`
            ][opt.seriesIndex].data[opt.dataPointIndex]
          }  )`

          // <img src="${
          //   getTokenEntity(
          //     assetsPerformanceData.value[
          //       `${assetsPerformanceRangeOption.value}_tokens`
          //     ][opt.seriesIndex].name,
          //     'short',
          //   ).icon
          // }" width="15">
        },
      },
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.11)',
    },
  }
})

const chartOptions1 = computed(() => {
  return {
    ...tradesOptions.value,
    dataLabels: {
      enabled: false,
    },
    chart: {
      height: 250,
      offsetY: 15,
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: tradesTimestamps.value[tradeRangeOption.value],
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      labels: {
        show: true,
        hideOverlappingLabels: true,
        rotate: 0,
        style: {
          colors: '#777',
          fontSize: '10px',
          fontWeight: 400,
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        rotate: 0,
        rotateAlys: false,
        hideOverlappingLabels: true,
        style: {
          colors: 'white',
          fontSize: '10px',
          fontWeight: 400,
        },
      },
    },
    colors: ['#00e0ff'],
    stroke: {
      show: true,
      width: 0,
      colors: ['#00e0ff'],
    },
    tooltip: {
      theme: false,
      y: {
        formatter: function (val) {
          return val
        },
      },
    },
    grid: {
      show: false,
    },
  }
})
// const chartOptionsCLPool1 = computed(() => {
//   return {
//     ...tradesOptions.value,
//     dataLabels: {
//       enabled: false,
//     },
//     chart: {
//       height: 250,
//       offsetY: 15,
//       stacked: true,
//       type: 'bar',
//       toolbar: {
//         show: false,
//       },
//     },
//     colors: ['#46FF7A', '#FF9946'],
//     plotOptions: {
//       bar: {
//         horizontal: false,
//       },
//     },
//     xaxis: {
//       // categories: tradesTimestamps.value[tradeRangeOption.value],
//       categories: [
//         '0.998401',
//         '0.998091',
//         '0.9994',
//         '0.9999',
//         '1.0004',
//         '1.0009',
//         '1.001401',
//         '1.003401',
//       ],
//       axisTicks: {
//         show: false,
//       },
//       tooltip: {
//         enabled: false,
//       },
//       labels: {
//         show: true,
//         hideOverlappingLabels: true,
//         rotate: 0,
//         style: {
//           colors: '#777',
//           fontSize: '10px',
//           fontWeight: 400,
//         },
//       },
//     },
//     yaxis: {
//       labels: {
//         show: false,
//         rotate: 0,
//         rotateAlys: false,
//         hideOverlappingLabels: true,
//         style: {
//           colors: '#777',
//           fontSize: '10px',
//           fontWeight: 400,
//         },
//       },
//     },
//     legend: {
//       position: 'top',
//       horizontalAlign: 'right',
//       labels: {
//         colors: '#777',
//       },
//       fontSize: '10px',

//       markers: {
//         width: 10,
//         height: 10,
//         radius: 100,
//       },
//     },
//     tooltip: {
//       theme: false,
//       y: {
//         formatter: (val, opt) => {
//           return `Amount: ${val} `
//         },
//       },
//     },
//     grid: {
//       show: false,
//     },
//   }
// })

const chartOptions2 = computed(() => {
  return {
    title: {
      text: `${props.symbol}${parseFloat(
        profitsData.value[profitRangeOption.value].reduce(
          (sum, v) => sum + parseFloat(v),
          0,
        ),
      ).toFixed(props.decimals)}`,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: 'white',
      },
    },
    chart: {
      type: 'bar',
      height: 250,
      offsetY: 15,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        columnWidth: '60%',
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#00e0ff'],
    stroke: {
      show: true,
      width: 0,
      colors: ['#00e0ff'],
    },
    xaxis: {
      categories: profitsTimestamps.value[profitRangeOption.value],
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      labels: {
        show: true,
        hideOverlappingLabels: true,
        rotate: 0,
        style: {
          colors: '#777',
          fontSize: '10px',
          fontWeight: 400,
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        rotate: 0,
        rotateAlways: false,
        hideOverlappingLabels: true,
        style: {
          colors: 'white',
          fontSize: '10px',
          fontWeight: 400,
        },
      },
    },

    tooltip: {
      theme: false,
      marker: {
        show: false,
      },
      y: {
        formatter: (val, opt) => {
          let items =
            profitsData.value[`${profitRangeOption.value}_tokens`][
              opt.dataPointIndex
            ]
          let result_str = ''
          console.log(items)
          let results = {}
          for (let i = 0; i < items.length; i++) {
            let item = items[i]
            let symbol = tokens.value.find(
              (t) => t.address == item.token.toLowerCase(),
            ).symbol
            if (!results[symbol]) results[symbol] = 0
            results[symbol] += item.value
          }
          for (const [key, value] of Object.entries(results)) {
            result_str += `<div style="display:flex; gap:5px">${key} 
              <img src=${getTokenEntity(key, 'short').icon} width="20" height="20"/> 
            ${formatBigNumber(value, 3)}</div> <br>`
          }
          return `<div style="margin-left:-60px;">${result_str}</div> <br> ${props.symbol}${val}`
        },
      },
    },
    grid: {
      show: false,
    },
  }
})

const chartOptionsCLPool2 = computed(() => {
  return {
    ...tradesOptions.value,
    dataLabels: {
      enabled: false,
    },
    chart: {
      height: 250,
      offsetY: 15,
      stacked: true,
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    colors: ['#00e0ff'],
    plotOptions: {
      bar: {
        horizontal: false,
        // borderRadius: 5,
        // columnWidth: '100%',
        borderRadiusApplication: 'end',
      },
    },
    xaxis: {
      // categories: tradesTimestamps.value[tradeRangeOption.value],
      categories: [
        '-30% +30%',
        '-20% +20%',
        '-10% +10%',
        '-5% +5%',
        '-2.5% +2.5%',
        '-1% +1%',
      ],
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      labels: {
        show: true,
        hideOverlappingLabels: true,
        rotate: 0,
        style: {
          colors: '#777',
          fontSize: '10px',
          fontWeight: 400,
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        rotate: 0,
        rotateAlys: false,
        // hideOverlappingLabels: true,
        style: {
          colors: '#777',
          fontSize: '10px',
          fontWeight: 400,
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: '#777',
      },
      fontSize: '10px',

      markers: {
        width: 10,
        height: 10,
        radius: 100,
      },
    },
    tooltip: {
      theme: false,
      y: {
        formatter: (val, opt) => {
          return `${val}k`
        },
      },
    },
    grid: {
      show: true,
      borderColor: 'rgba(255, 255, 255, 0.11)',
    },
  }
})
</script>

<style lang="scss" scoped>
.diagrams-container {
  padding-left: 0;
  padding-right: 0;
}

.diagrams_title {
  font-size: clamp(10px, 0.9vw, 16px);
}

.diagram-row {
  &:not(:first-child) {
    margin-top: 35px;
  }
}

.diagram {
  height: 274px;
  width: 100%;
  background-color: white;
}

.chart_card {
  padding: 15px;
  height: 100%;
  backdrop-filter: blur(10px);

  border-radius: 20px;
  // background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;
  border: 1px solid #ffffff0d;
}

:deep(.apexcharts-tooltip) {
  background: #02031c7e !important;
  backdrop-filter: blur(10px);
  padding: 10px;
  border-radius: 11px;
  color: white;
}

.pool_disturb_actions {
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 4px 0px #00000040;
  border-radius: 100%;
  padding: 4px;
  cursor: pointer;
}
</style>
