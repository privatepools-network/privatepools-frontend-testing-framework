<template>
  <div class="pools-rows">
    <div class="pools-row pools-row_header">
      <div
        class="pools-row__col"
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
            ></div>
            <div
              style="width: 20px; display: flex; align-items: center; gap: 6px"
              v-if="['tokens'].includes(headCaption.toLowerCase())"
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
          </div>
        </div>
      </div>
    </div>
    {{ console.log('filterByStatus', filterByStatus) }}

    <GeneralPoolRow
      v-for="(pool, index) in all_pools"
      :poolsLength="all_pools.length"
      :key="pool.name"
      :pool="pool"
      :index="index"
      :isActions="true"
    />
  </div>
</template>
<script setup>
import GeneralPoolRow from './GeneralPoolRow.vue'

const all_pools = [
  {
    id: '0x88e6378567c912e346e22e5de18ab417e5c8d9a3000100000000000000000007',
    'Pool Name': [['WMATIC', 'WBTC', 'AVAX', 'SOL']],
    Revenue: '103.639',
    Fees: '3.565',
    Trades: '25',
    Volume: '5787.216',
    TVL: '62337.19772',
    Liquidity: '62337.19772',
    APR: '5.093',
    Profit: '100.074',
    Blockchain: 'Polygon',
    'Pool Weight': [
      [
        {
          token: 'WMATIC',
          weight: '0.25%',
        },
        {
          token: 'WBTC',
          weight: '0.25%',
        },
        {
          token: 'AVAX',
          weight: '0.25%',
        },
        {
          token: 'SOL',
          weight: '0.25%',
        },
      ],
    ],
    LiquidityType: 'WP',
    ROI: '-',
    address: '0x88e6378567c912e346e22e5de18ab417e5c8d9a3',
  },
  {
    id: '0xdb13210d52a2d9bbc12fd4444e05f74d5f906d24000100000000000000000014',
    'Pool Name': [['AVAX', 'SOL', 'BTCB', 'MATIC']],
    Revenue: '0.000',
    Fees: '0.000',
    Trades: '0',
    Volume: '0.000',
    TVL: '1409.60396',
    Liquidity: '1409.60396',
    APR: '0.000',
    Profit: '0.000',
    Blockchain: 'Binance',
    'Pool Weight': [
      [
        {
          token: 'AVAX',
          weight: '0.25%',
        },
        {
          token: 'SOL',
          weight: '0.25%',
        },
        {
          token: 'BTCB',
          weight: '0.25%',
        },
        {
          token: 'MATIC',
          weight: '0.25%',
        },
      ],
    ],
    LiquidityType: 'WP',
    ROI: '-',
    address: '0xdb13210d52a2d9bbc12fd4444e05f74d5f906d24',
  },
  {
    id: '0x68aba87382af2ec495c5b0694f0a7984988b5fc7000100000000000000000004',
    'Pool Name': [['WMATIC', 'LINK', 'WETH', 'LDO']],
    Revenue: '0.000',
    Fees: '0.000',
    Trades: '0',
    Volume: '0.000',
    TVL: '1206.57402',
    Liquidity: '1206.57402',
    APR: '0.000',
    Profit: '0.000',
    Blockchain: 'Polygon',
    'Pool Weight': [
      [
        {
          token: 'WMATIC',
          weight: '0.25%',
        },
        {
          token: 'LINK',
          weight: '0.25%',
        },
        {
          token: 'WETH',
          weight: '0.25%',
        },
        {
          token: 'LDO',
          weight: '0.25%',
        },
      ],
    ],
    LiquidityType: 'WP',
    ROI: '-',
    address: '0x68aba87382af2ec495c5b0694f0a7984988b5fc7',
  },
  {
    id: '0x8fba8a1d6b6cbad7d87b4e6731e65d14dddfc98e000200000000000000000012',
    'Pool Name': [['WETH', 'USDC']],
    Revenue: '0.000',
    Fees: '0.000',
    Trades: '0',
    Volume: '0.000',
    TVL: '547.23200',
    Liquidity: '547.23200',
    APR: '0.000',
    Profit: '0.000',
    Blockchain: 'Binance',
    'Pool Weight': [
      [
        {
          token: 'WETH',
          weight: '0.5%',
        },
        {
          token: 'USDC',
          weight: '0.5%',
        },
      ],
    ],
    LiquidityType: 'CL',
    ROI: '-',
    address: '0x8fba8a1d6b6cbad7d87b4e6731e65d14dddfc98e',
  },
  {
    id: '0x8fba8a1d6b6cbad7d87b4e6731e65d14dddfc98e000200000000000000000012',
    'Pool Name': [['WETH', 'USDC']],
    Revenue: '0.000',
    Fees: '0.000',
    Trades: '0',
    Volume: '0.000',
    TVL: '547.23200',
    Liquidity: '547.23200',
    APR: '0.000',
    Profit: '0.000',
    Blockchain: 'Binance',
    'Pool Weight': [
      [
        {
          token: 'WETH',
          weight: '0.5%',
        },
        {
          token: 'USDC',
          weight: '0.5%',
        },
      ],
    ],
    LiquidityType: 'WP',
    ROI: '-',
    address: '0x8fba8a1d6b6cbad7d87b4e6731e65d14dddfc98e',
  },
]

const headers = [
  '#',
  'Tokens',
  'Profits',
  'Revenue',
  'Trades',
  'Volume (24h)',
  'TVL',
  'Fees',
  'APR',
  'Actions',
]
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.pools-row {
  &_header {
    font-size: 10px;
    font-family: Poppins;
    font-weight: 600;

    @media (max-width: $xxl) {
      font-size: 8px;
    }
  }

  .multiselect__single {
    background: none;
  }

  :deep(.multiselect__tags) {
    background: none !important;
    border-color: rgba(0, 0, 0, 0) !important;
    padding: 8px 20px 0 8px !important;
  }

  :deep(.multiselect__content-wrapper) {
    border-color: #00c9ff !important;
    border-top: 1px solid;
    width: 190px;
    right: 0px;
  }

  .multiselect__single {
    background: none !important;
    color: white !important;
  }

  .multiselect__option {
    background: rgb(15, 17, 19) !important;
    color: white !important;
  }

  :deep(.multiselect__option:hover) {
    background: rgba(1, 180, 126, 0.884) !important;
  }

  :deep(.multiselect__option--selected) {
    color: #00c9ff !important;
  }

  :deep(.multiselect__option--selected:hover) {
    color: rgb(229, 83, 83) !important;
    background: rgb(15, 17, 19) !important;
  }
}
.pools {
  &-rows {
    padding: 0;
    border-radius: 16px;
    border: 1px solid #ffffff0d;
    background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 2%),
      rgba(255, 255, 255, 0%)
    );
    box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

    margin-bottom: 30px;

    @media all and (max-width: $lg) {
      overflow-x: auto;
    }
  }
}
</style>
