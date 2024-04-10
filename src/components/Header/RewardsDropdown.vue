<template>
<Dropdown :distance="4" :placement="'bottom-center'">
          <div class="button_drop text-black dark:!text-white p-2 ">
            <img :src="rewards_icon"/>

            $1.23
          </div>
          <template #popper>
            <div class="header__popup bg-white dark:!bg-[#171717]">
              <h4 class="text-[14px] text-black dark:!text-[#626262] mb-[10px]">
                Rewards
              </h4>
              <div class="rewards_inside bg-[white] dark:!bg-[#22222224] text-black dark:!text-white">
                <div class="text-[12px] text-black dark:!text-[#626262]">
                  Pending pool rewards
                </div>
                <div class="flex items-center gap-1">
                  $1.23
                  <img :src="rewards_icon" width="16"/>
                </div>
              </div>
              <div class="rewards_inside bg-[white] dark:!bg-[#22222224] text-black dark:!text-white">
                <div class="text-[12px] text-black dark:!text-[#626262]">
                  Total staked
                </div>
                <div>
                  $234.34
                </div>
                <div class="text-[12px] text-black dark:!text-[#626262]">
                  in 2 farm(s)
                </div>
              </div>
              <div class="rewards_button_dropdown">Claim all pool rewards</div>
            </div>
          </template>
        </Dropdown>
</template>
<script setup>
import { Dropdown } from 'floating-vue'
import rewards_icon from '@/assets/icons/sidebarIcons/rewards_icon.svg'
</script>
<style lang="scss" scoped>
.rewards_inside {

  border-radius: 2px;
  box-shadow: 0px 4px 4px 0px #00000040;
  padding: 5px;
  font-family: Poppins;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  margin-bottom: 4px;
  // color: white;
}

.rewards_button_dropdown {
  cursor: pointer;
  margin-top: 10px;
  border-radius: 2px;
  font-family: Poppins;
  font-size: 12px;
  font-weight: 600;
  line-height: 24px;
  color: #FFFFFF;
  text-align: center;
  padding: 8px;
  background: linear-gradient(45deg, #00e0ff 0%, #0E3E9B 100%);

  box-shadow: 0px 4px 8.899999618530273px 0px #00AAE01A;
}


.button_drop {
  height: 40px;
 
  border: 1px solid #2222220d;
  box-shadow: 0px 4px 4px 0px #00000040;

  border-radius: 16px;
  padding: 8px 25px;
  font-family: Poppins;
  font-size: 15px;
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

</style>