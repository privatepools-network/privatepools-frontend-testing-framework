<template>
  <CModal alignment="normal" :visible="codeEditModal">
    <CModalBody>
      <div class="modal_body_inside">
        <div>
          <div
            class="modal_body_header d-flex justify-content-end align-items-start"
          >
            <div class="back_button" @click="codeEditModal = false">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18"
                  stroke="#FFFFFF"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6 6L18 18"
                  stroke="#FFFFFF"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div
          class="d-flex justify-content-center flex-column align-items-center"
        >
          <div
            style="
              color: white;
              font-size: clamp(16px, 0.9vw, 20px);
              font-weight: 700;
            "
          >
          Generate Referral Code
          </div>
          <div
            style="
              color: white;
              font-size: clamp(10px, 0.8vw, 14px);
              font-weight: 500;
            "
            class="my-3"
          >
          Create a referral code now, share it and start earning!
          </div>
          <div class="w-100 my-3">
            <input
              type="text"
              placeholder="Enter referral code"
              style="color: #fff !important"
              aria-label="Search by name, symbol or address"
              class="search-input"
            />
          </div>
          <div class="referrals_button">Generate code</div>
        </div>
      </div>
    </CModalBody>
  </CModal>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, toRefs } from 'vue'
const props = defineProps(['codeEditModal'])
const emit = defineEmits(['codeEditModalOpen'])
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.modal_body_header {
  font-family: Poppins;
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: -0.5px;
  color: white;
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
.modal_total_container {
  border: 1px solid rgba(163, 164, 165, 0.2);
  border-radius: 15px;
  font-size: 14px;
}

.back_button {
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background: #00000024;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  border: 1px solid #ffffff0d;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
@/composables/math/investMath/useInvestMath@/composables/poolActions/deposit/useApproveTokens
