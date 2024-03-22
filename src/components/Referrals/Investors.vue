<template>
  <ReferralsCodeEditModal
    :codeEditModal="codeEditModal"
    @codeEditModalOpen="codeEditModalOpen"
  />
  <div class="center_container mt-5" v-if="investorsSteps < 5">
    <div class="d-flex justify-content-center flex-column align-items-center">
      <div
        style="
          color: white;
          font-size: clamp(14px, 0.8vw, 20px);
          font-weight: 700;
        "
      >
        Enter Referral Code
      </div>
      <div
        style="
          color: white;
          font-size: clamp(10px, 0.8vw, 14px);
          font-weight: 500;
        "
        class="my-3"
      >
        Please input a referral code to benefit from fee discounts.
      </div>
      <div class="w-100 my-3">
        <input
          type="text"
          placeholder="Enter Code..."
          style="color: #fff !important"
          aria-label="Search by name, symbol or address"
          class="search-input"
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
        class="d-flex specific_container"
        v-for="(item, i) in specificPortfolioStats"
        :key="`${i}-specific-stats`"
      >
        <div class="d-flex align-items-center flex-column gap-2 w-100">
          <div class="text_header">{{ item.name }}</div>
          <div class="text_value">
            {{ item.value }}
            <img
              :src="editIcon"
              v-if="i === 0"
              @click="() => codeEditModalOpen()"
              style="cursor: pointer"
            />
          </div>
          <div v-if="i === 0" style="color: white; font-size: 10px">
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

const codeEditModal = ref(false)
function codeEditModalOpen() {
  codeEditModal.value = !codeEditModal.value
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
  background: #15151524;
  border: 1px solid #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  margin: 1% 30% 10% 30%;
  padding: 2.5%;
  border-radius: 16px;
}
.search-input {
  width: 100%;
  font-size: 12px;
  color: white !important;
  border: 1px solid #2abdff;
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
    outline: #2abdff;
  }
}

.referrals_button {
  width: 100%;
  cursor: pointer;
  margin-top: 5px;
  border-radius: 16px;
  font-family: Inter;
  font-size: 12px;
  font-weight: 600;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  padding: 6px;
  background: linear-gradient(45deg, #2abdff 0%, #0e3e9b 100%);
  box-shadow: 0px 4px 8.899999618530273px 0px #00aae01a;

  &:hover {
    filter: drop-shadow(0 0 0.7rem #00c9ff);
    background: #2abdff;
  }
}

.specific_container {
  background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;
  border: 1px solid #ffffff0d;
  padding: 8px 16px;
  border-radius: 16px;
  width: 23%;
}

.text_header {
  margin-top: 7px;
  font-family: Poppins;
  font-size: clamp(14px, 0.8vw, 20px);
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: center;

  color: #ffffff;
}
.text_value {
  margin-top: 5px;
  font-family: Poppins;
  font-size: clamp(14px, 0.8vw, 20px);
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0em;
  text-align: center;

  color: #ffffff;
}
</style>
