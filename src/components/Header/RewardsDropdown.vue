<template>
<Dropdown :distance="4" :placement="'bottom-center'">
          <div class="button_drop p-2 ">
            <img :src="rewards_icon"/>

            $1.23
          </div>
          <template #popper>
            <div class="header__popup">
              <h4 style="
                  font-size: 14px;
                  color: #626262;
                  margin-bottom: 10px;
                ">
                Rewards
              </h4>
              <div class="rewards_inside">
                <div style="color: #626262; font-size: 12px">
                  Pending pool rewards
                </div>
                <div class="flex items-center gap-1">
                  $1.23
                  <img :src="rewards_icon" width="16"/>
                </div>
              </div>
              <div class="rewards_inside">
                <div style="color: #626262; font-size: 12px">
                  Total staked
                </div>
                <div>
                  $234.34
                </div>
                <div style="color: #626262; font-size: 12px">
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
  background: #22222224;
  box-shadow: 0px 4px 4px 0px #00000040;
  padding: 5px;
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: white;
}

.rewards_button_dropdown {
  cursor: pointer;
  margin-top: 10px;
  border-radius: 2px;
  font-family: Inter;
  font-size: 12px;
  font-weight: 600;
  line-height: 24px;
  color: #FFFFFF;
  text-align: center;
  padding: 8px;
  background: linear-gradient(45deg, #2ABDFF 0%, #0E3E9B 100%);

  box-shadow: 0px 4px 8.899999618530273px 0px #00AAE01A;
}


.button_drop {
  height: 40px;
 
  border: 1px solid #2222220d;
  box-shadow: 0px 4px 4px 0px #00000040;

  border-radius: 16px;
  padding: 8px 25px;
  font-family: Inter;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: center;
  color: white;

  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #2abcff36;

    cursor: pointer;
  }
}

</style>