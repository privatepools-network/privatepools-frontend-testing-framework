<template>
  <div>
    <div class="w-100 d-flex justify-content-center gap-3 mt-5">
      <div
        class="d-flex specific_container dark:!bg-[#22222224] bg-white"
        v-for="(item, i) in specificPortfolioStats"
        :key="`${i}-specific-stats`"
      >
        <div class="d-flex align-items-center flex-column gap-2 w-100">
          <div class="text_header !text-black dark:!text-white">
            {{ item.name }}
          </div>
          <div class="text_value !text-black dark:!text-white">
            {{ item.value }}
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="affiliates_table dark:!bg-[#22222224] bg-white">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="text_header !text-black dark:!text-white">
            My Referral Codes
          </div>
          <div
            class="referrals_button w-auto"
            @click="$emit('codeEditModalOpen')"
          >
            + Create
          </div>
        </div>
        <hr
          style="
            border-bottom: 1px solid #ffffff0d;
            margin-left: -20px;
            margin-right: -20px;
          "
        />
        <div>
          <CTable borderless>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell
                  class="text-black dark:!text-white font-normal"
                  scope="col"
                  v-for="(header, i) in headers"
                  :key="`${i}-col`"
                  >{{ header }}</CTableHeaderCell
                >
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell scope="row">
                  <div
                    class="d-flex align-items-center gap-1 !text-black dark:!text-white"
                  >
                    MyCode
                    <img :src="copyCodeIcon" />
                    <img :src="twitterIcon" />
                  </div>
                </CTableHeaderCell>
                <CTableDataCell class="!text-black dark:!text-white"
                  >$0.00</CTableDataCell
                >
                <CTableDataCell class="!text-black dark:!text-white"
                  >0</CTableDataCell
                >
                <CTableDataCell class="!text-black dark:!text-white"
                  >$0.00</CTableDataCell
                >
              </CTableRow>
            </CTableBody>
          </CTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import copyCodeIcon from '@/assets/icons/Referrals/copyCode.svg'
import twitterIcon from '@/assets/icons/Referrals/twitter.svg'

defineEmits(['codeEditModalOpen'])

const headers = ref([
  'Referral Code',
  'Total Liquidity',
  'Investors Reffered',
  'Total Rewards',
])

const specificPortfolioStats = ref([
  {
    name: 'Investors Referred',
    value: '0',
  },
  {
    name: 'Referred Liquidity',
    value: '$0.00',
  },
  {
    name: 'Earned Rewards',
    value: '$0.00',
  },
  {
    name: 'Rewards Claimable',
    value: '$0.00000',
  },
])
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.affiliates_table {
  // background: #22222224;
  border: 1px solid #ffffff0d;
  border-radius: 16px;
  box-shadow: 0px 4px 4px 0px #00000040;
  padding: 20px;
  margin: 40px;

  @media (max-width: 1300px) {
    margin-top: 30px;
    margin-left: 10px;
    margin-right: 10px;
  }
}

.specific_container {
  // background: #22222224;
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

  // color: #ffffff;
}
.text_value {
  margin-top: 5px;
  font-family: Montserrat;
  font-size: clamp(14px, 0.8vw, 20px);
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0em;
  text-align: center;

  // color: #ffffff;
}

.referrals_button {
  cursor: pointer;
  margin-top: 5px;
  border-radius: 4px;
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 600;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  padding: 6px 12px;
  background: linear-gradient(45deg, #00e0ff 0%, #0e3e9b 100%);
  box-shadow: 0px 4px 8.899999618530273px 0px #00aae01a;

  &:hover {
    filter: drop-shadow(0 0 0.7rem #00c9ff);
    background: #00e0ff;
  }
}
</style>
