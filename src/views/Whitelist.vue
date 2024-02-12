<template>
  <MainCard>
    <div class="mb-4">
      <ChainSelector @updateChain="(newChain) => (chainSelected = newChain)"/>
    </div>
    <Title :title="'Whitelist'">
      <VTooltip :distance="0" :placement="'right'">
        <div style="cursor: help">
          <img :src="info" class="info_icon"/>
        </div>
        <template #popper>
          <div style="
                      background: linear-gradient(
                        rgba(89, 89, 89, 0.75),
                        rgba(73, 73, 73, 0.15)
                      );
                      backdrop-filter: blur(10px);
                      padding: 10px;
                      border-radius: 4px;
                      width: 400px;
                    ">
            <div style="font-size:clamp(10px, 0.9vw, 16px)">Information</div>
            <div style="display: flex; flex-direction: column; font-size: clamp(10px, 0.8vw, 14px);">
              <div>Name: Full name of the asset along with used abbreviation</div>
              <div>Price: Current market price of the asset</div>
              <div>Price Variation : Asset's price has changed in the last 24 hours.</div>
              <div>Volume: Trading volume for the asset over the past 24 hours.</div>
            </div>
          </div>
        </template>
      </VTooltip>
    </Title>
    <div class="table-wrapper">
      <Table class="table_top-trading-tokens" :headers="['Name', 'Blockhain', 'Address']">
        <div v-if="whitelists.length === 0" style="height: 500px">
          <LoaderPulse/>
        </div>
        <CTableBody v-if="whitelists.length > 0" class="table-body"
                    :class="{ 'table-body_scroll': whitelists.length > 6 }">
          <CTableRow v-for="item in whitelists" :key="item" class="table-row">

            <CTableDataCell class="align-middle table-cell">
              <div class="text-truncate file-table-cell">
                {{ item['name'] }}
              </div>
            </CTableDataCell>
            <CTableDataCell class="align-middle table-cell">
              <div class="text-truncate file-table-cell">
                  <img style="width: 15px; margin-right: 5px;" v-if="item['blockchain'] == 'Arbitrum'" :src="arb" alt="" />
                  <img style="width: 15px; margin-right: 5px;" v-else-if="item['blockchain'] == 'Binance'" :src="binance" alt="" />
                  <img style="width: 15px; margin-right: 5px;" v-else-if="item['blockchain'] == 'Polygon'" :src="polygon" alt="" />
                {{ item['blockchain'] }}
              </div>
            </CTableDataCell>
            <CTableDataCell class="align-middle table-cell">
              <div class="text-truncate file-table-cell">
                {{ item['address'] }}
              </div>
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </Table>
    </div>
    <Title :title="'Add Wallet'">
      <VTooltip :distance="0" :placement="'right'">
        <div style="cursor: help">
          <img :src="info" class="info_icon"/>
        </div>
        <template #popper>
          <div style="
                      background: linear-gradient(
                        rgba(89, 89, 89, 0.75),
                        rgba(73, 73, 73, 0.15)
                      );
                      backdrop-filter: blur(10px);
                      padding: 10px;
                      border-radius: 4px;
                      width: 400px;
                    ">
            <div style="font-size:clamp(10px, 0.9vw, 16px)">Information</div>
            <div style="display: flex; flex-direction: column; font-size: clamp(10px, 0.8vw, 14px);">
              <div>Name: Full name of the asset along with used abbreviation</div>
              <div>Price: Current market price of the asset</div>
              <div>Price Variation : Asset's price has changed in the last 24 hours.</div>
              <div>Volume: Trading volume for the asset over the past 24 hours.</div>
            </div>
          </div>
        </template>
      </VTooltip>
    </Title>
    <div class="add-card">
      <div class="add-card__title">
        Choose Blockchain
      </div>
      <div class="add-selector" @click="isBlockchainSelectorActive = !isBlockchainSelectorActive"
           :class="{ 'add-selector_active': isBlockchainSelectorActive }">
        <div class="add-selector__selected">
          <img class="add-selector__img" :src="selectedDeploymentBlockchain.img">
          <span class="add-selector__title">{{ selectedDeploymentBlockchain.title }} Blockchain</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="20" viewBox="0 0 25 20" fill="none">
            <path
                d="M7.76062 8.6834C7.76062 8.52978 7.83099 8.37617 7.98178 8.25489C8.2733 8.02042 8.75583 8.02042 9.04736 8.25489L12.0631 10.6804L15.0789 8.25489C15.3705 8.02042 15.853 8.02042 16.1445 8.25489C16.436 8.48936 16.436 8.87745 16.1445 9.11191L12.5959 11.966C12.3044 12.2004 11.8219 12.2004 11.5304 11.966L7.98178 9.11191C7.83099 8.99064 7.76062 8.83702 7.76062 8.6834Z"
                fill="#818181"/>
          </svg>
        </div>
        <div class="add-selector__options" v-if="isBlockchainSelectorActive">
          <div class="add-selector__el" v-for="item in blockchainSelectorOptions"
               @click="selectedDeploymentBlockchain = item" :key="item.title">
            <img class="add-selector__img" :src="item.img">
            <span class="add-selector__title">{{ item.title }} Blockchain</span>
          </div>
        </div>
      </div>
      <div class="add-card__title">
        New Address
      </div>
      <div class="add-card__input">
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
          <path d="M8.5 10.875H3.35417C2.82926 10.875 2.32585 10.6665 1.95468 10.2953C1.58352 9.92415 1.375 9.42074 1.375 8.89583C1.375 8.37093 1.58352 7.86752 1.95468 7.49635C2.32585 7.12519 2.82926 6.91667 3.35417 6.91667H3.75M10.875 8.5V13.6458C10.875 14.1707 10.6665 14.6742 10.2953 15.0453C9.92415 15.4165 9.42074 15.625 8.89583 15.625C8.37093 15.625 7.86752 15.4165 7.49635 15.0453C7.12519 14.6742 6.91667 14.1707 6.91667 13.6458V13.25M8.5 6.125H13.6458C14.1707 6.125 14.6742 6.33352 15.0453 6.70468C15.4165 7.07585 15.625 7.57926 15.625 8.10417C15.625 8.62907 15.4165 9.13248 15.0453 9.50365C14.6742 9.87481 14.1707 10.0833 13.6458 10.0833H13.25M6.125 8.5V3.35417C6.125 2.82926 6.33352 2.32585 6.70468 1.95468C7.07585 1.58352 7.57926 1.375 8.10417 1.375C8.62907 1.375 9.13248 1.58352 9.50365 1.95468C9.87481 2.32585 10.0833 2.82926 10.0833 3.35417V3.75" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <input type="text" placeholder="0x5F948D65dB10e40A066cdf60ec9C345A412a0cfF" v-model="address">
      </div>
      <div class="add-card__button">
        Whitelist
      </div>
    </div>
  </MainCard>
</template>
<script setup>
import MainCard from "@/UI/MainCard.vue";
import ChainSelector from "@/UI/ChainSelectorV2.vue";
import {ref} from "vue";
import Title from "@/UI/Title.vue";
import info from "@/assets/images/info.svg";
import Table from "@/UI/Table.vue";
import LoaderPulse from "@/components/loaders/LoaderPulse.vue";
import arb from '@/assets/images/networks/arbitrum.png'
import polygon from '@/assets/images/networks/polygon.png'
import binance from '@/assets/images/networks/binance2.png'

const chainSelected = ref({})

const whitelists = ref([
  {
    name: 'Client 1',
    blockchain: 'Polygon',
    address: '0x5F948D65dB10e40A066cdf60ec9C345A412a0cfF'
  },
  {
    name: 'FE Address',
    blockchain: 'Binance',
    address: '0x5F948D65dB10e40A066cdf60ec9C345A412a0cfF'
  },
  {
    name: 'D3 Adress 1',
    blockchain: 'Arbitrum',
    address: '0x5F948D65dB10e40A066cdf60ec9C345A412a0cfF'
  },
])
const isBlockchainSelectorActive = ref(false)
const blockchainSelectorOptions = [
  {
    title: 'Polygon',
    img: polygon
  },
  {
    title: 'Binance',
    img: binance
  },
  {
    title: 'Arbitrum',
    img: arb
  }

]
const selectedDeploymentBlockchain = ref(blockchainSelectorOptions[0])

const address =ref('')
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.add {
  &-card {
    padding: 20px 14px 40px 14px;
    border-radius: 20px;
    border: 1px solid rgba(163, 164, 165, 0.20);
    display: flex;
    width: 50%;
    flex-direction: column;
    align-items: start;
    &__title {
      font-size: clamp(12px, 0.9vw, 14px);
      color: #fff;
      margin-bottom: 10px;
    }
    &__input {
      border-radius: 10px;
      border: 1px solid #00C9FF;
      padding: 15px 20px;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      width: 100%;
      svg {
        margin-right: 10px;
      }
      input {
        color: #fff;
        border: none;
        outline: none;
        background: none;
        font-size: clamp(12px, 0.9vw, 14px);
        width: 100%;
        &::placeholder {
          color: rgba(255, 255, 255, 0.19);;
        }
      }
    }
    &__button {
      color: #fff;
      padding: 10px 15px;
      border-radius: 10px;
      background: linear-gradient(153deg, #BC5F04 0%, #000 100%);
      cursor: pointer;
      font-size: clamp(12px, 0.9vw, 14px);
    }
  }
  &-selector {
    cursor: pointer;
    position: relative;
    width: 250px;
    margin-bottom: 20px;
    svg {
      transition-duration: 0.2s;
    }

    &_active {
      .deployment-selector__selected {
        border-radius: 10px 10px 0 0;
      }

      svg {
        transform: rotate(180deg);
        transform-origin: center;
      }
    }

    &__selected {
      display: flex;
      align-items: center;
      border-radius: 10px;
      padding: 12px;
      background: rgba(1, 180, 126, 0.08);
    }

    &__img {
      margin-right: 15px;
      width: 32px;
      height: 32px;
    }

    &__title {
      margin-right: 10px;
      color: #fff;
      font-size: clamp(12px, 0.9vw, 14px);
      white-space: nowrap;
    }

    &__options {
      position: absolute;
      z-index: 1000;
      top: 56px;
      left: 0;
      width: 100%;
    }

    &__el {
      background: #00130e;
      padding: 12px;
      align-items: center;
      display: flex;
      user-select: none;

      &:hover {
        background: lighten(#00130e, 0.5);
      }

      &:last-child {
        border-radius: 0 0 10px 10px;

      }
    }
  }
}
:deep(.table-header-font-folder) {
  &:first-child {
    width: 600px !important;
    @media (max-width: 1300px) {
      width: auto !important;
    }
  }
}
.table {
  &-body {
    display: block;
    max-height: 500px;
    overflow-x: hidden;
    overflow-y: auto;

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
    border-color: transparent;
    width: 100%;
    display: table;
    table-layout: fixed;
  }

  &-cell {
    padding: 24px 0 24px 10px !important;
    width: fit-content;
    text-align: center;
    font-weight: 400;
    white-space: nowrap;
    font-size: 14px;
    overflow: visible;

    @media (max-width: $xxl) {
      font-size: 10px;
      padding: 12px 0 12px 10px !important;
    }

    &:first-child {
      padding: 24px 0 24px 45px !important;
      text-align: left;
      width: 600px;
      @media (max-width: $xxl) {
        padding: 12px 0 12px 15px !important;
      }
      @media (max-width: 1300px) {
        width: auto !important;
      }
    }

    &:last-child {
      padding: 24px 10px 24px 10px !important;

      @media (max-width: $xxl) {
        padding: 12px 10px 12px 10px !important;
      }
    }
  }

  &-wrapper {
    padding: 0;
    border-radius: 20px;
    outline: 0.5px solid rgba(163, 164, 165, 0.2196078431);
    background: transparent;
    width: 100%;
    overflow-x: auto;
    margin-bottom: 50px;

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
      background-color: #02120a;
      border-radius: 50px;
    }

    &::-webkit-scrollbar {
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
}
</style>
