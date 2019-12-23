<template>
  <el-menu background-color="#545c64" :default-active="$route['name']" text-color="#fff" active-text-color="#ffd04b" router>
    <template v-for="router in demoRouter">
      <el-menu-item :key="router['name']" :index="router['name']">
        <i class="el-icon-menu"></i>
        <span slot="title">{{router['meta']['title']}}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
import {demoRouter} from '@/router'

export default {
  name: 'windowMenu',
  computed: {
    demoRouter: () => demoRouter
  }
}
</script>

<style lang="scss">
.menuContainer {
  .el-menu {
    border: 0;
  }
}
</style>
