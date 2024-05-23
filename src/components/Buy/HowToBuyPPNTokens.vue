<template>
  <div class="my-4 text-black dark:!text-white font-medium text-3xl">
    {{ $t('how_to_buy') }}
  </div>
  <div class="d-flex gap-3 justify-content-center">
    <div
      v-for="(item, i) in howToBuyCards"
      :key="`${i}-how-to`"
      class="how_to_buy dark:!bg-[#22222224] bg-[#FFFFFF24]"
    >
      <img :src="item.icon" width="60" />
      <div class="text-black dark:!text-[#eaecef] text-base font-semibold">
        {{ item.name }}
      </div>
      <div class="text-black dark:!text-[#b7bdc6] text-sm">
        {{ item.desc }}
      </div>
    </div>
  </div>
</template>
<script setup>
import firstIcon from '@/assets/icons/howToCards/1.svg'
import secondIcon from '@/assets/icons/howToCards/2.svg'
import thirdIcon from '@/assets/icons/howToCards/3.svg'
import { t } from 'i18next';
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
  backdrop-filter: blur(10px);

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
