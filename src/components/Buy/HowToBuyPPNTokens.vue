<template>
  <div class="my-4 !text-white font-medium text-3xl">
    {{ $t('how_to_buy') }}
  </div>
  <div
    class="flex md:gap-1 gap-4 justify-between md:overflow-hidden overflow-y-auto"
  >
    <div class="flex gap-4">
      <div
        v-for="(item, i) in howToBuyCards"
        :key="`${i}-how-to`"
        class="how_to_buy !bg-[#22222224]"
      >
        <img :src="item.icon" width="60" />
        <div class="text-[#eaecef] text-base font-semibold">
          {{ item.name }}
        </div>
        <div class="!text-[#b7bdc6] text-sm">
          {{ item.desc }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import firstIcon from '@/assets/icons/howToCards/1.svg'
import secondIcon from '@/assets/icons/howToCards/2.svg'
import thirdIcon from '@/assets/icons/howToCards/3.svg'
import { t } from 'i18next'
import { ref } from 'vue'

const howToBuyCards = ref([
  {
    name: t('how_to_buy_cards_1_name'),
    desc: t('how_to_buy_cards_1_desc'),
    icon: firstIcon,
  },
  {
    name: t('how_to_buy_cards_2_name'),
    desc: t('how_to_buy_cards_2_desc'),
    icon: secondIcon,
  },
  {
    name: t('how_to_buy_cards_3_name'),
    desc: t('how_to_buy_cards_3_desc'),
    icon: thirdIcon,
  },
])
</script>
<style lang="scss" scoped>
.how_to_buy {
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 4px 0px #00000040;
  padding: 32px 22px;
  border-radius: 16px;
  width: 33%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    width: 300px;
  }
}
</style>
