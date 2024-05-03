<template>
  <Dropdown :distance="4" :placement="'bottom-center'">
        <div class="button_drop dark:!bg-[#02031C] bg-[#DCEEF6] text-black dark:!text-white" style="padding: 10px">
          <img :src="walletPoolsImg" />

          $1.23
        </div>
        <template #popper>
            <div class="header__popup bg-white dark:!bg-[#02031C]">
              <h4 
                class="text-[14px] text-black dark:!text-[#626262] mb-[10px]"
                >
                PPN {{ $t('token') }}
              </h4>
              <div class="rewards_inside bg-[white] dark:!bg-[#22222224] text-black dark:!text-white">
                <div  class="text-[12px] text-black dark:!text-[#626262]">
                  PPN {{ $t('price') }}
                </div>
                <div class="rewards_numbers">
                  $1.2345
             
                </div>
              </div>
              <div class="rewards_inside bg-[white] dark:!bg-[#22222224] text-black dark:!text-white">
                <div class="text-[12px] text-black dark:!text-[#626262]">
                  {{ $t('market_cap') }}
                </div>
                <div class="rewards_numbers">
                  $1,827,643
                </div>
                
              </div>
              <div class="rewards_inside bg-[white] dark:!bg-[#22222224]  text-black dark:!text-white">
                <div class="text-[12px] text-black dark:!text-[#626262]">
                  {{ $t('circulating_supply') }}
                </div>
                <div class="rewards_numbers">
                  6,001,859 PPN
                </div>
                
              </div>
              <div class="rewards_button_dropdown">{{ $t('add_ppn_to_wallet') }}</div>
            </div>
          </template>
      </Dropdown>
</template>
<script setup>
import { Dropdown } from 'floating-vue'
import walletPoolsImg from '@/assets/icons/sidebarIcons/walletPoolsImage.svg'

</script>
<style lang="scss" scoped>
.rewards_inside {
  border-radius: 2px;
  // background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;
  padding: 5px;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  // color: white;
  margin-bottom: 6px;

}

.rewards_button_dropdown {
  display: flex;
  align-items: center;
  
  justify-content: center;
  cursor: pointer;
  margin-top: 16px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  line-height: 24px;
  color: #000000;
  text-align: center;
  padding: 8px;
  background: #00E0FF;

  &:hover {
        filter: drop-shadow(0 0 0.3rem #00E0FF);

  }

}


.button_drop {
  height: 40px;
 
  font-family: 'Roboto Mono', monospace;

  border: 1px solid #2ABDFF;
  // box-shadow: 0px 4px 4px 0px #00000040;

  border-radius: 100px;
  padding: 8px 25px;
  font-size: clamp(10px, 0.8vw, 15px);
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: center;
  // color: white;

  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #2abcff36;

    cursor: pointer;
  }
}
.rewards_numbers {
  font-family: 'Roboto Mono', monospace;

}
</style>