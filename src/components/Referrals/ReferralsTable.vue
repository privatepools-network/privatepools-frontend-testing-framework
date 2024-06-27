<template>
  <div>
    <CRow
      v-if="width > 768"
      id="pool-activity-row"
      class="table-wrapper !mx-0"
      style="
        border-radius: 16px;
        background: #22222224;
        box-shadow: 0px 4px 4px 0px #00000040;
        border: 1px solid #ffffff0d;
      "
    >
      <div class="flex justify-between dark:!bg-[#22222224] items-center pt-3 !px-10">
        <div class="font-['Syne',_sans-serif] font-semibold dark:text-white">
          Referred Wallets
        </div>
        <div class="table_ref_button flex items-center gap-2">
          My Code

          <!-- <svg
            class="cursor-pointer"
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.9498 0.359131H4.45843C2.11254 0.359131 0.204102 2.26813 0.204102 4.61471V12.3854C0.204102 14.7319 2.11254 16.6409 4.45843 16.6409H12.9498C15.2957 16.6409 17.2041 14.7319 17.2041 12.3854V4.61471C17.2041 2.26813 15.2957 0.359131 12.9498 0.359131ZM1.70489 4.61471C1.70489 3.09617 2.94033 1.86036 4.45843 1.86036H12.9498C14.4679 1.86036 15.7033 3.09617 15.7033 4.61471V12.3854C15.7033 13.9039 14.4679 15.1397 12.9498 15.1397H4.45843C2.94033 15.1397 1.70489 13.9039 1.70489 12.3854V4.61471Z"
              fill="#02031C"
            />
            <path
              d="M8.70407 12.4576C10.8856 12.4576 12.6613 10.6823 12.6613 8.49918C12.6613 6.31609 10.8865 4.54077 8.70407 4.54077C6.52163 4.54077 4.74683 6.31609 4.74683 8.49918C4.74683 10.6823 6.52163 12.4576 8.70407 12.4576ZM8.70407 6.04297C10.0587 6.04297 11.1605 7.14509 11.1605 8.50014C11.1605 9.8552 10.0587 10.9573 8.70407 10.9573C7.34942 10.9573 6.24762 9.8552 6.24762 8.50014C6.24762 7.14509 7.34942 6.04297 8.70407 6.04297Z"
              fill="#02031C"
            />
            <path
              d="M13.0276 5.1802C13.6151 5.1802 14.0939 4.70223 14.0939 4.11366C14.0939 3.52509 13.616 3.04712 13.0276 3.04712C12.4393 3.04712 11.9614 3.52509 11.9614 4.11366C11.9614 4.70223 12.4393 5.1802 13.0276 5.1802Z"
              fill="#02031C"
            />
          </svg> -->

          <ShareNetwork
            network="twitter"
            url="https://privatepools.network/"
            title="Join my referral code in Private Pools ecosystem! Test"
            description="Private Pools Referrals Code"
            quote=""
            hashtags="privatepools,referrals,ppn"
          >
            <svg
              class="cursor-pointer"
              width="18"
              height="17"
              viewBox="0 0 18 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.24633 0.281738L7.02505 9.34742L0.204102 16.7184H1.73967L7.71199 10.2653L12.537 16.7184H17.7616L10.6018 7.14281L16.9511 0.281738H15.4155L9.91594 6.22491L5.47198 0.281738H0.247349H0.24633ZM2.50384 1.41289H4.90348L15.5021 15.5873H13.1024L2.50384 1.41289Z"
                fill="#02031C"
              />
            </svg>
          </ShareNetwork>


          <ShareNetwork
            network="telegram"
            url="https://privatepools.network/"
            title="Join my referral code in Private Pools ecosystem! Test"
            description="Private Pools Referrals Code"
            quote=""
            hashtags="privatepools,referrals,ppn"
          >
          <svg
            class="cursor-pointer"
            width="18"
            height="15"
            viewBox="0 0 18 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.20835 6.88181C1.24739 6.86239 1.28645 6.84393 1.32451 6.82645C1.98624 6.52148 2.65676 6.23594 3.3263 5.95039C3.36241 5.95039 3.4229 5.90863 3.45706 5.89503C3.50879 5.87269 3.56053 5.85132 3.61226 5.82898C3.71181 5.78625 3.81137 5.74449 3.90994 5.70175C4.10905 5.61725 4.30716 5.53275 4.50627 5.44825L5.69797 4.94029C6.49243 4.6023 7.2879 4.26333 8.08236 3.92534C8.87683 3.58734 9.67227 3.24838 10.4667 2.91038C11.2612 2.57239 12.0566 2.23343 12.8511 1.89543C13.6456 1.55744 14.441 1.21847 15.2355 0.88048C15.4122 0.804723 15.6035 0.692055 15.7928 0.659033C15.9519 0.630866 16.1071 0.576479 16.2671 0.546371C16.5707 0.489067 16.9054 0.465759 17.1963 0.59105C17.2968 0.634756 17.3895 0.695944 17.4666 0.772673C17.8356 1.13592 17.7838 1.73226 17.7058 2.24314C17.1621 5.80373 16.6185 9.3653 16.0739 12.9259C15.9997 13.4144 15.8982 13.9506 15.5107 14.2594C15.1828 14.5207 14.7162 14.5498 14.3112 14.4391C13.9062 14.3274 13.549 14.0933 13.1986 13.8631C11.7453 12.9055 10.2911 11.9478 8.83779 10.9902C8.49228 10.7629 8.10774 10.4657 8.11165 10.0529C8.1136 9.8043 8.26292 9.58285 8.41517 9.38569C9.67812 7.74623 11.5003 6.61958 12.856 5.05587C13.0473 4.8354 13.1976 4.43719 12.9351 4.30995C12.7789 4.2342 12.5993 4.33715 12.4568 4.43524C10.6649 5.67358 8.8739 6.91289 7.08196 8.15123C6.49733 8.55527 5.8844 8.97097 5.17973 9.07003C4.54923 9.15939 3.91483 8.98456 3.30483 8.80585C2.7934 8.65628 2.28293 8.50282 1.77443 8.34451C1.50408 8.26098 1.22494 8.17066 1.01608 7.98126C0.807212 7.79187 0.687179 7.4733 0.813084 7.22078C0.89214 7.06246 1.04538 6.96243 1.20642 6.88084L1.20835 6.88181Z"
              fill="#02031C"
            />
          </svg>
          </ShareNetwork>


          <ShareNetwork
            network="whatsapp"
            url="https://privatepools.network/"
            title="Join my referral code in Private Pools ecosystem! Test"
            description="Private Pools Referrals Code"
            quote=""
            hashtags="privatepools,referrals,ppn"
          >
          <svg
            class="cursor-pointer"
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.829 12.325C8.48227 12.325 5.75946 9.60049 5.75854 6.25279C5.75946 5.40418 6.45024 4.71411 7.29677 4.71411C7.38381 4.71411 7.46992 4.72144 7.55237 4.7361C7.73377 4.76635 7.90601 4.82775 8.06451 4.92031C8.08741 4.93405 8.10298 4.95605 8.10665 4.98171L8.46028 7.21137C8.46486 7.23703 8.45662 7.26361 8.43921 7.28285C8.24407 7.49913 7.99488 7.65492 7.71728 7.73281L7.58353 7.77039L7.63391 7.8996C8.09015 9.06163 9.01914 9.98997 10.1817 10.4482L10.3109 10.4995L10.3485 10.3657C10.4263 10.088 10.5821 9.83876 10.7983 9.64356C10.8139 9.6289 10.835 9.62156 10.856 9.62156C10.8606 9.62156 10.8652 9.62156 10.8707 9.62248L13.0997 9.97622C13.1263 9.9808 13.1483 9.99546 13.162 10.0184C13.2536 10.1769 13.315 10.3501 13.3461 10.5316C13.3608 10.6122 13.3672 10.6974 13.3672 10.7863C13.3672 11.634 12.6773 12.3241 11.829 12.325Z"
              fill="#02031C"
            />
            <path
              d="M17.7637 7.76504C17.5832 5.72508 16.6488 3.83266 15.1325 2.43695C13.6071 1.03298 11.6282 0.259521 9.55863 0.259521C5.01634 0.259521 1.32058 3.95637 1.32058 8.5C1.32058 10.0249 1.74109 11.5105 2.53723 12.8045L0.761719 16.7359L6.44646 16.1302C7.43499 16.5352 8.48124 16.7405 9.55772 16.7405C9.84081 16.7405 10.1312 16.7258 10.4226 16.6956C10.6791 16.6681 10.9384 16.6278 11.1931 16.5765C14.9969 15.8076 17.7738 12.4306 17.7958 8.544V8.5C17.7958 8.25257 17.7848 8.00514 17.7628 7.76595L17.7637 7.76504ZM6.66542 14.4045L3.52027 14.7399L4.45933 12.6587L4.27151 12.4067C4.25777 12.3884 4.24403 12.3701 4.22845 12.349C3.41308 11.2227 2.98248 9.89205 2.98248 8.50092C2.98248 4.87372 5.9325 1.92283 9.55863 1.92283C12.9557 1.92283 15.8352 4.57405 16.1128 7.9584C16.1275 8.13985 16.1357 8.32222 16.1357 8.50184C16.1357 8.55316 16.1348 8.60356 16.1339 8.65763C16.0642 11.6919 13.9452 14.2689 10.9805 14.9251C10.7542 14.9755 10.5224 15.014 10.2916 15.0387C10.0515 15.0662 9.80508 15.0799 9.56047 15.0799C8.68921 15.0799 7.84268 14.9113 7.04288 14.5777C6.95401 14.542 6.86697 14.5035 6.78543 14.4641L6.66634 14.4064L6.66542 14.4045Z"
              fill="#02031C"
            />
          </svg>
          </ShareNetwork>
        </div>
      </div>
      <hr style="border: 1px solid #ffffff1f" class="mt-3 !mb-0" />
      <Table
        :headers="['Wallets', 'TVL', 'Number of Pools', 'Referred Rewards']"
      >
        <CTableBody
          v-if="filteredActivities"
          class="dark:!text-white text-black table-body"
          style="margin-left: 12px; margin-right: 12px"
        >
          <!-- <CTableRow v-for="(item, i) in filteredActivities" :key="i"
            class="table-row bg-white dark:!bg-[#22222224] hover:!bg-[#66c5ff3d] dark:hover:!bg-[#4242421d]"
            @click="$emit('changeToSpecificPortfolio', item.Wallet)" style="cursor: pointer">
      
            <CTableDataCell scope="row" class="dark:!text-white text-black table-cell">
              <div class="d-flex align-items-center gap-2">
             
                {{ item['Wallet'] }}
                <div v-if="user_in_top && user_info && item['Wallet'].toLowerCase() == account.toLowerCase()"
                  style="color: #8b968c; font-size: 11px;">My Ranking</div>
              </div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="text-success table-cell">
              <div>
                <CurrencySymbol /> {{ numberToAposthrophe(item['Profit'], 2) }}
              </div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="dark:!text-white text-black table-cell">
              <div>
                {{ item['Number of Pools'] }}
              </div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="dark:!text-white text-black table-cell">
              <div>
                <CurrencySymbol /> {{ numberToAposthrophe(item['Traded Volume'], 2) }}
              </div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="text-danger table-cell">
              <div class=" flex items-center gap-3 cursor-pointer">
                <CurrencySymbol />{{ numberToAposthrophe(item['Gas Fees'], 5) }}
                <span>
                  <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_423_9484)">
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M1.12744 2.57276C1.17717 2.76609 1.30566 2.90418 1.44256 3.0408C3.0233 4.61847 4.60153 6.19865 6.18319 7.77543C6.25878 7.85081 6.25854 7.88864 6.18307 7.96387C4.60137 9.54056 3.02304 11.1206 1.44218 12.6982C1.30526 12.8349 1.17685 12.973 1.12744 13.1665V13.3774C1.20565 13.6273 1.36871 13.7924 1.61963 13.8696H1.854C2.04556 13.8079 2.18365 13.6739 2.32196 13.5355C4.01199 11.8435 5.70335 10.1528 7.39599 8.46335C7.53706 8.32254 7.67543 8.18308 7.73682 7.98682V7.75244C7.67445 7.55681 7.53762 7.41633 7.39632 7.2753C5.70357 5.58609 4.01224 3.89543 2.32235 2.20336C2.18393 2.06472 2.04521 1.93172 1.854 1.86963H1.61963C1.57395 1.8889 1.52803 1.9076 1.48264 1.9275C1.29035 2.01175 1.19606 2.17633 1.12744 2.36182V2.57276Z"
                        fill="#ADABAB" stroke="#ADABAB" stroke-width="0.2" />
                    </g>
                    <defs>
                      <clipPath id="clip0_423_9484">
                        <rect width="8" height="14" fill="white" transform="translate(0.127441 0.869629)" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </div>
            </CTableDataCell>
          </CTableRow> -->

          <!-- Your rating -->
          <hr style="border: 1px solid #ffffff1f" class="my-3" />
          <CTableRow
            v-if="!user_in_top && account"
            class="table-row bg-white dark:!bg-[#22222224] hover:!bg-[#66c5ff3d] dark:hover:!bg-[#4242421d] mb-4"
            @click="$emit('changeToSpecificPortfolio', user_info.Wallet)"
            style="cursor: pointer"
          >
            <CTableDataCell
              scope="row"
              class="dark:!text-white text-black table-cell"
            >
              <div class="d-flex align-items-center gap-2">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_423_9463)">
                    <g clip-path="url(#clip1_423_9463)">
                      <g clip-path="url(#clip2_423_9463)">
                        <path
                          d="M24.1274 0.869629H0.127441V24.8696H24.1274V0.869629Z"
                          fill="#F93301"
                        />
                        <path
                          d="M1.67249 35.1297L24.0669 26.4969L15.4341 4.10255L-6.9603 12.7353L1.67249 35.1297Z"
                          fill="#F5B800"
                        />
                        <path
                          d="M-6.73939 -4.9875L-10.5962 18.7005L13.0918 22.5573L16.9486 -1.1307L-6.73939 -4.9875Z"
                          fill="#03555E"
                        />
                        <path
                          d="M8.74274 -13.241L-15.0269 -16.5626L-18.3485 7.20704L5.42114 10.5286L8.74274 -13.241Z"
                          fill="#236FE1"
                        />
                      </g>
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_423_9463">
                      <rect
                        x="0.127441"
                        y="0.869629"
                        width="24"
                        height="24"
                        rx="12"
                        fill="white"
                      />
                    </clipPath>
                    <clipPath id="clip1_423_9463">
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="translate(0.127441 0.869629)"
                      />
                    </clipPath>
                    <clipPath id="clip2_423_9463">
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="translate(0.127441 0.869629)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <div class="d-flex flex-column">
                  <div>{{ user_info.Wallet }}</div>
                  <!-- <div style="color: #8b968c; font-size: 11px;">My Ranking</div> -->
                </div>
              </div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="text-success table-cell">
              <div>
                <CurrencySymbol />
                {{ numberToAposthrophe(user_info['Profit'], 2) }}
              </div>
            </CTableDataCell>
            <CTableDataCell
              scope="row"
              class="dark:!text-white text-black table-cell"
            >
              <div>{{ user_info['Number of Pools'] }}</div>
            </CTableDataCell>
            <CTableDataCell
              scope="row"
              class="dark:!text-white text-black table-cell"
            >
              <div class="flex items-center gap-24">
                <div>
                  <CurrencySymbol />
                  {{ numberToAposthrophe(user_info['Traded Volume'], 2) }}
                </div>
                <span>
                  <svg
                    width="9"
                    height="15"
                    viewBox="0 0 9 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_423_9484)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M1.12744 2.57276C1.17717 2.76609 1.30566 2.90418 1.44256 3.0408C3.0233 4.61847 4.60153 6.19865 6.18319 7.77543C6.25878 7.85081 6.25854 7.88864 6.18307 7.96387C4.60137 9.54056 3.02304 11.1206 1.44218 12.6982C1.30526 12.8349 1.17685 12.973 1.12744 13.1665V13.3774C1.20565 13.6273 1.36871 13.7924 1.61963 13.8696H1.854C2.04556 13.8079 2.18365 13.6739 2.32196 13.5355C4.01199 11.8435 5.70335 10.1528 7.39599 8.46335C7.53706 8.32254 7.67543 8.18308 7.73682 7.98682V7.75244C7.67445 7.55681 7.53762 7.41633 7.39632 7.2753C5.70357 5.58609 4.01224 3.89543 2.32235 2.20336C2.18393 2.06472 2.04521 1.93172 1.854 1.86963H1.61963C1.57395 1.8889 1.52803 1.9076 1.48264 1.9275C1.29035 2.01175 1.19606 2.17633 1.12744 2.36182V2.57276Z"
                        fill="#ADABAB"
                        stroke="#ADABAB"
                        stroke-width="0.2"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_423_9484">
                        <rect
                          width="8"
                          height="14"
                          fill="white"
                          transform="translate(0.127441 0.869629)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </div>
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
        <div v-else style="height: 500px">
          <LoaderPulse></LoaderPulse>
        </div>
      </Table>
    </CRow>
    <!-- <div v-else class="mobile_table_container">
      <LeaderboardMobileTable :user_in_top="user_in_top" :account="account" :user_info="user_info"
        :filteredActivities="filteredActivities" :type="'portfolios'"
        @changeToSpecificPortfolio="changeToSpecificPortfolio" />
    </div> -->
    {{ console.log('filteredActivities', filteredActivities) }}
    <Pagination
      :perPage="perPage"
      :pools="filteredActivities"
      :currentPage="currentPage"
      @changePage="changePage"
      @changePerPage="changePerPage"
      :perPageOptions="[25, 50, 100]"
    ></Pagination>
  </div>
</template>
<script setup>
import LoaderPulse from '../loaders/LoaderPulse.vue'
import Table from '@/UI/Table'
import { ref, defineEmits, onMounted, computed, toRefs, defineProps } from 'vue'
import { getTokenEntity } from '@/lib/helpers/util'
import Pagination from '@/components/Pool/Pagination.vue'
import { ShareNetwork } from 'vue-social-sharing'
import secondPlace from '@/assets/icons/generalIcons/secondPlace.svg'
import thirdPlace from '@/assets/icons/generalIcons/thirdPlace.svg'

import numberToAposthrophe from '@/lib/formatter/numberToAposthrophe'
import CurrencySymbol from '@/components/TrackInfo/CurrencySymbol.vue'
import { InitializeMetamask } from '@/lib/utils/metamask'
import { useDevice } from '@/composables/adaptive/useDevice'
import LeaderboardMobileTable from '@/components/General/LeaderboardMobileTable.vue'

const props = defineProps(['allRefs', 'changeToSpecificPortfolio'])
const { allRefs } = toRefs(props)

defineEmits('changeToSpecificPortfolio')
const { width } = useDevice()

const perPage = ref(25)
const currentPage = ref(1)

const filteredActivities = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return allRefs.value.slice(start, end)
})

const account = ref('')
const user_info = computed(() => {
  const portfolio = allRefs.value.find(
    (item) => item['Wallet'].toLowerCase() === account.value.toLowerCase(),
  ) ?? {
    Wallet: account.value,
    Place: allRefs.value.length + 1,
    Profit: 0,
    'Number of Pools': 0,
    'Gas Fees': 0,
    'Traded Volume': 0,
  }
  return portfolio
})

const user_in_top = computed(() => {
  return filteredActivities.value
    .map((item) => item['Wallet'].toLowerCase())
    .includes(account.value.toLowerCase())
})

onMounted(async () => {
  const mmProvider = await InitializeMetamask()
  if (mmProvider) {
    const address = await mmProvider.getSigner().getAddress()
    account.value = address
  }
})

function changePage(args) {
  if (args.isEquating == false) {
    currentPage.value = currentPage.value + args.num
  } else {
    currentPage.value = args.num
  }
}

function changePerPage(v1) {
  perPage.value = Number(v1)
  currentPage.value = 1
}
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';

@mixin cells-widths {
  width: 150px;

  @media (max-width: $xxl) {
    width: 100px;
  }

  &:nth-child(1) {
    width: 600px;

    @media (max-width: $xxl) {
      width: 300px;
    }
  }

  // &:nth-child(2) {
  //   width: 600px;

  //   @media (max-width: $xxl) {
  //     width: 300px;
  //   }
  // }
}

:deep(.table-header-font-folder) {
  text-align: left !important;
  @include cells-widths;
}

.table {
  &__header {
    display: flex;
    margin-bottom: 18px;
  }

  &-body {
    display: block;
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
      background-color: #02120a;
      border-radius: 50px;
      margin-bottom: 10px;
    }

    &::-webkit-scrollbar {
      width: 8px !important;
      height: 8px !important;
      background: #02120a;
      border-radius: 50px;
    }

    &::-webkit-scrollbar-thumb {
      border: 2px solid #02120a;
      background: #00c9ff;
      border-radius: 21px;
    }
  }

  &-wrapper {
    padding: 0;
    border-radius: 20px;
    outline: 0.5px solid rgba(163, 164, 165, 0.2196078431);
    background: transparent;
    width: 100%;
    overflow-x: auto;
    margin-bottom: 30px;
  }

  &-row {
    border-color: transparent;
    width: 100%;
    display: table;
    table-layout: fixed;
    vertical-align: middle;
    // background: #22222224;
    box-shadow: 0px 4px 4px 0px #00000040;
    border-radius: 16px;
    margin-top: 10px;

    &:hover {
      background: #00c8ff07;
    }
  }

  &-cell {
    padding: 24px 0 24px 10px !important;
    width: fit-content;
    font-weight: 400;
    white-space: nowrap;
    font-size: 14px;
    overflow: visible;
    @include cells-widths;

    @media (max-width: $xxl) {
      font-size: clamp(10px, 1vw, 14px);
      padding: 16px 0 12px 10px !important;
    }

    &:first-child {
      padding: 24px 0 24px 45px !important;
      text-align: left;

      @media (max-width: $xxl) {
        padding: 12px 0 12px 15px !important;
      }
    }

    &:last-child {
      padding: 24px 10px 24px 10px !important;

      @media (max-width: $xxl) {
        padding: 16px 0 12px 10px !important;
      }
    }
  }
}

.actions-cell {
  display: flex;
  align-items: center;

  &__text {
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    letter-spacing: 0em;
    // color: #ffffff;
    margin-left: 12px;

    @media (max-width: $xxl) {
      font-size: 12px;
    }
  }
}

.details-cell {
  display: flex;
  flex-wrap: wrap;

  &__token-entity {
    display: flex;

    &:not(:last-child) {
      margin-right: 12px;
    }

    &__icon {
      height: 20px;
      width: 20px;
      margin-right: 8px;

      @media (max-width: $xxl) {
        margin-right: 4px;
      }
    }
  }
}

.row {
  margin-right: 0 !important;
  margin-left: 0 !important;
}

.table_ref_button {
  background: #00e0ff;
  padding: 7px 12px 7px 12px;
  border-radius: 100px;
  color: #02031c;
  font-weight: 600;
}
</style>
