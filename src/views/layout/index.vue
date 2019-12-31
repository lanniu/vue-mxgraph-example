<template>
  <el-container class="layoutContainer">
    <sidebar/>
    <el-container>
      <el-header>
        <navbar/>
      </el-header>
      <el-main>
        <transition name="fade-transform" mode="out-in">
          <keep-alive>
            <router-view/>
          </keep-alive>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import sidebar from '@/views/layout/sidebar'
import navbar from '@/views/layout/navbar'

export default {
  name: 'layout',
  components: {
    sidebar,
    navbar
  }
}
</script>

<style lang="scss">
.layoutContainer {
  width: 100%;
  height: 100%;

  .el-header {
    padding: 0;
  }

  .el-menu {
    height: 100%;
  }

  .el-main {
    padding: 5px;
  }
}
</style>
