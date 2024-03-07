<template>
  <TokenSelectModal
    :tokenSelectModal="tokenSelectModal"
    @tokenSelectModalOpen="tokenSelectModalOpen"
    :pairIndex="pairIndex"
    @updateToken="updateToken"
    :possibleComposeTokens="notSelectedPossibleComposeTokens"
    @addToken="onAddToken"
  />
  <MainCard>
    <div class="buy_container">
      <div class="buy_container_section_1">
        <div style="margin-top: -60px">
          <div
            style="
              color: white;
              font-size: clamp(24px, 0.8vw, 40px);
              font-weight: 700;
            "
            class="my-3"
          >
            Trade <br />
            PPN Tokens
          </div>
          <div class="buy_balance_container">
            <div class="d-flex mb-2" style="font-weight: 600">
              <div class="buy_balance_container_row">My Tokens</div>
              <div class="buy_balance_container_row_right">Balance</div>
              <div class="buy_balance_container_row_right">Value</div>
            </div>
            <div
              class="d-flex my-3"
              v-for="(item, i) in tokens_balances"
              :key="`${i}-balance`"
            >
              <div class="buy_balance_container_row">
                <img
                  :src="getTokenEntity(item.name, 'short').icon"
                  width="14"
                />
                {{ item.name }}
              </div>
              <div class="buy_balance_container_row_right">
                {{ item.balance }} {{ item.name }}
              </div>
              <div class="buy_balance_container_row_right">
                ${{ item.value }}
              </div>
            </div>
          </div>
        </div>
        <div class="buy_token_container">
          <div class="d-flex">
            <div
              @click="selectedTab = 'Buy'"
              :class="selectedTab === 'Sell' ? 'buy_tab' : 'buy_tab_active'"
            >
              Buy
            </div>
            <div
              @click="selectedTab = 'Sell'"
              :class="selectedTab === 'Buy' ? 'buy_tab' : 'buy_tab_active'"
            >
              Sell
            </div>
          </div>
          <div class="d-flex flex-column gap-3 p-4">
            <div class="selector_button">
              <div class="d-flex flex-column gap-2">
                <div>Spend</div>
                <input
                  type="number"
                  placeholder="0.00"
                  style="
                    background: none;
                    border: none;
                    outline: none;
                    width: 180px;
                    color: rgb(193, 200, 206);
                    font-weight: 600;
                    font-size: 20px;
                  "
                />
              </div>
              <div
                @click="() => tokenSelectModalOpen()"
                class="d-flex flex-column gap-2"
              >
                <div style="color: #7d7d7d; font-size: 12px">
                  Balance: {{ selectedTab === 'Buy' ? '1.00BTC' : '1.00PPN' }}
                </div>
                <div
                  v-if="selectedTab === 'Buy'"
                  style="font-size: 16px; margin-bottom: 0; color: white"
                >
                  <img :src="getTokenEntity('BTC', 'short').icon" width="18" />
                  <span style="margin-left: 5px">BTC</span>
                  <svg
                    style="margin-left: 10px"
                    width="9"
                    height="6"
                    viewBox="0 0 9 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.36011 0.0750122V1.95001L4.61011 5.92501L0.860107 1.95001V0.0750122H8.36011Z"
                      fill="#848E9C"
                    />
                  </svg>
                </div>
                <div
                  v-else
                  style="font-size: 16px; margin-bottom: 0; color: white"
                >
                  <img :src="walletPoolsImg" />
                  <span style="margin-left: 5px">PPN</span>
                </div>
              </div>
            </div>
            <div class="selector_button">
              <div class="d-flex flex-column gap-2">
                <div>Receive</div>
                <input
                  type="number"
                  placeholder="0.00"
                  style="
                    background: none;
                    border: none;
                    outline: none;
                    width: 180px;
                    color: rgb(193, 200, 206);
                    font-weight: 600;
                    font-size: 20px;
                  "
                />
              </div>
              <div
                @click="() => tokenSelectModalOpen()"
                class="d-flex flex-column gap-2"
              >
                <div style="color: #7d7d7d; font-size: 12px">
                  Balance: {{ selectedTab === 'Sell' ? '1.00BTC' : '1.00PPN' }}
                </div>
                <div
                  v-if="selectedTab === 'Sell'"
                  style="font-size: 16px; margin-bottom: 0; color: white"
                >
                  <img :src="getTokenEntity('BTC', 'short').icon" width="18" />
                  <span style="margin-left: 5px">BTC</span>
                  <svg
                    style="margin-left: 10px"
                    width="9"
                    height="6"
                    viewBox="0 0 9 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.36011 0.0750122V1.95001L4.61011 5.92501L0.860107 1.95001V0.0750122H8.36011Z"
                      fill="#848E9C"
                    />
                  </svg>
                </div>
                <div
                  v-else
                  style="font-size: 16px; margin-bottom: 0; color: white"
                >
                  <img :src="walletPoolsImg" />
                  <span style="margin-left: 5px">PPN</span>
                </div>
              </div>
            </div>
            <div class="referrals_button">
              {{ selectedTab === 'Sell' ? 'Sell' : 'Buy' }}
            </div>
          </div>
        </div>
      </div>

      <div
        style="
          color: white;
          font-size: clamp(24px, 0.8vw, 40px);
          font-weight: 700;
        "
        class="my-5"
      >
        How to buy PPN Tokens
      </div>

      <div class="d-flex gap-3 justify-content-center">
        <div
          v-for="(item, i) in howToBuyCards"
          :key="`${i}-how-to`"
          class="how_to_buy"
        >
          <img :src="item.icon" width="60" />
          <div style="color: #eaecef; font-size: clamp(12px, 0.8vw, 20px)">
            {{ item.name }}
          </div>
          <div style="color: #b7bdc6; font-size: clamp(9px, 0.6vw, 13px)">
            {{ item.desc }}
          </div>
        </div>
      </div>

      <div
        style="
          color: white;
          font-size: clamp(24px, 0.8vw, 40px);
          font-weight: 700;
        "
        class="my-5"
      >
        PPN Token
      </div>
      <div class="d-flex gap-3">
        <div class="chart_container" style="width: 55%">
          <div class="d-flex justify-content-between">
            <div>PPN/USDC</div>
            <div>$65.62</div>
          </div>
          <div class="d-flex justify-content-between">
            <div>
              <img :src="walletPoolsImg" width="18" />
              <img :src="getTokenEntity('USDC', 'short').icon" width="18" />
            </div>
            <div>+0.59%</div>
          </div>
          <div class="d-flex justify-content-end">
            <ChartTimeline
              :currentTimeline="currentTimeline"
              :timelines="timelines"
              @changeTimeline="changeTimeline"
            />
          </div>
        </div>
        <div class="buy_balance_container" style="width: 45%"></div>
      </div>
    </div>
  </MainCard>
</template>

<script setup>
import Tabs from '@/UI/Tabs.vue'
import MainCard from '../UI/MainCard.vue'
import { ref } from 'vue'
import { getTokenEntity } from '@/lib/helpers/util'
import TokenSelectModal from '@/components/modals/TokenSelectModal.vue'
import walletPoolsImg from '@/assets/icons/sidebarIcons/walletPoolsImage.svg'
import firstIcon from '@/assets/icons/howToCards/1.svg'
import secondIcon from '@/assets/icons/howToCards/2.svg'
import thirdIcon from '@/assets/icons/howToCards/3.svg'
import ChartTimeline from '@/UI/ChartTimeline.vue'
const timelines = [
  {
    name: '24h',
  },
  {
    name: '7D',
  },
  {
    name: '30D',
  },
  {
    name: '1Y',
  },
]

const currentTimeline = ref(timelines[0])

function changeTimeline(tl) {
  currentTimeline.value = tl
}
const tokens_balances = ref([
  {
    name: 'USDC',
    balance: 100,
    value: 100,
  },
  {
    name: 'BNB',
    balance: 1,
    value: 410,
  },
  {
    name: 'BTC',
    balance: 1,
    value: 660036,
  },
  {
    name: 'ETH',
    balance: 33,
    value: 4100,
  },
  {
    name: 'AVAX',
    balance: 200,
    value: 30,
  },
  {
    name: 'SOL',
    balance: 1200,
    value: 140,
  },
])
const howToBuyCards = ref([
  {
    name: '1. Enter Amount & Select Currency',
    desc: 'Enter the amount and select the desired currency to trade for PPN tokens.',
    icon: firstIcon,
  },
  {
    name: '2. Confirm Swap',
    desc: 'Confirmation of transaction detail information, including trading pair quotes, fees, and other explanatory tips.',
    icon: secondIcon,
  },
  {
    name: '3. Receive PPN Tokens',
    desc: 'After successful swapping, the PPN Tokens will reach your wallet.',
    icon: thirdIcon,
  },
])

const selectedTab = ref('Buy')

// function changeSelectedTab(_new) {
//   selectedTab.value = _new
// }

const tokenSelectModal = ref(false)
function tokenSelectModalOpen() {
  tokenSelectModal.value = !tokenSelectModal.value
}
const notSelectedPossibleComposeTokens = ref([])
</script>
<style lang="scss" scoped>
@import '../styles/_variables.scss';

.buy_container {
  // display: flex;
  // justify-content: center;
  // width: 70%;
  padding-left: 200px;
  padding-right: 200px;
  @media (max-width: $xxl) {
    padding-left: 100px;
    padding-right: 100px;
  }

  &_section_1 {
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
  }
}

.buy_balance_container {
  background: #22222224;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 4px 0px #00000040;
  border-radius: 16px;
  padding: 12px 20px;
  font-family: Poppins;
  font-size: clamp(10px, 0.8vw, 14px);
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0em;
  color: white;
  height: fit-content;

  &_row {
    width: 150px;
    @media (max-width: $xxl) {
      width: 100px;
    }
    &_right {
      width: 150px;
      text-align: right;

      @media (max-width: $xxl) {
        width: 100px;
      }
    }
  }
}

.buy_token_container {
  background: #171717;
  border: 1px solid #191919;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

  border-radius: 20px;
}

.buy_tab {
  width: 100%;
  border-radius: 16px 16px 0px 0px;
  background: #2b3139;
  display: flex;
  justify-content: center;
  padding: 12px 60px;
  align-items: center;
  font-family: Arial;
  font-size: clamp(15px, 0.8vw, 19px);
  font-weight: 700;
  line-height: 28px;
  text-align: center;
  color: #5e6673;
  &:hover {
    color: white;
    cursor: pointer;
  }
}
.buy_tab_active {
  width: 100%;
  border-radius: 16px 16px 0px 0px;
  font-size: clamp(15px, 0.8vw, 19px);
  position: relative;
  background: #171717;
  display: flex;
  justify-content: center;
  padding: 12px 60px;
  align-items: center;
  font-family: Arial;

  font-weight: 700;
  line-height: 28px;
  text-align: center;
  color: #eaecef;
}

// .buy_tab_active:after {
//   background: #171717;
//   border-radius: 16px 16px 0px 0px;
//   bottom: 0;
//   content: ' ';
//   position: absolute;
//   right: -18px;
//   top: 0;
//   transform: skewX(11deg);
//   width: 24px;
// }

// .buy_tab_active:before {
//   background: #171717;
//   border-radius: 8px 16px 0px 0px;
//   bottom: 0;
//   content: ' ';
//   position: absolute;
//   left: -11px;
//   top: 0;
//   transform: skewX(171deg);
//   width: 24px;
// }

.selector_button {
  font-family: Poppins;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0em;
  color: #eaecef;

  background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;
  border: 1px solid #ffffff0d;
  border-radius: 16px;
  padding: 15px;
  display: flex;
  gap: 10px;
  align-items: center;

  &:hover {
    // background: #003e4f;
    cursor: pointer;
  }
}

.referrals_button {
  width: 100%;
  cursor: pointer;
  margin-top: 45px;
  margin-bottom: 5px;
  border-radius: 4px;
  font-family: Inter;
  font-size: 12px;
  font-weight: 600;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  padding: 6px;
  background: linear-gradient(45deg, #2abdff 0%, #0e3e9b 100%);
  box-shadow: 0px 4px 8.899999618530273px 0px #00aae01a;

  &:hover {
    filter: drop-shadow(0 0 0.7rem #00c9ff);
    background: #2abdff;
  }
}

.how_to_buy {
  background: #22222224;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 4px 0px #00000040;
  padding: 32px 22px;
  border-radius: 16px;
  width: 33%;

  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
