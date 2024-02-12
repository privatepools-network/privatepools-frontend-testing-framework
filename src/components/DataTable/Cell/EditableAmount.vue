<template>
  <div class="editable-amount-container">
    <div class="value-text">
      {{ convertFromNumber(numberValue, tokenEntity.short) }}
      <svg  @click="toggleEdit" width="17" height="17" viewBox="0 0 17 17" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15.7586 4.73201L12.268 1.24061C12.1519 1.1245 12.0141 1.0324 11.8624 0.969568C11.7107 0.906731 11.5482 0.87439 11.384 0.87439C11.2198 0.87439 11.0572 0.906731 10.9056 0.969568C10.7539 1.0324 10.6161 1.1245 10.5 1.24061L0.866412 10.875C0.749834 10.9906 0.657407 11.1283 0.594506 11.28C0.531604 11.4317 0.499482 11.5944 0.500006 11.7586V15.25C0.500006 15.5815 0.631702 15.8994 0.866123 16.1339C1.10054 16.3683 1.41849 16.5 1.75001 16.5H5.24141C5.40563 16.5005 5.5683 16.4684 5.71999 16.4055C5.87168 16.3426 6.00935 16.2502 6.12501 16.1336L15.7586 6.49998C15.8747 6.3839 15.9668 6.24609 16.0296 6.09442C16.0925 5.94274 16.1248 5.78017 16.1248 5.616C16.1248 5.45182 16.0925 5.28925 16.0296 5.13758C15.9668 4.9859 15.8747 4.84809 15.7586 4.73201ZM2.0086 11.5L8.62501 4.88358L9.92891 6.18748L3.31251 12.8031L2.0086 11.5ZM1.75001 13.0086L3.99141 15.25H1.75001V13.0086ZM5.50001 14.9914L4.1961 13.6875L10.8125 7.07108L12.1164 8.37498L5.50001 14.9914ZM13 7.49139L9.5086 3.99998L11.3836 2.12498L14.875 5.61561L13 7.49139Z"
          fill="white" />
      </svg>
    </div>
    <CModal alignment="center" :visible="isEditing" @close="() => {
      isEditing = false
    }
      ">
      <CModalHeader>
        <CModalTitle>
          <div class="title-text">Edit Tokens</div>
          <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21.862 6.02482L16.9752 1.13685C16.8127 0.974305 16.6197 0.845365 16.4074 0.757395C16.195 0.669424 15.9674 0.624146 15.7376 0.624146C15.5077 0.624146 15.2801 0.669424 15.0678 0.757395C14.8555 0.845365 14.6625 0.974305 14.5 1.13685L1.01298 14.625C0.849768 14.7869 0.72037 14.9796 0.632308 15.192C0.544245 15.4044 0.499274 15.6321 0.500009 15.862V20.75C0.500009 21.2141 0.684383 21.6592 1.01257 21.9874C1.34076 22.3156 1.78588 22.5 2.25001 22.5H7.13798C7.36788 22.5007 7.59563 22.4557 7.80799 22.3677C8.02035 22.2796 8.2131 22.1502 8.37501 21.987L21.862 8.49998C22.0246 8.33747 22.1535 8.14453 22.2415 7.93219C22.3295 7.71984 22.3747 7.49224 22.3747 7.2624C22.3747 7.03255 22.3295 6.80495 22.2415 6.59261C22.1535 6.38026 22.0246 6.18733 21.862 6.02482ZM2.61204 15.5L11.875 6.23701L13.7005 8.06248L4.43751 17.3243L2.61204 15.5ZM2.25001 17.612L5.38798 20.75H2.25001V17.612ZM7.50001 20.3879L5.67454 18.5625L14.9375 9.29951L16.763 11.125L7.50001 20.3879ZM18 9.88794L13.112 4.99998L15.737 2.37497L20.625 7.26185L18 9.88794Z"
              fill="white" />
          </svg>
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="token-name">
          <CAvatar :src="tokenEntity.icon" />
          <div class="token-name-text">
            {{ tokenName }}
          </div>
        </div>
        <div class="editable-content">
          <div class="editable-content__caption fs-6">{{ fieldName }}:</div>
          <div class="editable-content__value d-flex align-items-center">
            <div style="font-size:18px;">$</div>
            <CFormInput type="text" id="poolNameInput" style="text-decoration:underline" placeholder=" $" :value="value"
              @input="(event) => (value = editingEnabled ? event.target.value : value)" required minlength="1" maxlength="20"
              aria-describedby="exampleFormControlInputHelpInline" />
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton class="submit-button" @click="OnEditClick
          ">
          Save
        </CButton>

        <div>
          <CAlert :dismissible="false" class="d-flex gap-2 mt-2 mb-0" style="
            background-color: rgba(15, 17, 19, 1);
            color: white;
            border: none;
            display: flex;
          " color="primary" :visible="addStrategyWarning"  @close="() => {
            addStrategyWarning = false
          }
            ">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M22 12C22 17.5228 17.5228 22 12 22H2.9937C2.11018 22 1.66771 20.9229 2.29245 20.2929L4.2495 18.3195C2.84334 16.597 2 14.397 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.2071 8.79289C15.5976 9.18342 15.5976 9.81658 15.2071 10.2071L13.4142 12L15.2071 13.7929C15.5976 14.1834 15.5976 14.8166 15.2071 15.2071C14.8166 15.5976 14.1834 15.5976 13.7929 15.2071L12 13.4142L10.2071 15.2071C9.81658 15.5976 9.18342 15.5976 8.79289 15.2071C8.40237 14.8166 8.40237 14.1834 8.79289 13.7929L10.5858 12L8.79289 10.2071C8.40237 9.81658 8.40237 9.18342 8.79289 8.79289C9.18342 8.40237 9.81658 8.40237 10.2071 8.79289L12 10.5858L13.7929 8.79289C14.1834 8.40237 14.8166 8.40237 15.2071 8.79289Z"
                fill="#FF507A" />
            </svg>

            <div>
              It's impossible to change this value because there is a Strategy curently running.
            </div>
          </CAlert>
        </div>

        <div>
          <CAlert :dismissible="false" class="d-flex gap-2 mt-2 mb-0" style="
            background-color: rgba(15, 17, 19, 1);
            color: white;
            border: none;
            display: flex;
          " color="primary" :visible="addStrategySuccess"  @close="() => {
            addStrategySuccess = false
          }
            ">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22H2.9937C2.11018 22 1.66771 20.9229 2.29245 20.2929L4.2495 18.3195C2.84334 16.597 2 14.397 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.7071 10.7071C16.0976 10.3166 16.0976 9.68342 15.7071 9.29289C15.3166 8.90237 14.6834 8.90237 14.2929 9.29289L11 12.5858L9.70711 11.2929C9.31658 10.9024 8.68342 10.9024 8.29289 11.2929C7.90237 11.6834 7.90237 12.3166 8.29289 12.7071L10.2929 14.7071C10.4804 14.8946 10.7348 15 11 15C11.2652 15 11.5196 14.8946 11.7071 14.7071L15.7071 10.7071Z" fill="#7EF6B2"/>
</svg>


            <div>
              Success! Your changes have been successfully implemented
            </div>
          </CAlert>
        </div>

      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { getTokenEntity } from '@/lib/helpers/util'
import { defineProps, defineEmits, ref, computed } from 'vue'
import { GetTokensAll } from "@/composables/admin/tokens/useTokensAll"
import { UpdateSum } from "@/composables/admin/tokens/useUpdateSum"
const props = defineProps(['value', 'tokenName', 'fieldName', 'editingEnabled', "chainSelected"])
defineEmits(['update'])

const addStrategyWarning = ref(false)
const addStrategySuccess = ref(false)
const isEditing = ref(false)
const numberValue = computed({
  get: () => props.value,
  set: (value) => {
    // emit('update', value)
    return value
  },
})

const toggleEdit = () => {
  const currentValue = isEditing.value
  isEditing.value = !currentValue
}

const convertFromNumber = (str, name) => {
  let number = parseFloat(str)

  let suffix = ''
  if (number >= 1e9) {
    suffix = 'b'
    number /= 1e9
  } else if (number >= 1e6) {
    suffix = 'm'
    number /= 1e6
  } else if (number >= 1e3) {
    suffix = 'k'
    number /= 1e3
  }

  const result = number + suffix + ' ' + name
  return result
}
const tokenEntity = computed(() => getTokenEntity(props.tokenName))


async function OnEditClick() {
  if (props.editingEnabled === true) {
  let allTokens = await GetTokensAll(props.chainSelected)
  let editedToken = allTokens.find((t) => t.name == tokenEntity.value.short)
  if (editedToken) {
    await UpdateSum(props.chainSelected, props.fieldName, editedToken.address, numberValue.value)
  }
  addStrategySuccess.value = true
  setTimeout(() => {
    addStrategySuccess.value = false
    }, 4000);
  }else {
    addStrategyWarning.value = true
    setTimeout(() => {
      addStrategyWarning.value = false
    }, 4000);
  }

}

</script>

<style lang="scss" scoped>
@mixin text-content {
  font-size: 22px;
  line-height: 27px;
  letter-spacing: 0em;
  color: #ffffff;
}

:deep(.form-control) {
  width: 70%;

  color: white;
  background-color: #ffffff00;

  border: none;

}

.editable-amount-container {
  display: flex;
  text-align: end;
  color: #27ae60;
  width: 100%;
  justify-content: center;

  .value-text {
    display: flex;
    align-items: center;

    svg {
      margin-left: 12px;
    }
  }

  &:deep(.modal-content) {
    padding: 20px;
    background-color: #181c1f !important;
    border-color: #00C9FF !important;
  }

  &:deep(.modal-header) {
    padding: 0;
    border: 0;

    .modal-title {
      display: flex;

      .title-text {
        font-size: 24px;
        font-weight: 600;
        line-height: 29px;
        letter-spacing: 0em;
        color: #ffffff;
        margin-right: 18px;
      }
    }
  }

  &:deep(.modal-body) {
    padding: 27px 0 38px 0;
    border: 0;
  }

  &:deep(.modal-footer) {
    padding: 0;
    border: 0;
    justify-content: flex-start;
  }
}

.token-name {
  display: flex;
  align-items: center;

  .token-name-text {
    @include text-content;
    font-weight: 600;
  }
}

.editable-content {
  display: flex;
  align-items: center;

  margin-top: 32px;

  &__caption {
    @include text-content;
    font-weight: 400;
  }

  &__value {
    @include text-content;
    font-weight: 600;
    margin-left: 16px;
    /* text-decoration: underline; */
  }
}

.submit-button {
  color: #ffffff;
  background-color: #00C9FF;
  margin: 0;
}
</style>
@/composables/admin/tokens/useTokensAll