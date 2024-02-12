<template>
  <div class="elements-wrapper">
    <div class="containerr">
      <div class="elements-container">

        <div class="elements-wrapper__side">
          <div class="elements-wrapper__caption">Select {{ caption }} to Trade</div>

          <div class="multiselect-wrapper" :class="{ '--expanded': isMultiselectOpen }" style="height=464px">
            <multiselect :showLabels="false" v-model="selectedTokens" label="name" :trackBy="trackBy" :options="options"
              :multiple="true" :taggable="true" :searchable="false" :openDirection="bottom" :isOpen="true"
              @update:modelValue="(v1) => $emit('onSelect', v1)" :modelValue="selectedTokens" :disabled="isSaveDisabled"
              @open="onMultiselectOpen" @close="onMultiselectStayOpen" :close-on-select="false" ref="multiselectRef">
              <template v-slot:option="{ option }">
                <div class="select-option">
                  <div class="select-option__text">
                    <img class="select-option__icon" :src="option.img === '' ? option.img_color : option.img
                      " />
                    <span class="select-option__name">{{ option.name }}</span>
                  </div>
                  <div v-if="!option['$isDisabled'] && isInitialized" class="select-option__flag" />
                </div>
              </template>
            </multiselect>
            <CButton :disabled="selectedTokens.length == 0"
              @click="() => isSaveDisabled ? showWarning = true : onSaveClick()" class="save-button"
              v-show="isMultiselectOpen">
              Save
            </CButton>
          </div>


        </div>

        <div class="elements-wrapper__side"
          v-if="possibleTokens && possibleTokens.length && selectedTokens && selectedTokens.length">
          <div class="elements-wrapper__caption">
            Current {{ caption }} Trading
          </div>

          <div class="selected-elements-wrapper" style="height=464px">
            <div>
              <div v-for="(selectedToken, selectedTokenIndex) in selectedTokens"
                :key="`selected-option-list-item-key-${selectedTokenIndex}`" class="select-option --container">
                <div class="select-option__text" v-if="selectedToken.name">
                  <img v-if="selectedToken.img === ''" class="select-option__icon" :src="selectedToken.img_color" />
                  <img v-if="selectedToken.img !== ''" class="select-option__icon" :src="selectedToken.img" />
                  <span class="select-option__name">{{ selectedToken.name }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div>
        <CAlert class="d-flex gap-2 w-75" style="
            background-color: rgba(15, 17, 19, 1);
            color: white;
            border: none;
            margin-top: 20px;
            display: flex;
          " color="primary" :visible="showWarning" dismissible @close="() => {
            showWarning = false
          }
            ">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M22 12C22 17.5228 17.5228 22 12 22H2.9937C2.11018 22 1.66771 20.9229 2.29245 20.2929L4.2495 18.3195C2.84334 16.597 2 14.397 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.2071 8.79289C15.5976 9.18342 15.5976 9.81658 15.2071 10.2071L13.4142 12L15.2071 13.7929C15.5976 14.1834 15.5976 14.8166 15.2071 15.2071C14.8166 15.5976 14.1834 15.5976 13.7929 15.2071L12 13.4142L10.2071 15.2071C9.81658 15.5976 9.18342 15.5976 8.79289 15.2071C8.40237 14.8166 8.40237 14.1834 8.79289 13.7929L10.5858 12L8.79289 10.2071C8.40237 9.81658 8.40237 9.18342 8.79289 8.79289C9.18342 8.40237 9.81658 8.40237 10.2071 8.79289L12 10.5858L13.7929 8.79289C14.1834 8.40237 14.8166 8.40237 15.2071 8.79289Z"
              fill="#FF507A" />
          </svg>

          <div>
            It's impossible to change tokens because there is a Strategy
            curently running.
          </div>
        </CAlert>
      </div>

      <div>
        <CAlert class="d-flex gap-2 w-75" style="
            background-color: rgba(15, 17, 19, 1);
            color: white;
            border: none;
            margin-top: 20px;
            display: flex;
          " color="primary" :visible="showSuccess" dismissible @close="() => {
            showSuccess = false
          }
            ">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M22 12C22 17.5228 17.5228 22 12 22H2.9937C2.11018 22 1.66771 20.9229 2.29245 20.2929L4.2495 18.3195C2.84334 16.597 2 14.397 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.7071 10.7071C16.0976 10.3166 16.0976 9.68342 15.7071 9.29289C15.3166 8.90237 14.6834 8.90237 14.2929 9.29289L11 12.5858L9.70711 11.2929C9.31658 10.9024 8.68342 10.9024 8.29289 11.2929C7.90237 11.6834 7.90237 12.3166 8.29289 12.7071L10.2929 14.7071C10.4804 14.8946 10.7348 15 11 15C11.2652 15 11.5196 14.8946 11.7071 14.7071L15.7071 10.7071Z"
              fill="#7EF6B2" />
          </svg>

          <div>
            Success! Your changes have been successfully implemented
          </div>
        </CAlert>
      </div>
    </div>
  </div>
</template>

<script setup>
import Multiselect from '@/components/Multiselect'


import { ref, defineProps, onMounted, watch, toRefs } from 'vue'
const props = defineProps(['caption', "isInitialized", "trackBy", 'options', 'strategy', 'chainSelected', "isSaveDisabled", "onSave", "selectedTokens", "possibleTokens"])

const { selectedTokens, options, possibleTokens } = toRefs(props)
const { isSaveDisabled } = toRefs(props)  // Destructure isSaveDisabled from props

const multiselectRef = ref({})
const showWarning = ref(false)
const showSuccess = ref(false)

watch(isSaveDisabled, (newVal) => {
  console.log('isSaveDisabled changed:', newVal)
  // Put any side effect code you want here
  // For example, you could set other properties, make API calls, etc.
})


const { chainSelected } = toRefs(props)


// watch(options, (newVal) => {
//   // set isLoading to true as soon as possibleTokens changes
//   isLoading2.value = true;

//   if (newVal && newVal.length) {
//     isLoading2.value = false;
//   }
// }, { immediate: true });


watch(chainSelected, () => {
  multiselectRef.value.activate()
})

const onSaveClick = () => {
  if (props.isSaveDisabled.value) {
    showWarning.value = true;

    return; // If the warning is shown, you might not want to proceed with save
  }
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false;
    showWarning.value = false;

  }, 3000);

  props.onSave();
}
const isMultiselectOpen = ref(true)
const onMultiselectOpen = () => {
  if (props.isSaveDisabled) return;
  isMultiselectOpen.value = true;
}
const onMultiselectStayOpen = () => {
  isMultiselectOpen.value = true; // Ensure the internal state remains open
}
onMounted(() => {
  if (multiselectRef.value && typeof multiselectRef.value.activate === 'function') {
    multiselectRef.value.activate();
  }
});

</script>

<style lang="scss" scoped>
.spinner-container-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; // Optional: so that it appears above all other content
}

.multiselect-wrapper {
  width: 328px;
  padding: 12px 20px 26px 14px;
  border: 1px solid #00C9FF;
  border-radius: 4px;

  display: flex;
  flex-direction: column;
  align-items: flex-end;

  &.is-disabled {
    pointer-events: none;
    background: none;
  }

  &.--expanded {
    height: 464px;
    position: relative;

    .save-button {
      position: absolute;
      bottom: 16px;
    }
  }
}
:deep(.multiselect--disabled) {
  background: none !important;
}
:deep(.multiselect--disabled .multiselect__select) {
  background: none !important;
}


.select-option {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__text {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  &__icon {
    height: 32px;
    width: 32px;
    margin-right: 6px;
  }

  &__name {
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
    letter-spacing: 0em;
    text-align: left;
    color: #ffffff;
  }

  &__flag {
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff;
    border-radius: 2px;
    position: relative;
  }
}

.spinner-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  /* Optional: so that it appears above all other content */
}

.multiselect__option--selected {
  .select-option__flag {
    &::after {
      content: '×';
      color: #ffffff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
      width: 9px;
      height: 11px;
      line-height: 10px;
    }
  }
}

.containerr {
  flex-direction: column;
}

.elements-container {
  display: flex;
  justify-content: space-between; // if you want to separate them a bit
  // ... any other required styles ...
}

.elements-wrapper {
  background-color: #181c1f;
  border-radius: 4px;
  width: fit-content;
  min-width: 600px;
  min-height: 600px;
  padding: 20px;
  display: flex;
  z-index: 1;

  &__side {
    &:not(:first-child) {
      margin-left: 26px;
    }
  }

  &__caption {
    font-family: Poppins;
    font-size: 16px;
    font-weight: 500;
    line-height: 15px;
    letter-spacing: 0em;
    color: #ffffff;

    padding-bottom: 6px;
  }
}

.selected-elements-wrapper {
  position: relative; // <---- Add this line
  border: 1px solid #00C9FF;
  border-radius: 4px;
  width: 371px;
  padding: 4px;
  min-height: 464px;
  max-height: 464px;
  overflow-y: auto;

  .--container {
    padding: 6px 12px;
  }
}

:deep(.chain-select) {
  padding: 0 6px !important;
  max-width: 120px !important;
  margin-bottom: 12px;
  border-color: #00C9FF;
}

.save-button {
  background-color: #00C9FF;
  border-radius: 4px;
  color: #ffffff;
  padding: 7px 18px;
  align-self: center;
}
</style>
@/composables/admin/useChoosenRoutes@/composables/admin/useChoosenRoutes@/composables/admin/usePossibleRoutes@/composables/admin/useBotStatus@/composables/admin/useSaveDexes@/composables/admin/dex/useChoosenRoutes
