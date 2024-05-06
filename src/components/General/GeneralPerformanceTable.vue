<template>
  <div class="pools-rows">
    <div class="pools-row pools-row_header">
      <div class="pools-row__col !text-black dark:!text-white" v-for="(headCaption, headCaptionIndex) in headers"
        :key="headCaption">
        <div class="file-table-header-cell">
          <div class="d-flex align-items-center gap-1" :class="headCaptionIndex !== 0 ? header_cells_inside : ''"
            style="cursor: pointer; height: 20px">
            <div style="" v-if="!['pool composition', 'actions', 'tokens'].includes(
              headCaption.toLowerCase(),
            )
            "></div>
            <div style="width: 20px; display: flex; align-items: center; gap: 6px"
              v-if="['tokens'].includes(headCaption.toLowerCase())">
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

            <div @click="onDatatableHeaderClick(headCaption)" :class="'head_caption_text'">
              {{ headCaption }}
            </div>
          </div>
        </div>
      </div>
    </div>
    {{ console.log('all_pools!!!', all_pools) }}

    <PoolRow v-if="all_pools && all_pools.length > 0" v-for="(pool, index) in all_pools.slice(0, sliceNumber)"
      :key="pool.name" :pool="pool"
      :userPools="all_pools.filter((item) => user_staked_pools.map((p) => p.id).includes(item.id))" :index="index"
      @goToPoolWithdraw="goToPoolWithdraw" @goToCLPool="goToCLPool" @goToPool="goToPool"
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
import { t } from 'i18next';
import Pagination from '../Pool/Pagination.vue';
import PoolRow from '../Pool/PoolRow.vue';
import { defineProps, ref } from "vue";

const perPage = ref(25)
const currentPage = ref(1)

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


const headers = [
  t('tokens'),
  t('composition'),
  'ROI',
  'TVL',
  `${t('volume')} (24h)`,
  'APR',
  t('actions'),
]
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

  &_header {
    font-size: clamp(10px, 1vw, 14px);
    
    font-weight: 600;

    @media (max-width: $xxl) {
      font-size: 8px;
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
