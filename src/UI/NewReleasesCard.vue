<template>
  <div class="release">
    <div class="release-info">
      <div class="d-flex justify-content-between w-100 align-items-center">
      <div class="release-info__title" >
        About Update
      </div>
      <div class="release_verison">
        V2.3.6
      </div>
    </div>
   

      <div class="release-info__description" >
        <ol style="padding-inline-start: 20px !important;">
          <li>Fixed UI data Display Issues</li>
          <li>Implemented new Trading startegies</li>
          <li>Improve loading experience</li>
          <li>Added new Pools</li>
        </ol>
      </div>
   
      <div class="release-info__button" @click="checkNewRelease">
        Enter Dark Pool
      </div>
     

    </div>
   
  </div>
</template>

<script setup>

import {defineProps} from 'vue'

defineProps([
  'newReleaseCheck',

])

function checkNewRelease() {
  localStorage.setItem('release', "checked")
  window.location.reload()

}


</script>

<style lang="scss" scoped>
.release {
  display: flex;
  position: absolute;
  width: 460px;
  height: auto;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -30%);
  border-radius: 20px 20px;
  padding: 0;
  z-index: 10;
  border: 0.2px solid rgba(1, 180, 126, 0.40);
  background: linear-gradient(210.96deg, rgba(1, 180, 126, 0.61) 0.01%, rgba(1, 180, 126, 0.7) 39.58%, rgba(0, 0, 0, 0) 104.81%);
  box-shadow: 0px 48px 69px 0px #000000D8;

  &__verison {
   
font-size: clamp(18px, 0.8vw, 40px);
font-weight: 600;
line-height: 60px;
letter-spacing: 0em;


  }


  &-info {
    color: #FFFFFF;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    width: 100%;
    padding: 34px;

    &__title {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 4px;
    }

    &__description {
      padding-top: 20px;
      font-size: 14px;
      margin-bottom: 12px;
    }

    &__button {
      padding: 8px;
      font-size: 12px;
      color: white;
      border: 0px;
      background: linear-gradient(89.26deg, #00C9FF 5.07%, #7EF6B2 99.37%);
      width: 100%;
      border-radius: 20px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      // transition-duration: 0.3s;
      text-shadow: 1px 1px 2px black;
      &:hover {
        color: #fff;
        background: #7EF6B2;
        box-shadow: 0px 12px 24px 0px rgba(#00C9FF, 0.20), 0px 4px 8px 0px rgba(#7EF6B2, 0.30);
      }
    }
  }
}
</style>
