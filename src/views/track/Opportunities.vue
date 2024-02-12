<template>
  <MainCard>
    <div class="chaing-selector">
      <ChainSelector
        :excludeAll="true"
        @updateChain="(newChain) => (chainSelected = newChain)"
      />
    </div>
    <CRow class="d-flex align-items-center">
      <Title :title="'Missed Opportunities'" style="margin-bottom: 0 !important">
        <VTooltip :distance="0" :placement="'right'">
          <div style="cursor: help">
            <svg
              class="info_icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 17H13V11H11V17ZM12 9C12.2833 9 12.521 8.904 12.713 8.712C12.905 8.52 13.0007 8.28267 13 8C13 7.71667
        12.904 7.479 12.712 7.287C12.52 7.095 12.2827 6.99933 12 7C11.7167 7 11.479 7.096 11.287 7.288C11.095 7.48
        10.9993 7.71733 11 8C11 8.28333 11.096 8.521 11.288 8.713C11.48 8.905 11.7173 9.00067 12 9ZM12 22C10.6167 22
        9.31667 21.7373 8.1 21.212C6.88333 20.6867 5.825 19.9743 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788
        15.9C2.26333 14.6833 2.00067 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31333 6.88333 4.02567 5.825
        4.925 4.925C5.825 4.025 6.88333 3.31267 8.1 2.788C9.31667 2.26333 10.6167 2.00067 12 2C13.3833 2 14.6833 2.26267
        15.9 2.788C17.1167 3.31333 18.175 4.02567 19.075 4.925C19.975 5.825 20.6877 6.88333 21.213 8.1C21.7383 9.31667
        22.0007 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6867 17.1167 19.9743 18.175 19.075 19.075C18.175
        19.975 17.1167 20.6877 15.9 21.213C14.6833 21.7383 13.3833 22.0007 12 22ZM12 20C14.2333 20 16.125 19.225 17.675
        17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4
        7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20
        12 20Z"
                fill="#F8F8F8"
              />
            </svg>
          </div>
          <template #popper>
            <div
              style="
                background: linear-gradient(
                  rgba(89, 89, 89, 0.75),
                  rgba(73, 73, 73, 0.15)
                );
                backdrop-filter: blur(10px);
                padding: 10px;
                border-radius: 4px;
                width: 400px;
              "
            >
              <h6>Information</h6>
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  font-size: clamp(10px, 0.8vw, 14px);
                "
              >
                <div>
                  In this section, you'll find a wealth of trade insights. It's
                  organized into monthly folders, and when opened, you'll
                  discover a file for each day with recorded trade
                  opportunities.
                </div>
              </div>
            </div>
          </template>
        </VTooltip>
      </Title>
    </CRow>
    <CRow class="root-folders-container">
      <CContainer class="top-folders-container">
        <!-- {{ console.log("FOLDERS", foldersMonths) }} -->
        <CButton
          class="folder"
          :class="{ folder_active: rootFolderSelected == month }"
          v-for="(month, monthIndex) in foldersMonths"
          :key="`root-directory-${monthIndex}`"
          @click="setRootFolderSelected(month)"
        >
          <svg
            width="20"
            height="19"
            viewBox="0 0 20 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.5 4.5H13.75L9.41797 1.25C8.98438 0.925781 8.45703 0.75 7.91797 0.75H2.5C1.12109 0.75 0 1.87109 0 3.25V15.75C0 17.1289 1.12109 18.25 2.5 18.25H17.5C18.8789 18.25 20 17.1289 20 15.75V7C20 5.62109 18.8789 4.5 17.5 4.5Z"
              fill="#7EF6B2"
            />
          </svg>

          <span>2023 {{ month }} </span>
        </CButton>
      </CContainer>
    </CRow>
    <CRow v-if="rootFolderSelected" class="d-flex justify-content-between">
      <Title :title="'Opportunities Table'">
        <VTooltip :distance="0" :placement="'right'">
          <div style="cursor: help">
            <img class="info_icon" :src="info" width="20" v-if="fileSelected" />
          </div>
          <template #popper>
            <div
              style="
                background: linear-gradient(
                  rgba(89, 89, 89, 1),
                  rgba(73, 73, 73, 0.45)
                );
                backdrop-filter: blur(10px);
                padding: 10px;
                border-radius: 4px;
              "
            >
              <h6>Information</h6>
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  font-size: clamp(10px, 0.8vw, 14px);
                "
              >
                <div>
                  Time Stamp: Exact date and time when a specific trade
                  opportunity was identified or executed
                </div>
                <div>Token 0: Specifies the initial token being traded</div>
                <div>
                  Token 1: Denotes the token received in exchange for "Token 0"
                  during the trade
                </div>
                <div>
                  Best Input Amount: Indicates the optimal amount of "Token 1"
                  to be traded
                </div>
                <div>
                  BestOutAmount: Optimal amount received from the first swap in
                  a multi-swap trade
                </div>
                <div>
                  Best Profit: Displays the highest possible profit achievable
                  for the trade
                </div>
                <div>
                  Buy Path: Path offering the best possible purchase conditions
                </div>
                <div>
                  Sell Path: Path offering the best possible sell conditions
                </div>
                <div>
                  Total 1Inch Calls: Quantifies the total number of API calls
                  made to 1INCH
                </div>
                <div>
                  Ratio: Illustrates the proportion between "Token 0" and "Token
                  1" in the trade
                </div>
                <div>Chain: Specifies the blockchain network</div>
                <div>Strategy: Describes the applied trading strategy</div>
              </div>
            </div>
          </template>
        </VTooltip>
      </Title>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="folder-breadcrumbs">
          <svg
            class="folder-breadcrumbs__icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 10H21M10 3V21M3 5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5Z"
              stroke="#F8F8F8"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="text-white folder-breadcrumbs__text">/</span>
          <CBreadcrumb class="path-breadcrumb text-white mb-0 d-flex flex-row">
            <CBreadcrumbItem
              v-for="(breadcrumb, breadcrumbIndex) in breadcrumbs"
              :key="`breadcrumb-key-${breadcrumbIndex}`"
              @click="breadcrumb.action(breadcrumb.value)"
            >
              <template v-if="breadcrumbIndex === 0">
                <CIcon
                  v-if="!fileSelected"
                  :icon="cilFolder"
                  class="folder-breadcrumbs__icon"
                  size="xl"
                />
                <CIcon
                  v-else
                  :icon="cilFile"
                  class="folder-breadcrumbs__icon"
                  size="xl"
                />
              </template>
              <span class="folder-breadcrumbs__text">{{
                breadcrumb.value
              }}</span>
            </CBreadcrumbItem>
            <!-- <div style="margin-left: 5px;"> <span> / {{ chainSelected }} </span></div> -->
          </CBreadcrumb>
        </div>
        <div
          class="d-flex align-items-center gap-2"
          v-if="fileTableHeadCaptions.length > 0"
        >
          <div v-if="width > 768" class="text-white" style="font-size: clamp(10px, 0.8vw, 14px)">
            Hide null Opportunities
          </div>
          <div style="cursor: pointer">
            <CFormSwitch
              size="l"
              v-model="hideNullOpportunities"
              id="hideZeroOpportunities"
            />
          </div>
        </div>
      </div>
    </CRow>
    <CRow v-if="rootFolderSelected">
      <div class="file-opp-container" v-if="!fileTableHeadCaptions.length">
        <Table
          class="table-choose-opportunity"
          :headers="['Name', '', 'Chain', 'Share date']"
        >
          <CTableBody
            class="table-body"
            :class="{ 'table-body_scroll': foldersDays.length > 7 }"
          >
            <div
              class="d-flex justify-content-center"
              style="padding: 280px 0px"
              v-if="isLoading === true"
            >
              <LoaderPulse />
            </div>
            {{ console.log('foldersDays', foldersDays) }}
            <div v-if="foldersDays.length > 0">
              <CTableRow
                style="cursor: pointer; border-color: transparent"
                v-for="(subfolder, subfolderIndex) in foldersDays"
                :key="`subfolder-key-${subfolderIndex}`"
                @click="setFileSelected(subfolder)"
                class="table-row"
              >
                <CTableDataCell scope="row" class="align-middle table-cell">
                  <div>
                    <!-- <CIcon :icon="cilFile" size="xl" /> -->
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_3609_1434)">
                        <rect width="32" height="32" rx="4" fill="#181C1F" />
                      </g>
                      <path
                        d="M18.5312 7.5625H10.9375C10.0048 7.5625 9.25 8.31726 9.25 9.25V22.75C9.25 23.6827 10.0048 24.4375 10.9375 24.4375H21.0625C21.9952 24.4375 22.75 23.6827 22.75 22.75V11.7812L18.5312 7.5625ZM16 20.2188H11.7813V19.375H16V20.2188ZM20.2188 17.6875H11.7813V16.8438H20.2188V17.6875ZM20.2188 15.1562H11.7813V14.3125H20.2188V15.1562Z"
                        fill="#00C9FF"
                      />
                      <defs>
                        <clipPath id="clip0_3609_1434">
                          <rect width="32" height="32" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    <!-- <CIcon :icon="cilFile" size="xl" v-if="subfolderSelected"/> -->
                    <!-- <CIcon :icon="cilFolder" size="xl" v-else/> -->
                  </div>
                </CTableDataCell>
                <CTableDataCell scope="row" class="align-middle table-cell">
                  <div class="text-white d-flex flex-column ms-2 text-start">
                    {{ subfolder }}
                  </div>
                </CTableDataCell>
                <CTableDataCell scope="row" class="align-middle table-cell">
                  <div class="text-white d-flex flex-column ms-2">
                    {{ chainSelected.name }}
                  </div>
                </CTableDataCell>
                <CTableDataCell scope="row" class="align-middle table-cell">
                  <div class="text-white d-flex flex-column ms-2">
                    {{ subfolder }}
                  </div>
                </CTableDataCell>
              </CTableRow>
            </div>
            <div class="warning_container" v-else>
              <div class="warning">
                <img :src="bunner" class="warning__bunner" />
                <div class="warning-info">
                  <div class="warning-info__title">No Results Found</div>

                  <div class="warning-info__description">
                    It looks like there were noresults for the selected period.
                    Please adjust your filters or check back later for updated
                    data.
                  </div>
                </div>
              </div>
            </div>
          </CTableBody>
        </Table>
      </div>
      <div v-else class="file-opp-container table-opportunity">
        <Table :headers="fileTableHeadCaptions">
          <CTableBody
            style="
              overflow-x: hidden;
              overflow-y: auto;
              max-height: 626px;
              display: block;
            "
           class="table_files_scrollbar"
          >
            <div
              class="d-flex justify-content-center"
              style="padding: 280px 0px"
              v-if="isLoading === true || filterIsLoading === true"
            >
              <LoaderPulse />
            </div>
            <CTableRow
              class="table-row"
              style="border-color: transparent"
              v-for="(fileDataRow, fileDataRowIndex) in csvData"
              :key="`file-data-row-key-${fileDataRowIndex}`"
            >
              <CTableDataCell
                scope="row"
                class="align-middle file-table-content-container table-cell"
                :style="
                  fileDataCellIndex !== 0 ? 'text-align: -webkit-center' : ''
                "
                v-for="(
                  fileDataCell, fileDataCellKey, fileDataCellIndex
                ) in fileDataRow"
                :key="`file-table-cell-key-${fileDataCellKey}`"
              >
                <div
                  v-if="fileDataCellIndex === 1 || fileDataCellIndex === 2"
                  class="file-table-content-cell text-truncate"
                  data-coreui-toggle="tooltip"
                  data-coreui-placement="left"
                  :title="fileDataCell"
                >
                  <div class="d-flex align-items-center">
                    {{ console.log('fileDataCell', fileDataCell) }}
                    <img
                      :src="computedTokenImage(fileDataCell)"
                      class="table-cell__img"
                      height=""
                    />
                    <div>{{ fileDataCell }}</div>
                  </div>
                </div>
                <div
                  v-else-if="fileDataCellIndex === 0"
                  class="file-table-content-cell"
                  data-coreui-toggle="tooltip"
                  data-coreui-placement="left"
                  :title="fileDataCell"
                >
                  {{ timestampToDateTime(fileDataCell)[0] }}
                  <br />
                  {{ timestampToDateTime(fileDataCell)[1] }}
                </div>
                <div
                  v-else-if="fileDataCellIndex === 11"
                  class="file-table-content-cell"
                  data-coreui-toggle="tooltip"
                  data-coreui-placement="left"
                  :title="fileDataCell"
                >
                  <div
                    class="text-white"
                    v-if="
                      fileDataCell == 'arbFromTokensWithVault' 
                    "
                  >
                    1inch Fusion
                  </div>
                  <div
                    class="text-white"
                    v-if="
                      fileDataCell == 'arbFromTokensWith1InchAndVault'                    "
                  >
                    1inch
                  </div>
                  <div
                    class="text-white"
                    v-else-if="
                      fileDataCell == 'arbFromTokensWith1InchUniV3AndVault'
                    "
                  >
                    1InchUniV3
                  </div>
                  <div
                    class="text-white"
                    v-else-if="fileDataCell == 'arbFromTokensWithOdosAndVault'"
                  >
                    Odos
                  </div>
                  <div
                    class="text-white"
                    v-else-if="
                      fileDataCell == 'arbFromTokensWithFireBirdAndVault' ||
                      fileDataCell == 'FirebirdAndVault'
                    "
                  >
                    Firebird
                  </div>
                  <div class="text-white" v-else>{{ fileDataCell }}</div>
                </div>
                <div
                  v-else
                  class="file-table-content-cell text-truncate"
                  data-coreui-toggle="tooltip"
                  data-coreui-placement="left"
                  :title="fileDataCell"
                >
                  {{
                    typeof fileDataCell === 'string' &&
                    fileDataCell.includes(' ')
                      ? `${Number(fileDataCell.split(' ')[0]).toFixed(2)}`
                      : typeof fileDataCell === 'number'
                      ? fileDataCell.toFixed(2)
                      : fileDataCell
                  }}
                  <img
                    :src="computedTokenImage(fileDataCell.split(' ')[1])"
                    class="table-cell__img"
                    height=""
                    v-if="
                      typeof fileDataCell === 'string' &&
                      fileDataCell.includes(' ')
                    "
                  />
                </div>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </Table>
      </div>
    </CRow>
  </MainCard>
</template>

<script setup>
import fileData from '@/assets/files_mocks/opportunities.data.json'
import { ref, computed, watch } from 'vue'
import { cilFolder, cilFile } from '@coreui/icons'
import { timestampToDateTime } from '@/lib/helpers/util'
import axios from 'axios'
import { Buffer } from 'buffer'
import moment from 'moment'
import { CBreadcrumb } from '@coreui/vue'
import ChainSelector from '@/UI/ChainSelectorV2.vue'
import info from '@/assets/images/info.svg'
import computedTokenImage from '../../composables/useComputedTokenImage'
import MainCard from '@/UI/MainCard.vue'
import Table from '@/UI/Table.vue'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
// import arb from "@/assets/images/networks/arbitrum2.png";
import Title from '@/UI/Title'
import { useDevice } from '@/composables/adaptive/useDevice'
import bunner from '@/assets/images/warning-bg.jpg'

// const chainSelected = ref('Arbitrum')
const isLoading = ref(true)
const filterIsLoading = ref(false)
const { width } = useDevice()

const foldersActualData = ref()
const foldersMonths = ref([])
const foldersDays = ref([])
const foldersDaysDefault = ref([])
const CSVSingleFileData = ref([])
const CSVSingleFileDataWithZero = ref([])
const CSVSingleFileDataHiddenZero = ref([])
const hideNullOpportunities = ref(true)

const csvData = computed(() =>
  hideNullOpportunities.value
    ? CSVSingleFileDataHiddenZero.value
    : CSVSingleFileDataWithZero.value,
)

const chainSelected = ref({})

watch(
  csvData,
  (_new) => {
    if (_new.length > 0) {
      isLoading.value = false
    }
  },
  {
    deep: true,
  },
)

// For month filtration
const rootFolderSelected = ref()

// const uniqueValues = (nums) => [...new Set(nums)]

const setRootFolderSelected = async (target) => {
  // console.log(target)
  rootFolderSelected.value = target
  // setSubfolderSelected(undefined)
  foldersDays.value = foldersDaysDefault.value
  console.log(foldersDays.value)
  console.log(foldersDays.value.map((el) => moment(el).format('MMMM')))
  foldersDays.value = foldersDays.value.filter(
    (el) => moment(el).format('MMMM') === target,
  )
  foldersDays.value = foldersDays.value
    .sort((a, b) => Date.parse(new Date(a)) - Date.parse(new Date(b)))
    .reverse()
  // console.log("foldersDays.value",foldersDays.value.sort((a, b) => Date.parse(new Date(a)) - Date.parse(new Date(b))).reverse())
  await setFileSelected(undefined)
}

// const subfolderSelected = ref()

// const setSubfolderSelected = (target) => {
//   setFileSelected(undefined)
//   subfolderSelected.value = target
// }

const fileSelected = ref()

const setFileSelected = async (target) => {
  console.log(target)
  fileSelected.value = target

  target === undefined ? '' : await fetchCSVFileInsideFolder(`${target}.json`)
}

const breadcrumbs = computed(() =>
  [
    console.log('BREADCRUMBS', rootFolderSelected.value),
    rootFolderSelected.value
      ? { value: rootFolderSelected.value, action: setRootFolderSelected }
      : null,
    // rootFolderSelected.value && subfolderSelected.value ? {value: subfolderSelected.value, action: !fileSelected.value ? () => {} : null} : null,
    rootFolderSelected.value && fileSelected.value
      ? {
          value: fileSelected.value,
          action: () => {},
        }
      : null,
  ].filter(Boolean),
)

const fileTableHeadCaptions = computed(() =>
  !fileSelected.value || !fileData || !fileData[0]
    ? []
    : Object.getOwnPropertyNames(fileData[0]),
)

async function fetchFoldersData() {
  isLoading.value = true
  const username = process.env.VUE_APP_OPPORTUNITIES_USER
  const password = process.env.VUE_APP_OPPORTUNITIES_PASSWORD
  const token = Buffer.from(`${username}:${password}`, 'utf8').toString(
    'base64',
  )
  try {
    let response = await axios.get(
      chainSelected.value.name === 'Arbitrum'
        ? process.env.VUE_APP_OPPORTUNITIES_ARBITRUM
        : chainSelected.value.name === 'Binance'
        ? process.env.VUE_APP_OPPORTUNITIES_BINANCE
        : chainSelected.value.name === 'Polygon'
        ? process.env.VUE_APP_OPPORTUNITIES_POLYGON
        : process.env.VUE_APP_OPPORTUNITIES_ARBITRUM,
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      },
    )
    // console.log('RESPONSE', response)
    const foldersData = response.data

    const days = SortStringDates(foldersData.map((el) => el.split('.')[0]))
    foldersDays.value = days
    foldersDaysDefault.value = days
    // console.log('days', days)

    const filteredMonths = Array.from(
      new Set(days.map((el) => moment(el).format('MMMM'))),
    )

    foldersMonths.value = filteredMonths.reverse()
    console.log(foldersData)
    foldersActualData.value = foldersData
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    console.log(error)
  }
}

function SortStringDates(dates) {
  const dateObjects = dates.map((dateString) => new Date(dateString))

  // Sort the Date objects
  dateObjects.sort((a, b) => a - b)

  // Convert the sorted Date objects back to string dates
  const sortedDates = dateObjects.map((date) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString()
    const day = date.getDate().toString()
    return `${year}-${month}-${day}`
  })
  return sortedDates
}

async function fetchCSVFileInsideFolder(file) {
  isLoading.value = true
  const username = process.env.VUE_APP_OPPORTUNITIES_USER
  const password = process.env.VUE_APP_OPPORTUNITIES_PASSWORD
  const token = Buffer.from(`${username}:${password}`, 'utf8').toString(
    'base64',
  )
  try {
    let response = await axios.get(
      chainSelected.value.name === 'Arbitrum'
        ? `${process.env.VUE_APP_OPPORTUNITIES_ARBITRUM}/${file}`
        : chainSelected.value.name === 'Binance'
        ? `${process.env.VUE_APP_OPPORTUNITIES_BINANCE}/${file}`
        : chainSelected.value.name === 'Polygon'
        ? `${process.env.VUE_APP_OPPORTUNITIES_POLYGON}/${file}`
        : `${process.env.VUE_APP_OPPORTUNITIES_ARBITRUM}/${file}`,
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      },
    )
    // console.log('RESPONSE', response)
    let CSVFileData = response.data
    CSVSingleFileData.value = []

    // Parse the input JSON string into an object
    const outputData = JSON.stringify(CSVFileData)
      .replace(/\\/g, '')
      .replace(/"{/g, '{')
      .replace(/}"/g, '}')

    CSVFileData = JSON.parse(outputData)
    console.log('CSVFileData', CSVFileData)

    // console.log('chainSelected.value', chainSelected.value)

    const CSVFileDataFiltered = CSVFileData.filter((el) =>
      (el.chain === chainSelected.value.name) === 'Binance'
        ? 'BSC'
        : chainSelected.value.name,
    )
    console.log('CSVFileDataFiltered', CSVFileDataFiltered)

    const CSVDataHideZeroOpp = CSVFileDataFiltered.filter(
      (el) => el.ratio !== 0,
    )
    console.log('CSVDataHideZeroOpp', CSVDataHideZeroOpp)

    CSVSingleFileDataWithZero.value = CSVFileDataFiltered
    CSVSingleFileDataHiddenZero.value = CSVDataHideZeroOpp
  } catch (error) {
    console.log(error)
  }
}

watch(
  () => chainSelected.value.name,
  async () => {
    rootFolderSelected.value = undefined
    await setFileSelected(undefined)

    await fetchFoldersData()
  },
)

fetchFoldersData()
</script>
<style lang="scss">
@import '@/styles/_variables.scss';

.chain-selector {
  margin-bottom: 55px;

  @media (max-width: 1400px) {
    margin-bottom: 20px;
  }
}

.table {
  &-opportunity {
    overflow-x: auto;

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
      background-color: #02120a;
      border-radius: 50px;
      margin-right: 10px;
      margin-left: 10px;
    }

    &::-webkit-scrollbar {
      width: 8px !important;
      height: 8px !important;
      background: #02120a;
    }

    &::-webkit-scrollbar-thumb {
      border: 2px solid #02120a;
      background: #00C9FF;
      border-radius: 21px;
    }

    .table-cell {
      width: 100px !important;

      @media (max-width: $xxl) {
        width: 70px !important;
      }

      &:first-child {
        width: 130px !important;

        @media (max-width: $xxl) {
          width: 90px !important;
        }
      }

      &:nth-child(4) {
        width: 80px !important;
      }

      &:nth-child(6) {
        width: 80px !important;
      }

      &:nth-child(9) {
        width: 80px !important;
      }

      &__img {
        width: 35px;

        @media (max-width: $xxl) {
          width: 20px;
        }
      }
    }

    .table-header-font-folder {
      width: 100px !important;

      @media (max-width: $xxl) {
        width: 70px !important;
      }

      &:first-child {
        width: 130px !important;

        @media (max-width: $xxl) {
          width: 90px !important;
        }
      }

      &:nth-child(4) {
        width: 80px !important;
      }

      &:nth-child(6) {
        width: 80px !important;
      }

      &:nth-child(9) {
        width: 80px !important;
      }
    }

    .file-table-content-container {
      .file-table-content-cell {
        @media (max-width: $xxl) {
          font-size: 10px !important;
        }
      }
    }
  }

  &-choose-opportunity {
    .table-header-font-folder {
      &:nth-child(1) {
        width: 100px;

        @media (max-width: $xxl) {
          width: 50px;
        }
      }

      &:nth-child(2) {
        width: 70% !important;

        @media (max-width: 1200px) {
          width: 40% !important;
        }

        @media (max-width: 767px) {
          width: 30% !important;
        }
      }
    }

    .table-cell {
      &:nth-child(1) {
        width: 100px;

        @media (max-width: $xxl) {
          width: 50px;
        }
      }

      &:nth-child(2) {
        width: 70% !important;

        @media (max-width: 1200px) {
          width: 40% !important;
        }

        @media (max-width: 767px) {
          width: 30% !important;
        }
      }
    }
  }
}
</style>
<style scoped lang="scss">
@import '@/styles/_variables.scss';

.table-opportunity {
  .table-row {
    width: calc(100% + 8px) !important;
  }
}

.header-text {
  font-weight: 600;
}

.root-folders-container {
  margin-top: 30px;
  margin-bottom: 80px;

  @media (max-width: $xxl) {
    margin-bottom: 50px;
  }

  .container {
    display: flex;

    @media (max-width: $md) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 20px;
    }
  }
}

.breadcrumb-item {
  display: flex;
  cursor: pointer;

  &:hover {
    color: #7ef6b2;
  }

  &:before {
    color: #fff;

    @media (max-width: $xxl) {
      font-size: 12px;
    }
  }

  svg {
    margin-right: 12px;
  }
}

.folder {
  border: #7ef6b2 1px solid;
  border-radius: 20px;
  background: transparent;
  padding: 13px 14px;
  width: 274px;
  color: #7ef6b2;

  @media (max-width: $xxl) {
    padding: 6px 14px;
    width: auto;
  }

  @media (max-width: $md) {
    padding: 3px 7px;
    width: 45%;
  }

  &_active {
    background: #00C9FF;
    border: #00C9FF 1px solid;
    color: #fff;

    svg {
      path {
        fill: #fff;
      }
    }
  }

  span {
    margin-left: 16px;
    font-size: clamp(10px, 0.8vw, 14px);
    font-weight: 400;
    line-height: 21px;
    letter-spacing: 0em;
    text-align: left;

    // @media (max-width: $xxl) {
    //   font-size: 12px;
    // }

    // @media (max-width: $md) {
    //   font-size: 10px;
    // }
  }

  &-breadcrumbs {
    display: flex;
    gap: 15px;
    align-items: center;

    @media (max-width: $xxl) {
      gap: 10px;
    }

    &__text {
      
        font-size: clamp(10px, 0.8vw, 14px);
     
    }

    &__icon {
      @media (max-width: $xxl) {
        width: 15px !important;
        height: 15px !important;
      }
    }
  }

  &:hover {
    background-color: rgba(#1f3022, 50%);
  }

  &:not(:first-child) {
    margin-left: 32px;

    @media (max-width: $md) {
      margin-left: 0px;
    }
  }
}

.folder:hover {
  svg {
    path {
      fill: lighten(#7ef6b2, 10%);
    }
  }
}

.file-table-header-container {
  .file-table-header-cell {
    color: #c3c5cb;
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
    width: fit-content;
    max-width: 100%;
  }
}

.file-table-content-container {
  .file-table-content-cell {
    color: #ffffff;
    font-size: 16px;
    font-weight: 400;
    line-height: 19px;
    letter-spacing: 0em;
    width: fit-content;
    max-width: 100%;
  }
}

:deep(.multiselect__tags) {
  background: none !important;
  border-color: #00C9FF !important;
}

:deep(.multiselect__content-wrapper) {
  border-color: #00C9FF !important;
}

:deep(.multiselect__single) {
  background: none !important;
  color: white !important;
}

:deep(.multiselect__option) {
  background: rgb(15, 17, 19) !important;
  color: white !important;
}

:deep(.multiselect__option:hover) {
  background: rgba(1, 180, 126, 0.884) !important;
}

.table {
  &-cell {
    padding: 24px 0 24px 10px;
    width: fit-content;
    text-align: center;
    font-weight: 400;
    white-space: nowrap;

    @media (max-width: $xxl) {
      font-size: 10px;
      padding: 12px 0 12px 10px !important;
    }

    &:first-child {
      padding: 24px 0 24px 45px;
      text-align: left;

      @media (max-width: $xxl) {
        padding: 12px 0 12px 15px !important;
      }

      svg {
        @media (max-width: $xxl) {
          width: 24px !important;
        }
      }
    }

    &:last-child {
      padding: 24px 10px 24px 10px;

      @media (max-width: $xxl) {
        padding: 12px 10px 12px 10px !important;
      }
    }
  }

  &-body {
    display: block;
    overflow-x: hidden;
    max-height: 600px;
    overflow-y: auto;

    .table-row {
      width: 100%;
    }

    &_scroll {
      .table-row {
        width: calc(100% + 8px);
      }
    }

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
      background: #00C9FF;
      border-radius: 21px;
    }
  }

  &-row {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
}

.file-opp-container {
  padding: 0;
  border-radius: 20px;
  outline: 0.5px solid rgba(163, 164, 165, 0.2196078431);
  background: transparent;
}

.warning_container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.warning {
  display: flex;
  width: 55%;
  height: 180px;
  border-radius: 4px 20px 20px 4px;
  padding: 0;
  border: 0.2px solid rgba(1, 180, 126, 0.4);
  background: #02120a;
  box-shadow: 0px 12px 24px 0px rgba(1, 180, 126, 0.2),
    0px 4px 8px 0px rgba(1, 180, 126, 0.3);

  &__bunner {
    border-radius: 4px 0 0 4px;
  }

  &-info {
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    padding: 24px;

    &__title {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 4px;
    }

    &__description {
      font-size: 14px;
      margin-bottom: 12px;
    }
  }
}


.table_files_scrollbar {
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
      background: #00C9FF;
      border-radius: 21px;
    }
}

</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
