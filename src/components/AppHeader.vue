<template>
  <CHeader position="static" :class="isHeaderBg ? 'header_main header_main_bg' : 'header_main'" ref="headRef">
    <CContainer fluid class="header_container">
      <!-- <CHeaderNav v-if="width > 768" class="d-flex me-auto">
        <AppBreadcrumb :title="true" />
      </CHeaderNav> -->

      <div class="d-flex align-items-center gap-4">
        <div @click="router.push('/pools')" :class="router.currentRoute.value.path === '/pools'
          ? 'navigation_text_selected navigation_text'
          : 'navigation_text'
          ">
          Pools
        </div>
        <Dropdown :distance="6">
          <div :class="router.currentRoute.value.path === '/general' || router.currentRoute.value.path === '/user_analytics'
            ? 'navigation_text_selected navigation_text'
            : 'navigation_text'
            ">
            Analytics
          </div>
          <template #popper>
            <div class="header__popup" style="width: 100px;">
            <a href="/general" :class="router.currentRoute.value.path === '/general'
              ? 'navigation_text_selected navigation_text'
              : 'navigation_text'
              ">
              General
            </a>
            <a href="/user_analytics"  :class="router.currentRoute.value.path === '/user_analytics'
              ? 'navigation_text_selected navigation_text'
              : 'navigation_text'
              ">
              User
            </a>
          </div>
          </template>
        </Dropdown>

        <div @click="router.push('/portfolio')" :class="router.currentRoute.value.path === '/portfolio'
          ? 'navigation_text_selected navigation_text'
          : 'navigation_text'
          ">
          Portfolio
        </div>
        <div @click="router.push('/referrals')" :class="router.currentRoute.value.path === '/referrals'
          ? 'navigation_text_selected navigation_text'
          : 'navigation_text'
          ">
          Referrals
        </div>
        <div @click="router.push('/buy')" :class="router.currentRoute.value.path === '/buy'
          ? 'navigation_text_selected navigation_text'
          : 'navigation_text'
          ">
          Buy
        </div>
      </div>

      <div style="position: relative; cursor: text">
        <vue-select :options="selectOptions" label-by="id" searchable @search:input="handleInput"
          search-placeholder="Search tokens and liquidity pools" placeholder="Search tokens and liquidity pools">
          <template #dropdown-item="{ option }">
            <div v-if="option.firstToken" class="search_groups">
              <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 7L5.92308 2.2L10.8462 7L17 1M17 1H13.0615M17 1V4.84" stroke="#686868" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Popular tokens
            </div>
            <template v-if="option.tokens">
              <div class="p-2 d-flex align-items-center justify-content-between gap-2"
                @click="goToFilteredPools(option.img)">
                <div class="d-flex align-items-center gap-2">
                  <img :src="getTokenEntity(option.img, 'short').icon" width="38" />
                  <div class="d-flex flex-column">
                    <div style="font-size: 12px; color: #ffffff">
                      {{ option.label }}
                    </div>
                    <div style="font-size: 10px; color: #8e8e8e">
                      {{ option.img }}
                    </div>
                  </div>
                </div>
                <div>
                  <div class="d-flex flex-column align-items-end">
                    <div style="font-size: 12px; color: #ffffff">
                      {{ option.price }}
                    </div>
                    <div style="font-size: 10px; color: #8e8e8e" class="d-flex align-items-center gap-1">
                      <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_74_4052)">
                          <path
                            d="M5.44288 3.82129C5.75064 4.35474 5.36567 5.02152 4.74981 5.02172L1.60344 5.02356C0.986982 5.02415 0.601322 4.3566 0.909584 3.82268L2.48436 1.09508C2.79262 0.561153 3.56357 0.561368 3.87129 1.09553L5.44288 3.82129Z"
                            fill="#40B66B" />
                        </g>
                        <defs>
                          <clipPath id="clip0_74_4052">
                            <rect width="5.12436" height="5.12436" fill="white"
                              transform="translate(4.4375 7) rotate(-150)" />
                          </clipPath>
                        </defs>
                      </svg>
                      {{ option.percentChange }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div v-if="option.firstPool" class="search_groups">
              <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 7L5.92308 2.2L10.8462 7L17 1M17 1H13.0615M17 1V4.84" stroke="#686868" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Top picks for you
            </div>
            <template v-if="option.pools">
              <div class="p-2 d-flex align-items-center justify-content-between gap-2"
                @click="goToPool(option.poolId, option.chainId, option.type)">
                <div class="d-flex align-items-center gap-2">
                  <img class="pair_avatars_manage_pool" :data-tooltip="tokenEntity"
                    v-for="(tokenEntity, tokenEntityIndex) in option.img" :key="`token-entity-key-${tokenEntityIndex}`"
                    :src="computedTokenImage(tokenEntity)" :title="tokenEntity" />
                  <div class="d-flex flex-column">
                    <div style="font-size: 12px; color: #ffffff; margin-left: 18px">
                      {{ option.label }}
                    </div>
                    <div style="font-size: 10px; color: #8e8e8e; margin-left: 18px">
                      {{ option.desc }}
                    </div>
                  </div>
                </div>
                <div>
                  <div class="d-flex flex-column align-items-end">
                    <div style="font-size: 12px; color: #ffffff">
                      {{ option.price }}
                    </div>
                    <div style="font-size: 10px; color: #8e8e8e" class="d-flex align-items-center gap-1">
                      <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_74_4052)">
                          <path
                            d="M5.44288 3.82129C5.75064 4.35474 5.36567 5.02152 4.74981 5.02172L1.60344 5.02356C0.986982 5.02415 0.601322 4.3566 0.909584 3.82268L2.48436 1.09508C2.79262 0.561153 3.56357 0.561368 3.87129 1.09553L5.44288 3.82129Z"
                            fill="#40B66B" />
                        </g>
                        <defs>
                          <clipPath id="clip0_74_4052">
                            <rect width="5.12436" height="5.12436" fill="white"
                              transform="translate(4.4375 7) rotate(-150)" />
                          </clipPath>
                        </defs>
                      </svg>
                      {{ option.percentChange }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </vue-select>
        <div style="position: absolute; left: 7px; top: 6px; color: #858c90">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17.9417 17.0583L14.7408 13.8575C15.8108 12.5883 16.4583 10.9525 16.4583 9.16667C16.4583 5.14583 13.1875 1.875 9.16667 1.875C5.14583 1.875 1.875 5.14583 1.875 9.16667C1.875 13.1875 5.14583 16.4583 9.16667 16.4583C10.9525 16.4583 12.5883 15.8108 13.8575 14.7408L17.0583 17.9417C17.18 18.0633 17.34 18.125 17.5 18.125C17.66 18.125 17.82 18.0642 17.9417 17.9417C18.1858 17.6983 18.1858 17.3025 17.9417 17.0583ZM3.125 9.16667C3.125 5.835 5.835 3.125 9.16667 3.125C12.4983 3.125 15.2083 5.835 15.2083 9.16667C15.2083 12.4983 12.4983 15.2083 9.16667 15.2083C5.835 15.2083 3.125 12.4983 3.125 9.16667Z"
              fill="#9B9B9B" />
          </svg>
        </div>
        <!-- <div style="position: absolute; right: 12px; top: 7px; color: #7d7d7d">
          <svg width="5" height="12" viewBox="0 0 5 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.35511 0.863636L1.54261 11.3125H0.191761L3.00426 0.863636H4.35511Z" fill="#7D7D7D" />
          </svg>
        </div> -->
      </div>

      <div v-if="!address">
        <div class="connect_wallet" @click="$emit('toggleSidebar')">
          Connect
        </div>
      </div>
      <div v-else-if="address && address !== ''" class="d-flex align-items-center gap-2">
        <Dropdown :distance="4" :placement="'bottom-center'">
          <div class="wallet_address" style="padding: 10px">
            <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M18.2596 4.65411C17.5168 4.92921 16.933 5.55162 16.675 6.34349L16.1936 7.82082C16.1866 7.84334 16.1669 7.85851 16.1447 7.85851C16.1225 7.85851 16.1028 7.84334 16.0959 7.82082L15.6145 6.34349C15.3564 5.55157 14.7725 4.92915 14.0296 4.65411L12.644 4.14094C12.6233 4.13327 12.6094 4.1125 12.6094 4.08917C12.6094 4.06585 12.6233 4.04508 12.644 4.03741L14.0296 3.52424C14.7725 3.2492 15.3564 2.62677 15.6145 1.83486L16.0959 0.357515C16.1028 0.335026 16.1225 0.319824 16.1447 0.319824C16.1669 0.319824 16.1866 0.335026 16.1936 0.357515L16.675 1.83486C16.933 2.62674 17.5168 3.24915 18.2596 3.52424L19.6453 4.03741C19.6659 4.04508 19.6798 4.06585 19.6798 4.08917C19.6798 4.1125 19.6659 4.13327 19.6453 4.14094L18.2596 4.65411ZM12.1671 9.26357C11.1354 9.64571 10.3246 10.5102 9.96631 11.61L9.29742 13.6618C9.28759 13.6928 9.26039 13.7135 9.2298 13.7135C9.1992 13.7135 9.172 13.6928 9.16217 13.6618L8.49328 11.61C8.13496 10.5102 7.32416 9.64571 6.29255 9.26357L4.36776 8.55086C4.33906 8.54018 4.31982 8.51138 4.31982 8.47893C4.31982 8.44654 4.33906 8.41774 4.36776 8.40706L6.29255 7.69435C7.32416 7.31221 8.13497 6.44776 8.49328 5.34794L9.16217 3.29608C9.172 3.26519 9.1992 3.2444 9.2298 3.2444C9.26039 3.2444 9.28759 3.26519 9.29742 3.29608L9.96631 5.34794C10.3246 6.44776 11.1354 7.31221 12.1671 7.69435L14.0919 8.40706C14.1205 8.41774 14.1398 8.44654 14.1398 8.47893C14.1398 8.51138 14.1205 8.54018 14.0919 8.55086L12.1671 9.26357ZM16.0974 14.4665C16.3038 13.833 16.7708 13.3351 17.3649 13.115L18.474 12.7045C18.4905 12.6983 18.5016 12.6817 18.5016 12.663C18.5016 12.6444 18.4905 12.6277 18.474 12.6216L17.3649 12.2111C16.7708 11.9909 16.3038 11.493 16.0974 10.8595L15.7121 9.67771C15.707 9.65902 15.691 9.64622 15.6727 9.64622C15.6545 9.64622 15.6384 9.65902 15.6333 9.67771L15.249 10.8595C15.0424 11.4933 14.575 11.9912 13.9805 12.2111L12.8724 12.6216C12.8559 12.6277 12.8448 12.6444 12.8448 12.663C12.8448 12.6817 12.8559 12.6983 12.8724 12.7045L13.9805 13.115C14.575 13.3349 15.0424 13.8328 15.249 14.4665L15.6333 15.6484C15.6384 15.667 15.6545 15.6798 15.6727 15.6798C15.691 15.6798 15.707 15.667 15.7121 15.6484L16.0974 14.4665Z"
                fill="url(#paint0_linear_79_4174)" />
              <defs>
                <linearGradient id="paint0_linear_79_4174" x1="19.6798" y1="-7.36018" x2="6.0653" y2="10.4435"
                  gradientUnits="userSpaceOnUse">
                  <stop stop-color="#2775CA" />
                  <stop offset="1" stop-color="#2ABDFF" />
                </linearGradient>
              </defs>
            </svg>

            $1.23
          </div>
          <template #popper>
            <div class="header__popup">
              <h4 style="
                  font-size: 14px;
                  color: #626262;
                  
                  margin-bottom: 10px;
                  /* text-align: center; */
                ">
                Rewards
              </h4>
              <div class="rewards_inside">
                <div style="color: #626262; font-size: 12px">
                  Pending pool rewards
                </div>
                <div>
                  $1.23
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M7.15739 2.3273C6.786 2.46485 6.49409 2.77605 6.3651 3.17199L6.12436 3.91065C6.12091 3.92192 6.11105 3.9295 6.09995 3.9295C6.08884 3.9295 6.07899 3.92192 6.07553 3.91065L5.83483 3.17199C5.7058 2.77603 5.41384 2.46482 5.04241 2.3273L4.34958 2.07071C4.33924 2.06688 4.3323 2.0565 4.3323 2.04483C4.3323 2.03317 4.33924 2.02278 4.34958 2.01895L5.04241 1.76236C5.41384 1.62484 5.7058 1.31363 5.83483 0.917673L6.07553 0.179002C6.07899 0.167757 6.08884 0.160156 6.09995 0.160156C6.11105 0.160156 6.12091 0.167757 6.12436 0.179002L6.3651 0.917673C6.49409 1.31361 6.786 1.62482 7.15739 1.76236L7.85025 2.01895C7.86056 2.02278 7.8675 2.03317 7.8675 2.04483C7.8675 2.0565 7.86056 2.06688 7.85025 2.07071L7.15739 2.3273ZM4.11112 4.63203C3.59531 4.8231 3.1899 5.25532 3.01074 5.80524L2.6763 6.83116C2.67138 6.84662 2.65778 6.85699 2.64249 6.85699C2.62719 6.85699 2.61359 6.84662 2.60867 6.83116L2.27423 5.80524C2.09507 5.25532 1.68967 4.8231 1.17386 4.63203L0.211467 4.27568C0.197117 4.27033 0.1875 4.25593 0.1875 4.23971C0.1875 4.22352 0.197117 4.20912 0.211467 4.20377L1.17386 3.84742C1.68967 3.65635 2.09507 3.22412 2.27423 2.67421L2.60867 1.64828C2.61359 1.63284 2.62719 1.62244 2.64249 1.62244C2.65778 1.62244 2.67138 1.63284 2.6763 1.64828L3.01074 2.67421C3.1899 3.22412 3.59531 3.65635 4.11112 3.84742L5.07352 4.20377C5.08785 4.20912 5.09748 4.22352 5.09748 4.23971C5.09748 4.25593 5.08785 4.27033 5.07352 4.27568L4.11112 4.63203ZM6.0763 7.2335C6.1795 6.91676 6.41297 6.6678 6.71006 6.55772L7.26459 6.35248C7.27284 6.3494 7.27841 6.34108 7.27841 6.33174C7.27841 6.32243 7.27284 6.31411 7.26459 6.31104L6.71006 6.10579C6.41297 5.99571 6.1795 5.74675 6.0763 5.43001L5.88366 4.8391C5.8811 4.82976 5.87307 4.82336 5.86395 4.82336C5.85483 4.82336 5.8468 4.82976 5.84424 4.8391L5.65208 5.43001C5.54878 5.74688 5.31508 5.99584 5.01784 6.10579L4.46379 6.31104C4.45553 6.31411 4.44996 6.32243 4.44996 6.33174C4.44996 6.34108 4.45553 6.3494 4.46379 6.35248L5.01784 6.55772C5.31508 6.66768 5.54878 6.91664 5.65208 7.2335L5.84424 7.82444C5.8468 7.83376 5.85483 7.84016 5.86395 7.84016C5.87307 7.84016 5.8811 7.83376 5.88366 7.82444L6.0763 7.2335Z"
                      fill="url(#paint0_linear_406_4895)" />
                    <defs>
                      <linearGradient id="paint0_linear_406_4895" x1="7.8675" y1="-3.67984" x2="1.06024" y2="5.22198"
                        gradientUnits="userSpaceOnUse">
                        <stop stop-color="#2775CA" />
                        <stop offset="1" stop-color="#2ABDFF" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div class="rewards_inside">
                <div style="color: #626262; font-size: 12px">
                  Total staked
                </div>
                <div>
                  $234.34
                </div>
                <div style="color: #626262; font-size: 12px">
                  in 2 farm(s)
                </div>
              </div>
              <div class="rewards_button_dropdown">Claim all pool rewards</div>
            </div>
          </template>
        </Dropdown>

        <Dropdown :distance="4" :placement="'bottom-center'">
        <div class="wallet_address" style="padding: 10px">
          <img :src="walletPoolsImg" />

          $1.23
        </div>
        <template #popper>
            <div class="header__popup">
              <h4 style="
                  font-size: 14px;
                  color: #626262;
                  
                  margin-bottom: 10px;
                  /* text-align: center; */
                ">
                PPN Token
              </h4>
              <div class="rewards_inside">
                <div style="color: #626262; font-size: 12px">
                  PPN Price
                </div>
                <div>
                  $1.2345
             
                </div>
              </div>
              <div class="rewards_inside">
                <div style="color: #626262; font-size: 12px">
                  Market Cap
                </div>
                <div>
                  $1,827,643
                </div>
                
              </div>
              <div class="rewards_inside">
                <div style="color: #626262; font-size: 12px">
                  Circulating Supply
                </div>
                <div>
                  6,001,859 PPN
                </div>
                
              </div>
              <div class="rewards_button_dropdown"> <img :src="walletPoolsImg" /> Add PPN to wallet</div>
            </div>
          </template>
      </Dropdown>


        <div class="wallet_address" @click="$emit('toggleSidebar')">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_74_4008)">
              <path d="M30 0H0V30H30V0Z" fill="#F93301" />
              <path d="M1.93132 42.8252L29.9243 32.0342L19.1333 4.04118L-8.85969 14.8322L1.93132 42.8252Z"
                fill="#F5B800" />
              <path d="M-8.58379 -7.32143L-13.4048 22.2886L16.2052 27.1096L21.0262 -2.50043L-8.58379 -7.32143Z"
                fill="#03555E" />
              <path d="M10.7686 -17.638L-18.9434 -21.79L-23.0954 7.92196L6.61664 12.074L10.7686 -17.638Z"
                fill="#236FE1" />
            </g>
            <defs>
              <clipPath id="clip0_74_4008">
                <rect width="30" height="30" rx="15" fill="white" />
              </clipPath>
            </defs>
          </svg>
          {{ computedAddress }}
        </div>
      </div>
    </CContainer>
  </CHeader>
</template>

<script setup>
// import AppBreadcrumb from './AppBreadcrumb'
// import polygon from '@/assets/images/networks/polygon.png'
// import arbitrum from '@/assets/images/networks/arbitrum.png'
// import binance from '@/assets/images/networks/binance.png'
import router from '@/router'
import { getTokenEntity } from '@/lib/helpers/util'

// import AppHeaderDropdownAccnt from './AppHeaderDropdownAccnt'
import { computed, onMounted, ref, watch, defineEmits, defineProps } from 'vue'
import { cilUser } from '@coreui/icons'
import { Dropdown } from 'floating-vue'
import metamask from '@/assets/images/metamask.png'
// import bell from '@/assets/images/bell.svg'
import binance_network from '@/assets/icons/networks/binance.svg'
import arbitrum_network from '@/assets/icons/networks/arbitrum.svg'
import unsupported_network from '@/assets/icons/networks/unsupported.svg'
import polygon_network from '@/assets/icons/networks/polygon.svg'
import walletPoolsImg from '@/assets/icons/sidebarIcons/walletPoolsImage.svg'
import meatamask_without_bg from '@/assets/images/meatamask_without_bg.png'
import { useClipboard } from '@vueuse/core'
import {
  Network,
  ReversedDisplayNetwork,
  DisplayChain,
  networkId,
  setNetworkId,
} from '@/composables/useNetwork'
import { ethers } from 'ethers'
import { setMetamaskProvider } from '@/composables/useMetamaskProvider'
import { useStore } from 'vuex'
import { useDevice } from '@/composables/adaptive/useDevice'
import SidebarMobile from '@/components/SidebarMobile'
import { capitalizeFirstLetter } from '@/lib/utils/index'
import { configService } from '@/services/config/config.service'
import { toast } from 'vue3-toastify'
import Toast from '@/UI/Toast.vue'
import { GetTokens } from '@/composables/tokens/useTokenSymbols'
import { fetchDataAndMerge } from '@/composables/pools/trades/fetch/useFetchTrades'
import { GetPools } from '@/composables/pools/usePools'
import { useUniswapPools } from '@/composables/concentrated-liquidity/useUniswapPools'
import VueSelect from 'vue-next-select'
import 'vue-next-select/dist/index.css'
import 'vue3-toastify/dist/index.css'
import computedTokenImage from '@/composables/useComputedTokenImage'
var emitter = require('tiny-emitter/instance')

const emit = defineEmits(['toggleSidebar', 'setAddress'])
const props = defineProps(['address'])
const { width } = useDevice()
function reloadPage() {
  window.location.reload()
}
const tokens = ref([])
const swaps = ref([])
const pools = ref([])
const cl_pools = ref([])
const topTradedTokens = computed(() => {
  let formattedTokens = []
  for (let i = 0; i < tokens.value.length; i++) {
    let total_profit = swaps.value
      .filter((item) => item.token.toLowerCase() == tokens.value[i].address)
      .reduce((sum, item) => sum + item.profitUsd, 0)

    formattedTokens.push({ ...tokens.value[i], profit: total_profit })
  }
  return formattedTokens
    .filter((item) => item.profit > 0)
    .toSorted((a, b) => b.profit - a.profit)
})

const topPools = computed(() => {
  return pools.value
    .concat(cl_pools.value)
    .toSorted((a, b) => b.totalLiquidity - a.totalLiquidity)
})
const visibleOptions = ref(null)
const tokensOptions = computed(() => {
  let result = []
  result.push({ firstToken: true, id: "a b c d e f g h i j k l m n o p q r s t u v w x y z" })
  result.push(...topTradedTokens.value.map((item) => ({
    id: `${item.name} ${item.symbol}`,
    label: item.name,
    img: item.symbol,
    price: `${item.profit.toFixed(2)}$`,
    percentChange: '0%',
    tokens: true
  })))
  result.push({ firstPool: true, id: "a b c d e f g h i j k l m n o p q r s t u v w x y z" })
  result.push(...topPools.value.map((item) => ({
    id: `${item.tokens.map((token) => token.symbol).join("/")} ${item.type}`,
    poolId: item.id,
    chainId: item.chainId,
    type: item.type,
    label: item.type,
    img: item.tokens.map((token) => token.symbol),
    desc: item.tokens.map((token) => token.symbol).join("/"),
    percentChange: "0%",
    price: `${parseFloat(item.totalLiquidity).toFixed(2)}$`,
    pools: true
  })))
  return result
})

const visibleOptionsComputed = computed(() => {
  if (tokensOptions.value.length <= 2) {
    return []
  }
  let result = tokensOptions.value.slice(0, 3)
  let index = tokensOptions.value.findIndex((item) => item.firstPool)
  result.push(...tokensOptions.value.slice(index, index + 3))
  return result
})

const selectOptions = computed(() =>
  visibleOptions.value ? visibleOptions.value : tokensOptions.value,
)

watch(visibleOptionsComputed, () => {
  if (visibleOptionsComputed.value)
    visibleOptions.value = [...visibleOptionsComputed.value]
})

const isHeaderBg = ref(false)

const networks = [
  process.env.VUE_APP_KEY_ARBITRUM ? Network.ARBITRUM : undefined,
  process.env.VUE_APP_KEY_BINANCE ? Network.BINANCE : undefined,
  process.env.VUE_APP_KEY_POLYGON ? Network.POLYGON : undefined,
].filter((n) => n != undefined)

const headRef = ref(null) // obtain the reference

onMounted(async () => {
  window.addEventListener('scroll', () => {
    var curr = window.pageYOffset

    // You can style header-bg for style purpose

    if (curr >= 50) {
      isHeaderBg.value = true
    } else {
      isHeaderBg.value = false
    }
  })
  tokens.value = (
    await Promise.all(networks.map((network) => GetTokens(network)))
  ).flat()
  swaps.value = await fetchDataAndMerge()
  pools.value = (
    await Promise.all(
      networks.map((network) => GetPools(network, null, true, true)),
    )
  )
    .flat()
    .map((item) => ({ ...item, type: 'Weighted Pool' }))
  cl_pools.value = (await useUniswapPools(56)).map((item) => ({
    ...item,
    type: 'Concentrated Liquidity',
    totalLiquidity: item.totalValueLockedUSD,
    tokens: [item.token0, item.token1],
  }))
  console.log('CL POOLS - ', cl_pools.value)
})

const searchInput = ref('')
function handleInput(event) {
  searchInput.value = event.target.value
  let _search = searchInput.value.toLowerCase()
  visibleOptions.value = searchInput.value
    ? [
      ...tokensOptions.value.filter((item) =>
        checkInputSearchItem(_search, item),
      ),
    ]
    : [...visibleOptionsComputed.value]
}

function checkInputSearchItem(_search, item) {
  if (item.firstPool || item.firstToken) return true

  let result =
    (item.desc && item.desc.toLowerCase().includes(_search)) ||
    (item.label && item.label.toLowerCase().includes(_search))
  return result
}

const notify = (popupType, popupText, popupSubText) => {
  toast(Toast, {
    closeOnClick: true,
    theme: 'dark',
    type: popupType,
    autoClose: 5000,
    closeButton: false,
    position: toast.POSITION.TOP_RIGHT,
    data: {
      header_text: popupText,
      toast_text: popupSubText,
    },
  })
}


function goToPool(poolId, chainId, type) {
  router.push(`/pools/${type == "Concentrated Liquidity" ? "CLdetails" : "details"}/${poolId}/${DisplayChain[chainId]}/info`)
}

function goToFilteredPools(token) {
  router.push({ path: `/pools`, query: { token } })
}

const navOpen = ref(false)
const isMetamaskSupported = ref(false)
const isConnectedToWeb3 = ref(localStorage.getItem('isConnectedToWeb3'))
// const isConnectedToWeb3LocalStorage = ref(false)
const accountData = ref()
const ethereumNetwork = ref('')
const store = useStore()
// eslint-disable-next-line
const { text, copy, copied, isSupported } = useClipboard({
  address: props.address,
})


const clearedNotifications = ref([])

// function clearNotifications() {
//   clearedNotifications.value = [...notifications.value]
//   notifications.value = []
//   localStorage.removeItem("notifications")
// }

watch(
  () => ethereumNetwork.value,
  () => {
    if (ethereumNetwork.value.chainId) {
      let isConnectedToExistingChain = false
      for (let i = 0; i < networksList.value.length; i++) {
        let network = networksList.value[i]
        if (network.decimalChainId == ethereumNetwork.value.chainId) {
          network.current = true
          isConnectedToExistingChain = true
        } else {
          network.current = false
        }
      }
      if (!isConnectedToExistingChain) {
        notify(
          'error',
          'Wrong chain',
          'Please connect to one of the available chains',
        )
      }
    }
  },
)

const TWO_MINUTES_INTERVAL = 1000 * 60 * 2

if (window.Worker) {
  const myWorker = new Worker(new URL('@/worker', import.meta.url), {
    type: 'module',
  })
  setInterval(
    () =>
      myWorker.postMessage({
        method: 'update',
        data: JSON.parse(localStorage.getItem('notifications')) || '[]',
      }),
    TWO_MINUTES_INTERVAL,
  )
  emitter.on('addNotification', (notification) => {
    myWorker.postMessage({
      method: 'add',
      data: {
        all_notifications: JSON.parse(
          localStorage.getItem('notifications') || '[]',
        ),
        newNotification: notification,
      },
    })
  })

  myWorker.onmessage = function (e) {
    let newNotifications = e.data.filter(
      (item1) =>
        !clearedNotifications.value.some(
          (item2) => item2.hash && item2.hash === item1.hash,
        ),
    )

    localStorage.setItem('notifications', JSON.stringify(newNotifications))
    notifications.value = newNotifications
    console.log('Message received from worker')
  }
}
const notifications = ref(
  JSON.parse(localStorage.getItem('notifications')) || [],
)

const networksList = ref(
  [
    process.env.VUE_APP_KEY_ARBITRUM
      ? {
        name: 'Arbitrum',
        chainId: '0xa4b1',
        decimalChainId: 42161,
        image: arbitrum_network,
        current: false,
      }
      : undefined,
    process.env.VUE_APP_KEY_BINANCE
      ? {
        name: 'Binance',
        chainId: '0x38',
        decimalChainId: 56,
        image: binance_network,
        current: false,
      }
      : undefined,
    process.env.VUE_APP_KEY_POLYGON
      ? {
        name: 'Polygon',
        chainId: '0x89',
        decimalChainId: 137,
        image: polygon_network,
        current: false,
      }
      : undefined,
  ].filter((item) => item != undefined),
)

onMounted(async () => {
  isMetamaskSupported.value = window.ethereum !== undefined
  console.log('MM SUPPORTED - ', isMetamaskSupported)
  if (isMetamaskSupported.value) {
    await connectWallet()
  } else {
    notify(
      'error',
      'Metamask is not installed!',
      'Please install Metamask browser extension.',
    )
  }
})

// eslint-disable-next-line
function getNotificationLink(notification) {
  if (!notification.network) return '#'
  let config = configService.getNetworkConfig(
    ReversedDisplayNetwork[capitalizeFirstLetter(notification.network)],
  )
  return `${config.explorer}/tx/${notification.hash}`
}

async function connectWallet() {
  window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(async (res) => {
      // Request MetaMask to connect
      await window.ethereum.enable()
      let provider = new ethers.providers.Web3Provider(window.ethereum)
      setMetamaskProvider(provider)
      const network = await provider.getNetwork()

      isConnectedToWeb3.value = true
      localStorage.setItem('isConnectedToWeb3', true)

      // isConnectedToWeb3LocalStorage = true

      // console.log('res', res)
      console.log(res)
      const walletData = res
      accountData.value = walletData
      emit('setAddress', res[0])
      console.log('APP HEADER')
      ethereumNetwork.value = network
      store.dispatch('setWalletData', walletData)
      store.dispatch('setCurrentNetwork', network)
      localStorage.setItem('ethereumNetwork', JSON.stringify(network))

      console.log(
        window.ethereum.networkVersion,
        'window.ethereum.networkVersion',
      )
      setNetworkId(network.chainId)
      window.ethereum.on('chainChanged', handleChainChanged)
      window.ethereum.on('accountsChanged', function (accounts) {
        emit('setAddress', accounts[0])
        localStorage.setItem('account', accounts[0])
      })
    })
    .catch((err) => {
      console.error(err)
      notify(
        'warning',
        'Wallet is not connected',
        'Please connect your wallet via Metamask',
      )
    })
}

async function handleChainChanged() {
  let provider = new ethers.providers.Web3Provider(window.ethereum)
  const newNetwork = await provider.getNetwork()
  setNetworkId(newNetwork.chainId)
}

async function disconnectFromWallet() {
  isConnectedToWeb3.value = localStorage.removeItem('isConnectedToWeb3')
  await window.ethereum.request({
    method: 'eth_requestAccounts',
    params: [{ eth_accounts: {} }],
  })
  networkId.value = Network.NONE
}

async function selectANetwork(chainId) {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: chainId }],
  })
  let decimal_chain_id = parseInt(chainId, 16)
  setNetworkId(decimal_chain_id)
  ethereumNetwork.value = { chainId: decimal_chain_id }
  // .then(() => {
  //   window.location.reload()
  // });

  // networksList.value.forEach((element) => element.current = false);
  // networksList.value[index].current = true
}

const computedAddress = computed(() =>
  props.address
    ? props.address.substring(0, 6) +
    '....' +
    props.address.substring(props.address.length - 4)
    : '',
)

const computedNetwork = computed(() =>
  ethereumNetwork.value.chainId === 42161
    ? 'Arbitrum'
    : // : ethereumNetwork.value.chainId === 1
    // ? 'Ethereum'
    ethereumNetwork.value.chainId === 56
      ? 'Binance'
      : ethereumNetwork.value.chainId === 137
        ? 'Polygon'
        : 'Unsupported network',
)

const computedNetworkImage = computed(() =>
  ethereumNetwork.value.chainId === 42161
    ? arbitrum_network
    : ethereumNetwork.value.chainId === 56
      ? binance_network
      : ethereumNetwork.value.chainId === 137
        ? polygon_network
        : unsupported_network,
)
</script>
<style lang="scss">
@import '@/styles/_variables.scss';

.header_container {
  align-items: center !important;
}

.header_main {
  position: sticky;
  top: 0;
  z-index: 12;
  margin-top: 10px;
  margin-bottom: 10px;

  &_bg {
    background: linear-gradient(356.2deg,
        rgba(0, 29, 37, 0.755) 0%,
        #000000 105.42%) !important;
    -webkit-backdrop-filter: blur(60px);
    backdrop-filter: blur(60px);
  }
}

.header_main_container {
  display: flex;
}

.right_sidebar {
  display: flex;
}

.header {
  border-bottom: none;
  padding: 16px 33px 16px 33px;
  background-color: transparent;

  &-nav {
    display: flex;
    align-items: center;

    .nav-item {
      margin: 0;

      &:hover {
        background: transparent;
      }
    }
  }

  &-network-button {
    padding: 8px 8px;
    border-radius: 8px;
    box-shadow: 0px 8px 10px 0px #00000033;
    box-shadow: 0px 6px 30px 0px #0000001f;
    box-shadow: 0px 16px 24px 0px #00000024;
    background: radial-gradient(50% 50% at 26.04% 40.42%,
        rgba(0, 201, 255, 0.13) 0%,
        rgba(0, 201, 255, 0) 100%);
    background-color: #1f1f1f;
    color: #fff;
    font-size: 14px;
    font-family: 'Poppins';

    &:hover {
      color: #fff;
    }
  }

  &-button {
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0px 8px 10px 0px #00000033;
    box-shadow: 0px 6px 30px 0px #0000001f;
    box-shadow: 0px 16px 24px 0px #00000024;
    background: radial-gradient(50% 50% at 26.04% 40.42%,
        rgba(0, 201, 255, 0.13) 0%,
        rgba(0, 201, 255, 0) 100%);
    background-color: #1f1f1f;
    color: #fff;
    font-size: 14px;
    font-family: 'Poppins';

    &:hover {
      color: #fff;
    }
  }

  &__popup {
    width: 200px;
    border-radius: 16px;
    background: #171717;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
    border: 0.5px solid #ffffff0d;
    padding: 13px 8px;
    color: #fff;
    position: relative;

    // &:before {
    //   content: '';
    //   position: absolute;
    //   background: linear-gradient(#065e41, #0c261b);
    //   background-blend-mode: overlay;
    //   z-index: -1;
    //   left: -1px;
    //   top: -1px;
    //   right: -1px;
    //   bottom: -1px;
    //   border-radius: 20px;
    // }

    // &:after {
    //   content: '';
    //   position: absolute;
    //   height: 1px;
    //   width: 100%;
    //   background: rgba(2, 73, 13, 0.81);
    //   top: 46px;
    //   left: 0;
    // }
  }

  &-notifications {
    border-radius: 20px 20px 0 0;
    width: 250px;

    &:before {
      border-radius: 20px 20px 0 0;
    }

    &__wrapper {
      max-height: 300px;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 0px !important;
        height: 0px !important;
      }
    }

    &__el {
      position: relative;
      z-index: 2;
      padding: 3px 10px;
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:before {
        content: '';
        position: absolute;
        z-index: -10;
        left: -1px;
        right: -1px;
        top: -1px;
        bottom: -1px;
        border-radius: 20px;
        background: conic-gradient(from 180deg at 51.95% 49.81%,
            rgba(0, 255, 178, 0) -2.11deg,
            rgba(1, 180, 126, 0) 131.45deg,
            #7ef6b2 175.58deg,
            rgba(51, 255, 96, 0) 252.32deg,
            rgba(8, 182, 129, 0) 310.85deg,
            rgba(0, 255, 178, 0) 357.89deg,
            rgba(1, 180, 126, 0) 491.45deg);
      }

      &:after {
        content: '';
        position: absolute;
        z-index: -9;
        left: 0;
        border-radius: 20px;
        width: 100%;
        height: 100%;
        background: linear-gradient(90.23deg, #04422f 0.28%, #0b231a 129.42%);
      }
    }
  }

  &-account {
    width: 300px;
    border-radius: 20px 20px 0 0;

    &:after {
      display: none;
    }

    &__header {
      margin-bottom: 20px;
    }

    &__button {
      position: relative;
      cursor: pointer;
      z-index: 2;
      padding: 6px 10px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      border-radius: 20px;

      &:before {
        content: '';
        position: absolute;
        z-index: -10;
        left: -1px;
        right: -1px;
        top: -1px;
        bottom: -1px;
        border-radius: 20px;
        background: conic-gradient(from 180deg at 51.95% 49.81%,
            rgba(1, 180, 126, 0) 0deg,
            #7ef6b2 148.33deg,
            rgba(8, 182, 129, 0) 225.21deg,
            rgba(51, 255, 96, 0) 268.33deg,
            rgba(0, 255, 178, 0) 357.89deg,
            rgba(1, 180, 126, 0) 360deg);
      }

      &:after {
        content: '';
        position: absolute;
        z-index: -9;
        border-radius: 20px;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90.23deg, #04422f 0.28%, #0b231a 129.42%);
      }

      &:hover {
        &:before {
          background: conic-gradient(from 180deg at 51.95% 49.81%,
              rgba(1, 180, 126, 0) 0deg,
              #c6ffdf 148.33deg,
              rgba(8, 182, 129, 0) 225.21deg,
              rgba(51, 255, 96, 0) 268.33deg,
              rgba(0, 255, 178, 0) 357.89deg,
              rgba(1, 180, 126, 0) 360deg);
        }
      }
    }

    &__footer {
      background: rgba(3, 22, 3, 0.81);
      color: white;
      padding: 3px 11px;
      font-size: 12px;
      cursor: pointer;
      border: 1px solid rgba(3, 22, 3, 0.81);
      border-radius: 0 0 20px 20px;
      backdrop-filter: blur(10px);
    }
  }
}

.wallet_container {
  position: relative;
  z-index: 2;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 20px;

  &:before {
    content: '';
    position: absolute;
    z-index: -10;
    left: -1px;
    right: -1px;
    top: -1px;
    bottom: -1px;
    border-radius: 20px;
    background: conic-gradient(from 180deg at 51.95% 49.81%,
        rgba(0, 255, 178, 0) -2.11deg,
        rgba(1, 180, 126, 0) 131.45deg,
        #7ef6b2 175.58deg,
        rgba(51, 255, 96, 0) 252.32deg,
        rgba(8, 182, 129, 0) 310.85deg,
        rgba(0, 255, 178, 0) 357.89deg,
        rgba(1, 180, 126, 0) 491.45deg);
  }

  &:after {
    content: '';
    position: absolute;
    z-index: -9;
    border-radius: 20px;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90.23deg, #04422f 0.28%, #0b231a 129.42%);
  }

  &:hover {
    &:before {
      background: conic-gradient(from 180deg at 51.95% 49.81%,
          rgba(0, 255, 178, 0) -2.11deg,
          rgba(1, 180, 126, 0) 131.45deg,
          #c7e7d4 175.58deg,
          rgba(51, 255, 96, 0) 252.32deg,
          rgba(8, 182, 129, 0) 310.85deg,
          rgba(0, 255, 178, 0) 357.89deg,
          rgba(1, 180, 126, 0) 491.45deg);
    }
  }
}

.v-popper__inner {
  overflow-y: visible !important;
}

.wallet_container:hover {
  cursor: pointer;
}

.account_icon {
  padding: 2px 7px;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  z-index: 2;

  &:before {
    content: '';
    position: absolute;
    z-index: -10;
    left: -1px;
    right: -1px;
    top: 1px;
    bottom: -1px;
    border-radius: 5px;
    background: conic-gradient(from 180deg at 51.95% 49.81%,
        rgba(1, 180, 126, 0) 0deg,
        #7ef6b2 118.33deg,
        rgba(51, 255, 96, 0) 270.21deg,
        rgba(8, 182, 129, 0) 311.46deg,
        rgba(0, 255, 178, 0) 357.89deg,
        rgba(1, 180, 126, 0) 360deg);
  }

  &:after {
    content: '';
    position: absolute;
    z-index: -9;
    border-radius: 5px;
    left: 0;
    width: 100%;
    height: 100%;
    background: #072b20;
  }
}

.account_icon:hover {
  background-color: #009065b2;
}

.network_item {
  display: flex;
  padding: 8px;
}

.network_item:hover {
  background: #009065b2;
  cursor: pointer;
  border-radius: 20px;
}

.bell_container {
  cursor: pointer;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 12px;
  border-radius: 8px;
  box-shadow: 0 8px 10px 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0 6px 30px 0 rgba(0, 0, 0, 0.122);
  box-shadow: 0 16px 24px 0 rgba(0, 0, 0, 0.141);
  background: radial-gradient(50% 50% at 26.04% 40.42%,
      rgba(0, 201, 255, 0.13) 0,
      rgba(0, 201, 255, 0) 100%);
  background-color: #1f1f1f;
  color: #fff;

  img {
    width: 24px;
  }
}

.bell_container:hover {
  background: radial-gradient(50% 50% at 26.04% 40.42%,
      rgba(0, 201, 255, 0.13) 0,
      rgba(0, 201, 255, 0) 100%);
}

.bell_icon {
  color: white;
}

.bell_container:hover .bell_icon {
  color: #009065;
}

@media (max-width: $md) {
  .sidemenu__btn {
    display: block;
    width: 36px;
    height: 36px;
    background: none;
    border: none;
    position: relative;
    z-index: 100;
    appearance: none;
    cursor: pointer;
    standard: none;

    span {
      display: block;
      width: 20px;
      height: 2px;
      margin: auto;
      background: white;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      transition: all 0.4s ease;
      border-radius: 10px;

      &.mid {
        width: 13px;
        margin-left: 8px;
      }

      &.top {
        transform: translateY(-8px);
      }

      &.bottom {
        transform: translateY(8px);
        width: 15px;
        margin-left: 8px;
      }
    }

    &.active {
      .top {
        transform: rotate(-45deg);
      }

      .mid {
        transform: translateX(-20px) rotate(360deg);
        opacity: 0;
      }

      .bottom {
        transform: rotate(45deg);
        width: 20px;
      }
    }
  }

  .header_main {
    padding-bottom: 5px;
  }

  .header_main_container {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .header {
    border-bottom: none;
    padding: 10px;

    &-nav {
      width: 100%;

      display: flex;
      align-items: center;

      .nav-item {
        margin: 0;

        &:hover {
          background: transparent;
        }
      }
    }

    &-network-button {
      padding: 8px 8px;
      border-radius: 8px;
      color: #fff;
      font-size: 14px;

      &:hover {
        color: #fff;
      }
    }

    &-button {
      padding: 12px 16px;
      border-radius: 8px;
      color: #fff;
      font-size: 14px;

      &:hover {
        color: #fff;
      }
    }
  }
}

.badge {
  background: #00c9ff;
  margin-right: -20px;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  text-align: center;
  padding: 5%;
  position: relative;
  right: 16.8px;
  top: -3px;
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
}

.message-count {
  position: relative;
  color: white;
  font: bold 8px Helvetica, Verdana, Tahoma;
  text-align: center;
}

.navigation_text {
  font-family: Inter;
  font-size: clamp(10px, 0.8vw, 15px);
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 0em;
  text-align: center;
  color: #7d7d7d;
  text-decoration: none;

  &:hover {
    color: #2abdff;
    cursor: pointer;
  }

  &_selected {
    background: -webkit-linear-gradient(#2775ca, #2abdff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 0.7rem #00c9ff);
  }
}

.arrow-downward {
  display: none !important;
}

.vue-select {
  background: linear-gradient(0deg, #090909, #090909),
    linear-gradient(0deg, rgba(115, 115, 115, 0.06), rgba(115, 115, 115, 0.06));
  border: 1px solid #222222c9;
  border-radius: 16px;
  width: 500px;

  @media (max-width:1300px) {
    width: 370px;

  }

  &:hover {
    // border: 1px solid #00c8ffb7;
    filter: drop-shadow(0 0 0.3rem #00c8ff63);
  }
}

.vue-input {
  padding-left: 35px;
  font-family: Inter;
  font-size: 15px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0em;
  color: #7d7d7d;
  height: 38px;
}

.vue-input input {
  background: transparent;
  color: white;
}

.vue-dropdown {
  background: #090909;
  border: 1px solid #222222c9;
  color: white;
}

/* Scrollbar */
.vue-dropdown::-webkit-scrollbar {
  height: 0px;
  width: 4px;
}

.vue-dropdown::-webkit-scrollbar {
  background: transparent;
}

.vue-dropdown::-webkit-scrollbar-thumb {
  background-color: #2abdff9e;
  border-radius: 8px;
}

.vue-dropdown-item.highlighted {
  background: #99a1bd14;
}

.vue-dropdown-item.selected.highlighted {
  background: #00c8ff13;
}

.vue-dropdown-item.selected {
  background: transparent;
}

.vue-select[data-is-focusing='false'][aria-disabled='false'] .vue-input input,
input[readonly] {
  cursor: text;
}

.search_groups {
  font-family: Inter;
  font-size: 12px;
  font-weight: 500;
  line-height: 15px;
  letter-spacing: 0em;
  color: #7d7d7d;
  padding: 8px;
}

.connect_wallet {
  border-radius: 16px;
  background: linear-gradient(0deg, #090909, #090909),
    linear-gradient(0deg, rgba(42, 189, 255, 0.62), rgba(42, 189, 255, 0.62));
  border: 1px solid #2abdff9e;
  box-shadow: 0px 4px 4px 0px #2abdff40;
  color: #2abdff;
  font-family: Inter;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: center;
  padding: 10px 20px;

  &:hover {
    background: #2abdff;
    color: white;
    cursor: pointer;
  }
}

.wallet_address {
  height: 40px;
  background: #15151580;
  border: 1px solid #2222220d;
  box-shadow: 0px 4px 4px 0px #00000040;

  border-radius: 16px;
  padding: 8px 25px;
  font-family: Inter;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: center;
  color: white;

  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #2abcff36;

    cursor: pointer;
  }
}

.pair_avatars_manage_pool {
  width: 38px;
  margin-right: -18px;
}

.rewards_inside {
  border-radius: 2px;
  background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;
  padding: 5px;
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: white;
}

.rewards_button_dropdown {
  cursor: pointer;
  margin-top: 10px;
  border-radius: 2px;
  font-family: Inter;
  font-size: 12px;
  font-weight: 600;
  line-height: 24px;
  color: #FFFFFF;
  text-align: center;
  padding: 8px;
  background: linear-gradient(45deg, #2ABDFF 0%, #0E3E9B 100%);

  box-shadow: 0px 4px 8.899999618530273px 0px #00AAE01A;



}
</style>
