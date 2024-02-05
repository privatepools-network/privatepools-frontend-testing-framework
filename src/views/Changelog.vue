<template>
  <MainCard>
    <section>
      <div>
        <img :src="changelog_header" class="w-100" />
        <div class="changelog_header_container">
          <div class="d-flex justify-content-between">
            <div class="d-flex align-items-center gap-1">
              <div>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 15H11V9H9V15ZM10 7C10.2833 7 10.521 6.904 10.713 6.712C10.905 6.52 11.0007 6.28267 11 6C11 5.71667 10.904 5.479 10.712 5.287C10.52 5.095 10.2827 4.99933 10 5C9.71667 5 9.479 5.096 9.287 5.288C9.095 5.48 8.99933 5.71733 9 6C9 6.28333 9.096 6.521 9.288 6.713C9.48 6.905 9.71733 7.00067 10 7ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6867 3.825 17.9743 2.925 17.075C2.025 16.175 1.31267 15.1167 0.788 13.9C0.263333 12.6833 0.000666667 11.3833 0 10C0 8.61667 0.262667 7.31667 0.788 6.1C1.31333 4.88333 2.02567 3.825 2.925 2.925C3.825 2.025 4.88333 1.31267 6.1 0.788C7.31667 0.263333 8.61667 0.000666667 10 0C11.3833 0 12.6833 0.262667 13.9 0.788C15.1167 1.31333 16.175 2.02567 17.075 2.925C17.975 3.825 18.6877 4.88333 19.213 6.1C19.7383 7.31667 20.0007 8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6867 15.1167 17.9743 16.175 17.075 17.075C16.175 17.975 15.1167 18.6877 13.9 19.213C12.6833 19.7383 11.3833 20.0007 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z"
                    fill="#5E5E5E"
                  />
                </svg>
              </div>
              <div>
                A changelog of the latest
                <span style="color: #7ef6b2">Dark Pool</span> feature realeses,
                product updates and important bug fixes.
              </div>
            </div>
            <div>
              <div class="changelog_button changelog_button_single">
                <div class="d-flex align-items-center gap-2">
                  Changelog
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.5 14.25C1.5 15.525 2.475 16.5 3.75 16.5H14.25C15.525 16.5 16.5 15.525 16.5 14.25V8.25H1.5V14.25ZM14.25 3H12.75V2.25C12.75 1.8 12.45 1.5 12 1.5C11.55 1.5 11.25 1.8 11.25 2.25V3H6.75V2.25C6.75 1.8 6.45 1.5 6 1.5C5.55 1.5 5.25 1.8 5.25 2.25V3H3.75C2.475 3 1.5 3.975 1.5 5.25V6.75H16.5V5.25C16.5 3.975 15.525 3 14.25 3Z"
                      fill="#BBBBBB"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="changelogs_container">
          <div
            v-for="(item, i) in changelogsData"
            :key="`changelog-${i}`"
            class="changelog_card"
          >
            <div class="changelog_version_container">
              <div class="changelog_version">Version {{ item.version }}</div>
              <div class="changelog_big_version">{{ item.version }}</div>
            </div>

            <div class="changelog_changes_container">
              <hr
                style="
                  border: 1px solid #7777772b;
                  margin-left: -20px;
                  margin-right: -20px;
                "
              />
              <div class="changelog_date">{{ item.date }}</div>
              <div class="changelog_change">
                <div class="mb-2">Improvements & Changes</div>
                <div v-for="(change, i) in item.changes" :key="`changes-${i}`">
                  <div class="d-flex align-items-center gap-1 mb-2">
                    <div>
                      <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="2.5" cy="2.5" r="2.5" fill="#575A59" />
                      </svg>
                    </div>
                    <div class="changelog_change_list">{{ change }}</div>
                  </div>
                </div>
              </div>
              <div class="changelog_change">
                <div class="mb-2">Bug Fixes</div>
                <div v-for="(bug, i) in item.bugsFixes" :key="`bug-${i}`">
                  <div class="d-flex align-items-center gap-1 mb-2">
                    <div>
                      <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="2.5" cy="2.5" r="2.5" fill="#575A59" />
                      </svg>
                    </div>
                    <div class="changelog_change_list">{{ bug }}</div>
                  </div>
                </div>
              </div>

              
              <div
              @click="router.push(`/changelog/${ item.id }`)"
                class="d-flex align-items-center gap-1 justify-content-end changelog_read"
              >
                <div>Read more</div>
                <div>
                  <svg
                    width="9"
                    height="4"
                    viewBox="0 0 9 4"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_6365_60)">
                      <path
                        d="M6.11499 1.5H0.109985V2.5H6.11499V4L8.10999 2L6.11499 0V1.5Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_6365_60">
                        <rect
                          width="8"
                          height="4"
                          fill="white"
                          transform="translate(0.109985)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="changelogs_pagination">
        <div style="cursor:pointer">
          <svg
            width="43"
            height="16"
            viewBox="0 0 43 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.292892 7.29289C-0.0976295 7.68342 -0.0976295 8.31658 0.292892 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41422 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292892 7.29289ZM43 7H1V9H43V7Z"
              fill="white"
              fill-opacity="0.25"
            />
          </svg>
        </div>
        <div style="width: 30%; display: flex; align-items: center; gap: 10px">
          <div class="changelogs_pagination_page">
            01
          </div>
          <div class="w-100">
          <CProgress :height="3" >
            <CProgressBar :value="100" color="success"></CProgressBar>
          </CProgress>
        </div>
          <div class="changelogs_pagination_page">
            01
          </div>
        </div>
        <div style="cursor:pointer">
          <svg
            width="43"
            height="16"
            viewBox="0 0 43 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M42.7071 8.70711C43.0976 8.31658 43.0976 7.68342 42.7071 7.29289L36.3431 0.928932C35.9526 0.538408 35.3195 0.538408 34.9289 0.928932C34.5384 1.31946 34.5384 1.95262 34.9289 2.34315L40.5858 8L34.9289 13.6569C34.5384 14.0474 34.5384 14.6805 34.9289 15.0711C35.3195 15.4616 35.9526 15.4616 36.3431 15.0711L42.7071 8.70711ZM0 9L42 9V7L0 7L0 9Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </section>
  </MainCard>
</template>
<script setup>
import MainCard from '@/UI/MainCard.vue'
import changelog_header from '@/assets/images/changelog_header.svg'
import changelogsData from '@/assets/files_mocks/changelogs.json'
import router from '@/router'

</script>
<style lang="scss" scoped>
.changelog_header_container {
  font-size: clamp(12px, 0.8vw, 15px);
  font-weight: 400;
  line-height: 15px;
  color: #5e5e5e;

  background: #26272c70;
  padding: 20px;
  border-radius: 0px 0px 20px 20px;
}

.changelog_button {
  font-size: clamp(8px, 0.7vw, 12px);
  font-weight: 600;
  line-height: 18px;
  text-align: center;
  color: #ffffff;

  border-radius: 111px;
  background: linear-gradient(
    214.25deg,
    rgba(18, 255, 113, 0.196) 6.73%,
    rgba(163, 164, 165, 0) 100.28%
  );
  box-shadow: 0px 9px 12px 0px #00000029;

  &_all {
    padding: 9px;
  }

  &_single {
    padding: 9px 22px;
  }

  &:hover {
    filter: drop-shadow(0 0 0.3rem #01b47e);
    cursor: pointer;
  }
}

.changelogs_container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 2%;
  gap: 35px;
}

.changelog {
  &_card {
    width: 30%;
    background: linear-gradient(
      200deg,
      rgba(0, 173, 121, 0.871) 0%,
      rgba(10, 245, 167, 0) 100%
    );
    padding: 20px 20px;
    border-radius: 20px;
    box-shadow: 0px 9px 12px 0px #00000029;
  }

  &_version_container {
    font-size: clamp(15px, 0.8vw, 20px);
    font-weight: 500;
    line-height: 13px;
    color: #ffffff;
    overflow: hidden;
  }
  &_version {
    font-size: clamp(15px, 0.8vw, 20px);
    font-weight: 500;
    line-height: 20px;
    color: #ffffff;
  }

  &_big_version {
    font-size: clamp(45px, 0.8vw, 60px);
    color: #ffffff;
    font-weight: 700;
    text-align: right;
  }

  &_changes_container {
    margin-top: -20px;
    z-index: 10;
    position: relative;
  }

  &_date {
    font-size: clamp(8px, 0.7vw, 10px);
    font-weight: 300;
    line-height: 10px;
    text-align: right;
    color: #ffffff;
    margin-top: -5px;
    margin-right: 5px;
  }

  &_change {
    font-size: clamp(13px, 0.8vw, 16px);
    font-weight: 500;
    line-height: 16px;
    color: #ffffff;
    margin-top: 5px;
  }
  &_change_list {
    font-family: 'Poppins', sans-serif;

    font-size: clamp(9px, 0.8vw, 12px);
    color: #ffffff;
    font-weight: 300;
    line-height: 12px;
  }

  &_read {
    font-family: Poppins;
    font-size: clamp(8px, 0.7vw, 10px);
    font-weight: 400;
    line-height: 20px;
    color: #ffffff;

    &:hover {
      cursor: pointer;
      filter: drop-shadow(0 0 0.3rem white);
    }
  }
}

.changelogs_pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8%;

  &_page {
    font-family: Poppins;
font-size: clamp(18px, 0.8vw, 23px);
font-weight: 700;
line-height: 30px;
color: #ffffff;

  }
}
</style>
