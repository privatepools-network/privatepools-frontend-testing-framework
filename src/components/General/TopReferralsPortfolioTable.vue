<template>
  <div>
    <CRow
      id="pool-activity-row"
      class="table-wrapper"
      style="
        border-radius: 15.289px;
        background: #22222224;
        box-shadow: 0px 4px 4px 0px #00000040;
        border: 1px solid #ffffff0d;
      "
    >
      <Table
        :headers="[
          'Place',
          'Wallet',
          'Tier',
          'People Referred',
          'Number of Pools',
          'Total Volume Referred',
          'Rewards',
          '',
        ]"
      >
        <CTableBody v-if="filteredActivities" class="text-white table-body"  style="margin-left: 12px; margin-right: 12px;">
          <CTableRow
            v-for="(item, i) in filteredActivities"
            :key="i"
            class="table-row"
            @click="$emit('changeToSpecificPortfolio')"
            style="cursor: pointer"
          >
            <CTableDataCell scope="row" class="text-white table-cell">
              <div class="actions-cell">
                <img
                  v-if="item['Place'] === 1"
                  :src="firstPlace"
                  style="margin-top: -5px"
                />
                <img
                  v-else-if="item['Place'] === 2"
                  :src="secondPlace"
                  style="margin-top: -5px"
                />
                <img
                  v-else-if="item['Place'] === 3"
                  :src="thirdPlace"
                  style="margin-top: -5px"
                />
                <div v-else class="actions-cell__text">
                  {{ item['Place'] }}
                </div>
              </div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="text-white table-cell">
              <div class="d-flex align-items-center gap-2">
                <div class="d-flex flex-column">
                  <div>{{ computedAddress(item['Wallet']) }}</div>
                  <div style="color: #8b968c; font-size: 11px">
                    Joze Makumba
                  </div>
                </div>
              </div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="text-success table-cell">
              <div class="d-flex flex-column">
                {{ item['Tier'] }}
                <div style="color: #8b968c; font-size: 11px">5% discount</div>
              </div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="text-white table-cell">
              <div>
                {{ item['PeopleRef'] }}
              </div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="text-white table-cell">
              <div>
                {{ item['Number of Pools'] }}
              </div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="text-white table-cell">
              <div>${{ item['TotalVolumeReferred'] }}</div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="text-white table-cell">
              <div>${{ item['Rewards'] }}</div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="text-success table-cell">
              <div>
                Copy Code
                <span style="padding-left: 30px; cursor: pointer">
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
                </span>
              </div>
            </CTableDataCell>
          </CTableRow>

          <!-- Your rating -->
          <hr style="border: 1px solid #ffffff1f" class="my-2" />
          <CTableRow
            class="table-row  mb-4"
            @click="$emit('changeToSpecificPortfolio')"
            style="cursor: pointer"
          >
            <CTableDataCell scope="row" class="text-white table-cell">
              <div class="actions-cell">
                <div class="actions-cell__text">69</div>
              </div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="text-white table-cell">
              <div class="d-flex align-items-center gap-2">
                <div class="d-flex flex-column">
                  <div class="d-flex align-items-center gap-2">
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_423_9490)">
                        <g clip-path="url(#clip1_423_9490)">
                          <mask
                            id="mask0_423_9490"
                            style="mask-type: luminance"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="1"
                            width="24"
                            height="24"
                          >
                            <path
                              d="M23.4038 1.81065H0.36377V24.8506H23.4038V1.81065Z"
                              fill="white"
                            />
                          </mask>
                          <g mask="url(#mask0_423_9490)">
                            <path
                              d="M11.8838 1.81065C5.52127 1.81065 0.36377 6.96815 0.36377 13.3306C0.36377 19.6931 5.52127 24.8506 11.8838 24.8506C18.2463 24.8506 23.4038 19.6931 23.4038 13.3306C23.4038 6.96815 18.2463 1.81065 11.8838 1.81065ZM11.8838 4.97864C13.9516 4.97864 15.6278 6.65481 15.6278 8.72264C15.6278 10.7905 13.9516 12.4666 11.8838 12.4666C9.81594 12.4666 8.13977 10.7905 8.13977 8.72264C8.13977 6.65481 9.81594 4.97864 11.8838 4.97864ZM11.8838 22.5466C8.69273 22.5466 5.88185 20.9246 4.22757 18.4605C5.51897 16.5827 9.63276 15.6346 11.8838 15.6346C14.1348 15.6346 18.2486 16.5827 19.54 18.4605C17.8857 20.9246 15.0748 22.5466 11.8838 22.5466Z"
                              fill="white"
                              fill-opacity="0.6"
                            />
                          </g>
                        </g>
                      </g>
                      <defs>
                        <clipPath id="clip0_423_9490">
                          <rect
                            width="24"
                            height="24"
                            fill="white"
                            transform="translate(0.127441 0.869629)"
                          />
                        </clipPath>
                        <clipPath id="clip1_423_9490">
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
                      <div>
                        {{
                          computedAddress(
                            '0x12345550fd593b2cc60072fa09159d993b88a69d',
                          )
                        }}
                      </div>
                      <div style="color: #8b968c; font-size: 11px">
                        Joze Makumba
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="text-success table-cell">
              <div class="d-flex flex-column">
                Tier 1
                <div style="color: #8b968c; font-size: 11px">5% discount</div>
              </div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="text-white table-cell">
              <div>118</div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="text-white table-cell">
              <div>1</div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="text-white table-cell">
              <div>$518,150.000</div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="text-white table-cell">
              <div>$25.907</div>
            </CTableDataCell>
            <CTableDataCell scope="row" class="text-success table-cell">
              <div  @click="router.push('/referrals')">
                Manage my code
                <span style="padding-left: 8px; cursor: pointer">
                  <svg
                    width="9"
                    height="15"
                    viewBox="0 0 9 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_423_9983)">
                      <g clip-path="url(#clip1_423_9983)">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M1.12695 2.57276C1.17668 2.76609 1.30517 2.90418 1.44207 3.0408C3.02281 4.61847 4.60104 6.19865 6.1827 7.77543C6.25829 7.85081 6.25805 7.88864 6.18258 7.96387C4.60088 9.54056 3.02255 11.1206 1.44169 12.6982C1.30477 12.8349 1.17636 12.973 1.12695 13.1665V13.3774C1.20516 13.6273 1.36822 13.7924 1.61914 13.8696H1.85351C2.04507 13.8079 2.18316 13.6739 2.32147 13.5355C4.0115 11.8435 5.70286 10.1528 7.3955 8.46335C7.53657 8.32254 7.67494 8.18308 7.73633 7.98682V7.75244C7.67396 7.55681 7.53713 7.41633 7.39583 7.2753C5.70308 5.58609 4.01175 3.89543 2.32186 2.20336C2.18344 2.06472 2.04472 1.93172 1.85351 1.86963H1.61914C1.57346 1.8889 1.52754 1.9076 1.48215 1.9275C1.28986 2.01175 1.19557 2.17633 1.12695 2.36182V2.57276Z"
                          fill="#ADABAB"
                          stroke="#ADABAB"
                          stroke-width="0.2"
                        />
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0_423_9983">
                        <rect
                          width="8"
                          height="14"
                          fill="white"
                          transform="translate(0.126953 0.869629)"
                        />
                      </clipPath>
                      <clipPath id="clip1_423_9983">
                        <rect
                          width="8"
                          height="14"
                          fill="white"
                          transform="translate(0.126953 0.869629)"
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
    <Pagination
      :perPage="perPage"
      :pools="poolActivity"
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
import { ref, defineEmits, computed } from 'vue'
import { getTokenEntity } from '@/lib/helpers/util'
import Pagination from '../Manage/Pool/Pagination.vue'
import firstPlace from '@/assets/icons/generalIcons/firstPlace.svg'
import secondPlace from '@/assets/icons/generalIcons/secondPlace.svg'
import thirdPlace from '@/assets/icons/generalIcons/thirdPlace.svg'
import router from '@/router'

defineEmits('changeToSpecificPortfolio')

const perPage = ref(25)
const currentPage = ref(1)

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
const filteredActivities = [
  {
    Place: 1,
    Wallet: '0x73262550fd593b2cc60072fa09159d993b88a71f',
    Profit: '+$2,744.94',
    'Number of Pools': '5',
    Tier: 'Tier 1',
    PeopleRef: '118',
    TotalVolumeReferred: '518,150.000',
    Rewards: '25.907',
  },
  {
    Place: 2,
    Wallet: '0x73262550fd593b2cc60072fa09159d993b88a71f',
    Profit: '+$2,744.94',
    'Number of Pools': '5',
    Tier: 'Tier 1',
    PeopleRef: '118',
    TotalVolumeReferred: '518,150.000',
    Rewards: '25.907',
  },
  {
    Place: 3,
    Wallet: '0x73262550fd593b2cc60072fa09159d993b88a71f',
    Profit: '+$2,744.94',
    'Number of Pools': '5',
    Tier: 'Tier 1',
    PeopleRef: '118',
    TotalVolumeReferred: '518,150.000',
    Rewards: '25.907',
  },
  {
    Place: 4,
    Wallet: '0x73262550fd593b2cc60072fa09159d993b88a71f',
    Profit: '+$2,744.94',
    'Number of Pools': '5',
    Tier: 'Tier 1',
    PeopleRef: '118',
    TotalVolumeReferred: '518,150.000',
    Rewards: '25.907',
  },
  {
    Place: 5,
    Wallet: '0x73262550fd593b2cc60072fa09159d993b88a71f',
    Profit: '+$2,744.94',
    'Number of Pools': '5',
    Tier: 'Tier 1',
    PeopleRef: '118',
    TotalVolumeReferred: '518,150.000',
    Rewards: '25.907',
  },
]

function computedAddress(address) {
  return (
    address.substring(0, 6) + '....' + address.substring(address.length - 4)
  )
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
    width: 200px;

    @media (max-width: $xxl) {
      width: 130px;
    }
  }

  &:nth-child(2) {
    width: 200px;

    @media (max-width: $xxl) {
      width: 150px;
    }
  }
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
    background: #22222224;
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
      font-size: 10px;
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
    color: #ffffff;
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
</style>
