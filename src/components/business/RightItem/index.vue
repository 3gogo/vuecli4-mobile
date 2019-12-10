<template>
  <div class="item_wrap--right-item">
    <div class="item_img"></div>
    <div class="item_main">
      <div class="item_main--content">
        <div class="item_main--content-title">这是标题｜标题标标题</div>
        <div class="item_main--content-add-on">￥400  剩余: 10000份</div>
      </div>
    </div>
    <div class="item_tail">
      <info-button plain @detail="handleClick">立即领取</info-button>
    </div>
  </div>
</template>

<script>

import InfoButton from '@components/basic/InfoButton/index.vue';

export default {
  data() {
    return {
      aa: 1,
    };
  },
  components: {
    InfoButton,
  },
  methods: {
    handleClick() {
      console.log('handleClick...');
    },
  },
};

</script>

<style lang="less">
.item_wrap--right-item {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  .item_img {
    width: 140px;
    height: 120px;
    background-image: url('~@assets/logo.png');
    background-position: center;
    background-size: cover;
  }
  .item_title {
    font-size: 28px;
    color: #1D2023;
  }
  .item_add-on {
    font-size: 24px;
    color: #999;
  }
  .item_main {
    flex: 1;
    margin-left: 20px;
  }
  .item_main--content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
  }
  .item_main--content-title {
    font-size: 28px;
    line-height: 30px;
  }
  .item_main--content-add-on {
    color: #999;
    font-size: 24px;
    line-height: 33px;

    margin-top: 18px;
  }
}
</style>
