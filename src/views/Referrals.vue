<template>
  <Modal v-if="codeEditModal" @close="codeEditModalClose">

    <template #body>
      <ReferralsCodeGenerateModal @setReferralCode="(code) => referralCode = code" />
    </template>

  </Modal>

  <MainCard>
    <div class="my-3 title !text-black dark:!text-white">Referrals</div>
    <div class="my-1 description !text-black dark:!text-white">
      Get fee discounts and earn rebates through the referral program. For more
      information, please read the <a href="">referral program details.</a>
    </div>
    <div class="d-flex justify-content-center">
      <Tabs :filterEye="false" :selectedTab="selectedTab" :tabsOptions="['Investors', 'Affiliates']"
        @changeTab="changeSelectedTab" />
    </div>

    <div v-if="selectedTab === 'Investors'">
      <Investors />
    </div>
    <div class="mt-5" v-else>
      <Affiliates :referralCode="referralCode" @codeEditModalOpen="codeEditModalOpen" />
    </div>
  </MainCard>
</template>

<script setup>
import Tabs from '@/UI/Tabs.vue'
import MainCard from '@/UI/MainCard.vue'
import { ref, onMounted } from 'vue'
import Investors from '@/components/Referrals/Investors.vue'
import Affiliates from '@/components/Referrals/Affiliates.vue'
import ReferralsCodeGenerateModal from '@/components/modals/ReferralsCodeGenerateModal.vue'
import Modal from '@/UI/Modal.vue'
import { InitializeMetamask } from '@/lib/utils/metamask'
import { getReferralCode } from "@/composables/data/referralData"

const selectedTab = ref('Investors')
const referralCode = ref(null)
onMounted(async () => {
  const mmProvider = await InitializeMetamask()
  if (mmProvider) {
    const address = await mmProvider.getSigner().getAddress()
    referralCode.value = await getReferralCode(address)
  }
})


function changeSelectedTab(_new) {
  selectedTab.value = _new
}


const codeEditModal = ref(false)
function codeEditModalClose() {
  codeEditModal.value = false
}
function codeEditModalOpen() {
  codeEditModal.value = true
}

</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.title {
  // color: white;
  font-size: clamp(14px, 0.8vw, 20px);
  font-weight: 700;
}

.description {
  // color: white;
  font-size: clamp(10px, 0.8vw, 14px);
  font-weight: 500;
  width: 38%;

  @media (max-width:768px) {
    width: 100%;
    margin-bottom: 20px !important;
  }
}
</style>
