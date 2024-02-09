<template>
  <div class="pools-pagination">
    <div class="pools-pagination__page-num">
      <div
        style="display: flex; align-items: center; gap: 7px; color: white"
      >
        <div class="pools-pagination__text">Show:</div>
        <div>
          <div class="pagination-select">
            <div class="pagination-select__title" :class="{'pagination-select__title_active':isPerPageSelectOpened==true}" @click="isPerPageSelectOpened=!isPerPageSelectOpened">
              {{perPage}}
              <svg style="margin-left: 10px;" xmlns="http://www.w3.org/2000/svg" width="11" height="7" viewBox="0 0 11 7" fill="none">
                <path d="M0.929932 1.16992L5.42993 5.66992L9.92993 1.16992" stroke="#00C9FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="pagination-select__wrapper" :class="{'pagination-select__wrapper_active':isPerPageSelectOpened==true}">
              <div class="pagination-select__option" v-for="item in perPageOptions" :key="item" @click="$emit('changePerPage', item), isPerPageSelectOpened=false">
                {{item}}
              </div>
            </div>
          </div>
        </div>
        <div class="pools-pagination__text">Records</div>
      </div>
    </div>
    <div
      v-if="totalPage !== 0"
      style="display: flex; gap: 5px; justify-content: end; align-items: center"
    >
      <CButton
     
        :disabled="currentPage === 1"
        @click="$emit('changePage', {isEquating: true, num: 1})"
        style="border-radius: 20px;color: #00C9FF !important;border: 1px solid #00C9FF;font-size: clamp(10px, 0.8vw, 12px);padding: 4px 8px;"
      >First</CButton
      >
      <CButton
        :disabled="currentPage === 1"
        @click="$emit('changePage', {isEquating: false, num: -1})"
        style="border-radius: 15px;color: #00C9FF !important;border: 1px solid #00C9FF;background: linear-gradient(152.97deg, #001A29 0%, #00C9FF 100%);
;font-size: clamp(10px, 0.8vw, 12px);padding: 4px 10px;"

      >
        <svg
          width="7"
          height="10"
          viewBox="0 0 7 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.53 4.53442L4.69501 0.347936C4.9097 0.154714 5.23174 0.154714 5.42496 0.347936L5.91875 0.841727C6.11198 1.03495 6.11198 1.35699 5.91875 1.57168L2.61251 4.87793L5.91875 8.20564C6.11198 8.42033 6.11198 8.74237 5.91875 8.93559L5.42496 9.42938C5.23174 9.62261 4.9097 9.62261 4.69501 9.42938L0.53 5.2429C0.336777 5.04968 0.336777 4.72764 0.53 4.53442Z"
            fill="#fff"
          />
        </svg>
      </CButton>
      <CButton class="border-success text-white" style="border-radius: 20px;
      border: 1px solid #00C9FF !important;color: #FFFFFF !important;font-size: clamp(10px, 0.8vw, 12px);padding: 4px 10px;">{{ currentPage }}</CButton>
     {{ console.log('totalPage', pools) }}
     <CButton
        :disabled="currentPage >= totalPage / perPage"
        @click="$emit('changePage', {isEquating: false, num: 1})"
        style="border-radius: 15px;color: #00C9FF !important;border: 1px solid #00C9FF;background: linear-gradient(152.97deg, #001A29 0%, #00C9FF 100%);
;font-size: clamp(10px, 0.8vw, 12px);padding: 4px 10px;"
      >
        <svg
          width="7"
          height="10"
          viewBox="0 0 7 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.26861 5.2429L2.10359 9.42938C1.8889 9.62261 1.56687 9.62261 1.37364 9.42938L0.879853 8.93559C0.686631 8.74237 0.686631 8.42033 0.879853 8.20564L4.1861 4.87793L0.879853 1.57168C0.686631 1.35699 0.686631 1.03495 0.879853 0.841727L1.37364 0.347936C1.56687 0.154714 1.8889 0.154714 2.10359 0.347936L6.26861 4.53442C6.46183 4.72764 6.46183 5.04968 6.26861 5.2429Z"
            fill="#fff"
          />
        </svg>
      </CButton>

      <CButton
       
        style="border-radius: 20px;color: #00C9FF !important;border: 1px solid #00C9FF;font-size: clamp(10px, 0.8vw, 12px);padding: 4px 8px;"
        :disabled="currentPage === Math.ceil(totalPage / perPage)"
        @click="$emit('changePage', {isEquating: true, num: Math.ceil(totalPage / perPage)})"
      >Last
      </CButton>
    </div>
  </div>
</template>

<script setup>
import {defineProps, toRefs, ref} from 'vue'

const props = defineProps({
  perPage: Number,
  pools: Array,
  totalPage: Number,
  currentPage: Number,
  perPageOptions: Array,
})
const {perPage, pools, currentPage, perPageOptions} = toRefs(props)
console.log("pools are ", pools);
const isPerPageSelectOpened = ref(false)
</script>

<style lang="sass">
.pools-pagination
  display: flex
  justify-content: space-between
  margin-bottom: 30px
  .form-select
    background-color: #000
  &__text
    font-size: 15px
    color: #ffffff
    font-weight: 400
    font-family: Poppins
    @media (max-width: 1400px)
      font-size: 12px
.pagination-select
  position: relative
  cursor: pointer
  &__wrapper
    position: absolute
    border: 1px solid #00C9FF
    width: 100%
    border-radius: 10px 10px 0 0
    top: -79px
    background: #02120a
    display: none
    @media (max-width: 1400px)
      top: -69px
    &_active
      display: block
  &__title
    padding: 4px 8px
    border-radius: 20px
    font-size: 12px
    border: 1px solid #00C9FF
    @media (max-width: 1400px)
      font-size: 10px
    &_active
      border-radius: 0 0 20px 20px
  &__option
    padding: 4px 8px
    width: 100%
    font-size: 12px
    @media (max-width: 1400px)
      font-size: 10px
</style>
