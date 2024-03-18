<template>
     <div
        style="
          color: white;
          font-size: clamp(24px, 0.8vw, 40px);
          font-weight: 700;
        "
        class="my-5"
      >
        How to buy PPN Tokens
      </div>
      <div class="d-flex gap-3 justify-content-center">
        <div
          v-for="(item, i) in howToBuyCards"
          :key="`${i}-how-to`"
          class="how_to_buy"
        >
          <img :src="item.icon" width="60" />
          <div style="color: #eaecef; font-size: clamp(12px, 0.8vw, 20px)">
            {{ item.name }}
          </div>
          <div style="color: #b7bdc6; font-size: clamp(9px, 0.6vw, 13px)">
            {{ item.desc }}
          </div>
        </div>
      </div>
</template>
<script setup>
import firstIcon from '@/assets/icons/howToCards/1.svg'
import secondIcon from '@/assets/icons/howToCards/2.svg'
import thirdIcon from '@/assets/icons/howToCards/3.svg'
import { ref } from 'vue'

const howToBuyCards = ref([
  {
    name: '1. Enter Amount & Select Currency',
    desc: 'Enter the amount and select the desired currency to trade for PPN tokens.',
    icon: firstIcon,
  },
  {
    name: '2. Confirm Swap',
    desc: 'Confirmation of transaction detail information, including trading pair quotes, fees, and other explanatory tips.',
    icon: secondIcon,
  },
  {
    name: '3. Receive PPN Tokens',
    desc: 'After successful swapping, the PPN Tokens will reach your wallet.',
    icon: thirdIcon,
  },
])
</script>
<style lang="scss" scoped>
.how_to_buy {
  background: #22222224;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 4px 0px #00000040;
  padding: 32px 22px;
  border-radius: 16px;
  width: 33%;

  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
