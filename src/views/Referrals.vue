<template>
  <Modal v-if="codeEditModal" @close="codeEditModalClose">

    <template #body>
      <ReferralsCodeGenerateModal @setReferralCode="(code) => referralCode = code" />
    </template>

  </Modal>

  <MainCard>
    <div v-if="affiliateSteps !== 5" class="flex justify-center flex-col items-center mb-12">
      <div class="my-1 title !text-black dark:!text-white">Referrals</div>
      <div class="my-1 description !text-black dark:!text-white text-center">
        Get fee discounts and earn rebates through the referral program. For more
        information, please read the <a href="">referral program details.</a></div>
    </div>
    <div class="d-flex justify-content-center">
      <Tabs :filterEye="false" :selectedTab="selectedTab" :tabsOptions="['Investors', 'Affiliates']"
        @changeTab="changeSelectedTab" />
    </div>

    <div v-if="selectedTab === 'Investors'">
      <Investors />
    </div>
    <div class="mt-5" v-else>
      <Affiliates :referralCode="referralCode" :affiliateSteps="affiliateSteps" @codeEditModalOpen="codeEditModalOpen"
        @affiliateStepsChange="affiliateStepsChange" />
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
const affiliateSteps = ref(1)
function affiliateStepsChange(newValue) {
  affiliateSteps.value = newValue
}


const referralCode = ref(null)
onMounted(async () => {
  const mmProvider = await InitializeMetamask()
  if (mmProvider) {
    const address = await mmProvider.getSigner().getAddress()
    referralCode.value = await getReferralCode(address)
    if (referralCode.value) {
      affiliateSteps.value = 6;
    }
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
<style lang="scss">
@import '@/styles/_variables.scss';

.title {
  // color: white;
  font-size: clamp(16px, 0.9vw, 20px);
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

.referrals_button {
  width: 100%;
  cursor: pointer;
  margin-top: 5px;
  border-radius: 16px;

  font-size: 12px;
  font-weight: 600;
  line-height: 24px;
  color: #02031C;
  text-align: center;
  padding: 6px;
  background: #00E0FF;
  box-shadow: 0px 4px 8.899999618530273px 0px #00aae01a;

  &:hover {
    filter: drop-shadow(0 0 0.7rem #00c9ff);
    background: #00e0ff;
  }
}
</style>
