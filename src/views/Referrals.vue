<template>
  <MainCard>
    <div class="my-3 title">Referrals</div>
    <div class="my-1 description">
      Get fee discounts and earn rebates through the referral program. For more
      information, please read the <a href="">referral program details.</a>
    </div>
    <div class="d-flex justify-content-center">
      <Tabs
        :filterEye="false"
        :selectedTab="selectedTab"
        :tabsOptions="['Investors', 'Affiliates']"
        @changeTab="changeSelectedTab"
      />
    </div>

    <div v-if="selectedTab === 'Investors'">
      <Investors />
    </div>
    <div class="mt-5" v-else>
      <Affiliates />
    </div>
  </MainCard>
</template>

<script setup>
import Tabs from '@/UI/Tabs.vue'
import MainCard from '@/UI/MainCard.vue'
import { ref } from 'vue'
import Investors from '@/components/Referrals/Investors.vue'
import Affiliates from '@/components/Referrals/Affiliates.vue'

const selectedTab = ref('Investors')

function changeSelectedTab(_new) {
  selectedTab.value = _new
}
</script>
<style lang="scss">
@import '@/styles/_variables.scss';

.title {
  color: white;
  font-size: clamp(14px, 0.8vw, 20px);
  font-weight: 700;
}

.description {
  color: white;
  font-size: clamp(10px, 0.8vw, 14px);
  font-weight: 500;
  width: 38%;
}
</style>
