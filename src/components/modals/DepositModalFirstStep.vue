<template>
  <CModal size="lg" alignment="center" :visible="visibleDepositModal">
    <CModalHeader :close-button="false">
      <div class="d-flex justify-content-between w-100">
        <div style="cursor: pointer" @click="
          depositStep == 1 ? $emit('changeVisibleDeposit') : depositStep--
          ">
          <img :src="arrow_back" />
        </div>
        <div style="cursor: pointer" @click="$emit('changeVisibleDeposit')">
          <img :src="close_modal_icon" />
        </div>
      </div>
    </CModalHeader>
    <CModalBody>
      <div class="modal_body_inside">
        <div v-if="depositStep === 1">
          <div class="modal_body_header">
            <h3>Stake in pool</h3>
          </div>
          <div>
            <div class="d-flex flex-column gap-2" v-if="balances != {} &&
              lastTokenPrices != {} &&
              lineNumbers.length > 0
              ">
              <div class="modal_stake_token" v-for="(token, tokenIndex) in pool.tokens"
                :key="`deposit-token-${token.address}`">
                <div>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="modal_stake_token_inner_name">
                      <img :src="getTokenEntity(token.symbol, 'short').icon" width="40" />
                      {{ token.symbol }} {{ token.weight }}%
                    </div>
                    <input class="token-input" style="
                        color: rgb(168, 168, 168);
                        font-size: 14px;
                        font-weight: 500;
                      " :value="lineNumbers[tokenIndex] > 0 ? lineNumbers[tokenIndex] / 1000 : lineNumbers[tokenIndex]"
                      type="number" @input="(e) => onTokenInput(e, tokenIndex)">

                  </div>
                  <div>
                    <div class="modal_balance_slider">
                      <div class="value-label" ref="inputRefLabel">
                        Balance:
                        <span class="fw-bold">{{
                          (
                            balances[token.address] -
                            lineNumbers[tokenIndex] / 1000
                          ).toFixed(3)
                        }}</span><span class="fw-bold bg-transparent" style="cursor: pointer;"
                          @click="() => OnMaxClick(tokenIndex, token.address)">
                          Max</span>
                      </div>
                      <div style="rgba(51, 51, 51, 1)">
                        ${{
                          (
                            (lineNumbers[tokenIndex] / 1000) *
                            lastTokenPrices[token.address]
                          ).toFixed(3)
                        }}
                      </div>
                    </div>
                    <div class="mt-2">
                      <Slider @change="(value) => OnSliderValueChange(tokenIndex, value)
                        " :tooltips="false" :min="0" :max="balances[token.address] * 1000" :step="1"
                        v-model="lineNumbers[tokenIndex]" lazy="false" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                  <td class="fs-5 w-25 fw-bold" style="
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
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="fs-5 w-25 fw-bold">
                        ${{
                          lineNumbers.reduce(
                            (sum, current, index) =>
                              sum +
                              (current / 1000) * lastTokenPrices[tokens[index]],
                            0,
                          )
                        }}
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
                <tr>
                  <td style="
                      border-right: 1px solid rgba(163, 164, 165, 0.2);
                      padding: 8px;
                    " class="w-25">
                    Value loss
                  </td>
                  <td style="padding: 8px">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        {{ priceImpactFormatted }}%
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                      <div style="
                          background: rgba(59, 97, 65, 0.5);
                          padding: 4px 7px;
                          border-radius: 5px;
                        " @click="OnOptimizeClick">
                        Optimize
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
            <div class="mt-3 w-100">
              <CButton @click="() => depositStep = 2" class="modal_preview_button">
                Preview
              </CButton>
            </div>
          </div>
        </div>
        <div v-if="depositStep > 1 && depositStep < 5">
          <div class="modal_body_header">
            <h3>Stake preview</h3>
          </div>

          <div class="modal_stake_preview">
            <div class="d-flex flex-column">
              <div v-for="(token, tokenIndex) in pool.tokens" :key="`preview-stake-token-${token.address}`"
                class="d-flex align-items-center p-2 gap-3"
                style="border-bottom: 1px solid rgba(163, 164, 165, 0.2); border-radius: 20px;">
                <div>
                  <img :src="getTokenEntity(token.symbol, 'short').icon" width="50" class="p-1"/>
                </div>
                <div class="d-flex flex-column">
                  <div>
                    {{ lineNumbers[tokenIndex] / 1000 }} {{ token.symbol }}
                  </div>
                  <div>
                    ${{
                      (lineNumbers[tokenIndex] / 1000) *
                      lastTokenPrices[token.address]
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style="
              border: 1px solid rgba(163, 164, 165, 0.2);
              border-radius: 20px;
              color: white;
            " class="my-4">
            <div class="fs-6 fw-bold p-2" style="border-bottom: 1px solid rgba(163, 164, 165, 0.2)">
              Summary
            </div>
            <div class="d-flex flex-column p-2" style="font-size: 14px; color: rgba(221, 221, 221, 1)">
              <div class="d-flex justify-content-between align-items-center">
                <div>Total</div>
                <div class="d-flex gap-1">
                  ${{
                    lineNumbers.reduce(
                      (sum, current, index) =>
                        sum + (current / 1000) * lastTokenPrices[tokens[index]],
                      0,
                    )
                  }}
                  <img :src="info" />
                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <div>Value Loss</div>
                <div class="d-flex gap-1">
                  {{ priceImpactFormatted }}% <img :src="info" />
                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <div>Potential weekly yield</div>
                <div class="d-flex gap-1">${{ totalWeeklyYield }}</div>
              </div>
            </div>
          </div>

          <div v-if="depositStep === 2" class="my-3 d-flex justify-content-center gap-2">
            <div>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="15.5" stroke="#00C9FF" />
                <path
                  d="M18 7.36932V25.6304C18 25.9937 17.8613 26.342 17.6145 26.5989C17.3676 26.8557 17.0328 27 16.6837 27C16.3346 27 15.9998 26.8557 15.7529 26.5989C15.506 26.342 15.3674 25.9937 15.3674 25.6304V9.78778L12.9727 11.2829C12.6737 11.4619 12.3191 11.5116 11.9852 11.4213C11.6513 11.331 11.3648 11.1079 11.1874 10.8001C11.01 10.4922 10.9558 10.1242 11.0366 9.77523C11.1173 9.42624 11.3265 9.12419 11.6191 8.93407L16.0069 6.1949C16.2066 6.07032 16.4345 6.0031 16.6674 6.0001C16.9002 5.99711 17.1297 6.05844 17.3323 6.17784C17.535 6.29724 17.7035 6.47043 17.8208 6.67975C17.9381 6.88907 18 7.12702 18 7.36932Z"
                  fill="#00C9FF" />
              </svg>
            </div>
            <div>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="15.5" stroke="white" stroke-opacity="0.27" />
                <path
                  d="M21.9987 24.6304C21.9987 24.9936 21.8529 25.342 21.5932 25.5989C21.3336 25.8557 20.9814 26 20.6142 26H11.3845C11.1274 26 10.8753 25.9292 10.6566 25.7955C10.4379 25.6617 10.2611 25.4704 10.1462 25.2429C10.0312 25.0154 9.9825 24.7607 10.0056 24.5074C10.0287 24.2541 10.1226 24.0121 10.2769 23.8086L18.5779 12.861C18.8538 12.5009 19.0494 12.0871 19.1518 11.6467C19.2541 11.2063 19.2609 10.7495 19.1717 10.3064C19.0825 9.86322 18.8993 9.44383 18.6342 9.07587C18.3691 8.70791 18.0281 8.39974 17.6338 8.1717C17.2395 7.94367 16.8008 7.80094 16.3466 7.75295C15.8924 7.70496 15.4331 7.75279 14.999 7.89329C14.5649 8.03379 14.1658 8.26377 13.8282 8.56804C13.4905 8.87231 13.2219 9.24396 13.0401 9.65846C12.8929 9.99143 12.618 10.2529 12.2759 10.3854C11.9339 10.5179 11.5526 10.5105 11.216 10.3649C10.8794 10.2193 10.6151 9.94744 10.4812 9.60904C10.3472 9.27064 10.3547 8.89347 10.5019 8.5605C10.6898 8.1356 10.9272 7.73381 11.2091 7.36325C12.1667 6.10614 13.5899 5.27683 15.1655 5.05776C15.9457 4.94929 16.7399 4.9939 17.5027 5.18904C18.2654 5.38419 18.9819 5.72605 19.6111 6.1951C20.2403 6.66415 20.77 7.25122 21.1698 7.92277C21.5697 8.59432 21.832 9.33722 21.9416 10.109C22.0513 10.8808 22.0062 11.6665 21.8089 12.421C21.6116 13.1756 21.2661 13.8844 20.7919 14.5068L14.1534 23.2608H20.6142C20.9814 23.2608 21.3336 23.4051 21.5932 23.662C21.8529 23.9188 21.9987 24.2672 21.9987 24.6304Z"
                  fill="#DCDCDC" fill-opacity="0.38" />
              </svg>
            </div>
          </div>
          <div v-if="depositStep === 3" class="my-3 d-flex justify-content-center gap-2">
            <div>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink">
                <circle cx="16" cy="16" r="15.5" stroke="#00C9FF" />
                <rect x="5" y="5" width="23" height="23" fill="url(#pattern0)" />
                <defs>
                  <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlink:href="#image0_1039_237" transform="scale(0.03125)" />
                  </pattern>
                  <image id="image0_1039_237" width="32" height="32"
                    xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAR3SURBVHgB7VbNTxtHFP/N7K5tPuIsjnBCsBNblWiaqqoV2qK2aWNuVaoK0irngvoHwKH0WqRKrZL2QG69AaceWgk49VIpRvSDSyRHVRqkUthQLOOAyAZiwN6P6awXm914zVKpolKUn7Rez7w37/3em3lvFniO/xnEORh59/QQARtIttHsB13CrdjXuSz+Ayx/GktP3dP614rsChiZvDlXGKsjMJyW5YAReFQdv9RO8XpMyIaDuCVpRqZjbE3Bv8DysCxTsWVg10BfZslIL22aVZHaLJSToxlVtQZidVYypH6ngfvrJnJbLPXRy+L4iaCA3Gdnpw2wyXM389PwiVYg7HMeWjq3ZeKnRRPbJeZUkZ/ooRR/Z1wZGHknOs0HfV5Ge2IUPXEBIqfbGoIiCFC89DQdqWIJMn/jbt7EnGJ4qXGnLHNjbr3X/o/69HvhhQjBh6+KaAniUDwpAd/d0a3sHaZW2wZaGZalBHzw1ybD73nDTw2LG6afcwtyGbZPm0BAU3AELDz0NYz5B/46Fr7MrGdrBMasE0mYb8kpPAvW0wjqLrC2ZcIXBDVftPqHm53FEaBsNnaQWfTfItsXma0jwE/jlaMs9svAUcCroOZL9FMOiQQJXgFnwkA2xw51ssfLT24iSHUSvhU22T29njBjTPUgQGb4j9UgKkYunOZPlFacV5GIMPx4v3GaGffV/4rgWmORWHhoYqFgkbfJUBCljoDBkBX4e+AN0WXACYlPv98loBGudlG0Btxzlq1ERMB7F1Ah8O0vOvYYZqrymrXfVooLX10NJy+eoSkv45oGbKwb2Ns10R7xJpHP6yhz63KYx+gRQ4hH0CzRiU9+WLtRnaNOhdfigowG0HQCc78A2CGlbumUtcby7jhJOMfULWYNK6EpxHA+JuJUm9DAManIznVKCAZIIzNWuacejcpyHYHiF3HrNmyYASulQb6/0VPe6aWUVWShIK9ycmg3lENCa6qOAIjZj+MCZR/XEeBR9eGYYFVrHQE+qeKYQBy+an3g8TaZ4fs45FQslU3s7Bz0/rNREQXeCbf4F87FdvdB+GOdIRYmaOIhFTZ0GPvLWvhEIOg+68y0v4ZcBAwd0yaFiwAlFKWSCS0oQ4t3Y0dTsbC9gQerK5yAuxrmeZuWNttwKR6F1tkB6e87kEoqTrRS6LpLFSbMmToCui5mpYBmpaZWCdZpD4cF5Dvfhpa8jDKfu1v4GRPzCuZXD076VsnOwMD1Hrx46bIdZXMboitT8ILzu7KWm+SYojrv6SoCvHuFyXZtXNzZsyPmBKqP5dwpsxDWCxAEj3plB+l3ZaACg/doivRTS9TI2q/Tasdbj43gyaH0m9249+cSWppDaG5qqijs7O5WnFsyC6FibiJSmJeZfbklnMb40Zh0jl0Ul4cTsijpE/y+PskI/2jghyX+zWqmKr/9/XiaUDb+tFEHFGaSwd7rg7U1qyOdKR51GvtlrrUUryVHVdWTwFFwe2o8wa/OUQJy3jnPmDkLkY71Xhs8tnJ+NvAPxbi8h+fX1CkAAAAASUVORK5CYII=" />
                </defs>
              </svg>
            </div>
            <div>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="15.5" stroke="#D7D7D7" stroke-opacity="0.27" />
                <path
                  d="M21.9987 24.6304C21.9987 24.9936 21.8529 25.342 21.5932 25.5989C21.3336 25.8557 20.9814 26 20.6142 26H11.3845C11.1274 26 10.8753 25.9292 10.6566 25.7955C10.4379 25.6617 10.2611 25.4704 10.1462 25.2429C10.0312 25.0154 9.9825 24.7607 10.0056 24.5074C10.0287 24.2541 10.1226 24.0121 10.2769 23.8086L18.5779 12.861C18.8538 12.5009 19.0494 12.0871 19.1518 11.6467C19.2541 11.2063 19.2609 10.7495 19.1717 10.3064C19.0825 9.86322 18.8993 9.44383 18.6342 9.07587C18.3691 8.70791 18.0281 8.39974 17.6338 8.1717C17.2395 7.94367 16.8008 7.80094 16.3466 7.75295C15.8924 7.70496 15.4331 7.75279 14.999 7.89329C14.5649 8.03379 14.1658 8.26377 13.8282 8.56804C13.4905 8.87231 13.2219 9.24396 13.0401 9.65846C12.8929 9.99143 12.618 10.2529 12.2759 10.3854C11.9339 10.5179 11.5526 10.5105 11.216 10.3649C10.8794 10.2193 10.6151 9.94744 10.4812 9.60904C10.3472 9.27064 10.3547 8.89347 10.5019 8.5605C10.6898 8.1356 10.9272 7.73381 11.2091 7.36325C12.1667 6.10614 13.5899 5.27683 15.1655 5.05776C15.9457 4.94929 16.7399 4.9939 17.5027 5.18904C18.2654 5.38419 18.9819 5.72605 19.6111 6.1951C20.2403 6.66415 20.77 7.25122 21.1698 7.92277C21.5697 8.59432 21.832 9.33722 21.9416 10.109C22.0513 10.8808 22.0062 11.6665 21.8089 12.421C21.6116 13.1756 21.2661 13.8844 20.7919 14.5068L14.1534 23.2608H20.6142C20.9814 23.2608 21.3336 23.4051 21.5932 23.662C21.8529 23.9188 21.9987 24.2672 21.9987 24.6304Z"
                  fill="#D7D7D7" fill-opacity="0.38" />
              </svg>
            </div>
          </div>
          <div v-if="depositStep === 4" class="my-3 d-flex justify-content-center gap-2">
            <div>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="15.5" stroke="#00C9FF" />
                <path d="M13.7 23.025L8 17.325L9.425 15.9L13.7 20.175L22.875 11L24.3 12.425L13.7 23.025Z"
                  fill="#F8F8F8" />
              </svg>
            </div>
            <div>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="15.5" stroke="#00C9FF" />
                <path
                  d="M21.9987 24.6304C21.9987 24.9936 21.8529 25.342 21.5932 25.5989C21.3336 25.8557 20.9814 26 20.6142 26H11.3845C11.1274 26 10.8753 25.9292 10.6566 25.7955C10.4379 25.6617 10.2611 25.4704 10.1462 25.2429C10.0312 25.0154 9.9825 24.7607 10.0056 24.5074C10.0287 24.2541 10.1226 24.0121 10.2769 23.8086L18.5779 12.861C18.8538 12.5009 19.0494 12.0871 19.1518 11.6467C19.2541 11.2063 19.2609 10.7495 19.1717 10.3064C19.0825 9.86322 18.8993 9.44383 18.6342 9.07587C18.3691 8.70791 18.0281 8.39974 17.6338 8.1717C17.2395 7.94367 16.8008 7.80094 16.3466 7.75295C15.8924 7.70496 15.4331 7.75279 14.999 7.89329C14.5649 8.03379 14.1658 8.26377 13.8282 8.56804C13.4905 8.87231 13.2219 9.24396 13.0401 9.65846C12.8929 9.99143 12.618 10.2529 12.2759 10.3854C11.9339 10.5179 11.5526 10.5105 11.216 10.3649C10.8794 10.2193 10.6151 9.94744 10.4812 9.60904C10.3472 9.27064 10.3547 8.89347 10.5019 8.5605C10.6898 8.1356 10.9272 7.73381 11.2091 7.36325C12.1667 6.10614 13.5899 5.27683 15.1655 5.05776C15.9457 4.94929 16.7399 4.9939 17.5027 5.18904C18.2654 5.38419 18.9819 5.72605 19.6111 6.1951C20.2403 6.66415 20.77 7.25122 21.1698 7.92277C21.5697 8.59432 21.832 9.33722 21.9416 10.109C22.0513 10.8808 22.0062 11.6665 21.8089 12.421C21.6116 13.1756 21.2661 13.8844 20.7919 14.5068L14.1534 23.2608H20.6142C20.9814 23.2608 21.3336 23.4051 21.5932 23.662C21.8529 23.9188 21.9987 24.2672 21.9987 24.6304Z"
                  fill="#00C9FF" />
              </svg>
            </div>
          </div>





          <div class="mt-3 w-100">

            <CButton v-if="depositStep === 2" @click.once="() => OnPreviewClick()" class="modal_preview_button">
              Preview
            </CButton>
            <CButton v-if="depositStep === 3" @click="() => depositStep = 4" color="success"
              class="modal_preview_button d-flex justify-content-center">
              <div class="d-flex align-items-center gap-3">
                <CSpinner size="sm" />
                <span v-if="depositStep == 3">Confirm approval in wallet</span>
                <span v-else-if="depositStep == 4">Join pool</span>
              </div>
            </CButton>

          </div>
        </div>
        <div v-if="depositStep === 5" class="deposit-settled">
          <div class="text-white d-flex justify-content-center">
            <h5>Deposit Settled</h5>
          </div>
          <div class="py-4 d-flex justify-content-center">
            <img :src="depositSuccessIcon" />
          </div>
          <div class="py-4 d-flex justify-content-center" style="color: rgba(136, 136, 136, 1); font-weight: 500">
          </div>
          <div class="d-flex justify-content-evenly mt-5">
            <a target="_blank" :href="txLink" style="text-decoration: none;">
              <CButton style="width: 148px; border-radius: 10px;" v-if="depositStep === 5" color="success"
                class="text-white fw-bold d-flex justify-content-center">
                <div class="d-flex align-items-center gap-2">
                  <div>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10.5 7.58333V11.0833C10.5 11.3928 10.3771 11.6895 10.1583 11.9083C9.9395 12.1271 9.64275 12.25 9.33333 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V4.66667C1.75 4.35725 1.87292 4.0605 2.09171 3.84171C2.3105 3.62292 2.60725 3.5 2.91667 3.5H6.41667"
                        stroke="white" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M8.75 1.75H12.25V5.25" stroke="white" stroke-width="1.16667" stroke-linecap="round"
                        stroke-linejoin="round" />
                      <path d="M5.83203 8.16667L12.2487 1.75" stroke="white" stroke-width="1.16667" stroke-linecap="round"
                        stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div>Receipt</div>
                </div>
              </CButton>
            </a>

            <CButton style="width: 148px; border-radius: 10px;" v-if="depositStep === 5" @click="() => {
              $emit('changeVisibleDeposit');
              depositStep = 1
            }
              " color="success" class="text-white fw-bold d-flex justify-content-center">
              <div>Close</div>
            </CButton>

          </div>
        </div>
      </div>
    </CModalBody>
  </CModal>
</template>

<script setup>
import depositSuccessIcon from '@/assets/icons/deposit_success.svg'
import info from '@/assets/images/info.svg'
import arrow_back from '@/assets/icons/arrow/arrow_back.svg'
import close_modal_icon from '@/assets/icons/arrow/close_modal_icon.svg'
import Slider from '@vueform/slider'
import { ref, defineProps, onMounted, toRef, computed } from 'vue'
import { usePoolActionBalances } from '@/composables/balances/usePoolActionBalances'
import { getTokenEntity } from '@/lib/helpers/util'
import { useApproveTokens } from '@/composables/poolActions/deposit/useApproveTokens'
import useInvestFormMath from '@/composables/math/investMath/useInvestMath'
import { bnum, formatNotificationDate } from '@/lib/utils'
import { useJoinPool } from '@/composables/poolActions/deposit/useJoinPool'
import { configService } from '@/services/config/config.service'
import { networkId, DisplayNetwork } from '@/composables/useNetwork'
var emitter = require('tiny-emitter/instance');
const props = defineProps([
  'visibleDepositModal',
  'changeVisibleDeposit',
  'pool',
  'tokens',
])
const lineNumbers = ref([])
const balances = ref({})
const txLink = ref('')
const lastTokenPrices = ref({})
const formattedLineNumbers = computed(() =>
  lineNumbers.value.map((ln) => ln / 1000),
)
const { priceImpact, fullAmounts, bptOut } = useInvestFormMath(
  toRef(props.pool),
  props.pool.tokens,
  balances,
  formattedLineNumbers,
  true,
)

const amountMap = computed(() => {
  const amountMap = {}
  fullAmounts.value.forEach((amount, i) => {
    amountMap[props.tokens[i]] = parseFloat(amount)
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
  Object.values(fiatAmountMap.value).reduce(
    (total, amount) => bnum(total).plus(amount).toString(),
    '0',
  ),
)

const priceImpactFormatted = computed(() =>
  priceImpact.value ? (priceImpact.value * 100).toFixed(1) : 0,
)
const totalWeeklyYield = computed(() =>
  weeklyYieldForAPR(`${props.pool.apr.total}`),
)
const account = ref('')
onMounted(async () => {
  const {
    balances: _balances,
    account: _account,
    lineNumbers: _lineNumbers,
    lastTokenPrices: _lastTokenPrices,
  } = await usePoolActionBalances(props.tokens, props.pool.tokens)
  balances.value = _balances
  account.value = _account
  lineNumbers.value = _lineNumbers
  lastTokenPrices.value = _lastTokenPrices
})

function weeklyYieldForAPR(apr) {
  return bnum(apr).times(fiatTotal.value).div(52).toString()
}

const depositStep = ref(1)
let lastDepositChanged = ref(0)
function OnSliderValueChange(index, value) {
  console.log(value)
  lineNumbers.value[index] = value
  if (value > 0) lastDepositChanged.value = index
}

function OnAllMaxClick() {
  for (let i = 0; i < props.tokens.length; i++) {
    OnMaxClick(i, props.tokens[i])
  }
}
function OnMaxClick(index, address) {
  OnSliderValueChange(index, balances.value[address] * 1000)
}

function OnOptimizeClick() {
  if (lastDepositChanged.value == -1) return
  let token = props.tokens[lastDepositChanged.value]
  let usdAmount =
    (lineNumbers.value[lastDepositChanged.value] / 1000) *
    lastTokenPrices.value[token]
  for (let i = 0; i < lineNumbers.value.length; i++) {
    if (i != lastDepositChanged.value) {
      let newValue = usdAmount / lastTokenPrices.value[props.tokens[i]]
      lineNumbers.value[i] = newValue * 1000
    }
  }
}

async function OnPreviewClick() {


  depositStep.value = 3
  let success = await useApproveTokens(
    props.tokens,
    lineNumbers.value.map((ln) => ln / 1000),
    account.value,
  )
  if (!success) {
    depositStep.value = 2
    return
  }
  depositStep.value = 4
  let tx = await useJoinPool(
    props.pool,
    Object.values(props.pool.tokens),
    lineNumbers.value.map((ln) => ln / 1000),
    account.value,
    bptOut.value,
  )
  if (!tx) {
    depositStep.value = 2
    return
  }
  depositStep.value = 5
  txLink.value = `${configService.getNetworkConfig(networkId.value).explorer}/tx/${tx.hash}`


  emitter.emit('addNotification', {
    type: 'Deposit',
    value: `${parseFloat(fiatTotal.value).toFixed(4)} USD - ${formatNotificationDate(new Date().getTime())}`,
    status: 'Success',
    hash: tx.hash,
    network: DisplayNetwork[networkId.value]
  });
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
  lineNumbers.value[tokenIndex] = result_value
}
</script>
<style lang="scss" scoped>
.token-input {
  background-color: transparent;
  border: none;
  outline: none;
}

.modal_body_header {
  font-family: Poppins;
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: -0.5px;
  color: white
}

.modal_body_inside {
  padding: 0px 110px;
}

.modal_balance_slider {
  margin-top: 20px;
  color: white;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
}

.modal_total_container {
  border: 1px solid rgba(163, 164, 165, 0.2);
  border-radius: 15px;
  font-size: 14px;
}

.modal_stake_preview {
  border: 1px solid rgba(163, 164, 165, 0.2);
  border-radius: 20px;
  color: white;
  font-size: 14px;
}

.modal_preview_button {
  color: white;
  width: 100%;
  background: linear-gradient(89.26deg, #00C9FF 5.07%, #7EF6B2 99.37%);
  border-radius: 20px;
}

.deposit-settled {
  border: 1px solid rgba(1, 180, 126, 0.6);
  border-radius: 20px;
  width: 100%;
  height: 400px;
  margin-bottom: 30px;
  margin-top: 30px;
  padding: 30px 40px;
}

:deep(.range-slider) {
  background: transparent;
  border-radius: 8px;
  padding: 0;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 12px;
  outline: none;
  transition: opacity 0.2s;
  position: relative;

  /* Styling the track */
  &::-webkit-slider-runnable-track {
    height: 12px;
    background: rgba(59, 97, 65, 0.11);
    border-radius: 8px;
  }

  &::-moz-range-track {
    height: 12px;
    background: #ffffff29;
    border-radius: 8px;
  }

  &::-moz-range-progress {
    background-color: #00C9FF;
    height: 12px;
    border-radius: 8px 0 0 8px;
  }

  &::-ms-track {
    height: 12px;
    background: #ffffff29;
    border-radius: 8px;
  }

  /* Styling the thumb */
  &::-webkit-slider-thumb {
    width: 14px;
    height: 14px;
    background: #c1c1d1;
    border-radius: 50%;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -1px;
    /* necessary to center the thumb in the track */
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background: #c1c1d1;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-ms-thumb {
    width: 14px;
    height: 14px;
    background: #c1c1d1;
    border-radius: 50%;
    cursor: pointer;
    margin-top: 0;
  }
}

.bg-transparent {
  background-color: transparent;
}

.modal_stake_token {
  border: 1px solid rgba(163, 164, 165, 0.2);
  border-radius: 20px;
  padding: 15px;
}

.modal_stake_token_inner {}

.modal_stake_token_inner_name {
  background-color: rgba(59, 97, 65, 0.14);
  border-radius: 17px;
  color: white;
  font-size: 14px;
  padding: 2px 18px;
}
</style>
@/composables/math/investMath/useInvestMath@/composables/poolActions/deposit/useApproveTokens
