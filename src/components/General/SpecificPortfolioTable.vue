<template>
  <div v-if="width > 768" class="pools-rows" >
    <div class="pools-row pools-row_header">
      <div
        class="pools-row__col !text-black dark:!text-white"
        v-for="(headCaption, headCaptionIndex) in headers"
        :key="headCaption"
      >
        <div class="file-table-header-cell">
          <div
            class="d-flex align-items-center gap-1"
            :class="headCaptionIndex !== 0 ? header_cells_inside : ''"
            style="cursor: pointer; height: 20px"
          >
            <div
              style=""
              v-if="
                !['pool composition', 'actions', 'tokens'].includes(
                  headCaption.toLowerCase(),
                ) 
              "
            >
           
            </div>
            <div
              style="width: 20px; display: flex; align-items: center; gap: 6px"
              v-if="
                ['tokens'].includes(headCaption.toLowerCase())
              "
            >
              <svg
                width="24"
                height="16"
                viewBox="0 0 24 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_156_47)">
                  <g clip-path="url(#clip1_156_47)">
                    <path
                      d="M7.5 15C11.366 15 14.5 11.866 14.5 8C14.5 4.13401 11.366 1 7.5 1C3.63401 1 0.5 4.13401 0.5 8C0.5 11.866 3.63401 15 7.5 15Z"
                      stroke="white"
                    />
                    <path
                      d="M16.5 15C20.366 15 23.5 11.866 23.5 8C23.5 4.13401 20.366 1 16.5 1C12.634 1 9.5 4.13401 9.5 8C9.5 11.866 12.634 15 16.5 15Z"
                      stroke="white"
                    />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_156_47">
                    <rect
                      width="24"
                      height="15"
                      fill="white"
                      transform="translate(0 0.5)"
                    />
                  </clipPath>
                  <clipPath id="clip1_156_47">
                    <rect
                      width="24"
                      height="15"
                      fill="white"
                      transform="translate(0 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>

            <div
              @click="onDatatableHeaderClick(headCaption)"
              :class="'head_caption_text'"
            >
              {{ headCaption }}
            </div>
            <!-- <div
              @click="
                $emit('table-header-click', headCaption, headCaptionIndex)
              "
              style=" font-weight: 700; width: 20px"
              v-if="
                (sortedHeader && sortedHeader.caption == 'Time') ||
                (headCaptionIndex != 0 && sortedHeader && sortedHeader.caption)
              "
            >
              {{
                sortedHeader &&
                sortedHeader.caption &&
                sortedHeader.caption == headCaption
                  ? sortSymbol
                  : ''
              }}
            </div> -->
         
          </div>
        </div>
      </div>
    </div>
    {{ console.log('filterByStatus', filterByStatus) }}
  
    <PoolRow
        v-for="(pool, index) in all_pools.slice(0, sliceNumber)"
        :key="pool.name"
        :pool="pool"
        :userPools="user_staked_pools"
        :index="index"
        @goToPoolWithdraw="goToPoolWithdraw"
        @goToCLPool="goToCLPool"
        @goToPool="goToPool"
        @goToPoolDeposit="goToPoolDeposit"
        @goToPoolManage="goToPoolManage"
        @goToCL="goToCL"
        :isActions="true"
      />
  </div>
  <div v-else class="mobile_table_container">
      <MobileAdvancedTable
      v-for="(pool, index) in all_pools.slice(0, sliceNumber)"
        :key="pool.name"
        :pool="pool"
        :userPools="user_staked_pools"
        :index="index"
        @goToPoolWithdraw="goToPoolWithdraw"
        @goToCLPool="goToCLPool"
        @goToPool="goToPool"
        @goToPoolDeposit="goToPoolDeposit"
        @goToPoolManage="goToPoolManage"
        @goToCL="goToCL"
        :isActions="true"
      />
      <!-- <div
        v-if="
          sliceNumber <
          all_pools.filter((item) => !hideSmallPools || item.TVL > minimalTVL)
            .length
        "
        @click="all_pools.slice(0, (sliceNumber = sliceNumber + 5))"
        class="load_more text-black dark:!text-white"
      >
        {{ $t('load_more') }}
        <img :src="arrow_bottom" />
      </div> -->
      </div>
</template>
<script setup>
import MobileAdvancedTable from '@/UI/MobileAdvancedTable.vue';
import PoolRow from '../Pool/PoolRow.vue';
import { useDevice } from '@/composables/adaptive/useDevice';
// import GeneralPoolRow from './GeneralPoolRow.vue';

const { width } = useDevice()


const user_staked_pools = [
    {
        "id": "0x4fbc353def45f2c3d396b38d6feffe91d94cfa26",
        "label": "ETH / USDT",
        "img": "",
        "percentChange": "0",
        "price": "$13.16",
        "tvlToken0": 11.155263999999999,
        "tvlToken1": 1.9998014306351013
    },
    {
        "id": "0xdd411f1dd1f48689622fd7931292747ecf21e2c2",
        "label": "DAI / USDT",
        "img": "",
        "percentChange": "0",
        "price": "$1.66",
        "tvlToken0": 0.6614289990263649,
        "tvlToken1": 0.9999
    },
    {
        "id": "0xd81fd1a5972b8c87b800e572247cd6a977a008b9",
        "label": "DAI / DOGE",
        "img": "",
        "percentChange": "0",
        "price": "$7.78",
        "tvlToken0": 3.6992600038445027,
        "tvlToken1": 4.080071129939999
    },
    {
        "id": "0xa3b7ecc240f1fb49c3fa295ccfa698e8f164851a",
        "label": "ETH / USDC",
        "img": "",
        "percentChange": "0",
        "price": "$65.30",
        "tvlToken0": 39.739908040946794,
        "tvlToken1": 25.55595299543693
    },
    {
        "id": "0x631b9f9996c30ce37c2d57d1704fdc568429ef41",
        "label": "BTCB / WBNB",
        "img": "",
        "percentChange": "0",
        "price": "$914.96",
        "tvlToken0": 466.1625030538951,
        "tvlToken1": 448.79497027544363
    },
    {
        "id": "0xcde3e063c375cae742ed7b0cd43fe943b0d8296a",
        "label": "DAI / WBNB",
        "img": "",
        "percentChange": "0",
        "price": "$18.71",
        "tvlToken0": 7.666540002018327,
        "tvlToken1": 11.046600000000002
    }
]
const all_pools = [
    {
        "id": "0x88e6378567c912e346e22e5de18ab417e5c8d9a3000100000000000000000007",
        "Pool Name": [
            [
                "WMATIC",
                "WBTC",
                "AVAX",
                "SOL"
            ]
        ],
        "Revenue": "103.639",
        "Fees": "3.565",
        "Trades": "25",
        "Volume": "5787.216",
        "TVL": "62337.19772",
        "Liquidity": "62337.19772",
        "APR": "5.093",
        "Profit": "100.074",
        "Blockchain": "Polygon",
        "Pool Weight": [
            [
                {
                    "token": "WMATIC",
                    "weight": "0.25%"
                },
                {
                    "token": "WBTC",
                    "weight": "0.25%"
                },
                {
                    "token": "AVAX",
                    "weight": "0.25%"
                },
                {
                    "token": "SOL",
                    "weight": "0.25%"
                }
            ]
        ],
        "LiquidityType": "WP",
        "ROI": "-",
        "address": "0x88e6378567c912e346e22e5de18ab417e5c8d9a3"
    },
    {
        "id": "0xdb13210d52a2d9bbc12fd4444e05f74d5f906d24000100000000000000000014",
        "Pool Name": [
            [
                "AVAX",
                "SOL",
                "BTCB",
                "MATIC"
            ]
        ],
        "Revenue": "0.000",
        "Fees": "0.000",
        "Trades": "0",
        "Volume": "0.000",
        "TVL": "1409.60396",
        "Liquidity": "1409.60396",
        "APR": "0.000",
        "Profit": "0.000",
        "Blockchain": "Binance",
        "Pool Weight": [
            [
                {
                    "token": "AVAX",
                    "weight": "0.25%"
                },
                {
                    "token": "SOL",
                    "weight": "0.25%"
                },
                {
                    "token": "BTCB",
                    "weight": "0.25%"
                },
                {
                    "token": "MATIC",
                    "weight": "0.25%"
                }
            ]
        ],
        "LiquidityType": "WP",
        "ROI": "-",
        "address": "0xdb13210d52a2d9bbc12fd4444e05f74d5f906d24"
    },
    {
        "id": "0x68aba87382af2ec495c5b0694f0a7984988b5fc7000100000000000000000004",
        "Pool Name": [
            [
                "WMATIC",
                "LINK",
                "WETH",
                "LDO"
            ]
        ],
        "Revenue": "0.000",
        "Fees": "0.000",
        "Trades": "0",
        "Volume": "0.000",
        "TVL": "1206.57402",
        "Liquidity": "1206.57402",
        "APR": "0.000",
        "Profit": "0.000",
        "Blockchain": "Polygon",
        "Pool Weight": [
            [
                {
                    "token": "WMATIC",
                    "weight": "0.25%"
                },
                {
                    "token": "LINK",
                    "weight": "0.25%"
                },
                {
                    "token": "WETH",
                    "weight": "0.25%"
                },
                {
                    "token": "LDO",
                    "weight": "0.25%"
                }
            ]
        ],
        "LiquidityType": "WP",
        "ROI": "-",
        "address": "0x68aba87382af2ec495c5b0694f0a7984988b5fc7"
    },
    {
        "id": "0x8fba8a1d6b6cbad7d87b4e6731e65d14dddfc98e000200000000000000000012",
        "Pool Name": [
            [
                "WETH",
                "USDC"
            ]
        ],
        "Revenue": "0.000",
        "Fees": "0.000",
        "Trades": "0",
        "Volume": "0.000",
        "TVL": "547.23200",
        "Liquidity": "547.23200",
        "APR": "0.000",
        "Profit": "0.000",
        "Blockchain": "Binance",
        "Pool Weight": [
            [
                {
                    "token": "WETH",
                    "weight": "0.5%"
                },
                {
                    "token": "USDC",
                    "weight": "0.5%"
                }
            ]
        ],
        "LiquidityType": "WP",
        "ROI": "-",
        "address": "0x8fba8a1d6b6cbad7d87b4e6731e65d14dddfc98e"
    },

]

const headers = [
  'Tokens',
  'Composition',
  'ROI',
  'TVL',
  'Volume (24h)',
  'APR',
  'Actions',
]

</script>
<style lang="scss" scoped>
  @import '@/styles/_variables.scss';

.pools-row {
  &_header {
    font-size: clamp(10px, 1vw, 14px);
    
    font-weight: 600;

    @media (max-width: $xxl) {
      font-size: 8px;
    }
  }


}
.pools {
  &-rows {
    padding: 0;
    border-radius: 16px;
    border: 1px solid #ffffff0d;
    background: linear-gradient(0deg,
        rgba(255, 255, 255, 2%),
        rgba(255, 255, 255, 0%));
    box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
    backdrop-filter: blur(10px);
    margin-bottom: 30px;

    @media all and (max-width: $lg) {
      overflow-x: auto;
    }
  }
  &__col {
      display: flex;
      // color: #fff;
      width: 18%;
      // justify-content: center;

      @media (max-width: $xxl) {
        width: 23%;
      }

      &:first-child {
        min-width: 180px;
        display: flex;
        justify-content: start !important;

        @media (max-width: $xl) {
          min-width: 250px;
        }

        @media (max-width: $lg) {
          min-width: 200px;
        }
      }

      &:nth-child(2) {
        min-width: 30%;

        @media (max-width: $xl) {
          min-width: 250px;
        }

        @media (max-width: $lg) {
          min-width: 200px;
        }
      }

      &:last-child {
        width: 10%;
      }
    }

}

</style>
