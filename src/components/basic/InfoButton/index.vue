<template>
  <div class="btn_block--info">
    <van-button
      :plain="plain"
      :loading="loading"
      :disabled="disabled"
      :size="size"
      :text="text"
      hairline
      round
      type="info"
      @click="handleClick"
    >
      <slot></slot>
    </van-button>
  </div>
</template>

<script>
export default {
  props: {
    plain: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'small',
    },
    text: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleClick() {
      this.$emit('detail', true);
    },
  },
};
</script>
