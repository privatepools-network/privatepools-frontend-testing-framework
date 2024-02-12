<template>
  <div class="assets-features">
    <div class="assets-features__el">
      <div class="assets__title">
        Select Fee Tier
      </div>
      <div class="assets-features__interface">
        <div class="assets-features__currency">%</div>
        <input type="text" v-model="feeAmount"
               @focusout="$emit('amountValidate')"
               @input="(v1) => $emit('update:feeAmount', v1.target.value)"
               class="assets-features__input">
      </div>
    </div>
    <div class="assets-features__el">
      <div class="assets__title">
        Deposit Amount
      </div>
      <div class="assets-features__interface">
        <div class="assets-features__currency">$</div>
        <input type="text" v-model="depositAmount"
               @focusout="$emit('amountValidate')"
               @input="(v1) => $emit('update:depositAmount', v1.target.value)"
               class="assets-features__input">
      </div>
    </div>
  </div>
</template>
<script setup>
import {defineProps, toRefs} from "vue";
const props = defineProps({
  selectedFee: Number,
  feeOptions: Array,
  depositAmount: String,
  feeAmount: String
})
const {depositAmount, feeAmount} = toRefs(props)

</script>

<style lang="sass">
.assets
  &-features
    display: flex
    margin-bottom: 41px
    &__el
      width: 150px
      margin-right: 50px
      &:last-child
        margin-right: 0
    &__interface
      display: flex
      align-items: center
      padding: 9px 12px
      border-radius: 20px
      border: 0.2px solid #00C9FF
      background: transparent
      @media (max-width: 1400px)
        padding: 4px 10px
    &__currency
      color: #4B5563
    &__input
      width: 100%
      color: #4B5563
      background: none
      border: none
      outline: none
      font-size: clamp(12px, 0.8vw, 16px)

    &__icon
      margin-left: auto

</style>
