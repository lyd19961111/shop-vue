<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/webmain' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="'/'+current.path" v-if="current" v-show="current.authName!=='首页'">{{current.authName}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'commonCrumb',
  computed: {
    ...mapState({
      current: state => state.currentMenu
    }
    )
  }
}
</script>
<style>
.el-breadcrumb__inner a, .el-breadcrumb__inner.is-link {
  color: #606266;
}
.el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
  font-weight: 400;
  color: #ffffff;
  cursor: text;
}
</style>
<style  lang="scss" scoped>

</style>
