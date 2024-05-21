<template>
  <div class="pools-rows">
    <div class="pools-row pools-row_header">
      <div class="pools-row__col !text-black dark:!text-white" v-for="(headCaption, headCaptionIndex) in headers"
        :key="headCaption">
        <div class="file-table-header-cell">
          <div class="d-flex align-items-center gap-1" :class="headCaptionIndex !== 0 ? header_cells_inside : ''"
            style="cursor: pointer; height: 20px">
            <div style="width: 20px; display: flex; align-items: center; gap: 6px" v-if="
              ['tokens'].includes(headCaption.toLowerCase())
            ">
              <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_156_47)">
                  <g clip-path="url(#clip1_156_47)">
                    <path
                      d="M7.5 15C11.366 15 14.5 11.866 14.5 8C14.5 4.13401 11.366 1 7.5 1C3.63401 1 0.5 4.13401 0.5 8C0.5 11.866 3.63401 15 7.5 15Z"
                      stroke="white" />
                    <path
                      d="M16.5 15C20.366 15 23.5 11.866 23.5 8C23.5 4.13401 20.366 1 16.5 1C12.634 1 9.5 4.13401 9.5 8C9.5 11.866 12.634 15 16.5 15Z"
                      stroke="white" />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_156_47">
                    <rect width="24" height="15" fill="white" transform="translate(0 0.5)" />
                  </clipPath>
                  <clipPath id="clip1_156_47">
                    <rect width="24" height="15" fill="white" transform="translate(0 0.5)" />
                  </clipPath>
                </defs>
              </svg>
            </div>


            <div :class="'head_caption_text flex items-center'" @click="ascendFilterBy = headCaption">
              <img v-if="!headCaption.includes('Tokens') &&
                !headCaption.includes('Actions')" :src="filterArrow"
                :class="ascendFilterBy === headCaption ? 'rotate-180' : ''"  /> {{
                  headCaption }}
            </div>
          </div>
        </div>
      </div>
    </div>
    {{ console.log('all_pools!!!', all_pools) }}
    <LoaderPulse v-if="!all_pools" />
    <InvestmentsPoolRow v-else-if="all_pools && all_pools.length > 0"
      v-for="(pool, index) in sortedPools.slice(0, sliceNumber)"
      :key="pool.name" :pool="pool" :userPools="user_staked_pools" :index="index" @goToPoolWithdraw="goToPoolWithdraw" @goToCLPool="goToCLPool" @goToPool="goToPool"
      @goToPoolDeposit="goToPoolDeposit" @goToPoolManage="goToPoolManage" @goToCL="goToCL" :isActions="true" />
    <div v-else class="p-10 flex justify-center items-center dark:!text-white text-black">
      No pools of this type
    </div>
  </div>

  <!-- <Pagination
      :perPage="perPage"
      :pools="all_pools"
      :currentPage="currentPage"
      @changePage="changePage"
      @changePerPage="changePerPage"
      :perPageOptions="[25, 50, 100]"
    ></Pagination> -->
</template>
<script setup>
import { t } from 'i18next'
import Pagination from '../Pool/Pagination.vue'
import InvestmentsPoolRow from '../Pool/InvestmentsPoolRow.vue'
import { defineProps, ref, toRefs,computed } from 'vue'
import LoaderPulse from '../loaders/LoaderPulse.vue'
import filterArrow from '@/assets/icons/arrow/filterArrow.svg'
import {
  networkId,
  DisplayChain,
} from '@/composables/useNetwork'
import router from '@/router'
const perPage = ref(25)
const currentPage = ref(1)

const ascendFilterBy = ref('TVL')


function changePage(args) {
  if (args.isEquating == false) {
    currentPage.value = currentPage.value + args.num
  } else {
    currentPage.value = args.num
  }
}

function changePerPage(v1) {
  perPage.value = Number(v1)
  currentPage.value = 1
}
const props = defineProps(['all_pools', 'user_staked_pools'])
const { all_pools } = toRefs(props)

const sortedPools = computed(() => all_pools.value.toSorted((a, b) => b[ascendFilterBy] - a[ascendFilterBy]))

const headers = [
  'Tokens',
  'AVG APR',
  // 'Total Returns',
  'Liquidity Deposited',
  '% Of Pool',
  // 'Rewards',
  'TVL',
  'Volume',
  'Actions',
]

function goToPoolDeposit(args) {
  if (sortedPools.value[args.index].LiquidityType != 'CL') {
    router.push({
      name: 'Pool Deposit',
      params: {
        id: sortedPools.value[args.index].id,
        onMountedActivity: args.onMountedActivity,
        chainSelected: DisplayChain[networkId.value],
      },
    })
  } else {
    router.push({
      name: 'Concentrated liquidity',
      query: {
        tokens: sortedPools.value[args.index].tokens.map((t) => t.id),
        fee: sortedPools.value[args.index].fee,
      },
    })
  }
}
function goToPoolManage(args) {
  if (sortedPools.value[args.index].LiquidityType == 'WP') {
    router.push({
      name: 'Pool Deposit',
      params: {
        id: sortedPools.value[args.index].id,
        onMountedActivity: args.onMountedActivity,
        chainSelected: DisplayChain[networkId.value],
      },
    })
  } else {
    router.push({
      name: 'Concentrated liquidity Add',
      params: {
        onMountedActivity: 'deposit',
        poolId: sortedPools.value[args.index].id,
      },
    })
  }
}
function goToPoolWithdraw(args) {
  router.push({
    name: 'Pool Withdraw',
    params: {
      id: sortedPools.value[args.index].id,
      onMountedActivity: args.onMountedActivity,
      chainSelected: DisplayChain[networkId.value],
    },
  })
}
function goToPool(args) {
  router.push({
    name: 'Pool Details',
    params: {
      id: sortedPools.value[args.index].id,
      onMountedActivity: args.onMountedActivity,
      chainSelected: DisplayChain[networkId.value],
    },
  })
}
function goToCLPool(args) {
  router.push({
    name: 'Pool CL Details',
    params: {
      id: sortedPools.value[args.index].id,
      onMountedActivity: args.onMountedActivity,
      chainSelected: DisplayChain[networkId.value],
    },
  })
}

function goToCL(args) {
  router.push({
    name: 'Concentrated liquidity',
    query: {
      tokens: sortedPools.value[args.index].tokens.map((t) => t.id),
      fee: sortedPools.value[args.index].fee,
    },
  })
}


</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.pools-row {
  display: flex;
  align-items: center;
  padding: 24px 32px;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(49, 56, 61, 0.81);
  cursor: pointer;

  @media all and (max-width: $lg) {
    min-width: 130%;
  }

  @media all and (max-width: $md) {
    min-width: 300%;
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
      // min-width: 150px;
      display: flex;
      justify-content: start;

      // @media (max-width: $xl) {
      //   min-width: 150px;
      // }

      // @media (max-width: $lg) {
      //   min-width: 100px;
      // }
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
}
</style>
