<template>
  <div class="bot_container">
    <CCol :lg="6" :xl="6">
      <span class="text-white  mb-2 bot_status_text">Select Tokens</span>
      <div class="tokens-select">
        <div class="tokens-select__title">
          All tokens
        </div>
        <div class="tokens-select__search">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none" class="tokens-select__search_icon">
            <path
              d="M9.15779 7.36051C12.6949 7.36051 15.5617 6.16479 15.5617 4.69139C15.5617 3.218 12.6949 2.02228 9.15779 2.02228C5.62064 2.02228 2.75391 3.218 2.75391 4.69139C2.75391 6.16479 5.62064 7.36051 9.15779 7.36051ZM9.15779 11.6281C6.7138 11.6281 4.5525 11.0402 3.18917 10.1322C2.9115 10.4324 2.75391 10.7551 2.75391 11.0953C2.75391 12.5687 5.62064 13.7644 9.15779 13.7644C12.6949 13.7644 15.5617 12.5687 15.5617 11.0953C15.5617 10.7551 15.4041 10.4324 15.1264 10.1347C13.7631 11.0402 11.6018 11.6281 9.15779 11.6281ZM9.15779 8.42616C6.7138 8.42616 4.5525 7.8383 3.18917 6.93025C2.9115 7.23043 2.75391 7.55313 2.75391 7.89333C2.75391 9.36673 5.62064 10.5625 9.15779 10.5625C12.6949 10.5625 15.5617 9.36673 15.5617 7.89333C15.5617 7.55313 15.4041 7.23043 15.1264 6.93275C13.7631 7.8383 11.6018 8.42616 9.15779 8.42616Z"
              fill="#F8F8F8" />
          </svg>
          <input type="text" v-model="searchBy" class="tokens-select__input" placeholder="Add Tokens..."
            v-on:keyup.enter="emit('addToken', searchBy); searchBy = ''">
          <svg @click="searchBy=''" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="tokens-select__search_clear">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3 14C3 13.7348 3.10536 13.4804 3.29289 13.2929C3.48043 13.1054 3.73478 13 4 13H16C16.7956 13 17.5587 12.6839 18.1213 12.1213C18.6839 11.5587 19 10.7956 19 10V6C19 5.73478 19.1054 5.48043 19.2929 5.29289C19.4804 5.10536 19.7348 5 20 5C20.2652 5 20.5196 5.10536 20.7071 5.29289C20.8946 5.48043 21 5.73478 21 6V10C21 11.3261 20.4732 12.5979 19.5355 13.5355C18.5979 14.4732 17.3261 15 16 15H4C3.73478 15 3.48043 14.8946 3.29289 14.7071C3.10536 14.5196 3 14.2652 3 14Z" fill="#F8F8F8"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.29279 14.707C3.10532 14.5195 3 14.2652 3 14C3 13.7348 3.10532 13.4805 3.29279 13.293L7.29279 9.293C7.48139 9.11084 7.73399 9.01004 7.99619 9.01232C8.25838 9.0146 8.5092 9.11977 8.6946 9.30518C8.88001 9.49058 8.98518 9.7414 8.98746 10.0036C8.98974 10.2658 8.88894 10.5184 8.70679 10.707L5.41379 14L8.70679 17.293C8.8023 17.3852 8.87848 17.4956 8.93089 17.6176C8.9833 17.7396 9.01088 17.8708 9.01204 18.0036C9.01319 18.1364 8.98789 18.2681 8.93761 18.3909C8.88733 18.5138 8.81307 18.6255 8.71918 18.7194C8.62529 18.8133 8.51364 18.8875 8.39074 18.9378C8.26784 18.9881 8.13616 19.0134 8.00339 19.0122C7.87061 19.0111 7.73939 18.9835 7.61738 18.9311C7.49538 18.8787 7.38503 18.8025 7.29279 18.707L3.29279 14.707Z" fill="#F8F8F8"/>
          </svg>
        </div>

        <CFormSelect :disabled="isBotRunning || isBotLoading" class="strategy_form" color="primary"
          v-model="selectedToken" aria-label="Default select example" multiple="true" track-by="id">
          <option :class="`select_strategie`" v-for="opt in foundTokens" :key="opt.id" :value="opt.symbol"
            @click="(e) => { isBotRunning || isBotLoading ? '' : emit('selectToken', opt.id) }">
            <div :class="`d-flex align-items-center`">
              <span>{{ opt.symbol }}</span>
              <img :src="getTokenEntity(opt.symbol, 'short').icon" width="20">
            </div>
          </option>
        </CFormSelect>


      </div>

    </CCol>
    <CCol :lg="6">
      <span class="text-white  mb-2 bot_status_text">Current Tokens Trading</span>
      <div class="d-flex flex-column">
        <div class="d-flex align-items-center" v-for="token in selectedTokens" :key="token.id">
          <img :src="getTokenEntity(token.symbol, 'short').icon" width="25" />
          <div class="d-flex gap-1 align-items-center">
            <div class="text-white bot_status_text">{{ token.name }} <span class="text-dark">({{
              token.symbol
            }})</span></div>
            <div @click="emit('removeToken', token.id)">
              <svg class="removeIcon" width="7" height="7" viewBox="0 0 8 8" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.645917 0.646001C0.692363 0.599438 0.747538 0.562495 0.808283 0.537288C0.869028 0.512082 0.93415 0.499107 0.999917 0.499107C1.06568 0.499107 1.13081 0.512082 1.19155 0.537288C1.2523 0.562495 1.30747 0.599438 1.35392 0.646001L3.99992 3.293L6.64592 0.646001C6.6924 0.599513 6.74759 0.562637 6.80833 0.537477C6.86907 0.512318 6.93417 0.499369 6.99992 0.499369C7.06566 0.499369 7.13076 0.512318 7.1915 0.537477C7.25224 0.562637 7.30743 0.599513 7.35392 0.646001C7.4004 0.692489 7.43728 0.747678 7.46244 0.808417C7.4876 0.869157 7.50055 0.934257 7.50055 1C7.50055 1.06574 7.4876 1.13085 7.46244 1.19158C7.43728 1.25232 7.4004 1.30751 7.35392 1.354L4.70692 4L7.35392 6.646C7.4004 6.69249 7.43728 6.74768 7.46244 6.80842C7.4876 6.86916 7.50055 6.93426 7.50055 7C7.50055 7.06574 7.4876 7.13085 7.46244 7.19158C7.43728 7.25232 7.4004 7.30751 7.35392 7.354C7.30743 7.40049 7.25224 7.43737 7.1915 7.46252C7.13076 7.48768 7.06566 7.50063 6.99992 7.50063C6.93417 7.50063 6.86907 7.48768 6.80833 7.46252C6.74759 7.43737 6.6924 7.40049 6.64592 7.354L3.99992 4.707L1.35392 7.354C1.30743 7.40049 1.25224 7.43737 1.1915 7.46252C1.13076 7.48768 1.06566 7.50063 0.999917 7.50063C0.934173 7.50063 0.869073 7.48768 0.808333 7.46252C0.747594 7.43737 0.692405 7.40049 0.645917 7.354C0.599429 7.30751 0.562553 7.25232 0.537394 7.19158C0.512234 7.13085 0.499285 7.06574 0.499285 7C0.499285 6.93426 0.512234 6.86916 0.537394 6.80842C0.562553 6.74768 0.599429 6.69249 0.645917 6.646L3.29292 4L0.645917 1.354C0.599354 1.30756 0.562411 1.25238 0.537204 1.19163C0.511998 1.13089 0.499023 1.06577 0.499023 1C0.499023 0.934234 0.511998 0.869112 0.537204 0.808367C0.562411 0.747622 0.599354 0.692447 0.645917 0.646001Z"
                  fill="#F8F8F8" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </CCol>
  </div>
</template>
<script setup>

import { getTokenEntity } from "@/lib/helpers/util";
import { defineProps, toRefs, defineEmits, ref, watch } from "vue"

const selectedToken = ref(null)
const emit = defineEmits(['selectToken', 'removeToken', 'addToken'])
const props = defineProps(['selectedTokens', 'allTokens', 'isBotRunning', 'isBotLoading', 'chainSelected'])
const { selectedTokens, allTokens, isBotRunning, isBotLoading } = toRefs(props)

const searchBy = ref('')
const foundTokens = ref([...allTokens.value])

watch(allTokens, () => {
  foundTokens.value = [...allTokens.value]
})

watch(searchBy, (_new) => {
  if (!_new || _new.length == 0) {
    foundTokens.value = [...allTokens.value]
    return
  }
  let foundPools = []
  allTokens.value.forEach((pool) => {
    const lowerCaseName = pool.id.toLowerCase()
    const lowerCaseSearchTerm = _new.toLowerCase()
    const nameArr = lowerCaseName.split('')
    const searchTermArr = lowerCaseSearchTerm.split('')
    if (
      nameArr.splice(0, searchTermArr.length).join('') ==
      lowerCaseSearchTerm
    ) {
      foundPools.push(pool)
    }
  })
  foundTokens.value = foundPools

})





</script>
<style lang="scss" scoped>
.bot_container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-right: 20px;
  border: 1px solid rgba(163, 164, 165, 0.2);
  border-radius: 20px;
  padding: 10px 15px;
}

option:checked {
  color: white;
  background-color: #00C087;
  border-radius: 10px;
}

.removeIcon {
  margin-top: -5px;
  cursor: pointer;
}

.removeIcon:hover path {
  fill: red;
}

.bot_status_text {
  flex-direction: column;
  gap: 5px;
  font-size: clamp(10px, 0.8vw, 14px);

}

:deep(.form-select) {
  background-color: #22282c00 !important;
  border-radius: 20px 0px 0px 20px;
  font-size: clamp(10px, 0.8vw, 14px);
  color: rgba(1, 180, 126, 1);

  &::-webkit-scrollbar {
    height: 8px;
    width: 4px;
    border-radius: 50px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 50px;
    margin-left: 10px;
    margin-right: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 192, 135);
    border: 1px solid #02120a;
    border-radius: 50px;
  }
}


.selected_item {
  background-color: rgb(59 130 246) !important
}

:deep(.strategy_form) {
  border: none !important;
}

.tokens-select {
  border-radius: 20px;
  border: 1px solid #01B47E;

  &__title {
    padding: 6px 12px;
    color: #01B47E;
    font-size: 16px;
    font-weight: 500;
    margin-top: 5px;
  }

  &__search {
    border-radius: 8px;
    border: 1px solid rgba(193, 193, 209, 0.24);
    padding: 4px 0 4px 8px;
    margin: 0 12px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    &_icon {
      margin-right: 5px;

    }
    &_clear {
      margin-right: 10px;
      cursor: pointer;
    }
  }

  &__input {
    outline: none;
    background: none;
    border: none;
    font-size: 10px;
    color: #fff;
    width: 100%;
  }
}
</style>
