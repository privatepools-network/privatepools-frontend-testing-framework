<template>
  <MainCard>
    <CRow class="d-flex align-items-center">

      <CCol md="auto">
        <ChainSelector :excludeAll="true" @updateChain="(newChain) => (chainSelected = newChain)" />

      </CCol>

    </CRow>
    <CCol v-if="!['Arbitrum'].includes(chainSelected.name)" :lg="12" :xl="12" class="mt-4 mb-4">

      <div class="d-flex align-items-center gap-2 mb-3 justify-content-between">
        <Title :title="'Manage Arbitrage Bot'">
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
                <div style="font-size:clamp(10px, 0.9vw, 16px)">Information</div>
                <p style="display: flex; flex-direction: column; font-size: clamp(10px, 0.8vw, 14px)">
                  Customize your trading strategy with the Manage Arbitrage Bot. Choose your preferred strategy, set risk
                  parameters, select specific tokens for trading, and easily start or stop the bot as needed. </p>
              </div>
            </template>
          </VTooltip>
        </Title>

        <div class="bot-run-simulation" @click="changeVisibleRun">
          <div class="text-white">Run Simulation</div>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M6.66699 13.3333H8.33366V6.66667H6.66699V13.3333ZM10.0003 13.3333L15.0003 10L10.0003 6.66667V13.3333ZM10.0003 18.3333C8.84755 18.3333 7.76421 18.1144 6.75033 17.6767C5.73644 17.2389 4.85449 16.6453 4.10449 15.8958C3.35449 15.1458 2.76088 14.2639 2.32366 13.25C1.88644 12.2361 1.66755 11.1528 1.66699 10C1.66699 8.84722 1.88588 7.76389 2.32366 6.75C2.76144 5.73611 3.35505 4.85417 4.10449 4.10417C4.85449 3.35417 5.73644 2.76056 6.75033 2.32333C7.76421 1.88611 8.84755 1.66722 10.0003 1.66667C11.1531 1.66667 12.2364 1.88555 13.2503 2.32333C14.2642 2.76111 15.1462 3.35472 15.8962 4.10417C16.6462 4.85417 17.24 5.73611 17.6778 6.75C18.1156 7.76389 18.3342 8.84722 18.3337 10C18.3337 11.1528 18.1148 12.2361 17.677 13.25C17.2392 14.2639 16.6456 15.1458 15.8962 15.8958C15.1462 16.6458 14.2642 17.2397 13.2503 17.6775C12.2364 18.1153 11.1531 18.3339 10.0003 18.3333ZM10.0003 16.6667C11.8614 16.6667 13.4378 16.0208 14.7295 14.7292C16.0212 13.4375 16.667 11.8611 16.667 10C16.667 8.13889 16.0212 6.5625 14.7295 5.27083C13.4378 3.97917 11.8614 3.33333 10.0003 3.33333C8.13921 3.33333 6.56283 3.97917 5.27116 5.27083C3.97949 6.5625 3.33366 8.13889 3.33366 10C3.33366 11.8611 3.97949 13.4375 5.27116 14.7292C6.56283 16.0208 8.13921 16.6667 10.0003 16.6667Z"
              fill="#F8F8F8" />
          </svg>
        </div>
      </div>

      <div class="bot_main_card">
        <!-- <BotStatus  :botStrategySelect="botStrategySelect" :botStarted="botStarted"
      :chainSelected="chainSelected" :botData="botData" :botLoading="botLoading" @endBot="endBot" @startBot="startBot"
      :isBotRunning="isBotRunning" /> -->
        <CCol :lg="12" :xl="6">
          <BotCard :botStrategySelect="selectedStrategy" :strategies="botStrategySelect" :chainSelected="chainSelected"
            :botData="botData" @endBot="endBot" @startBot="startBot" :isBotRunning="isBotRunning"
            @updateDeviation="(newVal) => deviation = newVal" :isBotLoading="isBotLoading"
            @strategySelect="(newVal) => selectedStrategy = newVal" :deviation="deviation" />
        </CCol>



        {{ console.log("IMAGE", selectedTokens) }}
        <!-- <SelectTokens  :isInitialized="true" :isBotRunning="isBotRunning" @onSelect="onSelect" :trackBy="'address'"
        :selectedTokens="selectedTokens" :onSave="() => useSaveTokens(chainSelected, selectedTokens)" :strategy="false"
        caption="Tokens" :options="allTokens" :chainSelected="chainSelected" :isSaveDisabled="isSaveDisabled"
        :possibleTokens="allTokens" /> -->
        <CCol :lg="12" :xl="6">
          <SelectTokens :allTokens="allTokens" :selectedTokens="selectedTokens" @selectToken="selectToken"
            @removeToken="removeToken" :isBotRunning="isBotRunning" :isBotLoading="isBotLoading" @addToken="onAddToken" />
        </CCol>



      </div>

      <div v-if="isBotRunning && !isBotLoading">
        <BotLogs :chainSelected="ReversedDisplayNetwork[chainSelected.name]" />
      </div>
    </CCol>
    <CCol :lg="12" :xl="12" v-if="isWarningShow" class="mt-4 mb-4 absolute">
      <div class="warning_container">
        <div class="warning">
          <img :src="bunner" class="warning__bunner" />
          <div class="warning-info">
            <div class="warning-info__title">
              {{ warningMessage }}
            </div>


            <div class="warning-info__description">
              {{ warningDescription }}
            </div>

          </div>
          <div class="warning__close" @click="isWarningShow = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M11.8451 10.7175C11.9948 10.8672 12.0789 11.0702 12.0789 11.2819C12.0789 11.4936 11.9948 11.6967 11.8451 11.8464C11.6954 11.9961 11.4924 12.0802 11.2807 12.0802C11.069 12.0802 10.8659 11.9961 10.7162 11.8464L6.50009 7.62891L2.28263 11.845C2.13293 11.9947 1.92989 12.0788 1.71818 12.0788C1.50647 12.0788 1.30343 11.9947 1.15373 11.845C1.00402 11.6953 0.919922 11.4923 0.919922 11.2806C0.919922 11.0689 1.00402 10.8658 1.15373 10.7161L5.37119 6.5L1.15505 2.28254C1.00535 2.13284 0.92125 1.9298 0.92125 1.71809C0.92125 1.50638 1.00535 1.30334 1.15505 1.15363C1.30476 1.00393 1.5078 0.919831 1.71951 0.919831C1.93122 0.919831 2.13426 1.00393 2.28396 1.15363L6.50009 5.3711L10.7176 1.15297C10.8673 1.00327 11.0703 0.919167 11.282 0.919167C11.4937 0.919167 11.6968 1.00327 11.8465 1.15297C11.9962 1.30267 12.0803 1.50571 12.0803 1.71742C12.0803 1.92913 11.9962 2.13217 11.8465 2.28188L7.629 6.5L11.8451 10.7175Z"
                fill="#F8F8F8" />
            </svg>
          </div>
        </div>
      </div>
    </CCol>
    <div v-if="!isWarningShow && allTokens.length > 0" style="height: 448px"></div>
    <RunSimulation :chainSelected="chainSelected.name" :visibleRunModal="visibleRunModal"
      @changeVisibleRun="changeVisibleRun" :possibleTokens="allTokens"></RunSimulation>
    <!-- <div  class="button-add mb-4" >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4.16699V15.8337" stroke="white" stroke-width="1.66667" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M4.16699 10H15.8337" stroke="white" stroke-width="1.66667" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </div> -->
  </MainCard>
</template>

<script setup>
import BotCard from '@/components/Admin/ManageBot/BotCard.vue'
import BotLogs from '@/components/Admin/ManageBot/BotLogs.vue'
import SelectTokens from '@/components/Admin/ManageBot/BotSelectTokens.vue'
import { CRow } from '@coreui/vue'
import { computed, onMounted, ref, watch } from "vue"
import info from '@/assets/images/info.svg'
import { GetTokens } from '@/composables/tokens/useTokenSymbols'
import ChainSelector from '@/UI/ChainSelectorV2.vue'
import { useBotStatus } from "@/composables/admin/useBotStatus"
import { RunBot, StopBot } from "@/composables/admin/useBotRun.js"
import MainCard from '@/UI/MainCard.vue'
import { ReversedDisplayNetwork, DisplayNetwork, Network } from '@/composables/useNetwork'
import bunner from '@/assets/images/warning-bg.jpg'

import { ethers } from "ethers"
import erc20abi from "@/lib/abi/ERC20.json"
import { configService } from "@/services/config/config.service";
import { GetSingleToken } from "@/composables/tokens/useSingleToken"
import Title from "@/UI/Title.vue";
import RunSimulation from "@/components/modals/RunSimulation.vue";
const isWarningShow = ref(true)
const featureMessage = 'Feature Unavailable!'
const featureDescription = 'This feature is currently not available on the selected blockchain network. Please switch to a different chain to access this functionality.'

const tvlMessage = 'TVL is less than 100$!'
const tvlDescription = ''

const visibleRunModal = ref(false)

function changeVisibleRun() {
  visibleRunModal.value = !visibleRunModal.value
}

const warningMessage = ref(featureMessage)
const warningDescription = ref(featureDescription)
const networks = [process.env.VUE_APP_KEY_ARBITRUM ? Network.ARBITRUM : undefined, process.env.VUE_APP_KEY_BINANCE ? Network.BINANCE : undefined, process.env.VUE_APP_KEY_POLYGON ? Network.POLYGON : undefined].filter((n) => n != undefined)

const chainSelected = ref({ name: DisplayNetwork[networks[0]] })
watch(chainSelected, () => {
  if (['Arbitrum'].includes(chainSelected.value.name)) {
    warningMessage.value = featureMessage
    warningDescription.value = featureDescription
    isWarningShow.value = true
  }
  else {
    isWarningShow.value = false
  }
})
const deviation = ref(1)

const defaultStrategies = ['Strategy 1INCH', 'Strategy Firebird', 'Strategy Odos']
const strategyMap = {
  'Arbitrum': [...defaultStrategies],
  'Binance': [...defaultStrategies],
  'Polygon': [...defaultStrategies]
};

//eslint-disable-next-line
const strategyShortName = {
  'Strategy 1INCH': 'runArbitrageOne1inch',
  'Strategy Firebird': 'runArbitrageFirebird',
  'Strategy Odos': 'runArbitrageOdos',
}
const strategyLongName = {
  'runArbitrageOne1inch': 'Strategy 1INCH',
  'runArbitrageFirebird': 'Strategy Firebird',
  'runArbitrageOdos': 'Strategy Odos'
}



const botStrategySelect = computed(() => {
  return strategyMap[chainSelected.value.name] || [];  // Provide a default empty string if no strategy is found
});
const botData = ref('')


const selectedStrategy = ref(botStrategySelect.value[0])
watch(botStrategySelect, () => {
  selectedStrategy.value = botStrategySelect.value[0]
})

const { data: statusCheckQuery } = useBotStatus(chainSelected)
const isBotLoading = ref(false)
const isBotRunning = computed(() => statusCheckQuery.value != null)




const allTokens = ref([])
const selectedTokens = ref([])


async function InitTokens() {
  allTokens.value = await GetTokens(ReversedDisplayNetwork[chainSelected.value.name])
  selectedTokens.value = []
  console.log(allTokens.value)
}


function selectToken(id) {
  if (!selectedTokens.value.map((t) => t.id).includes(id)) {
    let found = allTokens.value.find(item => item.id == id)
    console.log(allTokens.value)
    selectedTokens.value = [found, ...selectedTokens.value]
  }
}
function removeToken(id) {
  if (selectedTokens.value.map((t) => t.id).includes(id)) {
    selectedTokens.value = selectedTokens.value.filter((item) => item.id != id)
  }
}


async function startBot() {
  isBotLoading.value = true
  await RunBot(chainSelected.value.name, selectedTokens.value.map((t) => t.id), deviation.value, strategyShortName[selectedStrategy.value])
  isBotLoading.value = false

}
async function endBot() {
  isBotLoading.value = true
  await StopBot(chainSelected.value.name)
  isBotLoading.value = false
}


const TOKEN_TVL_MIN = 100

async function checkErc20(contract) {
  try {
    let promises = [contract.symbol(), contract.name(), contract.decimals()]
    let results = await Promise.all(promises)
    return { symbol: results[0], name: results[1] }
  }
  catch (e) {
    return null
  }
}

async function onAddToken(value) {
  let address = value.toLowerCase()
  let isAlreadyIn = allTokens.value.find((item) => item.id == address)
  if (isAlreadyIn)
    return
  if (ethers.utils.isAddress(address)) {
    let network_id = ReversedDisplayNetwork[chainSelected.value.name]
    let config = configService.getNetworkConfig(network_id)
    if (config) {
      let provider = new ethers.providers.JsonRpcProvider(config.rpc)
      let token_contract = new ethers.Contract(address, erc20abi, provider)
      let tokenInfo = await checkErc20(token_contract)
      if (tokenInfo) {
        let tokenOnProtocolInfo = await GetSingleToken(network_id, address)
        if (!tokenOnProtocolInfo || tokenOnProtocolInfo.totalBalanceUSD <= TOKEN_TVL_MIN) {
          warningMessage.value = tvlMessage
          warningDescription.value = tvlDescription
          isWarningShow.value = true
        }
        allTokens.value = [{ symbol: tokenInfo.symbol, name: tokenInfo.name, id: address, address: address }, ...allTokens.value]
      }
    }
  }
}

watch(statusCheckQuery, async () => {
  if (statusCheckQuery.value && statusCheckQuery.value['tokenAddresses']) {
    selectedTokens.value = allTokens.value.filter((token) => statusCheckQuery.value['tokenAddresses'].includes(token.id))
    deviation.value = statusCheckQuery.value['deviation']
    selectedStrategy.value = strategyLongName[statusCheckQuery.value['strategy']]
  }
})


watch((chainSelected), async () => {
  await InitTokens()
})



onMounted(async () => {
  await InitTokens()
})






</script>

<style lang="scss">
.bot-run-simulation {
  display: flex;
  white-space: nowrap;
  align-items: center;
  cursor: pointer;

  svg {
    margin-left: 5px;
  }
}

.caption {
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0em;
  color: #ffffff;
  margin-bottom: 20px;
}

.bot_main_card {
  display: flex;
  gap: 20px;
  border: 1px solid rgba(163, 164, 165, 0.2);
  border-radius: 20px;
  padding: 25px;
}

.button-add {
  height: 52px;
  width: 52px;
  margin-bottom: 24px;
  background-color: rgba(1, 105, 73, 1);
  border-radius: 20px;
  border: 1px solid rgba(163, 164, 165, 0.4);

  display: flex;
  justify-content: space-around;
  align-items: center;

  cursor: pointer;
}

.button-delete {
  height: 52px;
  width: 52px;
  margin-bottom: 24px;
  background-color: rgba(248, 71, 71, 1);
  border-radius: 5px;

  display: flex;
  justify-content: space-around;
  align-items: center;

  cursor: pointer;
}

.warning_container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.warning {
  display: flex;
  width: 55%;
  height: 180px;
  border-radius: 4px 20px 20px 4px;
  padding: 0;
  border: 0.2px solid rgba(1, 180, 126, 0.40);
  background: #02120A;
  box-shadow: 0px 12px 24px 0px rgba(1, 180, 126, 0.20), 0px 4px 8px 0px rgba(1, 180, 126, 0.30);
  position: relative;

  &__close {
    position: absolute;
    right: 20px;
    top: 10px;
    cursor: pointer;
  }

  &__bunner {
    border-radius: 4px 0 0 4px;
  }

  &-info {
    color: #FFFFFF;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    padding: 24px;

    &__title {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 4px;
    }

    &__description {
      font-size: 14px;
      margin-bottom: 12px;
    }

  }
}

/* .multiselect__tags {
  background: none !important;
  border-color: rgba(1, 180, 126, 1) !important;
}
.multiselect__content-wrapper {
  border-color: rgba(1, 180, 126, 1) !important;
}
.multiselect__single {
  background: none !important;
  color: white !important;
}
.multiselect__option {
  background: rgb(15, 17, 19) !important;
  color: white !important;
}
.multiselect__option:hover {
  background: rgba(1, 180, 126, 0.884) !important;
} */
</style>
<!-- <style src="vue-multiselect/dist/vue-multiselect.css"></style> -->
