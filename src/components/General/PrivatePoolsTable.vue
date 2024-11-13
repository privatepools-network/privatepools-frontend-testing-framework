<template>
  <div class="table__header">
    <Tabs
      style="margin-right: 15px"
      class="w-fit"
      :selectedTab="
        activitiesModes[english_names.indexOf(activitiesSelectedMode)]
      "
      :tabsOptions="activitiesModes"
      @changeTab="changeActivitiesMode"
    ></Tabs>

    <Tabs
      class="w-fit"
      :selectedTab="actSelectedPeriodOfData"
      :tabsOptions="periodsOfData"
      @changeTab="changeActPeriodOfData"
    >
    </Tabs>
  </div>
  <CRow id="pool-activity-row" class="table-wrapper !mx-0">
    {{ console.log('activities', activities) }}
    <div
      v-if="loader"
      class="!bg-[white] dark:!bg-[#fff0] backdrop-blur-md h-[500px]"
    >
      <LoaderPulse />
    </div>
    <div v-else-if="activities.length !== 0">
      <Table
        v-if="width > 768"
        :headers="
          activitiesSelectedMode === 'Trade'
            ? [t('actions'), t('details'), 'Route', t('profits'), t('time')]
            : activitiesSelectedMode === 'All'
            ? [t('actions'), t('details'), t('value'), t('profits'), t('time')]
            : [t('actions'), t('details'), t('value'), t('time')]
        "
      >
        <CTableBody
          v-if="activities"
          class="text-black dark:!text-white"
          :class="isDark ? 'table-body' : 'table-body-light'"
        >
          <CTableRow
            v-for="(item, i) in activities.slice(0, sliceNumber)"
            :key="i"
            class="table-row"
          >
            <CTableDataCell
              scope="row"
              class="text-black dark:!text-white table-cell"
            >
              <div class="actions-cell">
                <img v-if="item['Actions'] === 'Deposit'" :src="DepositIcon" />
                <img v-if="item['Actions'] === 'Harvest'" :src="HarvestIcon" />
                <img
                  v-if="item['Actions'] === 'Withdraw'"
                  :src="WithdrawIcon"
                />
                <img v-if="item['Actions'] === 'Trade'" :src="SwapIcon" />
                <div class="actions-cell__text text-black dark:!text-white">
                  {{ item['Actions'] }}
                </div>
              </div>
            </CTableDataCell>

            <CTableDataCell
              v-if="activitiesSelectedMode === 'Trade'"
              scope="row"
              class="text-black dark:!text-white table-cell"
            >
              <div class="details-cell">
                <div
                  class="font-['Roboto_Mono',_monospace] flex items-start flex-col gap-1 flex-wrap"
                >
                  <VTooltip :distance="0" :placement="'bottom'">
                    <div style="cursor: help">
                      <div class="flex items-center gap-1">
                        <img
                          :src="
                            getTokenEntity(item.PathDetails.in.symbol, 'short')
                              .icon
                          "
                          class="w-6"
                        />
                        {{ parseFloat(item.PathDetails.in.amount).toFixed(5) }}
                        (${{
                          parseFloat(item.PathDetails.in.amountUsd).toFixed(5)
                        }})
                        <svg
                          width="25"
                          height="24"
                          viewBox="0 0 25 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.3804 12L10.3804 8V11H2.38037V13H10.3804V16M20.3804 18V6C20.3804 5.46957 20.1697 4.96086 19.7946 4.58579C19.4195 4.21071 18.9108 4 18.3804 4H6.38037C5.84994 4 5.34123 4.21071 4.96616 4.58579C4.59108 4.96086 4.38037 5.46957 4.38037 6V9H6.38037V6H18.3804V18H6.38037V15H4.38037V18C4.38037 18.5304 4.59108 19.0391 4.96616 19.4142C5.34123 19.7893 5.84994 20 6.38037 20H18.3804C18.9108 20 19.4195 19.7893 19.7946 19.4142C20.1697 19.0391 20.3804 18.5304 20.3804 18Z"
                            fill="#00E0FF"
                          />
                        </svg>
                      </div>
                    </div>
                    <template #popper>
                      <div class="tooltip_container !w-fit">
                        <div class="flex items-center gap-1">
                          <img :src="info" />
                          <div class="tooltip_container_text">Input token</div>
                        </div>
                      </div>
                    </template>
                  </VTooltip>

                  <VTooltip :distance="0" :placement="'bottom'">
                    <div style="cursor: help">
                      <div class="flex items-center gap-1">
                        <img
                          :src="
                            getTokenEntity(
                              item.PathDetails.traded.symbol,
                              'short',
                            ).icon
                          "
                          class="w-6"
                        />
                        {{
                          parseFloat(item.PathDetails.traded.amount).toFixed(5)
                        }}
                        (${{
                          parseFloat(item.PathDetails.traded.amountUsd).toFixed(
                            5,
                          )
                        }})
                        <svg
                          width="21"
                          height="20"
                          viewBox="0 0 21 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_2294_614)">
                            <path
                              d="M20.3804 3.8V13.16C20.3804 13.6374 20.1907 14.0952 19.8532 14.4328C19.5156 14.7704 19.0578 14.96 18.5804 14.96H10.0232C10.2064 15.1701 10.3013 15.4429 10.288 15.7213C10.2747 15.9997 10.1543 16.2623 9.95189 16.454C9.74951 16.6456 9.48085 16.7517 9.2021 16.7498C8.92335 16.748 8.65611 16.6384 8.45627 16.4441L6.65627 14.6441C6.55559 14.5438 6.4757 14.4245 6.42119 14.2933C6.36668 14.162 6.33862 14.0212 6.33862 13.8791C6.33862 13.737 6.36668 13.5962 6.42119 13.4649C6.4757 13.3337 6.55559 13.2144 6.65627 13.1141L8.45627 11.3141C8.65508 11.114 8.9243 10.9996 9.20635 10.9954C9.4884 10.9912 9.7609 11.0975 9.96558 11.2916C10.1703 11.4857 10.2909 11.7522 10.3016 12.0341C10.3124 12.316 10.2125 12.5909 10.0232 12.8H18.2204V4.16H8.86037C8.86037 4.44643 8.74659 4.72114 8.54405 4.92368C8.34151 5.12621 8.0668 5.24 7.78037 5.24C7.49394 5.24 7.21923 5.12621 7.0167 4.92368C6.81416 4.72114 6.70037 4.44643 6.70037 4.16V3.8C6.70037 3.32261 6.89001 2.86477 7.22758 2.52721C7.56514 2.18964 8.02298 2 8.50037 2H18.5804C19.0578 2 19.5156 2.18964 19.8532 2.52721C20.1907 2.86477 20.3804 3.32261 20.3804 3.8ZM14.9804 16.76C14.6939 16.76 14.4192 16.8738 14.2167 17.0763C14.0142 17.2789 13.9004 17.5536 13.9004 17.84H4.54037V9.2H12.7376C12.5544 9.41009 12.4595 9.68288 12.4728 9.96131C12.486 10.2397 12.6065 10.5023 12.8088 10.694C13.0112 10.8856 13.2799 10.9917 13.5586 10.9898C13.8374 10.988 14.1046 10.8784 14.3045 10.6841L16.1045 8.8841C16.2052 8.78376 16.285 8.66454 16.3396 8.53326C16.3941 8.40199 16.4221 8.26124 16.4221 8.1191C16.4221 7.97696 16.3941 7.83621 16.3396 7.70494C16.285 7.57366 16.2052 7.45443 16.1045 7.3541L14.3045 5.5541C14.1057 5.35399 13.8364 5.2396 13.5544 5.2354C13.2723 5.2312 12.9998 5.33752 12.7952 5.53162C12.5905 5.72572 12.4699 5.9922 12.4591 6.27408C12.4483 6.55596 12.5483 6.83086 12.7376 7.04H4.18037C3.70298 7.04 3.24514 7.22964 2.90758 7.56721C2.57001 7.90477 2.38037 8.36261 2.38037 8.84V18.2C2.38037 18.6774 2.57001 19.1352 2.90758 19.4728C3.24514 19.8104 3.70298 20 4.18037 20H14.2604C14.7378 20 15.1956 19.8104 15.5332 19.4728C15.8707 19.1352 16.0604 18.6774 16.0604 18.2V17.84C16.0604 17.5536 15.9466 17.2789 15.744 17.0763C15.5415 16.8738 15.2668 16.76 14.9804 16.76Z"
                              fill="#00E0FF"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_2294_614">
                              <rect
                                width="20"
                                height="20"
                                fill="white"
                                transform="translate(0.380371)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    <template #popper>
                      <div class="tooltip_container !w-fit">
                        <div class="flex items-center gap-1">
                          <img :src="info" />
                          <div class="tooltip_container_text">Traded token</div>
                        </div>
                      </div>
                    </template>
                  </VTooltip>

                  <VTooltip :distance="0" :placement="'bottom'">
                    <div style="cursor: help">
                      <div class="flex items-center gap-1">
                        <img
                          :src="
                            getTokenEntity(item.PathDetails.out.symbol, 'short')
                              .icon
                          "
                          class="w-6"
                        />
                        {{ parseFloat(item.PathDetails.out.amount).toFixed(5) }}
                        (${{
                          parseFloat(item.PathDetails.out.amountUsd).toFixed(5)
                        }})
                        <svg
                          width="20"
                          height="19"
                          viewBox="0 0 20 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.3158 17C16.7789 17 17.1753 16.8369 17.5048 16.5108C17.8344 16.1847 17.9994 15.7922 18 15.3333V3.66667C18 3.20833 17.8349 2.81611 17.5048 2.49C17.1747 2.16389 16.7784 2.00056 16.3158 2H4.52632C4.06316 2 3.66653 2.16333 3.33642 2.49C3.00632 2.81667 2.84154 3.20889 2.8421 3.66667V5.33333H4.52632V3.66667H16.3158V15.3333H4.52632V13.6667H2.8421V15.3333C2.8421 15.7917 3.00688 16.1842 3.33642 16.5108C3.66597 16.8375 4.0626 17.0006 4.52632 17H16.3158ZM6.21053 13.6667L7.38947 12.5L5.22105 10.3333H12.9474V8.66667H5.22105L7.38947 6.5L6.21053 5.33333L2 9.5L6.21053 13.6667Z"
                            fill="#00E0FF"
                          />
                        </svg>
                      </div>
                    </div>
                    <template #popper>
                      <div class="tooltip_container !w-fit">
                        <div class="flex items-center gap-1">
                          <img :src="info" />
                          <div class="tooltip_container_text">Output token</div>
                        </div>
                      </div>
                    </template>
                  </VTooltip>
                </div>
              </div>
            </CTableDataCell>

            <CTableDataCell
              v-if="activitiesSelectedMode != 'Trade'"
              scope="row"
              class="text-black dark:!text-white table-cell"
            >
              <div class="details-cell" v-if="item['Actions'] !== 'Trade'">
                <div
                  v-for="(tokenEntry, tokenIndex) in item['Details']"
                  class="details-cell__token-entity"
                  :key="`activity-token-key-${tokenIndex}`"
                >
                  <div
                    v-for="(tokenInfo, tokenInfoIndex) in Object.entries(
                      tokenEntry,
                    )"
                    :class="
                      tokenInfo[0] !== 'action'
                        ? 'details-cell__token-entity'
                        : 'hidden'
                    "
                    :key="`activity-token-info-key-${tokenInfoIndex}`"
                  >
                    <div
                      v-if="tokenInfo[0] !== 'action'"
                      class="d-flex align-items-center"
                    >
                      <img
                        :src="getTokenEntity(tokenInfo[0], 'short').icon"
                        class="details-cell__token-entity__icon"
                      />
                      <div
                        class="details-cell__token-entity__token-name font-['Roboto_Mono',_monospace]"
                      >
                        {{ trimZeros(tokenInfo[1]) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
           
              <div class="details-cell" v-else-if="item['Actions'] === 'Trade'">
                <div
                  class="font-['Roboto_Mono',_monospace] flex items-start flex-col gap-1 flex-wrap"
                >
                  <VTooltip :distance="0" :placement="'bottom'">
                    <div style="cursor: help">
                      <div class="flex items-center gap-1">
                        <img
                          :src="
                            getTokenEntity(item.PathDetails.in.symbol, 'short')
                              .icon
                          "
                          class="w-6"
                        />
                        {{ parseFloat(item.PathDetails.in.amount).toFixed(5) }}
                        (${{
                          parseFloat(item.PathDetails.in.amountUsd).toFixed(5)
                        }})
                        <svg
                          width="25"
                          height="24"
                          viewBox="0 0 25 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.3804 12L10.3804 8V11H2.38037V13H10.3804V16M20.3804 18V6C20.3804 5.46957 20.1697 4.96086 19.7946 4.58579C19.4195 4.21071 18.9108 4 18.3804 4H6.38037C5.84994 4 5.34123 4.21071 4.96616 4.58579C4.59108 4.96086 4.38037 5.46957 4.38037 6V9H6.38037V6H18.3804V18H6.38037V15H4.38037V18C4.38037 18.5304 4.59108 19.0391 4.96616 19.4142C5.34123 19.7893 5.84994 20 6.38037 20H18.3804C18.9108 20 19.4195 19.7893 19.7946 19.4142C20.1697 19.0391 20.3804 18.5304 20.3804 18Z"
                            fill="#00E0FF"
                          />
                        </svg>
                      </div>
                    </div>
                    <template #popper>
                      <div class="tooltip_container !w-fit">
                        <div class="flex items-center gap-1">
                          <img :src="info" />
                          <div class="tooltip_container_text">Input token</div>
                        </div>
                      </div>
                    </template>
                  </VTooltip>

                  <VTooltip :distance="0" :placement="'bottom'">
                    <div style="cursor: help">
                      <div class="flex items-center gap-1">
                        <img
                          :src="
                            getTokenEntity(
                              item.PathDetails.traded.symbol,
                              'short',
                            ).icon
                          "
                          class="w-6"
                        />
                        {{
                          parseFloat(item.PathDetails.traded.amount).toFixed(5)
                        }}
                        (${{
                          parseFloat(item.PathDetails.traded.amountUsd).toFixed(
                            5,
                          )
                        }})
                        <svg
                          width="21"
                          height="20"
                          viewBox="0 0 21 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_2294_614)">
                            <path
                              d="M20.3804 3.8V13.16C20.3804 13.6374 20.1907 14.0952 19.8532 14.4328C19.5156 14.7704 19.0578 14.96 18.5804 14.96H10.0232C10.2064 15.1701 10.3013 15.4429 10.288 15.7213C10.2747 15.9997 10.1543 16.2623 9.95189 16.454C9.74951 16.6456 9.48085 16.7517 9.2021 16.7498C8.92335 16.748 8.65611 16.6384 8.45627 16.4441L6.65627 14.6441C6.55559 14.5438 6.4757 14.4245 6.42119 14.2933C6.36668 14.162 6.33862 14.0212 6.33862 13.8791C6.33862 13.737 6.36668 13.5962 6.42119 13.4649C6.4757 13.3337 6.55559 13.2144 6.65627 13.1141L8.45627 11.3141C8.65508 11.114 8.9243 10.9996 9.20635 10.9954C9.4884 10.9912 9.7609 11.0975 9.96558 11.2916C10.1703 11.4857 10.2909 11.7522 10.3016 12.0341C10.3124 12.316 10.2125 12.5909 10.0232 12.8H18.2204V4.16H8.86037C8.86037 4.44643 8.74659 4.72114 8.54405 4.92368C8.34151 5.12621 8.0668 5.24 7.78037 5.24C7.49394 5.24 7.21923 5.12621 7.0167 4.92368C6.81416 4.72114 6.70037 4.44643 6.70037 4.16V3.8C6.70037 3.32261 6.89001 2.86477 7.22758 2.52721C7.56514 2.18964 8.02298 2 8.50037 2H18.5804C19.0578 2 19.5156 2.18964 19.8532 2.52721C20.1907 2.86477 20.3804 3.32261 20.3804 3.8ZM14.9804 16.76C14.6939 16.76 14.4192 16.8738 14.2167 17.0763C14.0142 17.2789 13.9004 17.5536 13.9004 17.84H4.54037V9.2H12.7376C12.5544 9.41009 12.4595 9.68288 12.4728 9.96131C12.486 10.2397 12.6065 10.5023 12.8088 10.694C13.0112 10.8856 13.2799 10.9917 13.5586 10.9898C13.8374 10.988 14.1046 10.8784 14.3045 10.6841L16.1045 8.8841C16.2052 8.78376 16.285 8.66454 16.3396 8.53326C16.3941 8.40199 16.4221 8.26124 16.4221 8.1191C16.4221 7.97696 16.3941 7.83621 16.3396 7.70494C16.285 7.57366 16.2052 7.45443 16.1045 7.3541L14.3045 5.5541C14.1057 5.35399 13.8364 5.2396 13.5544 5.2354C13.2723 5.2312 12.9998 5.33752 12.7952 5.53162C12.5905 5.72572 12.4699 5.9922 12.4591 6.27408C12.4483 6.55596 12.5483 6.83086 12.7376 7.04H4.18037C3.70298 7.04 3.24514 7.22964 2.90758 7.56721C2.57001 7.90477 2.38037 8.36261 2.38037 8.84V18.2C2.38037 18.6774 2.57001 19.1352 2.90758 19.4728C3.24514 19.8104 3.70298 20 4.18037 20H14.2604C14.7378 20 15.1956 19.8104 15.5332 19.4728C15.8707 19.1352 16.0604 18.6774 16.0604 18.2V17.84C16.0604 17.5536 15.9466 17.2789 15.744 17.0763C15.5415 16.8738 15.2668 16.76 14.9804 16.76Z"
                              fill="#00E0FF"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_2294_614">
                              <rect
                                width="20"
                                height="20"
                                fill="white"
                                transform="translate(0.380371)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    <template #popper>
                      <div class="tooltip_container !w-fit">
                        <div class="flex items-center gap-1">
                          <img :src="info" />
                          <div class="tooltip_container_text">Traded token</div>
                        </div>
                      </div>
                    </template>
                  </VTooltip>

                  <VTooltip :distance="0" :placement="'bottom'">
                    <div style="cursor: help">
                      <div class="flex items-center gap-1">
                        <img
                          :src="
                            getTokenEntity(item.PathDetails.out.symbol, 'short')
                              .icon
                          "
                          class="w-6"
                        />
                        {{ parseFloat(item.PathDetails.out.amount).toFixed(5) }}
                        (${{
                          parseFloat(item.PathDetails.out.amountUsd).toFixed(5)
                        }})
                        <svg
                          width="20"
                          height="19"
                          viewBox="0 0 20 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.3158 17C16.7789 17 17.1753 16.8369 17.5048 16.5108C17.8344 16.1847 17.9994 15.7922 18 15.3333V3.66667C18 3.20833 17.8349 2.81611 17.5048 2.49C17.1747 2.16389 16.7784 2.00056 16.3158 2H4.52632C4.06316 2 3.66653 2.16333 3.33642 2.49C3.00632 2.81667 2.84154 3.20889 2.8421 3.66667V5.33333H4.52632V3.66667H16.3158V15.3333H4.52632V13.6667H2.8421V15.3333C2.8421 15.7917 3.00688 16.1842 3.33642 16.5108C3.66597 16.8375 4.0626 17.0006 4.52632 17H16.3158ZM6.21053 13.6667L7.38947 12.5L5.22105 10.3333H12.9474V8.66667H5.22105L7.38947 6.5L6.21053 5.33333L2 9.5L6.21053 13.6667Z"
                            fill="#00E0FF"
                          />
                        </svg>
                      </div>
                    </div>
                    <template #popper>
                      <div class="tooltip_container !w-fit">
                        <div class="flex items-center gap-1">
                          <img :src="info" />
                          <div class="tooltip_container_text">Output token</div>
                        </div>
                      </div>
                    </template>
                  </VTooltip>
                </div>
              </div>
            </CTableDataCell>

            <CTableDataCell
              v-if="activitiesSelectedMode != 'Trade'"
              scope="row"
              class="text-black dark:!text-white table-cell"
            >
              <div class="font-['Roboto_Mono',_monospace] flex items-center">
                <!-- {{ console.log('111111', item['Value']) }} -->
                <CurrencySymbol />{{
                  item[
                    `Value${
                      currentCurrency == 'USD' ? '' : '_' + currentCurrency
                    }`
                  ] === '-'
                    ? '-'
                    : trimZeros(
                        item[
                          `Value${
                            currentCurrency == 'USD'
                              ? ''
                              : '_' + currentCurrency
                          }`
                        ],
                      )
                }}
              </div>
            </CTableDataCell>

            <CTableDataCell
              v-if="activitiesSelectedMode === 'Trade'"
              scope="row"
              class="text-black dark:!text-white table-cell"
            >
              <div
                class="font-['Roboto_Mono',_monospace] flex items-center flex-col gap-1 flex-wrap"
              >
                <div class="flex items-center gap-1">
                  <img
                    :src="
                      item.PathDetails.buyPath === 'Private Pools'
                        ? d3logo
                        : binanceCEX
                    "
                    :class="
                      item.PathDetails.buyPath === 'Private Pools'
                        ? 'w-4'
                        : 'w-6'
                    "
                  />
                  {{ item.PathDetails.buyPath }}
                </div>
                <img :src="swapArrowIcon" class="rotate-90" />
                <div class="flex items-center gap-1">
                  <img
                    :src="
                      item.PathDetails.sellPath === 'Private Pools'
                        ? d3logo
                        : binanceCEX
                    "
                    :class="
                      item.PathDetails.sellPath === 'Private Pools'
                        ? 'w-4'
                        : 'w-6'
                    "
                  />
                  {{ item.PathDetails.sellPath }}
                </div>
              </div>
            </CTableDataCell>

            <CTableDataCell
              v-if="
                activitiesSelectedMode === 'Trade' ||
                activitiesSelectedMode === 'All'
              "
              scope="row"
              class="text-black dark:!text-white table-cell"
            >
              <div
                class="font-['Roboto_Mono',_monospace] flex items-center"
                v-if="activitiesSelectedMode === 'Trade'"
              >
                <VTooltip :distance="0" :placement="'bottom'">
                  <div style="cursor: help">
                    <CurrencySymbol />{{
                      item[
                        `Profits${
                          currentCurrency == 'USD' ? '' : '_' + currentCurrency
                        }`
                      ] === undefined
                        ? '-'
                        : trimZeros(
                            parseFloat(
                              item[
                                `Profits${
                                  currentCurrency == 'USD'
                                    ? ''
                                    : '_' + currentCurrency
                                }`
                              ],
                            ).toFixed(currencyDecimals),
                          )
                    }}
                  </div>
                  <template #popper>
                    <div class="tooltip_container !w-fit">
                      <div class="flex items-center gap-1">
                        <img
                          :src="
                            getTokenEntity(item.PathDetails.in.symbol, 'short')
                              .icon
                          "
                          class="w-4"
                        />
                        <div class="tooltip_container_text">
                          {{ item.Profits_tokens.toFixed(8) }}
                        </div>
                      </div>
                    </div>
                  </template>
                </VTooltip>
              </div>
              <div
                v-else
                class="font-['Roboto_Mono',_monospace] flex items-center"
              >
                <CurrencySymbol />{{
                  item[
                    `Profits${
                      currentCurrency == 'USD' ? '' : '_' + currentCurrency
                    }`
                  ] === undefined
                    ? '-'
                    : trimZeros(
                        parseFloat(
                          item[
                            `Profits${
                              currentCurrency == 'USD'
                                ? ''
                                : '_' + currentCurrency
                            }`
                          ],
                        ).toFixed(currencyDecimals),
                      )
                }}
              </div>
            </CTableDataCell>

            <CTableDataCell
              scope="row"
              class="text-black dark:!text-white table-cell"
            >
              <div class="time-cell">
                <a
                  target="_blank"
                  :href="`${
                    configService.getNetworkConfig(item.chainId).explorer
                  }/tx/${item.Tx}`"
                  class="flex items-center gap-1 text-black dark:!text-white"
                >
                  {{ moment.unix(item['timestamp']).format('L, LTS') }}
                  <div class="w-[14px] h-[14px]">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.5068 7.58333V11.0833C10.5068 11.3928 10.3839 11.6895 10.1651 11.9083C9.94633 12.1271 9.64959 12.25 9.34017 12.25H2.9235C2.61408 12.25 2.31734 12.1271 2.09854 11.9083C1.87975 11.6895 1.75684 11.3928 1.75684 11.0833V4.66667C1.75684 4.35725 1.87975 4.0605 2.09854 3.84171C2.31734 3.62292 2.61408 3.5 2.9235 3.5H6.4235"
                        stroke="#00e0ff"
                        stroke-width="1.16667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.75684 1.75H12.2568V5.25"
                        stroke="#00e0ff"
                        stroke-width="1.16667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M5.83984 8.16667L12.2565 1.75"
                        stroke="#00e0ff"
                        stroke-width="1.16667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </a>
              </div>
            </CTableDataCell>
          </CTableRow>
          <div
            v-if="sliceNumber < activities.length"
            @click="activities.slice(0, (sliceNumber = sliceNumber + 5))"
            class="load_more text-black dark:!text-white"
          >
            {{ $t('load_more') }}
            <img :src="arrow_bottom" class="!border-b-0 !p-0" />
          </div>
        </CTableBody>
      </Table>

      <div v-else>
        <div v-for="(item, i) in activities.slice(0, sliceNumber)" :key="i">
          <div class="mobile_pool_activity">
            <div class="flex justify-between">
              <div class="flex items-center">
                <img v-if="item['Actions'] === 'Deposit'" :src="DepositIcon" />
                <img v-if="item['Actions'] === 'Harvest'" :src="HarvestIcon" />
                <img
                  v-if="item['Actions'] === 'Withdraw'"
                  :src="WithdrawIcon"
                />
                <img v-if="item['Actions'] === 'Trade'" :src="SwapIcon" />
                <div class="actions-cell__text text-black dark:!text-white">
                  {{ item['Actions'] }}
                </div>
              </div>

              <div
                class="text-black dark:!text-white text-xs font-['Roboto_Mono',_monospace] flex items-center"
              >
                <CurrencySymbol />{{
                  item[
                    `Profits${
                      currentCurrency == 'USD' ? '' : '_' + currentCurrency
                    }`
                  ] === undefined
                    ? '-'
                    : trimZeros(
                        parseFloat(
                          item[
                            `Profits${
                              currentCurrency == 'USD'
                                ? ''
                                : '_' + currentCurrency
                            }`
                          ],
                        ).toFixed(currencyDecimals),
                      )
                }}
              </div>
            </div>
            <div class="flex justify-between items-end mt-4">
              <div
                class="text-black dark:!text-white flex flex-wrap w-[70%] gap-1"
              >
                <div
                  v-for="(tokenEntry, tokenIndex) in item['Details']"
                  class="flex flex-wrap gap-1"
                  :key="`activity-token-key-${tokenIndex}`"
                >
                  <div
                    class="bg-[#22222224] rounded-2xl text-xs"
                    v-for="(tokenInfo, tokenInfoIndex) in Object.entries(
                      tokenEntry,
                    )"
                    :class="
                      tokenInfo[0] !== 'action'
                        ? 'details-cell__token-entity'
                        : ''
                    "
                    :key="`activity-token-info-key-${tokenInfoIndex}`"
                  >
                    <div
                      v-if="tokenInfo[0] !== 'action'"
                      class="d-flex align-items-center"
                    >
                      <img
                        :src="getTokenEntity(tokenInfo[0], 'short').icon"
                        class="details-cell__token-entity__icon"
                      />
                      <div
                        class="details-cell__token-entity__token-name font-['Roboto_Mono',_monospace]"
                      >
                        {{ trimZeros(tokenInfo[1]) }}
                      </div>
                      <div
                        v-if="
                          tokenEntry.action === 'Swap' && tokenInfoIndex === 1
                        "
                        style="margin-left: 10px"
                      >
                        <img :src="swapArrowIcon" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="text-[10px] w-[25%]">
                <a
                  target="_blank"
                  :href="`${
                    configService.getNetworkConfig(item.chainId).explorer
                  }/tx/${item.Tx}`"
                  class="flex items-center text-decoration-none text-black dark:!text-white"
                >
                  {{ moment.unix(item['timestamp']).format('L, LTS') }}
                  <div class="w-[10px] h-[10px]">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.5068 7.58333V11.0833C10.5068 11.3928 10.3839 11.6895 10.1651 11.9083C9.94633 12.1271 9.64959 12.25 9.34017 12.25H2.9235C2.61408 12.25 2.31734 12.1271 2.09854 11.9083C1.87975 11.6895 1.75684 11.3928 1.75684 11.0833V4.66667C1.75684 4.35725 1.87975 4.0605 2.09854 3.84171C2.31734 3.62292 2.61408 3.5 2.9235 3.5H6.4235"
                        stroke="#00e0ff"
                        stroke-width="1.16667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.75684 1.75H12.2568V5.25"
                        stroke="#00e0ff"
                        stroke-width="1.16667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M5.83984 8.16667L12.2565 1.75"
                        stroke="#00e0ff"
                        stroke-width="1.16667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full flex justify-center mt-4">
          <div
            v-if="sliceNumber < activities.length"
            @click="activities.slice(0, (sliceNumber = sliceNumber + 5))"
            class="bg-[#00E0FF] dark:text-[#02031C] rounded-full font-semibold px-3 py-1 w-fit"
          >
            {{ $t('load_more') }}
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="d-flex flex-column gap-2 justify-content-center align-items-center h-100 py-20"
    >
      <div
        class="text-black dark:!text-white"
        style="font-size: 14px; text-align: center"
      >
        {{ console.log('activitiesSelectedMode', activitiesSelectedMode) }}
        {{
          activitiesSelectedMode === 'Withdraw'
            ? 'No results'
            : 'No Activity yet'
        }}
      </div>
      <div
        class="text-black dark:!text-white"
        style="font-size: 12px; text-align: center"
      >
        {{
          activitiesSelectedMode === 'Withdraw'
            ? ''
            : 'Choose a pool to invest or create a pool to get started'
        }}
      </div>
      <!-- <div class="add_liq_btn_pools" v-if="activitiesSelectedMode !== 'Withdraw'">
        <div class="d-flex gap-1">+ Add liquidity</div>
      </div> -->
    </div>
  </CRow>

  <!-- <Pagination :perPage="perPage" :pools="activities" :currentPage="currentPage" @changePage="changePage"
    @changePerPage="changePerPage" :perPageOptions="[25, 50, 100]"></Pagination> -->
</template>
<script setup>
import Tabs from '@/UI/Tabs'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
import Table from '@/UI/Table'
import { ref, defineProps, computed, toRefs } from 'vue'
import { getTokenEntity } from '@/lib/helpers/util'
import { generateTimeAgoString, trimZeros } from '@/lib/utils'
import { configService } from '@/services/config/config.service'
import DepositIcon from '@/assets/icons/TableAction/DepositIcon.svg'
import HarvestIcon from '@/assets/icons/TableAction/harvestIcon.svg'
import WithdrawIcon from '@/assets/icons/TableAction/WithdrawIcon.svg'
import SwapIcon from '@/assets/icons/TableAction/SwapIcon.svg'
import swapArrowIcon from '@/assets/icons/TableAction/swapArrowIcon.svg'
import binanceCEX from '@/assets/icons/networks/binanceCEX.svg'
import { useDark } from '@vueuse/core'
import Pagination from '../Pool/Pagination.vue'
import { t } from 'i18next'
import arrow_bottom from '@/assets/icons/arrow/arrow_loadmore.svg'
import moment from 'moment'
import { storeToRefs } from 'pinia'
import { useSettings } from '@/store/settings'
import d3logo from '@/assets/images/d3v.png'
import Btc from '@/assets/images/tokens/btc.png'
import Ether from '@/assets/images/tokens/ETH.png'
import info from '@/assets/images/info.svg'
import router from '@/router'

import CurrencySymbol from '@/components/TrackInfo/CurrencySymbol.vue'
import { useDevice } from '@/composables/adaptive/useDevice'
const settingsStore = useSettings()
const { width } = useDevice()

const { currentCurrency } = storeToRefs(settingsStore)
const currencyDecimals = computed(() =>
  currentCurrency.value == 'USD' ? 5 : 8,
)
const isDark = useDark()

const props = defineProps([
  'clActivity',
  'wpActivity',
  'all_activities',
  'loader',
])
const sliceNumber = ref(10)

const activities = computed(() => {
  let result = props.all_activities ?? []
  console.log('HERE', props.all_activities)

  const combinedActivities = [...result]

  let now = Date.now() / 1000
  let filtered_time_ago = now - actSelectedPeriodOfData.value.number
  return combinedActivities
    .filter(
      (item) =>
        activitiesSelectedMode.value == 'All' ||
        activitiesSelectedMode.value == item.Actions,
    )
    .filter((item) => item.timestamp >= filtered_time_ago)
    .sort((a, b) => b.timestamp - a.timestamp)
})

// const perPage = ref(25)
// const currentPage = ref(1)

// function changePage(args) {
//   if (args.isEquating == false) {
//     currentPage.value = currentPage.value + args.num
//   } else {
//     currentPage.value = args.num
//   }
// }

// function changePerPage(v1) {
//   perPage.value = Number(v1)
//   currentPage.value = 1
// }

const periodsOfData = [
  {
    number: 86400,
    title: '24H',
  },
  {
    number: 604800,
    title: '7D',
  },
  {
    number: 2592000,
    title: '1M',
  },
  {
    number: 31536000,
    title: '1Y',
  },
  {
    number: 3153600000,
    title: t('all_time'),
  },
]

const english_names =
  router.currentRoute.value.path === '/portfolio'
    ? ['All', 'Deposit', 'Trade', 'Harvest', 'Withdraw']
    : ['All', 'Deposit', 'Trade', 'Withdraw']
const activitiesModes =
  router.currentRoute.value.path === '/portfolio'
    ? [t('all'), t('deposit'), t('trade'), 'Harvest', t('withdraw')]
    : [t('all'), t('deposit'), t('trade'), t('withdraw')]

const activitiesSelectedMode = ref(english_names[0])
const actSelectedPeriodOfData = ref(periodsOfData[4])

function changeActivitiesMode(_new) {
  activitiesSelectedMode.value = english_names[activitiesModes.indexOf(_new)]
}

function changeActPeriodOfData(_new) {
  actSelectedPeriodOfData.value = _new
}
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
    width: 200px !important;

    @media (max-width: $xxl) {
      width: 200px !important;
    }
  }
}

:deep(.table-header-font-folder) {
  text-align: left;
  @include cells-widths;
}

.table {
  &__header {
    display: flex;
    margin-bottom: 18px;
    @media (max-width: $md) {
      flex-direction: column;
      gap: 10px;
    }
  }

  &-body-light {
    display: block;
    // max-height: 500px;
    overflow-x: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
      background-color: #ffffff;
      border-radius: 50px;
      margin-bottom: 10px;
    }

    &::-webkit-scrollbar {
      width: 8px !important;
      height: 8px !important;
      background: #ffffff;
      border-radius: 50px;
    }

    &::-webkit-scrollbar-thumb {
      border: 1px solid #02120a71;
      background: #00c9ff;
      border-radius: 21px;
    }
  }

  &-body {
    display: block;
    // max-height: 500px;
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
    outline: 0.5px solid rgba(163, 164, 165, 0.2196078431);
    width: 100%;
    overflow-x: auto;
    margin-bottom: 30px;
    border-radius: 16px;
    background: #22222224;
    box-shadow: 0px 4px 4px 0px #00000040;
    border: 1px solid #ffffff0d;

    @media (max-width: 768px) {
      background: none;
      border: none;
      outline: none;
    }
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

.actions-cell {
  display: flex;
  align-items: center;

  &__text {
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    letter-spacing: 0em;
    // color: #ffffff;
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
    flex-wrap: wrap;
    gap: 8px;

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

.mobile_pool_activity {
  background: #22222224;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 4px 0px #00000040;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  padding: 8px;
  margin-bottom: 8px;
}
</style>
