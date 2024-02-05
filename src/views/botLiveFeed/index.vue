<template>
  <MainCard>
    <CRow class="d-flex">
      <CRow class="text-white d-flex align-items-center mb-2">
        <div class="d-flex align-items-center gap-3">
          <!-- <div style="font-size: 20px; font-weight: 600">Track Trades</div> -->
          <div>
            <ChainSelector
              @updateChain="(newChain) => (chainSelected = newChain)"
            />
          </div>
        </div>
      </CRow>
      <div class="mb-2">
      <BotLiveFeedChart/>
    </div>
      <div class="text-white d-flex flex-column mt-xxl-3 mt-0">
        <Title v-if="width > 768" :title="'Bot Live Feed'">
          <div style="display: flex;justify-content: space-between;flex-grow: 1;align-items: center">
            <VTooltip :distance="0" :placement="'right-start'">
              <div style="cursor: help">
                <img :src="info" class="info_icon"/>
              </div>
              <template #popper>
                <div
                  style="
          background: linear-gradient(
          rgba(89, 89, 89, 1),
          rgba(73, 73, 73, 0.45)
          );
          backdrop-filter: blur(10px);
          padding: 10px;
          border-radius: 4px;
          "
                >
                  <div style="font-size: clamp(10px, 0.9vw, 16px)">
                    Information
                  </div>
                  <div
                    style="
          display: flex;
          flex-direction: column;
          font-size: clamp(10px, 0.8vw, 14px);
          "
                  >
          <span>
          <span style="font-weight: 700">Number of trades: </span
          >Represents the total count of trades executed within a
          specific timeframe
          </span>
                    <!-- <span>
                    <span style="font-weight: 700">TVL: </span>Total Value Lock
                    </span> -->
                    <span>
          <span style="font-weight: 700">Avg Profit per Trade: </span
          >Sum of Profits per trade divided by the number of trades
          within a specific timeframe
          </span>
                    <span>
          <span style="font-weight: 700">Gas Fees: </span>Gas Fee
          Spent In Native Token
          </span>
                  </div>
                </div>
              </template>
            </VTooltip>
            <div class="pools-filters">
              <div class="pools-filters__el" id="pools-filters__el">
                <div class="pools-filters__title">SORT BY</div>
                <multiselect v-model="sortBySelected" placeholder="Sort Pools..." label="title" :options="sortByOptions"
                             :show-labels="true" :searchable="false" :allow-empty="false" :hide-selected="true"
                             :close-on-select="true"
                             :taggable="false" :showLabels="false">
                  <template v-slot:singleLabel="{ option }">
                    <span>{{ option }}</span>
                  </template>
                  <template v-slot:option="{ option }">
                    <span>{{ option }}</span>
                  </template>
                </multiselect>
              </div>
              <div class="pools-filters__el">
                <div class="pools-filters__title">SEARCH</div>
                <input placeholder="Search Pools..." class="pools-filters__input" v-model="searchBy"/>
              </div>
            </div>
          </div>
        </Title>
      </div>
    </CRow>
    <CRow>
      <div class="pools-rows">
        <div class="pools-row">
          <div class="pools-row__col">
            <div class="pools-row__info">
              <div class="pools-row__value">
                POOL NAME
              </div>
            </div>
          </div>
          <div class="pools-row__col">
            <div class="pools-row__info">
              <div class="pools-row__value">
                LP PRICE
              </div>
            </div>
          </div>
          <div class="pools-row__col">
            <div class="pools-row__info">
              <div class="pools-row__value">
                VOLUME
              </div>
            </div>
          </div>
          <div class="pools-row__col">
            <div class="pools-row__info">
              <div class="pools-row__value">
                TVL
              </div>
            </div>
          </div>
          <div class="pools-row__col">
            <div class="pools-row__info">
              <div class="pools-row__value">
                APR%
              </div>
            </div>
          </div>

        </div>
        <div v-if="pools.length === 0" style="
          display: flex;
          justify-content: center;
          margin-top: 20%;
          margin-bottom: 20%;
        ">
          <LoaderPulse/>
        </div>
        <PoolRow v-else v-for="(pool, index) in filterByStatus" :poolsLength="filterByStatus.length" :perPage="perPage"
                 :key="pool.Name" :pool="pool" :index="index" @click="goToPool"/>
      </div>
    </CRow>
    <Pagination v-if="pools.length != 0" :perPage="perPage" :pools="pools" :currentPage="currentPage"
                @changePage="changePage" @changePerPage="changePerPage" :perPageOptions="perPageOptions"></Pagination>
  </MainCard>
</template>

<script setup>

import {ref, defineEmits, watch, computed} from 'vue'
import info from "@/assets/images/info.svg";
import PoolRow from '@/components/Manage/Pool/PoolRow.vue'
import Multiselect from 'vue-multiselect'
import ChainSelector from '@/UI/ChainSelectorV2.vue'
import {useDevice} from '@/composables/adaptive/useDevice'
import MainCard from '@/UI/MainCard.vue'
import Title from '@/UI/Title.vue'
import {isRightChain} from "@/composables/pools/usePoolSwapsStats";
import Pagination from '@/components/Manage/Pool/Pagination.vue'
import router from "@/router";
import BotLiveFeedChart from "@/components/BotLiveFeed/BotLiveFeedChart.vue";


const emit = defineEmits(['updateChain'])

const chainSelected = ref({name: 'All Chains', code: 'ALL', img: ''})
const {width} = useDevice()

emit('updateChain', chainSelected.value.name)

watch(chainSelected, () => {
  emit('updateChain', chainSelected.value.name)
})

const pools = ref(
  [
    {
      "Name": [
        [
          "RDNT",
          "WETH",
          "GMX",
          "USDT"
        ]
      ],
      "id": "0x65157300dd3d59c45e53b69faffdd04b6eb0a3e900010000000000000000000c",
      "chain": "Arbitrum",
      "factory": "0x9b02c25ae23086a99f6a3c4f3b551f63482e2cc7",
      "address": "0x65157300dd3d59c45e53b69faffdd04b6eb0a3e9",
      "LP Price Change": "0.306",
      "LP Current": "13.60",
      "Volume 24 H": "0.000",
      "TVL": "1.69982",
      "LP Price": 0.08941330447034998,
      "APR %": "143713.064"
    },
    {
      "Name": [
        [
          "WBTC",
          "WETH",
          "ARB",
          "USDT"
        ]
      ],
      "id": "0x1693c0849bb9b20b53b2c0b3af9a69a1b95bf2ca000100000000000000000003",
      "chain": "Arbitrum",
      "factory": "0x9b02c25ae23086a99f6a3c4f3b551f63482e2cc7",
      "address": "0x1693c0849bb9b20b53b2c0b3af9a69a1b95bf2ca",
      "LP Price Change": "9933.394",
      "LP Current": "10030.69",
      "Volume 24 H": "0.000",
      "TVL": "0.00034",
      "LP Price": 2.961637822290707e-9,
      "APR %": 0
    },
    {
      "Name": [
        [
          "WBTC",
          "MAGIC",
          "WETH",
          "ARB"
        ]
      ],
      "id": "0x2d06f08580f0d9a55b1c2fe7d2c29acb92224264000100000000000000000005",
      "chain": "Arbitrum",
      "factory": "0x9b02c25ae23086a99f6a3c4f3b551f63482e2cc7",
      "address": "0x2d06f08580f0d9a55b1c2fe7d2c29acb92224264",
      "LP Price Change": "9999.954",
      "LP Current": "10000.00",
      "Volume 24 H": "0.000",
      "TVL": "0.00034",
      "LP Price": 2.970434971029624e-9,
      "APR %": 0
    },
    {
      "Name": [
        [
          "PENDLE",
          "WBTC",
          "WETH",
          "ARB"
        ]
      ],
      "id": "0xf2587983e6adf4924024cfb87d523c8be91fcc0c000100000000000000000004",
      "chain": "Arbitrum",
      "factory": "0x9b02c25ae23086a99f6a3c4f3b551f63482e2cc7",
      "address": "0xf2587983e6adf4924024cfb87d523c8be91fcc0c",
      "LP Price Change": "9999.999",
      "LP Current": "10000.00",
      "Volume 24 H": "0.000",
      "TVL": "0.00034",
      "LP Price": 2.970435169035132e-9,
      "APR %": 0
    },
    {
      "Name": [
        [
          "RDNT",
          "WETH",
          "GMX",
          "USDT"
        ]
      ],
      "id": "0xdbec896f27addaeb9685e9d57972b9b27dc3b48700010000000000000000000b",
      "chain": "Arbitrum",
      "factory": "0x9b02c25ae23086a99f6a3c4f3b551f63482e2cc7",
      "address": "0xdbec896f27addaeb9685e9d57972b9b27dc3b487",
      "LP Price Change": "532.902",
      "LP Current": "546.51",
      "Volume 24 H": "0.000",
      "TVL": "0.00000",
      "LP Price": 9.999920060951211e-7,
      "APR %": 0
    },
    {
      "Name": [
        [
          "WETH",
          "ARB",
          "USDT"
        ]
      ],
      "id": "0x838938b2b0931456532350ba4cec94a0e5e26375000100000000000000000001",
      "chain": "Arbitrum",
      "factory": "0x9b02c25ae23086a99f6a3c4f3b551f63482e2cc7",
      "address": "0x838938b2b0931456532350ba4cec94a0e5e26375",
      "LP Price Change": "496.553",
      "LP Current": "510.09",
      "Volume 24 H": "0.000",
      "TVL": "0.00000",
      "LP Price": 9.9999126050446e-7,
      "APR %": 0
    },
    {
      "Name": [
        [
          "RDNT",
          "WETH",
          "PEPE",
          "GMX",
          "USDT"
        ]
      ],
      "id": "0x6fffabbd187dc9283d0b5dde1c4bd673c0dfc7cf00010000000000000000000a",
      "chain": "Arbitrum",
      "factory": "0x9b02c25ae23086a99f6a3c4f3b551f63482e2cc7",
      "address": "0x6fffabbd187dc9283d0b5dde1c4bd673c0dfc7cf",
      "LP Price Change": "482.765",
      "LP Current": "482.77",
      "Volume 24 H": "0.000",
      "TVL": "0.00000",
      "LP Price": 9.999995821493992e-7,
      "APR %": 0
    },
    {
      "Name": [
        [
          "WETH",
          "GMX"
        ]
      ],
      "id": "0xcc67241a300f5984315e79cb3123158582109eb3000200000000000000000007",
      "chain": "Arbitrum",
      "factory": "0x9b02c25ae23086a99f6a3c4f3b551f63482e2cc7",
      "address": "0xcc67241a300f5984315e79cb3123158582109eb3",
      "LP Price Change": "0.009",
      "LP Current": "0.30",
      "Volume 24 H": "0.000",
      "TVL": "0.00000",
      "LP Price": 0.004068830809294195,
      "APR %": 0
    },
    {
      "Name": [
        [
          "WETH",
          "ARB"
        ]
      ],
      "id": "0x31478be536e8df39733f4e2611ca3f2fffcef791000200000000000000000000",
      "chain": "Arbitrum",
      "factory": "0x9b02c25ae23086a99f6a3c4f3b551f63482e2cc7",
      "address": "0x31478be536e8df39733f4e2611ca3f2fffcef791",
      "LP Price Change": "0.020",
      "LP Current": "0.05",
      "Volume 24 H": "0.000",
      "TVL": "0.00000",
      "LP Price": 0.021074496281065506,
      "APR %": 0
    },
    {
      "Name": [
        [
          "MAGIC",
          "WETH",
          "ARB",
          "GMX"
        ]
      ],
      "id": "0x35142f24c2528ff4dbae8617d6764180676efbae000100000000000000000008",
      "chain": "Arbitrum",
      "factory": "0x9b02c25ae23086a99f6a3c4f3b551f63482e2cc7",
      "address": "0x35142f24c2528ff4dbae8617d6764180676efbae",
      "LP Price Change": "0.001",
      "LP Current": "0.02",
      "Volume 24 H": "0.000",
      "TVL": "0.00000",
      "LP Price": 0.05934610315252911,
      "APR %": 0
    },
    {
      "Name": [
        [
          "MAGIC",
          "WETH",
          "ARB",
          "GMX"
        ]
      ],
      "id": "0x9cdf0f0444f49d5973920c6d128f977c932b9367000100000000000000000009",
      "chain": "Arbitrum",
      "factory": "0x9b02c25ae23086a99f6a3c4f3b551f63482e2cc7",
      "address": "0x9cdf0f0444f49d5973920c6d128f977c932b9367",
      "LP Price Change": "0.000",
      "LP Current": "0.01",
      "Volume 24 H": "0.000",
      "TVL": "0.00000",
      "LP Price": 0.060078288322461856,
      "APR %": 0
    },
    {
      "Name": [
        [
          "MAGIC",
          "WETH",
          "ARB"
        ]
      ],
      "id": "0x1e7e70c22652af441e1ca74e22bba19b289cae85000100000000000000000006",
      "chain": "Arbitrum",
      "factory": "0x9b02c25ae23086a99f6a3c4f3b551f63482e2cc7",
      "address": "0x1e7e70c22652af441e1ca74e22bba19b289cae85",
      "LP Price Change": "0.000",
      "LP Current": "0.01",
      "Volume 24 H": "0.000",
      "TVL": "0.00000",
      "LP Price": 0.07958697756502468,
      "APR %": 0
    },
    {
      "Name": [
        [
          "WBTC",
          "WETH",
          "ARB",
          "USDT"
        ]
      ],
      "id": "0xf70ea1a449ee70946aca238827112fbfa8abe354000100000000000000000002",
      "chain": "Arbitrum",
      "factory": "0x9b02c25ae23086a99f6a3c4f3b551f63482e2cc7",
      "address": "0xf70ea1a449ee70946aca238827112fbfa8abe354",
      "LP Price Change": "0.000",
      "LP Current": "0.00",
      "Volume 24 H": "0.000",
      "TVL": "0.00000",
      "LP Price": null,
      "APR %": 0
    },
    {
      "Name": [
        [
          "USDT",
          "VLX"
        ]
      ],
      "id": "0x778e6a67050be1f5045f03db4a6bd4ff1a0f5072000200000000000000000006",
      "chain": "Binance",
      "factory": "0xff35d2a5cd15374a79945675e29eb184c33b65b9",
      "address": "0x778e6a67050be1f5045f03db4a6bd4ff1a0f5072",
      "LP Price Change": "0.003",
      "LP Current": "0.09",
      "Volume 24 H": "39.580",
      "TVL": "2589.31763",
      "LP Price": 11.131888970869966,
      "APR %": "0.000"
    },
    {
      "Name": [
        [
          "USDT",
          "WBNB"
        ]
      ],
      "id": "0xb6d2ec4f4a53fa9f65223696238cbadb34c9867c000200000000000000000000",
      "chain": "Binance",
      "factory": "0xff35d2a5cd15374a79945675e29eb184c33b65b9",
      "address": "0xb6d2ec4f4a53fa9f65223696238cbadb34c9867c",
      "LP Price Change": "9.876",
      "LP Current": "50.17",
      "Volume 24 H": "0.000",
      "TVL": "0.00547",
      "LP Price": 0.0741700027854686,
      "APR %": "641250.767"
    },
    {
      "Name": [
        [
          "ETH",
          "USDT",
          "WBNB"
        ]
      ],
      "id": "0xb677bf899a24bc692b0fa176f3ac82c036c68b25000100000000000000000004",
      "chain": "Binance",
      "factory": "0xff35d2a5cd15374a79945675e29eb184c33b65b9",
      "address": "0xb677bf899a24bc692b0fa176f3ac82c036c68b25",
      "LP Price Change": "0.000",
      "LP Current": "159.05",
      "Volume 24 H": "0.000",
      "TVL": "0.01054",
      "LP Price": 0.01382013513793437,
      "APR %": "2712902.550"
    },
    {
      "Name": [
        [
          "USDC",
          "WBNB"
        ]
      ],
      "id": "0x5193a12ac2ec5df29fccefc5bd54d1c54f8177c3000200000000000000000003",
      "chain": "Binance",
      "factory": "0xff35d2a5cd15374a79945675e29eb184c33b65b9",
      "address": "0x5193a12ac2ec5df29fccefc5bd54d1c54f8177c3",
      "LP Price Change": "0.000",
      "LP Current": "13.76",
      "Volume 24 H": "0.000",
      "TVL": "0.00181",
      "LP Price": 0.07411934741822339,
      "APR %": "357247.597"
    },
    {
      "Name": [
        [
          "BETH",
          "USDT",
          "STG"
        ]
      ],
      "id": "0xe0b39d91782452c6b861d0880b0a314b959005ac000100000000000000000005",
      "chain": "Binance",
      "factory": "0xff35d2a5cd15374a79945675e29eb184c33b65b9",
      "address": "0xe0b39d91782452c6b861d0880b0a314b959005ac",
      "LP Price Change": "0.000",
      "LP Current": "546.23",
      "Volume 24 H": "0.000",
      "TVL": "0.00000",
      "LP Price": 0.0014484687748900847,
      "APR %": 0
    },
    {
      "Name": [
        [
          "ETH",
          "WBNB"
        ]
      ],
      "id": "0x77bda76eca78074ce43017d978cd16e9ba5cbc18000200000000000000000001",
      "chain": "Binance",
      "factory": "0xff35d2a5cd15374a79945675e29eb184c33b65b9",
      "address": "0x77bda76eca78074ce43017d978cd16e9ba5cbc18",
      "LP Price Change": "1.667",
      "LP Current": "1.67",
      "Volume 24 H": "0.000",
      "TVL": "0.00000",
      "LP Price": 0.0016363121062119943,
      "APR %": 0
    },
    {
      "Name": [
        [
          "ETH",
          "USDT"
        ]
      ],
      "id": "0x39e621ad99326749b5161e8d1b1f610b009b36ac000200000000000000000002",
      "chain": "Binance",
      "factory": "0xff35d2a5cd15374a79945675e29eb184c33b65b9",
      "address": "0x39e621ad99326749b5161e8d1b1f610b009b36ac",
      "LP Price Change": "0.000",
      "LP Current": "0.00",
      "Volume 24 H": "0.000",
      "TVL": "0.00140",
      "LP Price": 4.40040223957204e-8,
      "APR %": "0.000"
    },
    {
      "Name": [
        [
          "WMATIC",
          "STG",
          "GHST",
          "USDT"
        ]
      ],
      "id": "0xa62653e544d4d92e98f07c7ce47787e874fbf2f7000100000000000000000005",
      "chain": "Polygon",
      "factory": "0x30adb2d44d98ab053041912388f9577aebd9f6ff",
      "address": "0xa62653e544d4d92e98f07c7ce47787e874fbf2f7",
      "LP Price Change": "0.002",
      "LP Current": "1.27",
      "Volume 24 H": "1177.360",
      "TVL": "10872.71105",
      "LP Price": 1.2839379404964406,
      "APR %": "0.002"
    },
    {
      "Name": [
        [
          "WMATIC",
          "USDC",
          "WETH"
        ]
      ],
      "id": "0x53e659cae3cb839b7bf2ceb9e8c265b8022880ad000100000000000000000000",
      "chain": "Polygon",
      "factory": "0x30adb2d44d98ab053041912388f9577aebd9f6ff",
      "address": "0x53e659cae3cb839b7bf2ceb9e8c265b8022880ad",
      "LP Price Change": "4.670",
      "LP Current": "23.19",
      "Volume 24 H": "0.000",
      "TVL": "0.01197",
      "LP Price": 0.08368295536323123,
      "APR %": "2325941.120"
    },
    {
      "Name": [
        [
          "WMATIC",
          "STG",
          "USDT"
        ]
      ],
      "id": "0xf786aeb85ade76219146b00a95fc86648adb7db8000100000000000000000001",
      "chain": "Polygon",
      "factory": "0x30adb2d44d98ab053041912388f9577aebd9f6ff",
      "address": "0xf786aeb85ade76219146b00a95fc86648adb7db8",
      "LP Price Change": "0.044",
      "LP Current": "1.27",
      "Volume 24 H": "0.000",
      "TVL": "0.00869",
      "LP Price": 1.279626030202503,
      "APR %": "0.000"
    },
    {
      "Name": [
        [
          "WMATIC",
          "STG",
          "PAXG",
          "WETH"
        ]
      ],
      "id": "0x28b3584cd2e0e0fbdb5eea017bd85183978afb31000100000000000000000004",
      "chain": "Polygon",
      "factory": "0x30adb2d44d98ab053041912388f9577aebd9f6ff",
      "address": "0x28b3584cd2e0e0fbdb5eea017bd85183978afb31",
      "LP Price Change": "0.321",
      "LP Current": "56.72",
      "Volume 24 H": "0.000",
      "TVL": "0.00683",
      "LP Price": 0.02758259688464284,
      "APR %": "1859.420"
    },
    {
      "Name": [
        [
          "WMATIC",
          "WBTC",
          "STG",
          "WETH"
        ]
      ],
      "id": "0xf02de662f01d6fbc1baae0fc3eba69e2de6558b6000100000000000000000003",
      "chain": "Polygon",
      "factory": "0x30adb2d44d98ab053041912388f9577aebd9f6ff",
      "address": "0xf02de662f01d6fbc1baae0fc3eba69e2de6558b6",
      "LP Price Change": "1.857",
      "LP Current": "105.88",
      "Volume 24 H": "0.000",
      "TVL": "0.00746",
      "LP Price": 0.012866890369671515,
      "APR %": "4328.017"
    },
    {
      "Name": [
        [
          "WMATIC",
          "USDT"
        ]
      ],
      "id": "0x57b75677dc964c43e49a5cac4d595b7b5a82a3b9000200000000000000000002",
      "chain": "Polygon",
      "factory": "0x30adb2d44d98ab053041912388f9577aebd9f6ff",
      "address": "0x57b75677dc964c43e49a5cac4d595b7b5a82a3b9",
      "LP Price Change": "2.453",
      "LP Current": "3.86",
      "Volume 24 H": "0.000",
      "TVL": "0.00000",
      "LP Price": 0.4541148568483778,
      "APR %": 0
    },
    {
      "Name": [
        [
          "WMATIC",
          "USDT"
        ]
      ],
      "id": "0x77451228ae69ed1da24519f7d042e2a825d6457d000200000000000000000006",
      "chain": "Polygon",
      "factory": "0x30adb2d44d98ab053041912388f9577aebd9f6ff",
      "address": "0x77451228ae69ed1da24519f7d042e2a825d6457d",
      "LP Price Change": "1532640.162",
      "LP Current": "1532641.54",
      "Volume 24 H": "0.000",
      "TVL": "0.00000",
      "LP Price": 0.0000010011447417951933,
      "APR %": 0
    }
  ]
)

const defaultPools = ref([...pools.value])

const sortByOptions = ['APR', 'TVL', 'Volume', 'LP Price']
const sortBySelected = ref()
const searchBy = ref('')

const perPageOptions = [10, 25, 50]
const perPage = ref(perPageOptions[0])
const currentPage = ref(1)

function changePerPage(v1) {
  perPage.value = Number(v1)
  currentPage.value = 1
}

function changePage(args) {
  if (args.isEquating == false) {
    currentPage.value = currentPage.value + args.num
  } else {
    currentPage.value = args.num
  }
}


const filterByStatus = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = currentPage.value * perPage.value
  const result = pools.value.filter((pool) => isRightChain(pool, chainSelected.value.name)).slice(start, end)
  return result
})

watch(defaultPools, () => {
  pools.value = defaultPools.value
})

watch(sortBySelected, (_new) => {
  let sortedDesc
  switch (_new) {
    case 'APR': {
      sortedDesc = [...pools.value].sort((a, b) => b['APR %'] - a['APR %'])
      break
    }
    case 'TVL': {
      sortedDesc = [...pools.value].sort((a, b) => b['TVL'] - a['TVL'])
      break
    }
    case 'Volume': {
      sortedDesc = [...pools.value].sort(
        (a, b) => b['Volume 24 H'] - a['Volume 24 H'],
      )
      break
    }
    case 'LP Price': {
      sortedDesc = [...pools.value].sort(
        (a, b) => b['LP Current'] - a['LP Current'],
      )
      break
    }
  }
  pools.value = sortedDesc
})

watch(searchBy, (_new) => {
  if (_new.length > 0) {
    let foundPools = []
    pools.value.forEach((pool) => {
      pool['Name'][0].forEach((name) => {
        const lowerCaseName = name.toLowerCase()
        const lowerCaseSearchTerm = _new.toLowerCase()
        const nameArr = lowerCaseName.split('')
        const searchTermArr = lowerCaseSearchTerm.split('')
        if (
          nameArr.splice(0, searchTermArr.length).join('') ==
          lowerCaseSearchTerm
        ) {
          foundPools.push(pool)
        }
      })
    })
    pools.value = foundPools
  } else {
    pools.value = defaultPools.value
    console.log(defaultPools.value)
  }
})
function goToPool() {
  router.push({
    name: 'Bot Live Feed Details',
    // params: {
    //   id: filterByStatus.value[args.index].id,
    //   onMountedActivity: args.onMountedActivity,
    //   chainSelected: DisplayChain[networkId.value]
    // },
  })
}
</script>
<style lang="sass">
@import '@/styles/variables'

.pools-rows
  padding: 0
  border-radius: 24px
  border: 1px solid rgba(49, 56, 61, 0.81)
  margin-bottom: 30px
  @media all and (max-width: $md)
    overflow-x: auto

#pools-filters__el
  .multiselect
    min-height: 35.5px
    @media (max-width: $xxl)
      min-height: 24px !important

  .multiselect__placeholder
    color: rgba(255, 255, 255, 0.61) !important
    font-size: 13px !important
    margin-bottom: 0 !important
    line-height: 19.5px !important
    @media (max-width: $xxl)
      font-size: 10px !important
      line-height: normal !important

  .multiselect__tags
    padding: 5px 40px 7px 13px !important
    border-radius: 20px !important
    border: 1px solid #01B47E !important
    background: transparent !important
    color: #fff !important
    min-width: 170px !important
    height: 35.5px !important
    min-height: 35.5px !important
    @media (max-width: $xxl)
      min-height: 24px !important
      padding: 0px 10px 5px 10px !important
      min-width: 190px
      height: 24px !important

  .multiselect__select
    @media (max-width: $xxl)
      width: 24px
      height: 28px


  .multiselect--active
    .multiselect__tags
      border-radius: 20px 20px 0 0 !important

  .multiselect__content-wrapper
    border-radius: 0 0 20px 20px !important
    border: 1px solid #01B47E !important
    border-top: none !important
    background: #02120A !important

  .multiselect__option
    color: #A3A4A5 !important
    background: #02120A !important

    &:hover
      color: #01B47E !important
      background: lighten(#02120A, 0.7) !important


  .multiselect__single
    background: #02120A !important
    margin-bottom: 0 !important

.pools
  &-filters
    display: flex
    align-items: end
    gap: 16px
    @media all and (max-width: 767px)
      width: 100%
      margin-top: 20px
      align-items: flex-start

    &__title
      font-size: 12px
      font-weight: 700
      font-family: Poppins
      color: #fff
      @media (max-width: $xxl)
        font-size: 10px

    &__input
      border-radius: 20px
      border: 1px solid #01B47E
      padding: 0 13px
      min-height: 35.5px
      font-size: 13px
      line-height: 24px
      background: transparent
      color: #fff
      outline: none

      &::placeholder
        color: rgba(255, 255, 255, 0.61)

      @media (max-width: $xxl)
        min-height: 24px
        font-size: 10px

  &__warning
    position: absolute
    width: 660px
    height: 300px
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
</style>

<style lang="scss" scoped>
@import '@/styles/variables';

:deep(.pools-row__col) {
  &:first-child {
    width: 450px;
    @media (max-width: $xxl) {
      width: 300px;
    }
  }
}
:deep(.multiselect-tag.is-user) {
  margin-bottom: 5px;

  border-radius: 20px;
  background: rgba(0, 192, 135, 0.5);
  color: #ffffff;
}

:deep(.multiselect-tag.is-user) img {
  width: 30px;
  border-radius: 50%;
  height: 30px;
}

:deep(.multiselect-tag.is-user i:before) {
  color: #ffffff;
  border-radius: 50%;
}

:deep(.multiselect__tags) {
  min-height: 40px;
  min-width: 285px !important;
  max-width: 285px !important;
  display: block;
  padding: 5px 40px 0 8px;
  border-radius: 6px !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  background: rgba(15, 17, 19, 1) !important;

  font-size: 14px;
}

:deep(.multiselect__tags-wrap) {
  display: flex !important;
  flex-wrap: wrap !important;
}

:deep(.multiselect__option--highlight) {
  background: rgb(1, 180, 126) !important;
}

:deep(.multiselect__option) {
  background: rgba(15, 17, 19, 1) !important;
  color: white !important;
}

:deep(.multiselect__option:hover) {
  color: rgb(1, 180, 126) !important;
}

:deep(.multiselect__content-wrapper) {
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  background: none !important;
}

:deep(.multiselect__option.multiselect__option--highlight::after) {
  background: rgba(15, 17, 19, 1) !important;
}

:deep(.multiselect__option--selected.multiselect__option--highlight::after) {
  background: rgba(15, 17, 19, 1) !important;
}

:deep(.multiselect__option--selected) {
  color: rgb(1, 180, 126) !important;
}

:deep(.multiselect__option--selected:hover) {
  color: rgb(229, 83, 83) !important;
}

:deep(.multiselect__option) {
  color: rgba(108, 114, 132, 1);
}

:deep(.tag_close:hover) {
  color: rgb(255, 146, 146);
  cursor: pointer;
}
</style>
<style src="../../../node_modules/vue-multiselect/dist/vue-multiselect.css"></style>
