<template>
  <div id="app" class="pages">
    <transition :name='transitionType'>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transitionType: 'slide-right',
    };
  },
  watch: {
    $route(to, from) {
      this.initTransType(to, from);
    },
  },
  methods: {
    initTransType() {
      const { direction } = this.$DataStore;
      console.log(direction);
      this.transitionType = direction === 'forward' ? 'slide-right' : 'slide-left';
    },
    goBack() {
      window.history.go(-1);
    },
  },
  created() {
    this.$eventHub.$on('go-back', this.goBack);
  },
  beforeDestroy() {
    this.$eventHub.$off('go-back', this.goBack);
  },
};
</script>
