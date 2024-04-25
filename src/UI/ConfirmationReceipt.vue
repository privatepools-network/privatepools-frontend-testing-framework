<template>
  <div class="d-flex justify-content-center flex-column gap-5 w-100 align-items-center my-5">
    <div class="header_text">
      <h3>{{ header_text }}</h3>
    </div>
    <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M36.9987 0.333008C16.7587 0.333008 0.332031 16.7597 0.332031 36.9997C0.332031 57.2397 16.7587 73.6663 36.9987 73.6663C57.2387 73.6663 73.6654 57.2397 73.6654 36.9997C73.6654 16.7597 57.2387 0.333008 36.9987 0.333008ZM27.062 52.7297L13.8987 39.5663C13.5592 39.2269 13.29 38.8239 13.1062 38.3803C12.9225 37.9368 12.828 37.4614 12.828 36.9813C12.828 36.5013 12.9225 36.0259 13.1062 35.5824C13.29 35.1388 13.5592 34.7358 13.8987 34.3963C14.2382 34.0569 14.6412 33.7876 15.0847 33.6039C15.5282 33.4202 16.0036 33.3256 16.4837 33.3256C16.9638 33.3256 17.4392 33.4202 17.8827 33.6039C18.3262 33.7876 18.7292 34.0569 19.0687 34.3963L29.6654 44.9563L54.892 19.7297C55.5776 19.0441 56.5075 18.6589 57.477 18.6589C58.4466 18.6589 59.3764 19.0441 60.062 19.7297C60.7476 20.4153 61.1328 21.3451 61.1328 22.3147C61.1328 23.2842 60.7476 24.2141 60.062 24.8997L32.232 52.7297C31.8928 53.0696 31.4899 53.3393 31.0463 53.5233C30.6028 53.7073 30.1272 53.802 29.647 53.802C29.1668 53.802 28.6913 53.7073 28.2477 53.5233C27.8042 53.3393 27.4012 53.0696 27.062 52.7297Z"
        fill="#00C9FF" />
    </svg>
    <div class="header_subtext">
      <h6>{{ header_subtext }}</h6>
    </div>

    <div class="d-flex gap-5 justify-content-center align-items-center">
      <a class="compose_pool_connect_wallet" :href="link" target="_blank">
        <div class="d-flex align-items-center gap-2">
          Receipt
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_5891_8743)">
              <path
                d="M10.5 7.58333V11.0833C10.5 11.3928 10.3771 11.6895 10.1583 11.9083C9.9395 12.1271 9.64275 12.25 9.33333 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V4.66667C1.75 4.35725 1.87292 4.0605 2.09171 3.84171C2.3105 3.62292 2.60725 3.5 2.91667 3.5H6.41667"
                stroke="white" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8.75 1.75H12.25V5.25" stroke="white" stroke-width="1.16667" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M5.83203 8.16667L12.2487 1.75" stroke="white" stroke-width="1.16667" stroke-linecap="round"
                stroke-linejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_5891_8743">
                <rect width="14" height="14" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </a>

      <div class="compose_pool_connect_wallet" @click="router.go()">
        Pool Page
      </div>
    </div>
  </div>
</template>
<script setup>
import router from '@/router';
import { defineProps } from 'vue'

defineProps(['header_text', 'header_subtext', "link"])
</script>
<style lang="scss" scoped>
.header_text {
  font-family: Montserrat;
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: -0.5px;
  color: white;
}

.header_subtext {
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: -0.5px;
  color: white;
}

.compose_pool_connect_wallet {
  margin-top: 8px;
  padding: 10px 20px;
  font-size: 12px;
  color: white;
  border: 0px;
  background: linear-gradient(89.26deg, #00C9FF 5.07%, #7ef6b2 99.37%);
  //   width: 100%;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  // transition-duration: 0.3s;
  text-shadow: 1px 1px 2px black;

  &:hover {
    color: #fff;
    background: #00C9FF;
    box-shadow: 0px 12px 24px 0px rgba(#00C9FF, 0.2),
      0px 4px 8px 0px rgba(#00C9FF, 0.3);
  }
}
</style>
