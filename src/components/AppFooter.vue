<template>
  <CFooter :class="'footer dark:!bg-[#0c0c0c3d] !bg-[#F8F8F8]'">
    <div class="flex justify-between items-center w-full">
      <div class="flex flex-col">
        <img :src="PrivatePoolsLogo" width="140" class="mb-6" />
        <div class="text-black dark:!text-[#DCEEF680] mb-8 w-4/5 md:w-1/2">
          A new ecosystem, purpose built to generate yield from Arbitrage
          opportunities.
        </div>
        <div  v-if="width <= 768" class="mb-4"><ExternalLinks/></div>
        
        <div class="flex gap-2 w-100">
          <a href="https://x.com/PrivatePoolDeFi" target="_blank">
            <div class="link_logo">
              <img :src="twitterIcon" />
            </div>
          </a>
       <!--   <a href="https://linktr.ee/privatepoolsnetwork" target="_blank">
            <div class="link_logo">
              <img :src="discordIcon" />
            </div>
          </a>
          <a href="https://medium.com/@privatepoolnetwork" target="_blank">
            <div class="link_logo">
              <img :src="mediumIcon" />
            </div>
          </a>
          <a href="https://linktr.ee/privatepoolsnetwork" target="_blank">
            <div class="link_logo">
              <img :src="telegramIcon" />
            </div>
          </a> -->
        </div>
      </div>

      <div v-if="width > 768">
       <ExternalLinks/>
      </div>
    </div>
    <div class="flex justify-between mt-9 w-full">
      <div class="font-['Syne',_sans-serif] text-[12px] md:text-[14px] text-black dark:!text-white">
        © {{ new Date().getFullYear() }} Private Pools Network
      </div>

      <a href="https://d3.dev" class="text-decoration-none" target="_blank">
        <div
          class="font-['Syne',_sans-serif] text-[12px] md:text-[14px] text-black dark:!text-white flex gap-1"
        >
          Powered by D3
          <svg
            width="34"
            height="29"
            viewBox="0 0 34 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_1_2504)">
              <path
                d="M16.1975 20.4538C15.8754 20.253 15.6272 19.9531 15.4901 19.5992C15.3531 19.2452 15.3347 18.8564 15.4376 18.4911L18.1643 9.12716C18.2844 8.76316 18.5399 8.45931 18.878 8.27857C19.216 8.09782 19.6106 8.05404 19.98 8.15628C20.1623 8.19535 20.3347 8.27106 20.4867 8.37881C20.6388 8.48657 20.7674 8.62412 20.8646 8.7831C20.9619 8.94209 21.0258 9.11918 21.0525 9.30363C21.0792 9.48809 21.0681 9.67604 21.0199 9.85608L19.0482 16.6163L25.9913 11.9488C26.2121 11.8084 26.3952 11.6163 26.5248 11.389C26.6545 11.1618 26.7267 10.9064 26.7353 10.6449C26.7438 10.3835 26.6885 10.1239 26.574 9.88867C26.4595 9.65345 26.2894 9.44971 26.0783 9.29514L21.0949 5.50159C20.946 5.3931 20.8213 5.25469 20.729 5.09523C20.6366 4.93576 20.5786 4.75877 20.5587 4.57558C20.5387 4.39239 20.5573 4.20706 20.6131 4.03145C20.6689 3.85584 20.7608 3.69384 20.8829 3.55582C21.1426 3.26871 21.5002 3.08903 21.8855 3.05203C22.2709 3.01503 22.6561 3.12339 22.9657 3.35584L27.9511 7.1554C28.5108 7.56544 28.9621 8.10584 29.2657 8.72973C29.5694 9.35362 29.7163 10.0422 29.6936 10.7357C29.6709 11.4292 29.4794 12.1066 29.1357 12.7094C28.792 13.3121 28.3064 13.8219 27.7211 14.1946L18.4372 20.4338C18.1054 20.653 17.7172 20.7714 17.3195 20.7746C16.9219 20.7778 16.5318 20.6657 16.1965 20.4518L16.1975 20.4538ZM10.7301 17.4132L5.74473 13.6136C5.18499 13.2035 4.73374 12.663 4.43011 12.039C4.12647 11.415 3.97962 10.7264 4.00227 10.0329C4.02493 9.33932 4.21641 8.66175 4.56012 8.05893C4.90383 7.45611 5.38939 6.94621 5.9747 6.57346L15.2596 0.341202C15.5913 0.121761 15.9796 0.00326089 16.3773 6.63363e-05C16.775 -0.00312822 17.1651 0.10912 17.5003 0.323204C17.8224 0.523981 18.0707 0.823884 18.2077 1.17783C18.3447 1.53178 18.3632 1.92064 18.2602 2.28597L15.5336 11.6489C15.4122 12.0123 15.1563 12.3154 14.8185 12.4962C14.4806 12.6769 14.0865 12.7215 13.7168 12.6207C13.5346 12.5816 13.3623 12.5058 13.2103 12.398C13.0583 12.2902 12.9298 12.1526 12.8326 11.9937C12.7354 11.8347 12.6714 11.6577 12.6447 11.4733C12.6179 11.2889 12.6289 11.101 12.6769 10.921L14.6487 4.16175L7.7025 8.8212C7.48347 8.96372 7.3018 9.15667 7.17271 9.38388C7.04362 9.61109 6.97088 9.86593 6.96059 10.127C6.95327 10.3879 7.0092 10.6466 7.12359 10.8812C7.23799 11.1157 7.40745 11.3191 7.61751 11.4739L12.5999 15.2674C12.7491 15.3757 12.874 15.5141 12.9665 15.6735C13.059 15.833 13.1172 16.0101 13.1371 16.1933C13.1571 16.3766 13.1385 16.5621 13.0825 16.7377C13.0264 16.9133 12.9343 17.0753 12.8119 17.2132C12.668 17.3752 12.4911 17.5044 12.2931 17.5924C12.0952 17.6803 11.8807 17.7249 11.664 17.7231C11.3272 17.7247 10.9992 17.6158 10.7301 17.4132Z"
                fill="url(#paint0_linear_1_2504)"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_1_2504"
                x="0"
                y="0"
                width="33.6959"
                height="28.7747"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_1_2504"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_1_2504"
                  result="shape"
                />
              </filter>
              <linearGradient
                id="paint0_linear_1_2504"
                x1="16.8479"
                y1="0"
                x2="16.8479"
                y2="20.7746"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#B8F081" />
                <stop offset="1" stop-color="#64F9C8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </a>
    </div>
  </CFooter>
</template>

<script setup>
import PrivatePoolsLogo from '@/assets/icons/PrivatePoolsLogo.svg'
import telegramIcon from '@/assets/icons/Footer/telegram.svg'

import contactIcon from '@/assets/icons/Footer/contact.svg'
import discordIcon from '@/assets/icons/Footer/discord.svg'
import githubIcon from '@/assets/icons/Footer/github.svg'
import mediumIcon from '@/assets/icons/Footer/medium.svg'
import twitterIcon from '@/assets/icons/Footer/twitter.svg'
import { useDevice } from '@/composables/adaptive/useDevice'
import ExternalLinks from '@/components/Footer/ExternalLinks.vue'

const { width } = useDevice()

</script>
<style lang="scss" scoped>
.footer {
  backdrop-filter: blur(10px);
  border: none;
  width: 100%;
  padding: 30px 80px;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  @media (max-width:768px) {
    padding: 20px;
  }
}

.link_logo {
  width: 44px;
  height: 44px;
  background: #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #00c8ff5b;
  }
}

.link_logo:hover svg path {
  fill: #00c9ff;
}

.footer_text {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  // color: #FFFFFF;
  &:hover {
    cursor: pointer;
  }
}

.footer_text_svg:hover {
  color: #00c9ff;
}
.footer_text_svg:hover svg path {
  fill: #00c9ff;
}
</style>
