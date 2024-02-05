<template>
  <div class="container" v-if="allTokens.length > 0 && tokenSelected">
    {{ console.log("!!!", allTokens) }}
    <div class="selector">
      <div class="tokens-selector" @click="isSelectorOpened=!isSelectorOpened">
        <img style="width: 40px; height: 40px; margin-right:5px" :src="tokenSelected.img" />
        <div class="tokens-selector__selected-item-text">{{ tokenSelected.symbol }}</div>
        <div class="tokens-selector__dropdown-icon">
          <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.8125 1.40625L4.8125 5.40625L8.8125 1.40625" stroke="white" stroke-width="1.33333"
                  stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
      <div class="selector-options" v-show="isSelectorOpened" >
        <div class="tokens-select__search">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none"
               class="tokens-select__search_icon">
            <path
                d="M9.15779 7.36051C12.6949 7.36051 15.5617 6.16479 15.5617 4.69139C15.5617 3.218 12.6949 2.02228 9.15779 2.02228C5.62064 2.02228 2.75391 3.218 2.75391 4.69139C2.75391 6.16479 5.62064 7.36051 9.15779 7.36051ZM9.15779 11.6281C6.7138 11.6281 4.5525 11.0402 3.18917 10.1322C2.9115 10.4324 2.75391 10.7551 2.75391 11.0953C2.75391 12.5687 5.62064 13.7644 9.15779 13.7644C12.6949 13.7644 15.5617 12.5687 15.5617 11.0953C15.5617 10.7551 15.4041 10.4324 15.1264 10.1347C13.7631 11.0402 11.6018 11.6281 9.15779 11.6281ZM9.15779 8.42616C6.7138 8.42616 4.5525 7.8383 3.18917 6.93025C2.9115 7.23043 2.75391 7.55313 2.75391 7.89333C2.75391 9.36673 5.62064 10.5625 9.15779 10.5625C12.6949 10.5625 15.5617 9.36673 15.5617 7.89333C15.5617 7.55313 15.4041 7.23043 15.1264 6.93275C13.7631 7.8383 11.6018 8.42616 9.15779 8.42616Z"
                fill="#F8F8F8"/>
          </svg>
          <input type="text" v-model="searchBy" class="tokens-select__input" placeholder="Add Tokens..."
                 v-on:keyup.enter="emit('addToken', searchBy); searchBy = ''">
          <svg @click="searchBy=''" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
               fill="none" class="tokens-select__search_clear">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M3 14C3 13.7348 3.10536 13.4804 3.29289 13.2929C3.48043 13.1054 3.73478 13 4 13H16C16.7956 13 17.5587 12.6839 18.1213 12.1213C18.6839 11.5587 19 10.7956 19 10V6C19 5.73478 19.1054 5.48043 19.2929 5.29289C19.4804 5.10536 19.7348 5 20 5C20.2652 5 20.5196 5.10536 20.7071 5.29289C20.8946 5.48043 21 5.73478 21 6V10C21 11.3261 20.4732 12.5979 19.5355 13.5355C18.5979 14.4732 17.3261 15 16 15H4C3.73478 15 3.48043 14.8946 3.29289 14.7071C3.10536 14.5196 3 14.2652 3 14Z"
                  fill="#F8F8F8"/>
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M3.29279 14.707C3.10532 14.5195 3 14.2652 3 14C3 13.7348 3.10532 13.4805 3.29279 13.293L7.29279 9.293C7.48139 9.11084 7.73399 9.01004 7.99619 9.01232C8.25838 9.0146 8.5092 9.11977 8.6946 9.30518C8.88001 9.49058 8.98518 9.7414 8.98746 10.0036C8.98974 10.2658 8.88894 10.5184 8.70679 10.707L5.41379 14L8.70679 17.293C8.8023 17.3852 8.87848 17.4956 8.93089 17.6176C8.9833 17.7396 9.01088 17.8708 9.01204 18.0036C9.01319 18.1364 8.98789 18.2681 8.93761 18.3909C8.88733 18.5138 8.81307 18.6255 8.71918 18.7194C8.62529 18.8133 8.51364 18.8875 8.39074 18.9378C8.26784 18.9881 8.13616 19.0134 8.00339 19.0122C7.87061 19.0111 7.73939 18.9835 7.61738 18.9311C7.49538 18.8787 7.38503 18.8025 7.29279 18.707L3.29279 14.707Z"
                  fill="#F8F8F8"/>
          </svg>
        </div>
        <div v-if="searchBy == ''" style="display: flex; align-items: center" v-for="item in allTokens" :key="item.name" class="selector-options__el" @click="tokenSelected = item, $emit('updateToken', { ...tokenSelected, weight, amount: selectedAmount }), isSelectorOpened = false">
          <img style="width: 20px; height: 20px; margin-right: 5px" :src="item.img" /><span class="text-white"> {{ item.name }}</span>
          <span style="color: rgba(108, 114, 132, 1); margin-left: 2.5px">({{ item.symbol }})</span>
        </div>
        <div v-else style="display: flex; align-items: center" v-for="item in foundTokens" :key="item.name" class="selector-options__el" @click="tokenSelected = item, $emit('updateToken', { ...tokenSelected, weight, amount: selectedAmount }), isSelectorOpened = false">
          <img style="width: 20px; height: 20px; margin-right: 5px" :src="item.img" /><span class="text-white"> {{ item.name }}</span>
          <span style="color: rgba(108, 114, 132, 1); margin-left: 2.5px">({{ item.symbol }})</span>
        </div>
      </div>
    </div>
<!--    <multiselect :modelValue="tokenSelected"-->
<!--      @update:modelValue="(event) => { tokenSelected = event; $emit('updateToken', { ...tokenSelected, weight, amount: selectedAmount }) }"-->
<!--      placeholder="" label="title" track-by="address" :options="allTokens" :option-height="104" :show-labels="true"-->
<!--      :searchable="false" :allow-empty="false" :hide-selected="true" :close-on-select="true" :taggable="false"-->
<!--      :showLabels="false">-->

<!--      <template v-slot:singleLabel="{ option }">-->

<!--        <div class="tokens-selector">-->
<!--          <img style="width: 40px; height: 40px; margin-right:5px" :src="option.img" />-->
<!--          <div class="tokens-selector__selected-item-text">{{ option.symbol }}</div>-->
<!--          <div class="tokens-selector__dropdown-icon">-->
<!--            <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--              <path d="M0.8125 1.40625L4.8125 5.40625L8.8125 1.40625" stroke="white" stroke-width="1.33333"-->
<!--                stroke-linecap="round" stroke-linejoin="round" />-->
<!--            </svg>-->
<!--          </div>-->
<!--        </div>-->
<!--      </template>-->
<!--      <template v-slot:option="{ option, index }">-->
<!--&lt;!&ndash;        <div class="tokens-select__search" v-if="index==0">&ndash;&gt;-->
<!--&lt;!&ndash;          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none" class="tokens-select__search_icon">&ndash;&gt;-->
<!--&lt;!&ndash;            <path&ndash;&gt;-->
<!--&lt;!&ndash;                d="M9.15779 7.36051C12.6949 7.36051 15.5617 6.16479 15.5617 4.69139C15.5617 3.218 12.6949 2.02228 9.15779 2.02228C5.62064 2.02228 2.75391 3.218 2.75391 4.69139C2.75391 6.16479 5.62064 7.36051 9.15779 7.36051ZM9.15779 11.6281C6.7138 11.6281 4.5525 11.0402 3.18917 10.1322C2.9115 10.4324 2.75391 10.7551 2.75391 11.0953C2.75391 12.5687 5.62064 13.7644 9.15779 13.7644C12.6949 13.7644 15.5617 12.5687 15.5617 11.0953C15.5617 10.7551 15.4041 10.4324 15.1264 10.1347C13.7631 11.0402 11.6018 11.6281 9.15779 11.6281ZM9.15779 8.42616C6.7138 8.42616 4.5525 7.8383 3.18917 6.93025C2.9115 7.23043 2.75391 7.55313 2.75391 7.89333C2.75391 9.36673 5.62064 10.5625 9.15779 10.5625C12.6949 10.5625 15.5617 9.36673 15.5617 7.89333C15.5617 7.55313 15.4041 7.23043 15.1264 6.93275C13.7631 7.8383 11.6018 8.42616 9.15779 8.42616Z"&ndash;&gt;-->
<!--&lt;!&ndash;                fill="#F8F8F8" />&ndash;&gt;-->
<!--&lt;!&ndash;          </svg>&ndash;&gt;-->
<!--&lt;!&ndash;          <input type="text" v-model="searchBy" class="tokens-select__input" placeholder="Add Tokens..."&ndash;&gt;-->
<!--&lt;!&ndash;                 v-on:keyup.enter="emit('addToken', searchBy); searchBy = ''">&ndash;&gt;-->
<!--&lt;!&ndash;          <svg @click="searchBy=''" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="tokens-select__search_clear">&ndash;&gt;-->
<!--&lt;!&ndash;            <path fill-rule="evenodd" clip-rule="evenodd" d="M3 14C3 13.7348 3.10536 13.4804 3.29289 13.2929C3.48043 13.1054 3.73478 13 4 13H16C16.7956 13 17.5587 12.6839 18.1213 12.1213C18.6839 11.5587 19 10.7956 19 10V6C19 5.73478 19.1054 5.48043 19.2929 5.29289C19.4804 5.10536 19.7348 5 20 5C20.2652 5 20.5196 5.10536 20.7071 5.29289C20.8946 5.48043 21 5.73478 21 6V10C21 11.3261 20.4732 12.5979 19.5355 13.5355C18.5979 14.4732 17.3261 15 16 15H4C3.73478 15 3.48043 14.8946 3.29289 14.7071C3.10536 14.5196 3 14.2652 3 14Z" fill="#F8F8F8"/>&ndash;&gt;-->
<!--&lt;!&ndash;            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.29279 14.707C3.10532 14.5195 3 14.2652 3 14C3 13.7348 3.10532 13.4805 3.29279 13.293L7.29279 9.293C7.48139 9.11084 7.73399 9.01004 7.99619 9.01232C8.25838 9.0146 8.5092 9.11977 8.6946 9.30518C8.88001 9.49058 8.98518 9.7414 8.98746 10.0036C8.98974 10.2658 8.88894 10.5184 8.70679 10.707L5.41379 14L8.70679 17.293C8.8023 17.3852 8.87848 17.4956 8.93089 17.6176C8.9833 17.7396 9.01088 17.8708 9.01204 18.0036C9.01319 18.1364 8.98789 18.2681 8.93761 18.3909C8.88733 18.5138 8.81307 18.6255 8.71918 18.7194C8.62529 18.8133 8.51364 18.8875 8.39074 18.9378C8.26784 18.9881 8.13616 19.0134 8.00339 19.0122C7.87061 19.0111 7.73939 18.9835 7.61738 18.9311C7.49538 18.8787 7.38503 18.8025 7.29279 18.707L3.29279 14.707Z" fill="#F8F8F8"/>&ndash;&gt;-->
<!--&lt;!&ndash;          </svg>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--        <div style="display: flex; align-items: center">-->
<!--          <img style="width: 20px; height: 20px; margin-right: 5px" :src="option.img" /><span> {{ option.name }}</span>-->
<!--          <span style="color: rgba(108, 114, 132, 1); margin-left: 2.5px">({{ option.symbol }})</span>-->
<!--        </div>-->
<!--      </template>-->
<!--    </multiselect>-->

    <div class="parameters-container">
      <div class="pair" v-for="(parameter, parameterIndex) in parameters.map(
        (ooo) => Object.keys(ooo)[0],
      )" :key="`parameter-pair-key-${parameterIndex}`">
        <div class="pair__name">
          {{ parameters[parameterIndex][parameter] }}:
        </div>
        <div v-if="parameterIndex === 0" class="range-slider__container">
          <div class="value-label" ref="inputRefLabel">{{ Number(weight).toFixed(0) }}%</div>
          <input class="range-slider" ref="range_test" type="range" min="1" @input="onInput" max="100" v-model="weight" />

          <input type="number" id="poolNameInput" ref="inputRefLabel" @input="onInput" class="select-amount" style="width:22%; margin-left:15px" v-model="weight"  min="1"
            max="100" />

        </div>
        <div class="pair__value" v-else-if="parameterIndex === 1" style="justify-content: flex-start">
          <input type="number" id="poolNameInput" class="select-amount" v-model="selectedAmount" required minlength="1"
            maxlength="20" />
          <span @click="maximizeAmount" style="color: #01B47E; text-decoration: underline;font-size: 12px; cursor:pointer;">MAX</span>
        </div>
        <div class="pair__value" v-else-if="parameterIndex === 2">
          {{ (tokenSelected.balance - selectedAmount).toFixed(4) }} {{ tokenSelected.symbol }}
        </div>

      </div>
      <div class="button-delete" @click="$emit('click-delete')">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_1253_6329)">
            <path d="M2.5 5H4.16667H17.5" stroke="white" stroke-width="1.66667" stroke-linecap="round"
              stroke-linejoin="round" />
            <path
              d="M15.8337 5.00033V16.667C15.8337 17.109 15.6581 17.5329 15.3455 17.8455C15.0329 18.1581 14.609 18.3337 14.167 18.3337H5.83366C5.39163 18.3337 4.96771 18.1581 4.65515 17.8455C4.34259 17.5329 4.16699 17.109 4.16699 16.667V5.00033M6.66699 5.00033V3.33366C6.66699 2.89163 6.84259 2.46771 7.15515 2.15515C7.46771 1.84259 7.89163 1.66699 8.33366 1.66699H11.667C12.109 1.66699 12.5329 1.84259 12.8455 2.15515C13.1581 2.46771 13.3337 2.89163 13.3337 3.33366V5.00033"
              stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_1253_6329">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref, defineExpose } from 'vue'
import { defineProps, defineEmits, toRefs, watch } from 'vue'

const props = defineProps(['allTokens', 'tokensData'])
const emit = defineEmits(['updateToken', 'addToken'])

defineExpose({
  calculatePool
})

const { allTokens } = toRefs(props)


const range_test = ref(null)

const searchBy = ref('')

const inputRefLabel = ref()

const tokenSelected = ref(null)
const weight = ref(0)
const selectedAmount = ref(0)

watch(() => allTokens.value, (_new) => {
  tokenSelected.value = _new[0]
})

const foundTokens = ref([])

watch(searchBy, (_new) => {
  console.log(_new)
  if (!_new || _new.length == 0) {
    foundTokens.value = [...allTokens.value]
    return
  }
  let foundPools = []
  allTokens.value.forEach((token) => {
    const lowerCaseName = token.address.toLowerCase()
    const lowerCaseSearchTerm = _new.toLowerCase()
    const nameArr = lowerCaseName.split('')
    const searchTermArr = lowerCaseSearchTerm.split('')
    if (
        nameArr.splice(0, searchTermArr.length).join('') ==
        lowerCaseSearchTerm
    ) {
      foundPools.push(token)
    }
  })
  console.log(foundTokens.value)
  foundTokens.value = foundPools

})


watch([weight, selectedAmount], ([newWeight, newSelectedAmount]) => {
  emit('updateToken', { ...tokenSelected.value, weight: Number(newWeight).toFixed(0), amount: newSelectedAmount })
})


function maximizeAmount() {
  selectedAmount.value = (tokenSelected.value.balance - selectedAmount.value).toFixed(4)
}

function calculatePool() {
    weight.value = 100 / props.tokensData.length
    console.log("range_test", range_test.value)
    range_test.value[0].style.background = `linear-gradient(to right, #01B47E ${weight.value}%, #ffffff29 ${weight.value}%)`
    return (weight.value).toFixed(0)
}




const parameters = ref([
  { 'Select Weight (%)': 'Select Weight (%)' },
  { 'Select Amount': 'Select Amount' },
  { 'Available Amount': 'Available Amount' },
])

onMounted(() => {
  tokenSelected.value = allTokens.value[0]
})

const onInput = async ({ target }) => {
  range_test.value[0].style.background = `linear-gradient(to right, #01B47E ${target.value}%, #ffffff29 ${target.value}%)`
  inputRefLabel.value[0].style.left = `${target.value}px`

}
const isSelectorOpened = ref(false)
</script>

<style lang="scss" scoped>
.selector {
  position: relative;
  &-options {
    position: absolute;
    background: rgb(15, 17, 19) !important;
    z-index: 1000;
    border-radius: 10px;
    padding: 10px;
    max-height: 300px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 0;
    }
    &__el {
      padding: 8px 8px;
      cursor: pointer;
      &:hover {
        background: rgb(27, 30, 33) !important;
      }
    }
  }
}
.tokens-select {
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
.container {
  min-height: 226px;
  height: fit-content;
  min-width: 358px;
  width: fit-content;
  border: 1px #01b47e solid;
  border-radius: 5px;

  padding: 20px 24px 12px 16px;
  margin: 0;

  position: relative;

  .button-delete {
    height: 40px;
    width: 40px;
    border-radius: 5px;
    background: #01B47E;
    cursor: pointer;

    position: absolute;
    right: 12px;
    bottom: 12px;

    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.tokens-selector {
  display: flex;
  align-items: center;
  cursor: pointer;
  &__icon {
    height: 52px;
    width: 52px;
    border-radius: 50%;
    background-color: #ffffffde;

    display: flex;
    justify-content: space-around;
    align-items: center;

    margin-right: 8px;
  }

  &__selected-item-text {
    font-size: 16px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0em;
    color: #ffffff;

    margin-right: 8px;
  }
}

@mixin values-pair-text {
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0em;
  color: #ffffff;
}

.parameters-container {
  display: flex;
  flex-direction: column;

  .pair {
    margin-top: 24px;
    display: flex;

    &__name {
      @include values-pair-text;

      display: flex;
      min-width: 140px;
      align-items: center;
    }

    &__value {
      @include values-pair-text;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &__max-button {
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0em;
        color: #01b47e;
        text-decoration: underline;
        margin-right: 94px;
        cursor: pointer;
      }
    }
  }
}

.select-amount {
  background-color: rgba(59, 97, 65, 0) !important;
  width: 50%;
  border: none;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.5px;
  color: #ffffff;
}


:deep(.range-slider) {
  background: transparent;
  border-radius: 8px;
  padding: 0;

  -webkit-appearance: none;
  appearance: none;
  height: 12px;
  outline: none;
  transition: opacity 0.2s;
  position: relative;

  /* Styling the track */
  &::-webkit-slider-runnable-track {
    height: 12px;
    background: #ffffff29;
    border-radius: 8px;
  }

  &::-moz-range-track {
    height: 12px;
    background: #ffffff29;
    border-radius: 8px;
  }

  &::-moz-range-progress {
    background-color: #01b47e;
    height: 12px;
    border-radius: 8px 0 0 8px;
  }

  &::-ms-track {
    height: 12px;
    background: #ffffff29;
    border-radius: 8px;
  }

  /* Styling the thumb */
  &::-webkit-slider-thumb {
    width: 14px;
    height: 14px;
    background: #c1c1d1;
    border-radius: 50%;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -1px;
    /* necessary to center the thumb in the track */
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background: #c1c1d1;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-ms-thumb {
    width: 14px;
    height: 14px;
    background: #c1c1d1;
    border-radius: 50%;
    cursor: pointer;
    margin-top: 0;
  }
}

.range-slider__container {
  position: relative;

  .value-label {
    position: absolute;
    bottom: 20px;

    font-size: 10px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0em;
    color: #ffffff;
  }
}

// Multiselect custom
:deep(.multiselect__tags) {
  border: none !important;
  background: none !important
}

:deep(.multiselect__input, .multiselect__single) {
  background: none !important
}

:deep(.multiselect__content-wrapper) {
  border-color: rgba(1, 180, 126, 1) !important;
}

:deep(.multiselect__single) {
  background: none !important;
  color: white !important;
}

:deep(.multiselect__select) {
  display: none;
}

:deep(.multiselect__option) {
  border: 1px solid rgba(1, 180, 126, 1) !important;
  background: rgb(15, 17, 19) !important;
  color: white !important;
}

:deep(.multiselect__option:hover) {
  background: rgba(1, 180, 126, 0.884) !important;
}
</style>
