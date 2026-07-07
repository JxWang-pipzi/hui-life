<template>
  <text :style="styleObj" class="uni-icons" @click="_onClick">
    <slot>{{ unicode }}</slot>
  </text>
</template>

<script>
import { fontData } from '@dcloudio/uni-ui/lib/uni-icons/uniicons_file_vue.js'

const getSize = (value) => {
  const numeric = /^[0-9]*$/g
  return typeof value === 'number' || numeric.test(value) ? `${value}px` : value
}

export default {
  name: 'UniIcons',
  emits: ['click'],
  props: {
    type: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#333333',
    },
    size: {
      type: [Number, String],
      default: 16,
    },
    fontFamily: {
      type: String,
      default: 'uniicons',
    },
  },
  computed: {
    unicode() {
      const icon = fontData.find((item) => item.font_class === this.type)
      return icon ? icon.unicode : ''
    },
    styleObj() {
      return `color: ${this.color}; font-size: ${getSize(this.size)}; font-family: ${this.fontFamily};`
    },
  },
  methods: {
    _onClick(event) {
      this.$emit('click', event)
    },
  },
}
</script>

<style lang="scss">
.uni-icons {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: uniicons;
  line-height: 1;
  text-align: center;
  text-decoration: none;
}
</style>
