<template>
  <div :class="`pools-row__wrapper${inactive ? '__inactive' : ''}`">
    <div class="pools-row" @click="isActions ? (visibleDetails = !visibleDetails) : false">
      <div class="pools-row__col">
        <DataTableCellTokenNamePaired :value="pool['Pool Name']" />
      </div>
      <div class="pools-row__col">
        <div class="pools-row__info">
          <div class="pools-row__value">
            ${{ numberToAposthrophe(Number(pool['Revenue']).toFixed(0)) }}
          </div>
        </div>
      </div>
      <div class="pools-row__col">
        <div class="pools-row__info">
          <div class="pools-row__value">
            ${{ numberToAposthrophe(Number(pool['Fees']).toFixed(0)) }}
          </div>
        </div>
      </div>
      <div class="pools-row__col">
        <div class="pools-row__info">
          <div class="pools-row__value">
            {{ Number(pool['Trades']).toFixed(0) }}
          </div>
        </div>
      </div>
      <div class="pools-row__col">
        <div class="pools-row__info">
          <div class="pools-row__value">
            ${{ numberToAposthrophe(Number(pool['Volume']).toFixed(0)) }}
          </div>
        </div>
      </div>

      <div class="pools-row__col">
        <div class="pools-row__info">
          <div class="pools-row__value">
            ${{ numberToAposthrophe(Number(pool.TVL).toFixed(0)) }}
          </div>
        </div>
      </div>
      <div class="pools-row__col">
        <div class="pools-row__info">
          <div class="pools-row__value">
            {{ Number(pool['APR']).toFixed(0) }}%
          </div>
        </div>
      </div>
      <div class="pools-row__col">
        <div class="pools-row__info">
          <div class="pools-row__value">
            ${{ numberToAposthrophe(Number(pool['Profit']).toFixed(0)) }}
          </div>
        </div>
      </div>
      <div class="pools-row__col" v-if="isActions">
        <div class="pools-row__dropdown" v-if="visibleDetails == false">
          Details
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 20 24" fill="none">
            <path
              d="M6.76644 9.7418L9.9998 12.9752L13.2331 9.7418C13.5581 9.4168 14.0831 9.4168 14.4081 9.7418C14.7331 10.0668 14.7331 10.5918 14.4081 10.9168L10.5831 14.7418C10.2581 15.0668 9.73313 15.0668 9.40813 14.7418L5.58311 10.9168C5.25811 10.5918 5.25811 10.0668 5.58311 9.7418C5.90811 9.42513 6.44144 9.4168 6.76644 9.7418Z"
              fill="white" />
          </svg>
        </div>
        <div class="pools-row__dropdown" :class="{ 'pools-row__dropdown_active': visibleDetails }" v-else>
          Hide
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 20 24" fill="none">
            <path
              d="M6.76644 9.7418L9.9998 12.9752L13.2331 9.7418C13.5581 9.4168 14.0831 9.4168 14.4081 9.7418C14.7331 10.0668 14.7331 10.5918 14.4081 10.9168L10.5831 14.7418C10.2581 15.0668 9.73313 15.0668 9.40813 14.7418L5.58311 10.9168C5.25811 10.5918 5.25811 10.0668 5.58311 9.7418C5.90811 9.42513 6.44144 9.4168 6.76644 9.7418Z"
              fill="white" />
          </svg>
        </div>
      </div>
    </div>
    <CCollapse :visible="visibleDetails">
      <div class="details-el">
        <div class="details-el__col" v-if="!inactive">
          <div class="details-el__activity details-el__activity_deposit"
            @click="$emit('goToPool', { index, onMountedActivity: 'deposit' })">
            <div class="details-el__circle"></div>
            Deposit
          </div>
          <div class="details-el__activity details-el__activity_info"
            @click="$emit('goToPool', { index, onMountedActivity: 'info' })">
            <div class="details-el__circle"></div>
            Info
          </div>
          <div class="details-el__activity details-el__activity_withdraw"
            @click="$emit('goToPool', { index, onMountedActivity: 'withdraw' })">
            <div class="details-el__circle"></div>
            Withdraw
          </div>
        </div>
        <div v-else>

        </div>
        <div class="details-el__col">
          <div class="details-el__title">Factory Contract:</div>
          {{ console.log('pool.factory', pool) }}
          <a :href="pool.Blockchain
            ? `${configService.getNetworkConfig(
              ReversedDisplayNetwork[pool.Blockchain],
            ).explorer
            }/address/${configService.getNetworkConfig(
              ReversedDisplayNetwork[pool.Blockchain],
            ).addresses.weightedPoolFactory}`
            : ''
            " target="_blank" class="details-el__value">
            {{ pool.Blockchain ? shortenLabel(configService.getNetworkConfig(
              ReversedDisplayNetwork[pool.Blockchain],
            ).addresses.weightedPoolFactory) : '' }}
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
              <path
                d="M9.75 6.53646V9.38021C9.75 9.63161 9.63586 9.87272 9.4327 10.0505C9.22953 10.2283 8.95398 10.3281 8.66667 10.3281H2.70833C2.42102 10.3281 2.14547 10.2283 1.9423 10.0505C1.73914 9.87272 1.625 9.63161 1.625 9.38021V4.16667C1.625 3.91526 1.73914 3.67416 1.9423 3.49639C2.14547 3.31862 2.42102 3.21875 2.70833 3.21875H5.95833"
                stroke="#01B47E" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8.125 1.79688H11.375V4.64063" stroke="#01B47E" stroke-width="1.33333" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M5.4165 7.01042L11.3748 1.79688" stroke="#01B47E" stroke-width="1.33333" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </a>
        </div>
        <div class="details-el__col">
          <div class="details-el__title">Pool Contract:</div>
          <a class="details-el__value" target="_blank" :href="pool.Blockchain ? `${configService.getNetworkConfig(
            ReversedDisplayNetwork[pool.Blockchain],
          ).explorer
            }/address/${pool.id.slice(0, 42)}`
            : ''
            ">
            {{ pool.id ? shortenLabel(pool.id.slice(0, 42)) : '' }}
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
              <path
                d="M9.75 6.53646V9.38021C9.75 9.63161 9.63586 9.87272 9.4327 10.0505C9.22953 10.2283 8.95398 10.3281 8.66667 10.3281H2.70833C2.42102 10.3281 2.14547 10.2283 1.9423 10.0505C1.73914 9.87272 1.625 9.63161 1.625 9.38021V4.16667C1.625 3.91526 1.73914 3.67416 1.9423 3.49639C2.14547 3.31862 2.42102 3.21875 2.70833 3.21875H5.95833"
                stroke="#01B47E" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8.125 1.79688H11.375V4.64063" stroke="#01B47E" stroke-width="1.33333" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M5.4165 7.01042L11.3748 1.79688" stroke="#01B47E" stroke-width="1.33333" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </a>
        </div>
        <div class="details-el__col">
          <div class="details-el__title">LP Symbol</div>
          <div class="details-el__value">
            WPT-{{
              tokenEntities?.map((tokenEntity) => tokenEntity.short).join('-')
            }}
          </div>
        </div>
      </div>
    </CCollapse>
  </div>
</template>
<script setup>
import { toRefs, defineProps, ref, computed } from 'vue'
import { getTokenEntity } from '@/lib/helpers/util'
import { shortenLabel } from '@/lib/utils/index'
import DataTableCellTokenNamePaired from '@/components/DataTable/Cell/TokenNamePaired.vue'
import { configService } from '@/services/config/config.service'
import { ReversedDisplayNetwork } from '@/composables/useNetwork'
import numberToAposthrophe from '@/lib/formatter/numberToAposthrophe'
const props = defineProps({
  pool: Object,
  index: Number,
  inactive: Boolean,
  isActions: Boolean,
})
const { pool, index, inactive, isActions } = toRefs(props)
const tokenEntities = computed(() => {
  let tokens = pool?.value['Pool Name']?.flat()
  let entities = tokens?.map((propValue) => getTokenEntity(propValue, 'short'))
  return entities
})
const visibleDetails = ref(false)
</script>
<style lang="sass">
@import '@/styles/_variables.scss'
.token-name-container
  .short
    @media (max-width: $xxl)
      font-size: 10px !important
  .pair_avatars
    @media (max-width: $xxl)
      width: 20px
    &:not(:first-child)
      margin-left: -10px

.pools
  &-row
    display: flex
    align-items: center
    padding: 24px 32px
    border-bottom: 1px solid rgba(49, 56, 61, 0.81)
    cursor: pointer
    @media all and (max-width: $lg)
      min-width: 130%
    @media all and (max-width: $md)
      min-width: 300%

    &__col
      display: flex
      color: #fff
      width: 18%
      @media (max-width: $xxl)
        width: 23%
      &:first-child
        min-width: 355px
        @media (max-width: $xl)
          min-width: 250px
        @media (max-width: $lg)
          min-width: 200px
      &:last-child
        width: 10%
      &:not(:first-child)
        justify-content: center
      &:last-child
        justify-content: start

    &__value
      font-size: 12px
      font-weight: 400
      @media (max-width: $xxl)
        font-size: 10px
    &__dropdown
      cursor: pointer
      display: flex
      @media (max-width: $xxl)
        font-size: 10px
      svg
        @media (max-width: $xxl)
          width: 14px
          height: 14px
      &_active
        svg
          transform: rotate(180deg)
    &__wrapper
      &:last-child
        .pools-row
          border-bottom: none
      &__inactive
        opacity: 0.5
    &:first-child
      .pools-row__value
        @media (max-width: $xxl)
          font-size: 8px
.details
  &-el
    display: flex
    align-items: center
    padding: 24px 32px
    border-bottom: 1px solid rgba(49, 56, 61, 0.81)
    color: #fff
    @media all and (max-width: $md)
      width: 150%
    &__col
      width: 33%
      display: flex
      &:first-child
        flex-direction: column
        gap: 9px
        position: relative
        min-width: 355px
        width: 355px
        @media (max-width: $xl)
          min-width: 250px
          width: 250px
        @media (max-width: $lg)
          min-width: 200px
          width: 200px
        .details-el__value
          margin-left: 0
        &:after
          height: 100%
          width: 1px
          content: ''
          background: #A3A4A5
          left: 120px
          position: absolute
          @media (max-width: $xxl)
            left: 100px
      &:last-child
        .details-el__value
          font-weight: 400
          color: #fff
    &__activity
      font-family: Inter
      font-size: 11px
      font-weight: 700
      text-transform: uppercase
      text-decoration: underline
      display: flex
      align-items: center
      cursor: pointer
      &_deposit
        color: #F9BC2D
        .details-el__circle
          background: #F9BC2D
          box-shadow: 0px 0px 10px 0px rgba(249, 188, 45, 0.50)
      &_info
        color: #03A6E9
        .details-el__circle
          background: #03A6E9
          box-shadow: 0px 0px 10px 0px rgba(0, 209, 255, 0.50)
      &_withdraw
        color: #31D8A4
        .details-el__circle
          background: #31D8A4
          box-shadow: 0px 0px 10px 0px rgba(49, 216, 164, 0.50)
    &__circle
      width: 10px
      height: 10px
      border-radius: 5px
      margin-right: 8px
    &__title, &__value
      font-size: 12px
      font-weight: 600
      @media (max-width: $xxl)
        font-size: 10px
        font-weight: 400
    &__value
      color: #01B47E
      margin-left: 5px
      cursor: pointer
      &:hover
        color: #01B45E !important
</style>
