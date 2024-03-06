<template>
  <div style="height: 92%; padding-top: 7px">
    <div class="d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center gap-1">
        <img :src="accountIcon" />
        <div class="address_text">{{ computedAddress }}</div>
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
        <div class="balance_text">$510.98</div>
        <div class="balance_change">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_67_2314)">
              <path
                d="M8.55317 6.00527C9.03679 6.84355 8.43184 7.89135 7.46406 7.89166L2.51976 7.89456C1.55104 7.89549 0.945005 6.84648 1.42942 6.00745L3.90407 1.72123C4.38848 0.882201 5.59997 0.882539 6.08352 1.72194L8.55317 6.00527Z"
                fill="#40B66B" />
            </g>
            <defs>
              <clipPath id="clip0_67_2314">
                <rect width="8.05256" height="8.05256" fill="white" transform="translate(6.97363 11) rotate(-150)" />
              </clipPath>
            </defs>
          </svg>
          $12.37 (2.48%)
        </div>
      </div>
      <div @click="router.push('/pools')" class="add_liq_btn">
        <div class="d-flex gap-1">
          <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.7148 18.0011H8.7148C7.7148 18.0011 7.2148 17.5011 7.2148 16.5011V1.50107C7.2148 0.501068 7.7148 0.00106812 8.7148 0.00106812H9.7148C10.7148 0.00106812 11.2148 0.501068 11.2148 1.50107V16.5011C11.2148 17.5011 10.7148 18.0011 9.7148 18.0011ZM18.2148 16.5011V6.50107C18.2148 5.50107 17.7148 5.00107 16.7148 5.00107H15.7148C14.7148 5.00107 14.2148 5.50107 14.2148 6.50107V16.5011C14.2148 17.5011 14.7148 18.0011 15.7148 18.0011H16.7148C17.7148 18.0011 18.2148 17.5011 18.2148 16.5011ZM4.21484 16.5011V10.5011C4.21484 9.50109 3.71484 9.00109 2.71484 9.00109H1.71484C0.714844 9.00109 0.214844 9.50109 0.214844 10.5011V16.5011C0.214844 17.5011 0.714844 18.0011 1.71484 18.0011H2.71484C3.71484 18.0011 4.21484 17.5011 4.21484 16.5011Z"
              fill="#2ABDFF" />
          </svg>
          Add liquidity
        </div>
      </div>
      <div class="d-flex gap-3">
        <div @click="sidebarTab = 'Tokens'" :class="sidebarTab === 'Tokens' ? 'tab selected_tab' : 'tab'">
          Tokens
        </div>
        <div @click="sidebarTab = 'Pools'" :class="sidebarTab === 'Pools' ? 'tab selected_tab' : 'tab'">
          Pools
        </div>
        <div @click="sidebarTab = 'Activity'" :class="sidebarTab === 'Activity' ? 'tab selected_tab' : 'tab'">
          Activity
        </div>
      </div>
      <div v-if="sidebarTab === 'Tokens'" class="d-flex flex-column gap-2">
        <div v-for="(item, i) in tokensOptions" :key="`${i}-token`"
          class="p-2 d-flex align-items-center justify-content-between gap-2">
          <div class="d-flex align-items-center gap-2">
            <img :src="getTokenEntity(item.img, 'short').icon" width="38" />
            <div class="d-flex flex-column">
              <div style="font-size: 12px; color: #ffffff">
                {{ item.label }}
              </div>
              <div style="font-size: 10px; color: #8e8e8e">
                {{ item.img }}
              </div>
            </div>
          </div>
          <div>
            <div class="d-flex flex-column align-items-end">
              <div style="font-size: 12px; color: #ffffff">
                {{ item.price }}
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
                {{ item.percentChange }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="sidebarTab === 'Pools'" class="h-100">
        <div class="d-flex flex-column gap-2" v-if="addressPools.length > 0">
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

              <div class="d-flex flex-column">
                <div style="font-size: 12px; color: #ffffff">
                  {{ item.label }}
                </div>
                <div style="font-size: 10px; color: #8e8e8e">
                  {{ item.img }}
                </div>
              </div>
            </div>
            <div>
              <div class="d-flex flex-column align-items-end">
                <div style="font-size: 12px; color: #ffffff">
                  {{ item.price }}
                </div>
                <div style="font-size: 10px; color: #8e8e8e" class="d-flex align-items-center gap-1">
                  <svg v-if="item.percentChange !== 'Out of range' &&
          item.percentChange !== 'On range'
          " width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  {{ item.percentChange }}
                  <svg v-if="item.percentChange === 'Out of range' ||
          item.percentChange === 'On range'
          " width="5" height="5" viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="2.5" cy="2.5" r="2.5" :fill="item.percentChange === 'Out of range'
          ? '#EC9E13'
          : '#40B66B'
          " />
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
          <div class="text-white">No pools yet</div>
          <div class="text-white" style="font-size: 12px; text-align: center">
            Open a new position or create a pool to get started.
          </div>
          <div @click="router.push('/pools')" class="add_liq_btn_pools">
            <div class="d-flex gap-1">+ Add liquidity</div>
          </div>
        </div>
      </div>
      <div v-else-if="sidebarTab === 'Activity'" class="d-flex flex-column gap-2 overflow-auto activity_container">
        <div>
          <div class="tab my-2" style="font-size: 12px">Today</div>
          <div class="d-flex flex-column gap-2">
            <a :href="`${configService.getNetworkConfig(56).explorer}/tx/${item.hash}`"
              v-for="(item, i) in addressActivity.filter((el) => el.type == 'today')" :key="`${i}-token`"
              class="p-2 d-flex align-items-center justify-content-between gap-2">
              <div class="d-flex align-items-center gap-2">
                <img :src="item.img" width="38" />
                <div class="d-flex flex-column">
                  <div style="font-size: 12px; color: #ffffff">
                    {{ item.label }}
                  </div>
                  <div style="font-size: 10px; color: #8e8e8e">
                    {{ item.desc }}
                  </div>
                </div>
              </div>
              <div>
                <div class="d-flex flex-column align-items-end">
                  <div style="font-size: 12px; color: #ffffff">
                    {{ item.time }}
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div>
          <div class="tab my-2" style="font-size: 12px">This week</div>
          <div class="d-flex flex-column gap-2">
            <a :href="`${configService.getNetworkConfig(56).explorer}/tx/${item.hash}`"
              v-for="(item, i) in addressActivity.filter((el) => el.type == 'week')" :key="`${i}-token`"
              class="p-2 d-flex align-items-center justify-content-between gap-2">
              <div class="d-flex align-items-center gap-2">
                <img :src="item.img" width="38" />
                <div class="d-flex flex-column">
                  <div style="font-size: 12px; color: #ffffff">
                    {{ item.label }}
                  </div>
                  <div style="font-size: 10px; color: #8e8e8e">
                    {{ item.desc }}
                  </div>
                </div>
              </div>
              <div>
                <div class="d-flex flex-column align-items-end">
                  <div style="font-size: 12px; color: #ffffff">
                    {{ item.time }}
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div>
          <div class="tab my-2" style="font-size: 12px">This month</div>
          <div class="d-flex flex-column gap-2">
            <a v-for="(item, i) in addressActivity.filter((el) => el.type == 'month')" :key="`${i}-token`"
              :href="`${configService.getNetworkConfig(56).explorer}/tx/${item.hash}`"
              class="p-2 d-flex align-items-center justify-content-between gap-2">
              <div class="d-flex align-items-center gap-2">
                <img :src="item.img" width="38" />
                <div class="d-flex flex-column">
                  <div style="font-size: 12px; color: #ffffff">
                    {{ item.label }}
                  </div>
                  <div style="font-size: 10px; color: #8e8e8e">
                    {{ item.desc }}
                  </div>
                </div>
              </div>
              <div>
                <div class="d-flex flex-column align-items-end">
                  <div style="font-size: 12px; color: #ffffff">
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
import { useWalletActivity } from "@/composables/wallet/useWalletActivity"
import { configService } from '@/services/config/config.service'
import { useWalletPools } from "@/composables/wallet/useWalletPools"
import { InitializeMetamask } from '@/lib/utils/metamask'
const props = defineProps(['isConnectedToWeb3', 'address'])
const emit = defineEmits(['toggleSettings', 'toggleToWallets', 'setAddress'])

const sidebarTab = ref('Tokens')

const tokensOptions = ref([
  {
    label: 'Bitcoin',
    img: 'BTC',
    price: '$51000',
    percentChange: '5.1%',
  },
  {
    label: 'Ethereum',
    img: 'ETH',
    price: '$2700',
    percentChange: '2.1%',
  },
  {
    label: 'Arbitrum',
    img: 'ARB',
    price: '$1.89',
    percentChange: '1.1%',
  },
  {
    label: 'Solana',
    img: 'SOL',
    price: '$115.54',
    percentChange: '11.1%',
  },
])
const mockPools = ref([
  {
    label: 'MATIC / LDO',
    img: '0.01%',
    price: '$51000',
    percentChange: 'Out of range',
  },
  {
    label: 'MATIC / LDO',
    img: '0.01%',
    price: '$2700',
    percentChange: 'On range',
  },
  {
    label: 'WP-MATIC / BTC / USDC',
    img: '12.3% APR',
    price: '$1.89',
    percentChange: '1.1%',
  },
  {
    label: 'WP-MATIC / BTC / AVAX',
    img: '20.3% APR',
    price: '$115.54',
    percentChange: '11.1%',
  },
])
const addressActivity = ref([])
const addressPools = ref([])

const computedAddress = computed(
  () =>
    props.address ? props.address.substring(0, 6) + '....' + props.address.substring(props.address.length - 4) : '',
)
async function disconnectFromWallet() {
  localStorage.removeItem('address')
  await window.ethereum.request({
    method: 'eth_requestAccounts',
    params: [{ eth_accounts: {} }],
  })
  networkId.value = Network.NONE
  emit("setAddress", null)
  emit('toggleToWallets')
}


watch(props.address, async () => {
  await handlePortfolioData()
})

onMounted(async () => {
  await handlePortfolioData()
})


async function handlePortfolioData() {
  if (props.address) {
    let mmProvider = await InitializeMetamask()
    addressActivity.value = await useWalletActivity(props.address, mmProvider)
    addressPools.value = await useWalletPools(props.address, networkId.value)
  }
}
</script>

<style lang="scss" scoped>
.sidebar_header {
  font-family: Inter;
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
  background: #10101099;
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
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  color: #717a8c;
}

.wallet_bottom_text {
  font-family: Inter;
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
  font-family: Inter;
  font-size: 13px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0em;

  color: #ffffff;
}

.balance_text {
  font-family: Inter;
  font-size: 34px;
  font-weight: 500;
  letter-spacing: 0em;
  color: #ffffff;
}

.balance_change {
  font-family: Inter;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0em;

  color: #898989;
}

.add_liq_btn {
  padding: 15px;
  display: flex;
  justify-content: center;
  background: #002c4499;
  border-radius: 20px;
  font-family: Inter;
  font-size: 19px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: center;
  color: #2abdff;

  &:hover {
    background: #002c44cc;
    // filter: drop-shadow(0 0 0.6rem #2abcff91);
    cursor: pointer;
  }
}

.add_liq_btn_pools {
  padding: 8px;
  display: flex;
  justify-content: center;
  background: #2abdff;
  border-radius: 5px;
  font-family: Inter;
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0px 4px 4px 0px #00000040;

  text-align: center;
  color: white;

  &:hover {
    background: #1ab6ff;
    filter: drop-shadow(0 0 0.6rem #2abcff91);
    cursor: pointer;
  }
}

.tab {
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0em;
  color: #898989;
  cursor: pointer;
}

.selected_tab {
  color: white;
}



/* Scrollbar */
.activity_container::-webkit-scrollbar {
  height: 0px;
  width: 4px;
}

.activity_container::-webkit-scrollbar {
  background: transparent;
}

.activity_container::-webkit-scrollbar-thumb {
  background-color: #2abdff9e;
  border-radius: 8px;
}
</style>
