<template>
    <ReferralsCodeGenerateModal
    :codeEditModal="codeEditModal"
    @codeEditModalOpen="codeEditModalOpen"

  />
  <div>
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
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="affiliates_table">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="text_header">My Referral Codes</div>
          <div class="referrals_button" @click="() => codeEditModalOpen()">+ Create</div>
        </div>
        <hr
          style="
            border-bottom: 1px solid #ffffff0d;
            margin-left: -20px;
            margin-right: -20px;
          "
        />
        <div>
          <CTable borderless >
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell
                style="color: #FFFFFF85; font-weight: 400;"
                  scope="col"
                  v-for="(header, i) in headers"
                  :key="`${i}-col`"
                  >{{ header }}</CTableHeaderCell
                >
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell scope="row"
                  >
                  <div class="d-flex align-items-center gap-1">
                  MyCode
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5417 0H3.20833C3.08678 0 2.9702 0.0482886 2.88424 0.134243C2.79829 0.220197 2.75 0.336776 2.75 0.458333V2.75H0.458333C0.336776 2.75 0.220197 2.79829 0.134243 2.88424C0.0482886 2.9702 0 3.08678 0 3.20833V10.5417C0 10.6632 0.0482886 10.7798 0.134243 10.8658C0.220197 10.9517 0.336776 11 0.458333 11H7.79167C7.91322 11 8.0298 10.9517 8.11576 10.8658C8.20171 10.7798 8.25 10.6632 8.25 10.5417V8.25H10.5417C10.6632 8.25 10.7798 8.20171 10.8658 8.11576C10.9517 8.0298 11 7.91322 11 7.79167V0.458333C11 0.336776 10.9517 0.220197 10.8658 0.134243C10.7798 0.0482886 10.6632 0 10.5417 0ZM7.33333 10.0833H0.916667V3.66667H7.33333V10.0833ZM10.0833 7.33333H8.25V3.20833C8.25 3.08678 8.20171 2.9702 8.11576 2.88424C8.0298 2.79829 7.91322 2.75 7.79167 2.75H3.66667V0.916667H10.0833V7.33333Z"
                      fill="#F8F8F8"
                    />
                  </svg>
                  <svg
                    width="14"
                    height="11"
                    viewBox="0 0 14 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.2812 2.33083L12.0546 2.48868L12.0675 2.76458C12.2393 6.42101 9.41687 10.5 4.40202 10.5C3.58325 10.5 2.79551 10.3754 2.05666 10.1455C2.16345 10.1224 2.26971 10.0966 2.37534 10.068C3.16633 9.85414 3.90687 9.49183 4.55444 9.00098L5.70272 8.1306L4.26212 8.10261C3.76208 8.09289 3.27948 7.93272 2.88169 7.64692C2.70674 7.52122 2.55221 7.37415 2.4213 7.2106C2.61761 7.19314 2.80923 7.15917 2.99384 7.11035L2.96134 6.13614C2.09528 5.96794 1.44306 5.36106 1.18394 4.63104C1.40107 4.68063 1.62338 4.70928 1.84764 4.7162L3.6412 4.77153L2.1347 3.79666C1.63105 3.47074 1.27946 2.97559 1.14515 2.4151C1.06627 2.08596 1.06525 1.74679 1.13885 1.42157C1.79525 2.0668 2.55664 2.60557 3.39385 3.01588C4.47542 3.54595 5.65984 3.85003 6.87005 3.90895L7.53699 3.94142L7.38043 3.29231C7.04233 1.89048 8.14144 0.5 9.69421 0.5C10.3811 0.5 10.9992 0.780448 11.4317 1.22565L11.6193 1.41866L11.8837 1.36843C11.958 1.3543 12.0321 1.33888 12.1057 1.32216L12.4083 2.23593C12.4102 2.23572 12.4121 2.2355 12.4139 2.23529C12.3703 2.26778 12.326 2.29963 12.2812 2.33083Z"
                      stroke="white"
                    />
                  </svg>
                </div>
                </CTableHeaderCell>
                <CTableDataCell>$0.00</CTableDataCell>
                <CTableDataCell>0</CTableDataCell>
                <CTableDataCell>$0.00</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell scope="row"
                  >
                  <div class="d-flex align-items-center gap-1">
                  MyCode2
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5417 0H3.20833C3.08678 0 2.9702 0.0482886 2.88424 0.134243C2.79829 0.220197 2.75 0.336776 2.75 0.458333V2.75H0.458333C0.336776 2.75 0.220197 2.79829 0.134243 2.88424C0.0482886 2.9702 0 3.08678 0 3.20833V10.5417C0 10.6632 0.0482886 10.7798 0.134243 10.8658C0.220197 10.9517 0.336776 11 0.458333 11H7.79167C7.91322 11 8.0298 10.9517 8.11576 10.8658C8.20171 10.7798 8.25 10.6632 8.25 10.5417V8.25H10.5417C10.6632 8.25 10.7798 8.20171 10.8658 8.11576C10.9517 8.0298 11 7.91322 11 7.79167V0.458333C11 0.336776 10.9517 0.220197 10.8658 0.134243C10.7798 0.0482886 10.6632 0 10.5417 0ZM7.33333 10.0833H0.916667V3.66667H7.33333V10.0833ZM10.0833 7.33333H8.25V3.20833C8.25 3.08678 8.20171 2.9702 8.11576 2.88424C8.0298 2.79829 7.91322 2.75 7.79167 2.75H3.66667V0.916667H10.0833V7.33333Z"
                      fill="#F8F8F8"
                    />
                  </svg>
                  <svg
                    width="14"
                    height="11"
                    viewBox="0 0 14 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.2812 2.33083L12.0546 2.48868L12.0675 2.76458C12.2393 6.42101 9.41687 10.5 4.40202 10.5C3.58325 10.5 2.79551 10.3754 2.05666 10.1455C2.16345 10.1224 2.26971 10.0966 2.37534 10.068C3.16633 9.85414 3.90687 9.49183 4.55444 9.00098L5.70272 8.1306L4.26212 8.10261C3.76208 8.09289 3.27948 7.93272 2.88169 7.64692C2.70674 7.52122 2.55221 7.37415 2.4213 7.2106C2.61761 7.19314 2.80923 7.15917 2.99384 7.11035L2.96134 6.13614C2.09528 5.96794 1.44306 5.36106 1.18394 4.63104C1.40107 4.68063 1.62338 4.70928 1.84764 4.7162L3.6412 4.77153L2.1347 3.79666C1.63105 3.47074 1.27946 2.97559 1.14515 2.4151C1.06627 2.08596 1.06525 1.74679 1.13885 1.42157C1.79525 2.0668 2.55664 2.60557 3.39385 3.01588C4.47542 3.54595 5.65984 3.85003 6.87005 3.90895L7.53699 3.94142L7.38043 3.29231C7.04233 1.89048 8.14144 0.5 9.69421 0.5C10.3811 0.5 10.9992 0.780448 11.4317 1.22565L11.6193 1.41866L11.8837 1.36843C11.958 1.3543 12.0321 1.33888 12.1057 1.32216L12.4083 2.23593C12.4102 2.23572 12.4121 2.2355 12.4139 2.23529C12.3703 2.26778 12.326 2.29963 12.2812 2.33083Z"
                      stroke="white"
                    />
                  </svg>
                </div>
                </CTableHeaderCell>
                <CTableDataCell>$0.00</CTableDataCell>
                <CTableDataCell>0</CTableDataCell>
                <CTableDataCell>$0.00</CTableDataCell>
              </CTableRow>
           
            </CTableBody>
          </CTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ReferralsCodeGenerateModal from '@/components/modals/ReferralsCodeGenerateModal.vue'
const headers = ref([
  'Referral Code',
  'Total Liquidity',
  'Investors Reffered',
  'Total Rewards',
])

const codeEditModal = ref(false)
function codeEditModalOpen() {
  codeEditModal.value = !codeEditModal.value
}

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
  background: #22222224;
  border: 1px solid #ffffff0d;
  border-radius: 16px;
  box-shadow: 0px 4px 4px 0px #00000040;
  padding: 20px;
  margin: 40px;

  @media (max-width:1300px) {
    margin-top: 30px;
    margin-left: 10px;
    margin-right: 10px;
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

.referrals_button {
  cursor: pointer;
  margin-top: 5px;
  border-radius: 4px;
  font-family: Inter;
  font-size: 12px;
  font-weight: 600;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  padding: 6px 12px;
  background: linear-gradient(45deg, #2abdff 0%, #0e3e9b 100%);
  box-shadow: 0px 4px 8.899999618530273px 0px #00aae01a;

  &:hover {
    filter: drop-shadow(0 0 0.7rem #00c9ff);
    background: #2abdff;
  }
}
</style>
