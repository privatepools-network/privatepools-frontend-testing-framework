<template>
  <div class="modal_body_inside">
 
    <div class="d-flex justify-content-center flex-column align-items-center">
      <div
      
        class="!text-black dark:!text-white text-[18px] font-bold"
      >
        Edit Referral Code
      </div>
      <div
       
        class="my-3 !text-black dark:!text-white text-[12px] font-medium"
      >
        Please input a referral code to change your current one.
      </div>
      <div class="w-100 my-3">
        <input
          type="text"
          placeholder="Enter referral code"
          aria-label="Search by name, symbol or address"
          class="search-input !text-black dark:!text-white"
        />
      </div>
      <div class="referrals_button">Enter referral code</div>
    </div>
  </div>
</template>

<script setup>
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.modal_body_header {
  
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: -0.5px;
}

.search-input {
  width: 100%;
  font-size: 12px;
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
