<template>
  <div class="feed-header">
    <div class="feed-header__title">
      <div class="feed-header__avatar">
        <img :src="btc" class="feed-header__img">
        <img :src="eth" class="feed-header__img">
      </div>
      <div class="feed-header__name">
        <div class="feed-header__name_head">
          BTC/ETH
        </div>
        <div class="feed-header__name_ratio">
          50%BTC/50%ETH
        </div>
      </div>
    </div>
    <div class="feed-header__lp-price">
      <div class="feed-header__lp-price_value">
        <span>$1,134.86</span>
        <div class="feed-header__lp-price_label">
          <svg xmlns="http://www.w3.org/2000/svg" width="5" height="4" viewBox="0 0 5 4" fill="none">
            <path d="M1.98303 0.665163C2.17942 0.355732 2.63096 0.355733 2.82734 0.665164L4.2978 2.98207C4.50907 3.31496 4.26992 3.75 3.87565 3.75L0.93473 3.75C0.540457 3.75 0.301302 3.31496 0.512574 2.98207L1.98303 0.665163Z" fill="#0CAF60"/>
          </svg>
          3.36%
        </div>
      </div>
      <div class="feed-header__el_title">
        <span>LP Price</span>
      </div>
    </div>
    <div v class="feed-header__el">
      <div class="feed-header__el_value">
        23,653.4
      </div>
      <div class="feed-header__el_title">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
          <g clip-path="url(#clip0_5006_10869)">
            <path d="M8.50255 9.17336L9.53733 10.1147L15.7416 4.47069L16.7779 5.41336L9.53733 12L4.87349 7.75736L5.90974 6.81469L7.46704 8.23136L8.50255 9.17269V9.17336ZM8.50401 7.28802L12.1331 3.98602L13.1664 4.92602L9.53733 8.22802L8.50401 7.28802ZM6.43226 11.058L5.39674 12L0.732908 7.75736L1.76915 6.81469L2.80467 7.75669L2.80393 7.75736L6.43226 11.058Z" fill="#A4A8AB"/>
          </g>
          <defs>
            <clipPath id="clip0_5006_10869">
              <rect width="17.5883" height="16" fill="white"/>
            </clipPath>
          </defs>
        </svg>
        <span>Avg Sell Price</span>
      </div>
    </div>
    <div v class="feed-header__el">
      <div class="feed-header__el_value">
        23,653.4
      </div>
      <div class="feed-header__el_title">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
          <g clip-path="url(#clip0_5006_10869)">
            <path d="M8.50255 9.17336L9.53733 10.1147L15.7416 4.47069L16.7779 5.41336L9.53733 12L4.87349 7.75736L5.90974 6.81469L7.46704 8.23136L8.50255 9.17269V9.17336ZM8.50401 7.28802L12.1331 3.98602L13.1664 4.92602L9.53733 8.22802L8.50401 7.28802ZM6.43226 11.058L5.39674 12L0.732908 7.75736L1.76915 6.81469L2.80467 7.75669L2.80393 7.75736L6.43226 11.058Z" fill="#A4A8AB"/>
          </g>
          <defs>
            <clipPath id="clip0_5006_10869">
              <rect width="17.5883" height="16" fill="white"/>
            </clipPath>
          </defs>
        </svg>
        <span>Avg Sell Price</span>
      </div>
    </div>
    <div v class="feed-header__el">
      <div class="feed-header__el_value">
        23,653.4
      </div>
      <div class="feed-header__el_title">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
          <g clip-path="url(#clip0_5006_10869)">
            <path d="M8.50255 9.17336L9.53733 10.1147L15.7416 4.47069L16.7779 5.41336L9.53733 12L4.87349 7.75736L5.90974 6.81469L7.46704 8.23136L8.50255 9.17269V9.17336ZM8.50401 7.28802L12.1331 3.98602L13.1664 4.92602L9.53733 8.22802L8.50401 7.28802ZM6.43226 11.058L5.39674 12L0.732908 7.75736L1.76915 6.81469L2.80467 7.75669L2.80393 7.75736L6.43226 11.058Z" fill="#A4A8AB"/>
          </g>
          <defs>
            <clipPath id="clip0_5006_10869">
              <rect width="17.5883" height="16" fill="white"/>
            </clipPath>
          </defs>
        </svg>
        <span>Avg Sell Price</span>
      </div>
    </div>
    <div v class="feed-header__el">
      <div class="feed-header__el_value">
        23,653.4
      </div>
      <div class="feed-header__el_title">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
          <g clip-path="url(#clip0_5006_10869)">
            <path d="M8.50255 9.17336L9.53733 10.1147L15.7416 4.47069L16.7779 5.41336L9.53733 12L4.87349 7.75736L5.90974 6.81469L7.46704 8.23136L8.50255 9.17269V9.17336ZM8.50401 7.28802L12.1331 3.98602L13.1664 4.92602L9.53733 8.22802L8.50401 7.28802ZM6.43226 11.058L5.39674 12L0.732908 7.75736L1.76915 6.81469L2.80467 7.75669L2.80393 7.75736L6.43226 11.058Z" fill="#A4A8AB"/>
          </g>
          <defs>
            <clipPath id="clip0_5006_10869">
              <rect width="17.5883" height="16" fill="white"/>
            </clipPath>
          </defs>
        </svg>
        <span>Avg Sell Price</span>
      </div>
    </div>
    <div v class="feed-header__el">
      <div class="feed-header__el_value">
        23,653.4
      </div>
      <div class="feed-header__el_title">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
          <g clip-path="url(#clip0_5006_10869)">
            <path d="M8.50255 9.17336L9.53733 10.1147L15.7416 4.47069L16.7779 5.41336L9.53733 12L4.87349 7.75736L5.90974 6.81469L7.46704 8.23136L8.50255 9.17269V9.17336ZM8.50401 7.28802L12.1331 3.98602L13.1664 4.92602L9.53733 8.22802L8.50401 7.28802ZM6.43226 11.058L5.39674 12L0.732908 7.75736L1.76915 6.81469L2.80467 7.75669L2.80393 7.75736L6.43226 11.058Z" fill="#A4A8AB"/>
          </g>
          <defs>
            <clipPath id="clip0_5006_10869">
              <rect width="17.5883" height="16" fill="white"/>
            </clipPath>
          </defs>
        </svg>
        <span>Avg Sell Price</span>
      </div>
    </div>

  </div>
</template>
<script setup>
import btc from "@/assets/images/tokens/btc.png";
import eth from "@/assets/images/tokens/ether.png";
</script>
<style lang="scss" scoped>
.feed-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 50px;
  &__title {
    display: flex;
    padding-right: 25px;
    border-right: 2px solid #161D26;
  }
  &__img {
    &:not(:first-child) {
      margin-left: -26px;
    }
  }
  &__name {
    &_head {
      font-size: clamp(16px, 0.8vw, 24px);
      color: #fff;
      font-weight: 600;
    }
    &_ratio {
      font-size: clamp(12px, 0.8vw, 16px);
      color: #A4A8AB;
    }
  }
  &__lp-price {
    padding-right: 25px;
    border-right: 2px solid #161D26;
    &_value {
      display: flex;
      align-items: center;
      span {
        font-size: clamp(16px, 0.8vw, 24px);
        color: #fff;
        font-weight: 600;
        margin-right: 10px;
      }
    }
    &_label {
      display: flex;
      align-items: center;
      color: #0CAF60;
      font-size: clamp(8px, 0.8vw, 10px);
      padding: 7px;
      border: 1px solid #0CAF60;
      border-radius: 14px;
      svg {
        margin-right: 4px;
      }
    }
  }
  &__el {
    &:not(:last-child) {
      padding-right: 25px;
      border-right: 2px solid #161D26;
    }
    &_value {
      font-size: clamp(14px, 0.8vw, 18px);
      color: #fff;
      margin-bottom: 8px;
    }
    &_title {
      font-size: clamp(10px, 0.8vw, 14px);
      color: #A4A8AB;
      svg {
        margin-right: 4px;
      }
    }
  }
}
</style>
