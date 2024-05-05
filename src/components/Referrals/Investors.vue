<template>
  <Modal v-if="codeEditModal" @close="codeEditModalClose">
    <template #body>
      <ReferralsCodeEditModal />
    </template>
  </Modal>

  <div
    class="center_container bg-white dark:!bg-[#15151524] mt-5"
    v-if="investorsSteps < 5"
  >
    <div class="d-flex justify-content-center flex-column align-items-center">
      <div class="text-black dark:!text-white text-base font-bold">
        Enter Referral Code
      </div>
      <div class="my-3 text-black dark:!text-white text-sm font-medium">
        Please input a referral code to benefit from fee discounts.
      </div>
      <div class="w-100 my-3">
        <input
          type="text"
          placeholder="Enter Code..."
          aria-label="Search by name, symbol or address"
          class="search-input dark:!text-white text-black"
        />
      </div>
      <div
        class="referrals_button"
        v-if="investorsSteps === 1"
        @click="investorsSteps = 2"
      >
        Enter code
      </div>
      <div
        class="referrals_button"
        v-else-if="investorsSteps === 2"
        @click="investorsSteps = 3"
      >
        Checking code...
      </div>
      <div
        class="referrals_button"
        v-else-if="investorsSteps === 3"
        @click="investorsSteps = 4"
      >
        Submit
      </div>
      <div
        class="referrals_button"
        v-else-if="investorsSteps === 4"
        @click="investorsSteps = 5"
      >
        Adding...
      </div>
    </div>
  </div>
  <div v-else>
    <div class="w-100 d-flex justify-content-center gap-3 mt-5">
      <div
        class="d-flex specific_container dark:!bg-[#22222224] bg-white"
        v-for="(item, i) in specificPortfolioStats"
        :key="`${i}-specific-stats`"
      >
        <div class="d-flex align-items-center flex-column gap-2 w-100">
          <div class="text_header text-black dark:!text-white">
            {{ item.name }}
          </div>
          <div class="text_value text-black dark:!text-white flex items-center gap-1">
            {{ item.value }}

            <svg
              v-if="i === 0"
              @click="() => codeEditModalOpen()"
              class="cursor-pointer"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5.99994L18 8.99994M13 19.9999H21M5 15.9999L4 19.9999L8 18.9999L19.586 7.41394C19.9609 7.03889 20.1716 6.53027 20.1716 5.99994C20.1716 5.46961 19.9609 4.961 19.586 4.58594L19.414 4.41394C19.0389 4.039 18.5303 3.82837 18 3.82837C17.4697 3.82837 16.9611 4.039 16.586 4.41394L5 15.9999Z"
                class="stroke-black dark:!stroke-[#F8F8F8]"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div v-if="i === 0"  class="text-black dark:!text-white text-[10px]">
            Tier 1 (5% discount)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ReferralsCodeEditModal from '@/components/modals/ReferralsCodeEditModal.vue'
import editIcon from '@/assets/icons/Referrals/edit.svg'
import Modal from '@/UI/Modal.vue'

const codeEditModal = ref(false)
function codeEditModalOpen() {
  codeEditModal.value = true
}
function codeEditModalClose() {
  codeEditModal.value = false
}
const investorsSteps = ref(1)
const specificPortfolioStats = ref([
  {
    name: 'Active Referral Code',
    value: 'Code 13',
  },
  {
    name: 'Invested liquidity',
    value: '$0.0',
  },
  {
    name: 'Saved Costs',
    value: '$0.00000',
  },
])
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';
.center_container {
  // background: #15151524;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  margin: 1% 30% 10% 30%;
  padding: 2.5%;
  border-radius: 16px;
  backdrop-filter: blur(10px);

}
.search-input {
  width: 100%;
  font-size: 12px;
  // color: white !important;
  border: 1px solid #00e0ff;
  border-radius: 16px;
  padding: 8px 12px;
  @media (max-width: $xxl) {
    font-size: 10px;
    // padding: 0px 12px;
  }

  &::placeholder {
    color: #5e5e5e !important;
  }

  &:focus-visible {
    // border: 1px solid rgb(18, 180, 255) !important;
    outline: #00e0ff;
  }
}

.referrals_button {
  width: 100%;
  cursor: pointer;
  margin-top: 5px;
  border-radius: 16px;
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 600;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  padding: 6px;
  background: linear-gradient(45deg, #00e0ff 0%, #0e3e9b 100%);
  box-shadow: 0px 4px 8.899999618530273px 0px #00aae01a;

  &:hover {
    filter: drop-shadow(0 0 0.7rem #00c9ff);
    background: #00e0ff;
  }
}

.specific_container {
  box-shadow: 0px 4px 4px 0px #00000040;
  border: 1px solid #ffffff0d;
  padding: 8px 16px;
  border-radius: 16px;
  width: 23%;
}

.text_header {
  margin-top: 7px;
  font-family: Montserrat;
  font-size: clamp(14px, 0.8vw, 20px);
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: center;
}
.text_value {
  margin-top: 5px;
  font-family: Montserrat;
  font-size: clamp(14px, 0.8vw, 20px);
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0em;
  text-align: center;
}
</style>
