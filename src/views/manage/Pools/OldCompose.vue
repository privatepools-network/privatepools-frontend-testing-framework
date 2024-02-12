<template>
    <MainCard>
        <div style="height: 600px" v-if="visibleNetworkModal">
            <LoaderPulse v-if="visibleNetworkModal == 'closed'"></LoaderPulse>
        </div>
        <CRow v-if="!visibleNetworkModal && visibleNetworkModal != 'closed'">
            <Title :title="caption"></Title>
        </CRow>
        <CRow v-if="!visibleNetworkModal && visibleNetworkModal != 'closed'">
            <CForm class="inputs-form">
                <CRow>
                    <CCol>
                        <CFormLabel for="poolNameInput"> Pool Name</CFormLabel>
                        <input type="text" class="inputs-el" placeholder="Must be 8-20 characters long"
                            v-model="form.poolName">
                    </CCol>
                    <CCol>
                        <CFormLabel for="poolSymbolInput"> Pool Symbol</CFormLabel>
                        <div class="inputs-group">
                            <input type="text" class="inputs-el" required v-model="form.poolSymbol">
                            <div class="inputs-group__label">DPT-</div>
                        </div>
                    </CCol>
                </CRow>
                <CFormLabel for="tokens-row">Tokens</CFormLabel>
                <br />
                <CRow id="tokens-row">
                    <!-- {{ console.log("tokensData", tokensData) }} -->
                    <SynthCard :allTokens="possibleComposeTokens" class="synth-card" ref="synthCardChild"
                        @addToken="onAddToken" @updateToken="(v) => { tokensData[synthCardIndex] = v }"
                        v-for="(synthCard, synthCardIndex) in tokensData" :tokensData="tokensData"
                        :key="`synth-card-key-${synthCardIndex}`"
                        @click-delete="tokensData = tokensData.splice(synthCardIndex, 1)" />
                    <div class="button-add" @click="tokensData.push(possibleComposeTokens[0])">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 4.16699V15.8337" stroke="white" stroke-width="1.66667" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path d="M4.16699 10H15.8337" stroke="white" stroke-width="1.66667" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                </CRow>
                <div>
                    <CAlert class="d-flex gap-2 w-75" style="
            background-color: rgba(15, 17, 19, 1);
            color: white;
            border: none;
            margin-top: 20px;
            display: flex;
          " color="primary" :visible="showWarning" dismissible @close="() => {
              showWarning = false
          }
              ">
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M22 12C22 17.5228 17.5228 22 12 22H2.9937C2.11018 22 1.66771 20.9229 2.29245 20.2929L4.2495 18.3195C2.84334 16.597 2 14.397 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.2071 8.79289C15.5976 9.18342 15.5976 9.81658 15.2071 10.2071L13.4142 12L15.2071 13.7929C15.5976 14.1834 15.5976 14.8166 15.2071 15.2071C14.8166 15.5976 14.1834 15.5976 13.7929 15.2071L12 13.4142L10.2071 15.2071C9.81658 15.5976 9.18342 15.5976 8.79289 15.2071C8.40237 14.8166 8.40237 14.1834 8.79289 13.7929L10.5858 12L8.79289 10.2071C8.40237 9.81658 8.40237 9.18342 8.79289 8.79289C9.18342 8.40237 9.81658 8.40237 10.2071 8.79289L12 10.5858L13.7929 8.79289C14.1834 8.40237 14.8166 8.40237 15.2071 8.79289Z"
                                fill="#FF507A" />
                        </svg>

                        <div>
                            {{ warningMessage }}
                        </div>
                    </CAlert>
                </div>

                <div>

                    <a target="_blank" v-if="poolCreationLink" :href="poolCreationLink">
                        Pool creation link
                        <svg width=" 14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_1904_34599)">
                                <path
                                    d="M10.5 7.58333V11.0833C10.5 11.3928 10.3771 11.6895 10.1583 11.9083C9.9395 12.1271 9.64275 12.25 9.33333 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V4.66667C1.75 4.35725 1.87292 4.0605 2.09171 3.84171C2.3105 3.62292 2.60725 3.5 2.91667 3.5H6.41667"
                                    stroke="white" stroke-opacity="0.5" stroke-width="1.16667" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path d="M8.75 1.75H12.25V5.25" stroke="white" stroke-opacity="0.5" stroke-width="1.16667"
                                    stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M5.83301 8.16667L12.2497 1.75" stroke="white" stroke-opacity="0.5"
                                    stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_1904_34599">
                                    <rect width="14" height="14" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </a>
                </div>
                <div>

                    <a target="_blank" v-if="joinPoolLink" :href="joinPoolLink">
                        Join pool link
                        <svg width=" 14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_1904_34599)">
                                <path
                                    d="M10.5 7.58333V11.0833C10.5 11.3928 10.3771 11.6895 10.1583 11.9083C9.9395 12.1271 9.64275 12.25 9.33333 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V4.66667C1.75 4.35725 1.87292 4.0605 2.09171 3.84171C2.3105 3.62292 2.60725 3.5 2.91667 3.5H6.41667"
                                    stroke="white" stroke-opacity="0.5" stroke-width="1.16667" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path d="M8.75 1.75H12.25V5.25" stroke="white" stroke-opacity="0.5" stroke-width="1.16667"
                                    stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M5.83301 8.16667L12.2497 1.75" stroke="white" stroke-opacity="0.5"
                                    stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_1904_34599">
                                    <rect width="14" height="14" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </a>
                </div>
                <CFormLabel for="transactions-row">
                    Pool creation requires 2 transactions:
                </CFormLabel>
                <CRow id="transactions-row">
                    <CreatePoolTransaction v-for="(transaction, transactionIndex) in Object.keys(transactions)"
                        :key="`create-pool-key-${transactionIndex}`" :number="transactionIndex" :text="transaction"
                        :disabled="!transactions[transaction].enabled"
                        :clickEvent="() => transactions[transaction].action()" class="pool-item" />
                </CRow>
            </CForm>
        </CRow>
    </MainCard>
    <div class="" v-if="visibleNetworkModal && visibleNetworkModal != 'closed'">
        <Warning :NetworkUnsupported="NetworkUnsupported" :closable="true" @closeWarning="closeWarning"></Warning>
    </div>
</template>

<script setup>
import SynthCard from '@/components/SynthCard.vue'
import CreatePoolTransaction from '@/components/CreatePoolTransaction.vue'
import { GetPossibleComposeTokens } from "@/composables/poolActions/compose/usePossibleComposeTokens"
import { ref, watch, onMounted } from 'vue'
import { PoolCreatorService } from '@/services/pool-creator.service';
import { networkId } from '@/composables/useNetwork';
import { InitializeMetamask } from '@/lib/utils/metamask';
import { configService } from '@/services/config/config.service';
import MainCard from '@/UI/MainCard.vue'
import Title from '@/UI/Title.vue'
import Warning from "@/UI/Warning";
import { ethers } from "ethers";
import LoaderPulse from "@/components/loaders/LoaderPulse.vue";
import { useApproveTokens } from '@/composables/poolActions/deposit/useApproveTokens'
import useBalance from '@/composables/useBalance'
import { getTokenEntity } from "@/lib/helpers/util";
import erc20abi from "@/lib/abi/ERC20.json"
import { GetFilteredTokenPrices } from "@/composables/useTokenPrices"
import { SingleSwap } from "@/composables/admin/swap/useSingleSwap"
import { generatePairCombinations } from '@/lib/utils';
import { GetTokenPriceUsd } from '@/composables/balances/cryptocompare';
//import { InitBalancer } from '@/composables/math/withdrawMath/balancer.sdk';
const caption = ref('Compose Pool')
const form = ref({
    poolName: '',
    poolSymbol: '',
    fee: '0',
})
const possibleComposeTokens = ref([])


const visibleNetworkModal = ref(false)

function changeVisibleNetworkModal() {
    visibleNetworkModal.value = !visibleNetworkModal.value
}

function closeWarning() {
    visibleNetworkModal.value = 'closed'
}

const NetworkUnsupported = ref(false)
const networksSupported = ref(null)
watch(networkId, async () => {


    networksSupported.value = { chainId: networkId.value }
    if (networkId.value <= 0)
        networksSupported.value = false
    else
        networksSupported.value = true
    possibleComposeTokens.value = await GetPossibleComposeTokens(true)
})


onMounted(async () => {
    if (window.ethereum !== undefined && networkId.value > 0) {
        let provider = new ethers.providers.Web3Provider(window.ethereum)
        networksSupported.value = await provider.getNetwork()
    }

    if (
        window.ethereum === undefined ||
        window.ethereum?._state?.accounts?.length === 0 ||
        !localStorage.getItem('isConnectedToWeb3')
    ) {
        NetworkUnsupported.value = false
        changeVisibleNetworkModal()
    }
    console.log(networksSupported.value)
    if (
        window.ethereum !== undefined && networkId.value > 0 &&
        window.ethereum?._state?.accounts?.length !== 0 &&
        networksSupported.value.chainId !== 42161 &&
        networksSupported.value.chainId !== 56 &&
        networksSupported.value.chainId !== 137
    ) {
        NetworkUnsupported.value = true
        changeVisibleNetworkModal()
    }
})

const showWarning = ref(false)
const warningMessage = ref('')

const createdPoolId = ref('')

const poolCreationLink = ref('')
const joinPoolLink = ref('')

const tokensData = ref([possibleComposeTokens.value.length > 0 ? possibleComposeTokens.value[0] : {}])

async function onAddToken(value) {
    let address = value.toLowerCase()
    let isAlreadyIn = tokensData.value.find((item) => item.id == address)
    if (isAlreadyIn)
        return
    if (ethers.utils.isAddress(address)) {
        let network_id = networkId.value
        let config = configService.getNetworkConfig(network_id)
        if (config) {
            let provider = new ethers.providers.JsonRpcProvider(config.rpc)
            let token_contract = new ethers.Contract(address, erc20abi, provider)
            let tokenInfo = await checkErc20(token_contract)
            if (tokenInfo) {
                let provider = await InitializeMetamask()
                let account = await provider.getSigner().getAddress()
                let balance = await useBalance(address, provider, account)
                // let tokenOnProtocolInfo = await GetSingleToken(network_id, address)
                possibleComposeTokens.value = [{ balance, price: tokenInfo.price, decimals: tokenInfo.decimals, img: getTokenEntity(tokenInfo.symbol, 'short').icon, value: 0, symbol: tokenInfo.symbol, name: tokenInfo.name, id: address, address: address }, ...possibleComposeTokens.value]
            }
        }
    }
}

async function checkErc20(contract) {
    try {
        let promises = [contract.symbol(), contract.name(), contract.decimals()]
        let results = await Promise.all(promises)
        let price = await GetTokenPriceUsd(results[0])
        return { symbol: results[0], name: results[1], decimals: results[2], price }
    }
    catch (e) {
        return null
    }
}

const synthCardChild = ref(null)

watch(tokensData.value, () => {
    console.log(tokensData.value)
    console.log("tokensData", tokensData.value.map((el) => el.weight))
})





const transactions = ref({
    'Create Pool': {
        enabled: true,
        action: async () => {
            showWarning.value = false
            let weights_sum = (tokensData.value.reduce((sum, v) => sum + parseFloat(v.weight), 0))
            if (weights_sum == 99 && tokensData.value.length > 2 && tokensData.value.every((v) => v.weight == tokensData.value[0].weight)) {
                tokensData.value.forEach((v) => {
                    v.weight = (100 / tokensData.value.length).toFixed(6)
                })
                weights_sum = 100
            }
            if (weights_sum != 100) {
                warningMessage.value = 'The sum of the token weights should be 100.'
                showWarning.value = true
                return
            } else if ((tokensData.value.length < 2)) {
                warningMessage.value = 'Pool should contain at least 2 tokens'
                showWarning.value = true
                return
            } else if (!tokensData.value.every((t) => t.amount <= t.balance)) {
                warningMessage.value = 'Amount greater than balance'
                showWarning.value = true
                return
            } else if (Array.from(new Set(tokensData.value.map(t => t.symbol))).length != tokensData.value.map(t => t.symbol).length) {
                console.log(tokensData.value)
                warningMessage.value = 'No token repetitions'
                showWarning.value = true
                return
            } else if (!form.value.poolName || !form.value.poolSymbol) {
                warningMessage.value = 'Fill in all fields'
                showWarning.value = true
                return
            } else if (!tokensData.value.every((v) => v.amount != 0)) {
                warningMessage.value = 'Token amounts must be greater than 0'
                showWarning.value = true
                return

            }
            let poolCreateService = new PoolCreatorService(networkId.value)
            let provider = await InitializeMetamask()
            let account = await provider.getSigner().getAddress()
            let success = await useApproveTokens(
                tokensData.value.map((t => t.address)),
                tokensData.value.map((t) => t.amount),
                account,
            )
            if (!success) {
                warningMessage.value = 'Approve error'
                showWarning.value = true
                return
            }
            let tx = await poolCreateService.createWeightedPool(provider, form.value.poolName, "DPT-" + form.value.poolSymbol, form.value.fee, tokensData.value)
            if (tx) {
                let receipt = await provider.getTransactionReceipt(tx.hash)
                const { poolId: _poolId } = await poolCreateService.getPoolDataFromTransaction(provider, receipt)
                console.log("POOL ID - ", _poolId)
                createdPoolId.value = _poolId
                poolCreationLink.value = `${configService.getNetworkConfig(networkId.value).explorer}/tx/${tx.hash}`
                transactions.value['Join Pool'].enabled = true
                transactions.value['Create Pool'].enabled = false
            } else {
                warningMessage.value = 'Tx estimating error'
                showWarning.value = true
            }
            console.log("CREATE RESULT - ", tx)
        }
    },
    'Join Pool': {
        enabled: false,
        action: async () => {
            showWarning.value = false
            let poolCreateService = new PoolCreatorService(networkId.value)
            let provider = await InitializeMetamask()
            let tx = await poolCreateService.joinPool(provider, tokensData.value, createdPoolId.value, await provider.getSigner().getAddress())
            if (tx) {
                joinPoolLink.value = `${configService.getNetworkConfig(networkId.value).explorer}/tx/${tx.hash}`
                transactions.value['Join Pool'].enabled = false
                transactions.value['Swaps'].enabled = true
            }
            console.log("JOIN RESULT - ", tx)
        }
    },
    'Swaps': {
        enabled: false,
        action: async () => {
            showWarning.value = false
            let provider = await InitializeMetamask()
            let signer = provider.getSigner()
            let config = configService.getNetworkConfig(networkId.value)
            let addresses = tokensData.value.map((t) => t.address)
            let combinations = generatePairCombinations(addresses)

            let tokenPrices = await GetFilteredTokenPrices(addresses, addresses)
            for (let i = 0; i < combinations.length; i++) {
                let [token0, token1] = combinations[i].split('/')
                let found = tokenPrices.find((t) => (t.pricingAsset == token0 && t.asset == token1) || (t.pricingAsset == token1 && t.asset == token0))
                if (!found) {

                    // DELETE LATER
                    //createdPoolId.value = "0x65157300dd3d59c45e53b69faffdd04b6eb0a3e900010000000000000000000c"
                    let token0Info = tokensData.value.find((t) => t.address == token0)
                    let token1Info = tokensData.value.find((t) => t.address == token1)
                    const MIN_USD_SWAP = 0.1
                    const amountIn = (MIN_USD_SWAP / token0Info.price).toFixed(token0Info.decimals)
                    let tx = await SingleSwap(signer, config.addresses.vault, createdPoolId.value, {
                        address: token0Info.address,
                        decimals: token0Info.decimals,
                    }, { address: token1Info.address, decimals: token1Info.decimals }, amountIn)
                    if (tx) {
                        console.log("SUCESS - ", tx)
                    }
                }
            }
            transactions.value['Swaps'].enabled = false


        }
    }
})

</script>

<style lang="scss" scoped>
.manage-pools__warning {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(4px);
}

.caption {
    font-size: 20px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: 0em;
    color: #ffffff;
    margin-bottom: 20px;
}

.synth-card {
    margin-bottom: 24px;
    border-radius: 20px;
    border: 0.2px solid #00C9FF;

    &:not(:last-child) {
        margin-right: 24px;
    }
}

.button-add {
    height: 52px;
    width: 52px;
    margin-bottom: 24px;
    border-radius: 20px;
    background: #00C9FF;

    display: flex;
    justify-content: space-around;
    align-items: center;
    align-self: flex-end;

    cursor: pointer;
}

.form-label {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0em;
    color: #dbdbdb;
}

#tokens-row {
    margin-bottom: 56px;
    padding-left: 12px;
}

#transactions-row {
    gap: 12px;
    padding-left: 12px;
    padding-right: 12px;

    .pool-item {
        flex: 1;
    }
}

:deep(input[type='text'].form-control) {
    background-color: #3b61413f !important;
    height: 72px;
    border: none;

    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.5px;
    color: #ffffff;
}

.inputs {
    &-form {
        border-radius: 20px;
        border: 0.2px solid #A3A4A5;
        backdrop-filter: blur(4px);
        padding: 24px 16px 40px 16px;

        .row {
            &:not(:last-child) {
                margin-bottom: 48px;
            }
        }
    }

    &-el {
        background-color: rgba(59, 97, 65, 0.06);
        padding: 16px 24px;
        color: #fff;
        border: none;
        width: 100%;
        outline: none;

        &::placeholder {
            color: #6C7284;
        }
    }

    &-group {
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;

        &__label {
            position: absolute;
            left: 16px;
            color: #fff;
        }

        .inputs-el {
            padding-left: 60px;
        }
    }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>