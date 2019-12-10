<template>
  <div class="view_wrap--basic-list page">
    <van-nav-bar
      title="vuecli4"
      left-text=""
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="scroll-view">
      <right-item/>
      <primary-button
        size="large"
        text="是的"
      />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import RightItem from '@components/business/RightItem/index.vue';
import PrimaryButton from '@components/basic/PrimaryButton/index.vue';

export default {
  name: 'Index',
  components: {
    RightItem,
    PrimaryButton,
  },
  methods: {
    onClickLeft() {
      console.log('click left btn');
      this.$eventHub.$emit('go-back');
    },
  },
};
</script>
