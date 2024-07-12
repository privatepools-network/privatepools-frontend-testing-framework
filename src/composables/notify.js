import Toast from '@/UI/Toast.vue'
import { toast } from 'vue3-toastify'

export const notify = (popupType, popupText, popupSubText) => {
  toast(Toast, {
    closeOnClick: true,
    theme: 'dark',
    type: popupType,
    autoClose: 5000,
    closeButton: true,
    position: toast.POSITION.TOP_RIGHT,
    data: {
      header_text: popupText,
      toast_text: popupSubText,
      tx_link: '',
      speedUp: '',
    },
  })
}
