<template>
  <div class="home">
    <div class="menuContainer">
      <windowMenu></windowMenu>
    </div>
    <div class="demoDisplayAreaContainer">
      <router-view/>
    </div>
  </div>
</template>

<script>
import {demoRouter} from '@/router'
import windowMenu from '@/views/menu/menu'

export default {
  name: 'home',
  components: {windowMenu},
  computed: {
    demoRouter: () => demoRouter
  },
  mounted() {
    console.info(demoRouter)
  }
}
</script>

<style lang="scss">
.home {
  height: 100%;
  width: 100%;
  display: flex;

  .menuContainer {
    height: 100%;
    background: #545c64;
    border-right: solid 1px #e6e6e6;
    flex: 1;
  }

  .demoDisplayAreaContainer {
    flex: 7;
    position: relative;
    height: 100%;
  }
}
</style>
