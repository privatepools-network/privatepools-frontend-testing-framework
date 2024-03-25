<template>
  <div class="manage-pools-filters">
    <div v-if="width > 768">
      <div
        class="button d-flex align-items-center justify-content-evenly gap-2"
        :style="
          composePoolDropdownOpen === true
            ? 'border-radius: 8px 8px 0px 0px;'
            : ''
        "
        @click="composePoolDropdownOpen = !composePoolDropdownOpen"
      >
        Compose Pool
        <svg
          :style="composePoolDropdownOpen ? 'transform: rotate(180deg)' : ''"
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.22502 5.74172L4.99166 2.50836L1.75832 5.74172C1.43332 6.06672 0.908323 6.06672 0.583323 5.74172C0.258324 5.41672 0.258324 4.89169 0.583323 4.56669L4.40832 0.74169C4.73332 0.41669 5.25832 0.41669 5.58332 0.74169L9.40835 4.56669C9.73335 4.89169 9.73335 5.41672 9.40835 5.74172C9.08335 6.05839 8.55002 6.06672 8.22502 5.74172Z"
            fill="#00C9FF"
          />
        </svg>
      </div>
      <div
        v-if="composePoolDropdownOpen === true"
        class="compose_pool_dropdown"
      >
        <div
          @click="onClickConcentratedPool"
          class="compose_pool_dropdown_text"
        >
          CL Pools
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 2.5V9.5"
              stroke="#F8F8F8"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M2.5 6H9.5"
              stroke="#F8F8F8"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div @click="onClick" class="compose_pool_dropdown_text">
          Weighted Pools
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 2.5V9.5"
              stroke="#F8F8F8"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M2.5 6H9.5"
              stroke="#F8F8F8"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import router from '@/router'
import { useDevice } from '@/composables/adaptive/useDevice'

const { width } = useDevice()

const composePoolDropdownOpen = ref(false)

const onClick = () => {
  router.push('/pools/compose')
}
const onClickConcentratedPool = () => {
  router.push('/pools/concentrated_pool')
}
</script>
<style lang="scss" scoped>
.manage-pools {
  &-filters {
    display: flex;
    align-items: end;
    gap: 16px;

    @media all and (max-width: 767px) {
      width: 100%;
      margin-top: 20px;
      align-items: flex-start;
    }
  } 
}


.button {
  border-radius: 16px;
  border: 1px solid #2abdff;
  box-shadow: 0px 0px 4.600000381469727px 0px #00affe;
  width: 143px;
  color: white;
  font-weight: 600;
  padding: 7px 13px;
  font-size: 12px;
  display: inline-block;
  cursor: pointer;


}


.compose_pool_dropdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 100;
  position: absolute;
  background: black;
  padding: 11.5px;
  font-family: Segoe UI;
  font-size: 13px;
  font-weight: 600;
  line-height: 19px;
  letter-spacing: 0em;
  color: #ffffff;
  border-radius: 0px 0px 8px 8px;
  border: 1px solid #2abdff;
  box-shadow: 0px 0px 4.600000381469727px 0px #00affe;

  &_text {
    display: flex;
    align-items: center;
    gap: 4px;
    &:hover {
      color: #00c9ff;
      cursor: pointer;
    }
  }
}
</style>
