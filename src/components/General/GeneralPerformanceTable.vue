<template>
  <div v-if="width > 768" class="pools-rows">
      <div class="pools-row pools-row_header">
        <div class="pools-row__col" :class="
          // Table headers positioning by header names
          headCaptionIndex === 0 || headCaptionIndex === 1
            ? 'justify-content-start'
            : 'justify-content-center'
          " v-for="(headCaption, headCaptionIndex) in headers" :key="headCaption">
          <div class="file-table-header-cell">
            <div class="d-flex align-items-center gap-1" :class="headCaptionIndex !== 0 ? header_cells_inside : ''"
              style="cursor: pointer; height: 20px">
              <div v-if="headCaption === t('tokens')" :class="'head_caption_text text-black dark:!text-white'">
                <svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_1_2449)">
                    <path
                      d="M7.5 14.5C11.366 14.5 14.5 11.366 14.5 7.5C14.5 3.63401 11.366 0.5 7.5 0.5C3.63401 0.5 0.5 3.63401 0.5 7.5C0.5 11.366 3.63401 14.5 7.5 14.5Z"
                      stroke="white" />
                    <path
                      d="M16.5 14.5C20.366 14.5 23.5 11.366 23.5 7.5C23.5 3.63401 20.366 0.5 16.5 0.5C12.634 0.5 9.5 3.63401 9.5 7.5C9.5 11.366 12.634 14.5 16.5 14.5Z"
                      stroke="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_2449">
                      <rect width="24" height="15" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div v-else-if="headCaption === t('volume')"
                :class="'head_caption_text text-black dark:!text-white flex items-center gap-1'">
                <div class="flex items-center gap-1" @click="
                  ascendFilterBy = `${t('volume')}_${filterByTimeVolume}`
                  ">
                  <img :src="filterArrow" :class="ascendFilterBy === `${t('volume')}_${filterByTimeVolume}`
                      ? 'rotate-180'
                      : ''
                    " />
                  {{ headCaption }} ({{ filterByTimeVolume }})
                </div>
                <img :src="filterSVG" @click="
                  filterByTimeVolume === '24H'
                    ? (filterByTimeVolume = '7D')
                    : filterByTimeVolume === '7D'
                      ? (filterByTimeVolume = '30D')
                      : filterByTimeVolume === '30D'
                        ? (filterByTimeVolume = 'ALL')
                        : filterByTimeVolume === 'ALL'
                          ? (filterByTimeVolume = '24H')
                          : (filterByTimeVolume = '24H')
                  " />
              </div>
              <div v-else-if="headCaption === 'APR'"
                :class="'head_caption_text text-black dark:!text-white flex items-center gap-1'">
                <div class="flex items-center gap-1" @click="ascendFilterBy = `APR ${filterByTimeAPR}`">
                  <img :src="filterArrow" :class="ascendFilterBy === `APR ${filterByTimeAPR}`
                      ? 'rotate-180'
                      : ''
                    " />
                  {{ headCaption }} ({{ filterByTimeAPR }})
                </div>
                <img :src="filterSVG" @click="
                  filterByTimeAPR === '24H'
                    ? (filterByTimeAPR = '7D')
                    : filterByTimeAPR === '7D'
                      ? (filterByTimeAPR = '30D')
                      : filterByTimeAPR === '30D'
                        ? (filterByTimeAPR = 'ALL')
                        : filterByTimeAPR === 'ALL'
                          ? (filterByTimeAPR = '24H')
                          : (filterByTimeAPR = '24H')
                  " />
              </div>
              <div v-else :class="'head_caption_text flex items-center gap-1 text-black dark:!text-white'"
                @click="ascendFilterBy = headCaption">
                <img :class="ascendFilterBy === headCaption ? 'rotate-180' : ''" v-if="
                  !headCaption.includes(t('composition')) &&
                  !headCaption.includes(t('actions'))
                " :src="filterArrow" />
                {{ headCaption }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div v-if="all_pools.length === 0" class="my-5">
        <LoaderPulse />
      </div> -->
    <PoolRow v-if="all_pools && all_pools.length > 0" v-for="(pool, index) in all_pools
      .slice(0, sliceNumber)
      .toSorted((a, b) => b[ascendFilterBy] - a[ascendFilterBy])" :key="pool.name" :pool="pool"
      :filters="{ APR: filterByTimeAPR, Volume: filterByTimeVolume }"
      :userPools="user_staked_pools" :index="index" @goToPoolWithdraw="goToPoolWithdraw" :rewardsData="rewardsData"
      @goToCLPool="goToCLPool" @goToPool="goToPool" @goToPoolDeposit="goToPoolDeposit" @goToPoolManage="goToPoolManage"
      @goToCL="goToCL" :isActions="true" />
    <div v-else class="p-10 flex justify-center items-center dark:!text-white text-black">
      No pools of this type
    </div>
  </div>
  <div v-else>
    <div v-if="!all_pools" class="my-5">
      <LoaderPulse />
    </div>
    <div v-else-if="all_pools && all_pools.length > 0" class="mobile_table_container">
      <MobileAdvancedTable v-for="(pool, index) in all_pools
        .slice(0, sliceNumber)
        .toSorted((a, b) => b[ascendFilterBy] - a[ascendFilterBy])" :key="pool.name" :pool="pool"
        :userPools="user_staked_pools" :index="index" @goToPoolWithdraw="goToPoolWithdraw" @goToPool="goToPool"
        @goToPoolDeposit="goToPoolDeposit" @goToPoolManage="goToPoolManage" @goToCL="goToCL" :isActions="true" />
      <div v-if="
        sliceNumber <
        all_pools.filter((item) => !hideSmallPools || item.TVL > minimalTVL)
          .length
      " @click="all_pools.slice(0, (sliceNumber = sliceNumber + 5))" class="load_more text-black dark:!text-white">
        {{ $t('load_more') }}
        <img :src="arrow_bottom" />
      </div>
    </div>
    <div v-else class="my-5 text-center text-black dark:!text-white">
      <div>{{ $t('no_results') }}</div>
      <div>{{ $t('choose_a_pool') }}</div>
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
import PoolRow from '../Pool/PoolRow.vue'
import { defineProps, ref } from 'vue'
import LoaderPulse from '../loaders/LoaderPulse.vue'
import filterArrow from '@/assets/icons/arrow/filterArrow.svg'
import router from '@/router'
import { DisplayChain, networkId } from '@/composables/useNetwork'
import { useDevice } from '@/composables/adaptive/useDevice'
import MobileAdvancedTable from '@/UI/MobileAdvancedTable.vue'
import filterSVG from '@/assets/icons/filter.svg'

const { width } = useDevice()

// const perPage = ref(25)
// const currentPage = ref(1)

const ascendFilterBy = ref('TVL')
const filterByTimeAPR = ref('24H')
const filterByTimeVolume = ref('30D')
// function changePage(args) {
//   if (args.isEquating == false) {
//     currentPage.value = currentPage.value + args.num
//   } else {
//     currentPage.value = args.num
//   }
// }

// function changePerPage(v1) {
//   perPage.value = Number(v1)
//   currentPage.value = 1
// }
const props = defineProps(['all_pools', 'user_staked_pools', 'rewardsData'])

const headers = [
  t('tokens'),
  t('composition'),
  // 'All Returns %',
  'TVL',
  `${t('volume')}`,
  'APR',
  t('actions'),
]

function goToPool(args) {
  console.log('args', args)
  console.log('all_pools!!!', props.all_pools)
  console.log(
    'props.all_pools.value[args.index].id',
    props.all_pools[args.index].id,
  )
  router.push({
    name: 'Pool Details',
    params: {
      id: props.all_pools[args.index].id,
      onMountedActivity: args.onMountedActivity,
      chainSelected: DisplayChain[networkId.value],
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
      min-width: 180px;
      display: flex;
      justify-content: start;

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
