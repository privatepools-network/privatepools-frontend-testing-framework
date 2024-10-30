<template>
  <div v-if="width > 768" class="pools-rows">
    <div class="pools-row pools-row_header">
      <div
        class="pools-row__col text-black dark:!text-white"
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
              :class="'head_caption_text flex items-center'"
              @click="
                 !headCaption.includes('#') &&
                 !headCaption.includes('Tokens name')
                  ? (ascendFilterBy = headCaption)
                  : '';
                toggleSort()
              "
            >
              <img
                v-if="
                  !headCaption.includes('#') &&
                  !headCaption.includes('Tokens name')
                "
                :src="filterArrow"
                :class="
                  ascendFilterBy === headCaption && isReverseSorting
                    ? 'rotate-180 shadow-white'
                    : ascendFilterBy === headCaption
                    ? 'shadow-white'
                    : ''
                "
              />
              {{ headCaption }}
            </div>
          </div>
        </div>
      </div>
    </div>
    {{ console.log('all_tokens', all_tokens) }}
    <LoaderPulse v-if="!all_tokens" />
    <TopTradingTokensPoolRow
      v-else-if="all_tokens && all_tokens.length > 0"
      v-for="(pool, index) in all_tokens.toSorted((a, b) =>
          isReverseSorting
            ? b[ascendFilterBy.toLowerCase()] - a[ascendFilterBy.toLowerCase()]
            : a[ascendFilterBy.toLowerCase()] - b[ascendFilterBy.toLowerCase()],
       
      )"
      :poolsLength="all_tokens.length"
      :key="pool.name"
      :pool="pool"
      :index="index"
      :isActions="true"
    />
  </div>
  <div v-else>
    <LoaderPulse v-if="!all_tokens" />
    <div
      v-else-if="all_tokens && all_tokens.length > 0"
      class="mobile_table_container"
    >
      <MobileTable
      v-for="(pool, index) in all_tokens.toSorted((a, b) =>
          isReverseSorting
            ? b[ascendFilterBy.toLowerCase()] - a[ascendFilterBy.toLowerCase()]
            : a[ascendFilterBy.toLowerCase()] - b[ascendFilterBy.toLowerCase()],
       
      )"
        :poolsLength="all_tokens.length"
        :key="pool.name"
        :pool="pool"
        :index="index"
        :isActions="true"
      />
    </div>
  </div>
</template>
<script setup>
import { t } from 'i18next'
import Pagination from '../Pool/Pagination.vue'
import TopTradingTokensPoolRow from './TopTradingTokensPoolRow.vue'
import { defineProps, ref } from 'vue'
import filterArrow from '@/assets/icons/arrow/filterArrow.svg'
import { useDevice } from '@/composables/adaptive/useDevice'
import MobileTable from '@/UI/MobileTable.vue'

const { width } = useDevice()

const ascendFilterBy = ref('TVL')
let isReverseSorting = ref(true);

function toggleSort() {
  isReverseSorting.value = !isReverseSorting.value;
}
// const perPage = ref(25)
// const currentPage = ref(1)

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

const props = defineProps(['all_tokens'])

const headers = ['#', t('tokens_name'), 'TVL', t('volume'), t('profit')]
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.pools-row {
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
      display: flex;
      justify-content: start;
    }
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
    backdrop-filter: blur(10px);

    margin-bottom: 30px;

    @media all and (max-width: $lg) {
      overflow-x: auto;
    }
  }
}
</style>
