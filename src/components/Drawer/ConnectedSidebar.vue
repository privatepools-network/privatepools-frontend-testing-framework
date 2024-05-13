<template>
  <div style="height: 92%; padding-top: 7px">
    <div class="d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center gap-2">
        <!-- <img :src="accountIcon" /> -->
        <span class="pulse_green !w-[12px] !h-[12px]"></span>
        <div class="address_text text-black dark:!text-white">
          {{ computedAddress }}
        </div>
      </div>
      <div class="d-flex align-items-center gap-3">
        <div>
          <div class="sidebar_settings_icon" @click="$emit('toggleSettings')">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.9502 8.78334C13.9835 8.53334 14.0002 8.275 14.0002 8C14.0002 7.73334 13.9835 7.46667 13.9419 7.21667L15.6335 5.9C15.7064 5.83992 15.7563 5.75642 15.7745 5.66372C15.7927 5.57103 15.7783 5.47489 15.7335 5.39167L14.1335 2.625C14.0864 2.54131 14.0112 2.47698 13.9212 2.44343C13.8312 2.40987 13.7323 2.40925 13.6419 2.44167L11.6502 3.24167C11.2335 2.925 10.7919 2.65834 10.3002 2.45834L10.0002 0.341669C9.98546 0.246277 9.93698 0.159342 9.86358 0.0966492C9.79018 0.0339567 9.69674 -0.000334587 9.60021 2.46116e-06H6.40021C6.20021 2.46116e-06 6.04188 0.141669 6.00855 0.341669L5.70855 2.45834C5.21688 2.65834 4.76688 2.93334 4.35855 3.24167L2.36688 2.44167C2.18355 2.375 1.97521 2.44167 1.87521 2.625L0.283548 5.39167C0.183548 5.56667 0.216881 5.78334 0.383547 5.9L2.07521 7.21667C2.03355 7.46667 2.00021 7.74167 2.00021 8C2.00021 8.25834 2.01688 8.53334 2.05855 8.78334L0.366881 10.1C0.293984 10.1601 0.244176 10.2436 0.225941 10.3363C0.207707 10.429 0.222175 10.5251 0.266881 10.6083L1.86688 13.375C1.96688 13.5583 2.17521 13.6167 2.35855 13.5583L4.35021 12.7583C4.76688 13.075 5.20855 13.3417 5.70021 13.5417L6.00021 15.6583C6.04188 15.8583 6.20021 16 6.40021 16H9.60021C9.80021 16 9.96688 15.8583 9.99188 15.6583L10.2919 13.5417C10.7835 13.3417 11.2335 13.075 11.6419 12.7583L13.6335 13.5583C13.8169 13.625 14.0252 13.5583 14.1252 13.375L15.7252 10.6083C15.8252 10.425 15.7835 10.2167 15.6252 10.1L13.9502 8.78334ZM8.00021 11C6.35021 11 5.00021 9.65 5.00021 8C5.00021 6.35 6.35021 5 8.00021 5C9.65021 5 11.0002 6.35 11.0002 8C11.0002 9.65 9.65021 11 8.00021 11Z"
                fill="#797676" />
            </svg>
          </div>
        </div>
        <div class="sidebar_exit_icon" @click="disconnectFromWallet">
          <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 9.00002C7.76389 9.00002 7.56611 8.92002 7.40667 8.76002C7.24722 8.60002 7.16722 8.40224 7.16667 8.16669V1.50002C7.16667 1.26391 7.24667 1.06613 7.40667 0.906687C7.56667 0.747243 7.76444 0.667243 8 0.666687C8.23611 0.666687 8.43417 0.746687 8.59417 0.906687C8.75417 1.06669 8.83389 1.26446 8.83333 1.50002V8.16669C8.83333 8.4028 8.75333 8.60085 8.59333 8.76085C8.43333 8.92085 8.23556 9.00058 8 9.00002ZM8 16.5C6.95833 16.5 5.98278 16.3022 5.07333 15.9067C4.16389 15.5111 3.37222 14.9764 2.69833 14.3025C2.02444 13.6286 1.48972 12.837 1.09417 11.9275C0.698611 11.0181 0.500556 10.0422 0.5 9.00002C0.5 8.1528 0.638889 7.32974 0.916667 6.53085C1.19444 5.73196 1.59722 4.99946 2.125 4.33335C2.27778 4.13891 2.47222 4.0453 2.70833 4.05252C2.94444 4.05974 3.15278 4.15335 3.33333 4.33335C3.48611 4.48613 3.55556 4.67363 3.54167 4.89585C3.52778 5.11808 3.45139 5.32641 3.3125 5.52085C2.9375 6.02085 2.65278 6.56946 2.45833 7.16669C2.26389 7.76391 2.16667 8.37502 2.16667 9.00002C2.16667 10.625 2.73278 12.0036 3.865 13.1359C4.99722 14.2681 6.37556 14.8339 8 14.8334C9.625 14.8334 11.0036 14.2675 12.1358 13.1359C13.2681 12.0042 13.8339 10.6256 13.8333 9.00002C13.8333 8.36113 13.7397 7.73946 13.5525 7.13502C13.3653 6.53058 13.07 5.97863 12.6667 5.47919C12.5278 5.29863 12.4514 5.10085 12.4375 4.88585C12.4236 4.67085 12.4931 4.48669 12.6458 4.33335C12.8125 4.16669 13.0139 4.08002 13.25 4.07335C13.4861 4.06669 13.6806 4.15335 13.8333 4.33335C14.375 5.00002 14.7883 5.72919 15.0733 6.52085C15.3583 7.31252 15.5006 8.13891 15.5 9.00002C15.5 10.0417 15.3022 11.0175 14.9067 11.9275C14.5111 12.8375 13.9764 13.6292 13.3025 14.3025C12.6286 14.9759 11.8369 15.5106 10.9275 15.9067C10.0181 16.3028 9.04222 16.5006 8 16.5Z"
              fill="#797676" />
          </svg>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column h-100 gap-3 mt-3">
      <div class="d-flex flex-column">
        <div class="balance_text text-black dark:!text-white" >
          <CounterAnimation :currency="false" :value="Number(sidebarData?.userBalance?.total).toFixed(2)"/>
        </div>
        <!-- <div v-else class="py-8 px-4">
          <ThreeDots />
        </div> -->
        <div class="balance_change" v-if="sidebarData?.userBalance?.total != null">
          <svg
          :class="sidebarData?.userBalance?.balanceChange > 0 ? '' : 'rotate-180'"
          width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_67_2314)">
              <path
                d="M8.55317 6.00527C9.03679 6.84355 8.43184 7.89135 7.46406 7.89166L2.51976 7.89456C1.55104 7.89549 0.945005 6.84648 1.42942 6.00745L3.90407 1.72123C4.38848 0.882201 5.59997 0.882539 6.08352 1.72194L8.55317 6.00527Z"
                :fill="sidebarData?.userBalance?.balanceChange > 0 ? '#40B66B' : '#D22B2B'" />
            </g>
            <defs>
              <clipPath id="clip0_67_2314">
                <rect width="8.05256" height="8.05256" fill="white" transform="translate(6.97363 11) rotate(-150)" />
              </clipPath>
            </defs>
          </svg>
          <!-- ${{ Number(sidebarData?.userBalance?.totalYesterday).toFixed(2) }} -->
          ({{ Number(sidebarData?.userBalance?.balanceChange).toFixed(1) }}%)
        </div>
      </div>

      <!-- <div class="flex justify-between gap-2">
        <a
          href="/pools/concentrated_pool"
          class="text-black dark:!text-white no-underline hover:!text-[#1ab6ff] w-full"
        >
          <div class="add_liq_btn w-full">
            <div class="d-flex gap-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.5 8.99999C21.5001 10.2835 21.1204 11.5384 20.4085 12.6065C19.6967 13.6746 18.6847 14.5081 17.5 15.002V15C17.5 12.7457 16.6045 10.5836 15.0104 8.98959C13.4163 7.39553 11.2543 6.49999 9 6.49999H8.998C9.57681 5.11373 10.6178 3.97066 11.944 3.26505C13.2702 2.55944 14.7999 2.33484 16.273 2.62941C17.746 2.92398 19.0717 3.71955 20.0246 4.8809C20.9775 6.04226 21.4988 7.49775 21.5 8.99999ZM7 2.99999C5.93913 2.99999 4.92172 3.42142 4.17157 4.17157C3.42143 4.92171 3 5.93913 3 6.99999V8.49999H5V6.99999C5 6.46956 5.21071 5.96085 5.58579 5.58578C5.96086 5.21071 6.46957 4.99999 7 4.99999H8.5V2.99999H7ZM19 15.5V17C19 17.5304 18.7893 18.0391 18.4142 18.4142C18.0391 18.7893 17.5304 19 17 19H15.5V21H17C18.0609 21 19.0783 20.5786 19.8284 19.8284C20.5786 19.0783 21 18.0609 21 17V15.5H19ZM9 21.5C10.7239 21.5 12.3772 20.8152 13.5962 19.5962C14.8152 18.3772 15.5 16.7239 15.5 15C15.5 13.2761 14.8152 11.6228 13.5962 10.4038C12.3772 9.18481 10.7239 8.49999 9 8.49999C7.27609 8.49999 5.62279 9.18481 4.40381 10.4038C3.18482 11.6228 2.5 13.2761 2.5 15C2.5 16.7239 3.18482 18.3772 4.40381 19.5962C5.62279 20.8152 7.27609 21.5 9 21.5ZM9 12.5L11.5 15L9 17.5L6.5 15L9 12.5Z"
                  fill="#2ABDFF"
                />
              </svg>

              CL {{$t('pool')}}
            </div>
          </div>
        </a>
        <a
          href="/pools/compose"
          class="text-black dark:!text-white no-underline hover:!text-[#1ab6ff] w-full"
        >
          <div class="add_liq_btn w-full">
            <div class="d-flex gap-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.00011 12.5L6.50011 15L9.00011 17.5L11.5001 15L9.00011 12.5ZM15.0001 2.5C13.3597 2.50003 11.7799 3.12033 10.5777 4.23648C9.37548 5.35262 8.63976 6.88206 8.51811 8.518C7.27701 8.61026 6.08848 9.05689 5.09376 9.8048C4.09903 10.5527 3.33993 11.5705 2.90665 12.7371C2.47337 13.9038 2.38412 15.1703 2.64952 16.3862C2.91491 17.6021 3.52379 18.7163 4.40381 19.5963C5.28382 20.4763 6.39797 21.0852 7.61387 21.3506C8.82977 21.616 10.0963 21.5267 11.263 21.0935C12.4296 20.6602 13.4474 19.9011 14.1953 18.9064C14.9432 17.9116 15.3898 16.7231 15.4821 15.482C17.1594 15.3569 18.7228 14.5866 19.844 13.3328C20.9651 12.0791 21.5566 10.4396 21.4942 8.75883C21.4318 7.07808 20.7204 5.48695 19.5093 4.3198C18.2983 3.15265 16.682 2.50036 15.0001 2.5ZM15.3231 13.489C15.043 12.3211 14.4452 11.2534 13.5959 10.4042C12.7467 9.55491 11.679 8.95714 10.5111 8.677C10.5731 7.81679 10.8811 6.99252 11.3982 6.30232C11.9154 5.61213 12.6199 5.08508 13.4281 4.78392C14.2363 4.48276 15.1139 4.42018 15.9566 4.60363C16.7994 4.78708 17.5716 5.20883 18.1814 5.81867C18.7913 6.42851 19.213 7.20076 19.3965 8.04347C19.5799 8.88618 19.5174 9.76385 19.2162 10.572C18.915 11.3802 18.388 12.0848 17.6978 12.6019C17.0076 13.1191 16.1833 13.427 15.3231 13.489ZM13.5001 15C13.5001 16.1935 13.026 17.3381 12.1821 18.182C11.3382 19.0259 10.1936 19.5 9.00011 19.5C7.80664 19.5 6.66205 19.0259 5.81813 18.182C4.97422 17.3381 4.50011 16.1935 4.50011 15C4.50011 13.8065 4.97422 12.6619 5.81813 11.818C6.66205 10.9741 7.80664 10.5 9.00011 10.5C10.1936 10.5 11.3382 10.9741 12.1821 11.818C13.026 12.6619 13.5001 13.8065 13.5001 15ZM3.00011 7C3.00011 5.93913 3.42154 4.92172 4.17169 4.17157C4.92183 3.42143 5.93925 3 7.00011 3H8.50011V5H7.00011C6.46968 5 5.96097 5.21071 5.5859 5.58579C5.21083 5.96086 5.00011 6.46957 5.00011 7V8.5H3.00011V7ZM19.0001 17V15.5H21.0001V17C21.0001 18.0609 20.5787 19.0783 19.8285 19.8284C19.0784 20.5786 18.061 21 17.0001 21H15.5001V19H17.0001C17.5305 19 18.0393 18.7893 18.4143 18.4142C18.7894 18.0391 19.0001 17.5304 19.0001 17Z"
                  fill="#2ABDFF"
                />
              </svg>

              WP {{$t('pool')}}
            </div>
          </div>
        </a>
      </div> -->

      <div class="d-flex gap-3">
        <div @click="sidebarTab = 'Tokens'" :class="sidebarTab === 'Tokens' ? 'tab selected_tab' : 'tab'">
          {{ $t('tokens') }}
        </div>
        <div @click="sidebarTab = 'Pools'" :class="sidebarTab === 'Pools' ? 'tab selected_tab' : 'tab'">
          {{ $t('pools') }}
        </div>
        <div @click="sidebarTab = 'Activity'" :class="sidebarTab === 'Activity' ? 'tab selected_tab' : 'tab'">
          {{ $t('activity') }}
        </div>
      </div>
      {{ console.log('sidebarData?.userBalance?.tokens', sidebarData?.userBalance?.tokens) }}
      <div v-if="sidebarTab === 'Tokens'" class="flex flex-col gap-2 overflow-auto h-full activity_container">
        <div v-if="sidebarData?.userBalance?.tokens != null" v-for="(item, i) in sidebarData?.userBalance?.tokens.filter(
          (item) => item.usdAmount !== 0 && item.symbol !== 'BOOM',
        )" :key="`${i}-token`" class="p-2 d-flex align-items-center justify-content-between gap-2">
          <div class="d-flex align-items-center gap-2">
            <img :src="getTokenEntity(item.symbol, 'short').icon" width="38" />
            <div class="d-flex flex-column">
              <div class="text-black dark:!text-white text-[12px]">
                {{ item.symbol }}
              </div>
              <div class="text-black dark:!text-[#8e8e8e] text-[10px]">
                {{ item.amount.toFixed(6) }} {{ item.symbol }}
              </div>
            </div>
          </div>
          <div>
            <div class="d-flex flex-column align-items-end">
              <div class="text-black dark:!text-white text-[12px]">
                ${{ item.usdAmount.toFixed(2) }}
              </div>

              <div class="d-flex align-items-center gap-1 text-black dark:!text-[#8e8e8e] text-[10px]">
                <svg :class="item.percentChange24h > 0 ? '' : 'rotate-180'" width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_74_4052)">
                    <path
                      d="M5.44288 3.82129C5.75064 4.35474 5.36567 5.02152 4.74981 5.02172L1.60344 5.02356C0.986982 5.02415 0.601322 4.3566 0.909584 3.82268L2.48436 1.09508C2.79262 0.561153 3.56357 0.561368 3.87129 1.09553L5.44288 3.82129Z"
                      :fill="item.percentChange24h > 0 ? '#40B66B' : '#D22B2B'" />
                  </g>
                  <defs>
                    <clipPath id="clip0_74_4052">
                      <rect width="5.12436" height="5.12436" fill="white"
                        transform="translate(4.4375 7) rotate(-150)" />
                    </clipPath>
                  </defs>
                </svg>
                <!-- {{ item.percentChange }} -->
                {{ item.percentChange24h.toFixed(2) }}%
              </div>
            </div>
          </div>
        </div>
        <div v-else class="flex justify-center items-center pt-24">
          <LoaderPulse />
        </div>
      </div>
      <div v-else-if="sidebarTab === 'Pools'" class="h-100">
        <div class="d-flex flex-column gap-2" v-if="addressPools.length > 0">
          {{ console.log('addressPools', addressPools) }}
          <div v-for="(item, i) in addressPools" :key="`${i}-token`"
            class="p-2 d-flex align-items-center justify-content-between gap-2">
            <div class="d-flex align-items-center gap-2">
              <!-- <img :src="getTokenEntity(item.img, 'short').icon" width="38" /> -->
              <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_71_3305)">
                  <path d="M35 0H0V35H35V0Z" fill="#2775CA" />
                  <path d="M2.25263 49.9627L34.9111 37.3732L22.3216 4.71467L-10.3369 17.3042L2.25263 49.9627Z"
                    fill="#F5841F" />
                  <path d="M-10.0142 -8.54158L-15.6387 26.0034L18.9063 31.6279L24.5308 -2.91708L-10.0142 -8.54158Z"
                    fill="#40B66B" />
                  <path d="M12.5634 -20.5779L-22.1006 -25.4219L-26.9446 9.24213L7.71941 14.0861L12.5634 -20.5779Z"
                    fill="#FF007A" />
                </g>
                <defs>
                  <clipPath id="clip0_71_3305">
                    <rect width="35" height="35" rx="17.5" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <div class="flex items-center gap-1">
                <div class="flex-col">
                  <div class="flex items-center gap-1">
                    <div class="text-black dark:!text-white text-[12px]" :key="token.symbol + i"
                      v-for="(token, i) in item.tokens">
                      {{ token.symbol }} <span v-if="i === 0">/</span>
                    </div>
                  </div>
                  <div class="text-black dark:!text-[#8e8e8e] text-[10px]">{{ item.APR }}% APR</div>
                </div>
                <div class="text-black dark:!text-[#8e8e8e] text-[10px]">
                  {{ item.img }}
                </div>
              </div>
            </div>
            <div>
              <div class="d-flex flex-column align-items-end">
                <div class="text-black dark:!text-white text-[12px] font-['Roboto_Mono',_monospace]">
                  ${{ item.shareBalanceUsd.toFixed(3) }}
                </div>
                <div v-if="item.LiquidityType === 'WP'"
                  class="flex items-center gap-1 text-black dark:!text-[#8e8e8e] text-[10px]">
                  <svg :class="item.percentage > 0 ? '' : 'rotate-180'" width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_74_4052)">
                    <path
                      d="M5.44288 3.82129C5.75064 4.35474 5.36567 5.02152 4.74981 5.02172L1.60344 5.02356C0.986982 5.02415 0.601322 4.3566 0.909584 3.82268L2.48436 1.09508C2.79262 0.561153 3.56357 0.561368 3.87129 1.09553L5.44288 3.82129Z"
                      :fill="item.percentage > 0 ? '#40B66B' : '#D22B2B'" />
                  </g>
                  <defs>
                    <clipPath id="clip0_74_4052">
                      <rect width="5.12436" height="5.12436" fill="white"
                        transform="translate(4.4375 7) rotate(-150)" />
                    </clipPath>
                  </defs>
                </svg>
                  {{ item.percentage.toFixed(2) }}%
             
                </div>
                <div v-else class="flex items-center gap-1 text-black dark:!text-[#8e8e8e] text-[10px]">
                  On range <svg width="5" height="5" viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="2.5" cy="2.5" r="2.5" fill="#40B66B" />
                  </svg>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="d-flex flex-column gap-2 justify-content-center align-items-center h-100">
          <svg width="74" height="72" viewBox="0 0 74 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 51.4851L9.664 48.0541C12.2844 46.7035 15.1774 46 18.1111 46C21.0448 46 23.9378 46.7035 26.5582 48.0541L28.5529 49.083C31.1733 50.4337 34.0663 51.1372 37 51.1372C39.9337 51.1372 42.8267 50.4337 45.4471 49.083L47.4418 48.0541C50.0622 46.7035 52.9552 46 55.8889 46C58.8226 46 61.7156 46.7035 64.336 48.0541L71 51.4851M3 69L9.664 65.5651C12.2844 64.2145 15.1774 63.511 18.1111 63.511C21.0448 63.511 23.9378 64.2145 26.5582 65.5651L28.5529 66.594C31.1733 67.9447 34.0663 68.6481 37 68.6481C39.9337 68.6481 42.8267 67.9447 45.4471 66.594L47.4418 65.5651C50.0622 64.2145 52.9552 63.511 55.8889 63.511C58.8226 63.511 61.7156 64.2145 64.336 65.5651L71 69"
              stroke="#1E5973" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M37.5 18.525C48.2707 18.525 57 14.884 57 10.3974C57 5.91091 48.2707 2.2699 37.5 2.2699C26.7293 2.2699 18 5.91091 18 10.3974C18 14.884 26.7293 18.525 37.5 18.525ZM37.5 31.5199C30.058 31.5199 23.4768 29.7299 19.3254 26.9648C18.4799 27.8789 18 28.8615 18 29.8974C18 34.384 26.7293 38.025 37.5 38.025C48.2707 38.025 57 34.384 57 29.8974C57 28.8615 56.5201 27.8789 55.6746 26.9724C51.5232 29.7299 44.942 31.5199 37.5 31.5199ZM37.5 21.7699C30.058 21.7699 23.4768 19.9799 19.3254 17.2148C18.4799 18.1289 18 19.1115 18 20.1474C18 24.634 26.7293 28.275 37.5 28.275C48.2707 28.275 57 24.634 57 20.1474C57 19.1115 56.5201 18.1289 55.6746 17.2224C51.5232 19.9799 44.942 21.7699 37.5 21.7699Z"
              fill="#7D7D7D" />
          </svg>
          <div class="text-black dark:!text-white">
            {{ $t('no_pools_yet') }}
          </div>
          <div class="text-black dark:!text-white text-[12px] text-center">
            {{ $t('open_position_to_get_started') }}
          </div>
          <div @click="router.push('/pools')" class="add_liq_btn_pools">
            <div class="d-flex gap-1">+ {{ $t('add_liquidity') }}</div>
          </div>
        </div>
      </div>
      <div v-else-if="sidebarTab === 'Activity'" class="d-flex flex-column gap-2 overflow-auto activity_container">
        <div>
          {{ console.log('addressActivity', addressActivity) }}
          <div class="tab my-2" style="font-size: 12px">{{ $t('today') }}</div>
          <div class="d-flex flex-column gap-2">
            <a :href="`${configService.getNetworkConfig(56).explorer}/tx/${item.hash
              }`" target="_blank" v-for="(item, i) in addressActivity.filter(
                (el) => el.type == 'today',
              )" :key="`${i}-token`" class="p-2 d-flex align-items-center justify-content-between gap-2"
              style="text-decoration: none">
              <div class="d-flex align-items-center gap-2">
                <img :src="item.img" width="38" />
                <div class="d-flex flex-column">
                  <div class="text-black dark:!text-white text-[12px]">
                    {{ item.label }}
                  </div>
                  <div class="text-black dark:!text-[#8e8e8e] text-[12px]">
                    {{ item.desc }}
                  </div>
                </div>
              </div>
              <div>
                <div class="d-flex flex-column align-items-end">
                  <div class="text-black dark:!text-white text-[12px] whitespace-nowrap overflow-hidden text-ellipsis">
                    {{ item.time }}
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div>
          <div class="tab my-2" style="font-size: 12px">
            {{ $t('this_week') }}
          </div>
          <div class="d-flex flex-column gap-2">
            <a :href="`${configService.getNetworkConfig(56).explorer}/tx/${item.hash
              }`" target="_blank" v-for="(item, i) in addressActivity.filter(
                (el) => el.type == 'week',
              )" :key="`${i}-token`" class="p-2 d-flex align-items-center justify-content-between gap-2"
              style="text-decoration: none">
              <div class="d-flex align-items-center gap-2">
                <img :src="item.img" width="38" />
                <div class="d-flex flex-column">
                  <div class="text-black dark:!text-white text-[12px]">
                    {{ item.label }}
                  </div>
                  <div class="text-black dark:!text-[#8e8e8e] text-[10px]">
                    {{ item.desc }}
                  </div>
                </div>
              </div>
              <div>
                <div class="d-flex flex-column align-items-end">
                  <div class="text-black dark:!text-white text-[12px] whitespace-nowrap overflow-hidden text-ellipsis">
                    {{ item.time }}
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div>
          <div class="tab my-2" style="font-size: 12px">
            {{ $t('this_month') }}
          </div>
          <div class="d-flex flex-column gap-2">
            <a v-for="(item, i) in addressActivity.filter(
              (el) => el.type == 'month',
            )" :key="`${i}-token`" target="_blank" :href="`${configService.getNetworkConfig(56).explorer}/tx/${item.hash
                }`" class="p-2 d-flex align-items-center justify-content-between gap-2" style="text-decoration: none">
              <div class="d-flex align-items-center gap-2">
                <img :src="item.img" width="38" />
                <div class="d-flex flex-column">
                  <div class="text-black dark:!text-white text-[12px]">
                    {{ item.label }}
                  </div>
                  <div class="text-black dark:!text-[#8e8e8e] text-[10px]">
                    {{ item.desc }}
                  </div>
                </div>
              </div>
              <div>
                <div class="d-flex flex-column align-items-end">
                  <div class="text-black dark:!text-white text-[12px] whitespace-nowrap overflow-hidden text-ellipsis">
                    {{ item.time }}
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, computed, watch, onMounted } from 'vue'
import { defineEmits } from 'vue'
import accountIcon from '@/assets/icons/accountIcon.svg'
import { Network, networkId } from '@/composables/useNetwork'
import router from '@/router'
import { getTokenEntity } from '@/lib/helpers/util'
import { useWalletActivity } from '@/composables/wallet/useWalletActivity'
import { configService } from '@/services/config/config.service'
import { useWalletPools } from '@/composables/wallet/useWalletPools'
import { InitializeMetamask } from '@/lib/utils/metamask'
import { ethers } from 'ethers'
import { getSidebarData } from '@/composables/data/sidebarData'
import ThreeDots from '../loaders/ThreeDots.vue'
import LoaderPulse from '../loaders/LoaderPulse.vue'
import { Dropdown } from 'floating-vue'
import CounterAnimation from '@/UI/CounterAnimation.vue'

const props = defineProps(['isConnectedToWeb3', 'address'])
const emit = defineEmits(['toggleSettings', 'toggleToWallets', 'setAddress'])

const sidebarTab = ref('Tokens')
const sidebarData = ref({})

const tokensOptions = ref([])
const mockPools = ref([])
const addressActivity = ref([])
const addressPools = ref([])

const computedAddress = computed(() =>
  props.address
    ? props.address.substring(0, 6) +
    '....' +
    props.address.substring(props.address.length - 4)
    : '',
)
async function disconnectFromWallet() {
  localStorage.removeItem('address')
  await window.ethereum.request({
    method: 'eth_requestAccounts',
    params: [{ eth_accounts: {} }],
  })
  networkId.value = Network.NONE
  emit('setAddress', null)
  emit('toggleToWallets')
}

watch(props.address, async () => {
  await handlePortfolioData()
})

// const getBalance = async (address) => {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const balance = await provider.getBalance(address);

//     const balanceInEth = ethers.utils.formatEther(balance);
//     SidebarBalance.value = balanceInEth
//     console.log('balanceInEth',balanceInEth);
// }

onMounted(async () => {
  await handlePortfolioData()
})

async function handlePortfolioData() {
  if (props.address) {
    let mmProvider = await InitializeMetamask()
    addressActivity.value = await useWalletActivity(
      props.address,
      networkId.value,
    )
    addressPools.value = await useWalletPools(props.address, networkId.value)
    sidebarData.value = await getSidebarData(props.address, 56)
  }
}
</script>

<style lang="scss" scoped>
.sidebar_header {
  font-size: 14px;
  font-weight: 600;
  line-height: 44px;
  letter-spacing: 0px;
  color: #ffffff;
}

.sidebar_settings_icon {
  cursor: pointer;
}

.sidebar_settings_icon:hover svg path {
  fill: #00c9ff;
}

.sidebar_exit_icon {
  cursor: pointer;
}

.sidebar_exit_icon:hover svg path {
  fill: #00c9ff;
}

.wallet_container_sidebar {
  // background: #10101099;
  border-radius: 20px;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 15px 22px;

  &:hover {
    cursor: pointer;
    background: #1313134d;
  }
}

.wallet_text {
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  color: #717a8c;
}

.wallet_bottom_text {
  font-size: 13px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0em;
  color: #747474;
}

.wallet_link {
  cursor: pointer;
  text-decoration: underline;
  color: #747474;
}

.address_text {
  font-size: 13px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0em;

  // color: #ffffff;
}

.balance_text {
  font-family: 'Roboto Mono', monospace;
  font-size: 34px;
  font-weight: 500;
  letter-spacing: 0em;
  // color: #ffffff;
}

.balance_change {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0em;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #898989;
}

.add_liq_btn {
  padding: 15px;
  display: flex;
  justify-content: center;
  background: #002c4499;
  border-radius: 20px;

  font-size: 19px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: center;
  color: #00e0ff;

  &:hover {
    background: #002c44cc;
    // filter: drop-shadow(0 0 0.6rem #2abcff91);
    cursor: pointer;
  }
}

.tab {
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0em;
  color: #898989;
  cursor: pointer;
}

.selected_tab {
  color: #00c9ff;
}

/* Scrollbar */
.activity_container::-webkit-scrollbar {
  height: 0px;
  width: 5px;
}

.activity_container::-webkit-scrollbar {
  background: transparent;
}

.activity_container::-webkit-scrollbar-thumb {
  background-color: #00e0ff;
  border-radius: 100px;
}
</style>
