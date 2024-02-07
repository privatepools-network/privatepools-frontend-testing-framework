<template>
  <div :class="`pools-card ${inactive ? 'inactive-card' : ''}`">
    <PoolCardName :value="pool['Pool Name']"></PoolCardName>
    <div class="pools-card__info">
      <div class="pools-card__row">
        <div>
          TVL:
        </div>
        <div>
          ${{ pool.TVL }}
        </div>
      </div>
      <div class="pools-card__row">
        <div>
          Volume:
        </div>
        <div>
          ${{ pool['Volume'] }}
        </div>
      </div>
      <div class="pools-card__row">
        <div>
          APR:
        </div>
        <div>
          {{ pool['APR'] }}%
        </div>
      </div>
    </div>
    <div class="pools-card__activities" v-if="!inactive">
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
  </div>
</template>
<script setup>
import PoolCardName from "@/components/Manage/Pool/PoolCardName.vue";
import { defineProps, toRefs } from "vue";

const props = defineProps({
  pool: Object,
  index: Number,
  inactive: Boolean
})
const { pool, index, inactive } = toRefs(props)
</script>

<style lang="sass">
.pools-card
  width: 24%
  padding: 30px 30px 13px 30px
  position: relative
  overflow: hidden
  border-radius: 20px
  border: 0.2px solid #00C9FF
  background: linear-gradient(91deg, rgba(53, 192, 117, 0.05) 0.36%, rgba(53, 192, 84, 0.02) 99.41%)
  backdrop-filter: blur(4px)
  @media all and (max-width: 1400px)
    width: 32%
  @media all and (max-width: 992px)
    width: 48%
  @media all and (max-width: 767px)
    width: 100%
  &:before
    width: calc(100% + 2px)
    height: 15px
    content: ''
    top: 0
    left: -1px
    background: linear-gradient(89deg, #00C9FF 0%, #03A6E9 100%)
    position: absolute
  &__row
    display: flex
    justify-content: space-between
    margin-bottom: 12px
    font-family: Inter
    font-weight: 700
  &__activities
    display: flex
    gap: 16px
    margin-top: 30px
.inactive-card
  opacity:0.5
</style>
