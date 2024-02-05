<template>
  <div class="d-flex align-items-center">
    <div :class="className" />
    <span class="text-white ms-2" style="font-size: 15px">
      {{ title }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'CircleItem',
  props: {
    title: {
      type: String,
    },
    color: {
      type: String,
      default: 'green',
    },
  },
  setup(props) {
    const className = `bg--${props.color} circle-item`

    return {
      className,
    }
  },
}
</script>
