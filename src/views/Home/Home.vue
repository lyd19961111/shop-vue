<template>
  <el-container class="home_container">
      <!-- 头部 -->
    <el-header>
        <web-header>
        </web-header>
    </el-header>
    <!-- 内容区域 -->
    <el-container>
        <!-- 导航区域 -->
      <el-aside :width="$store.state.isCollapse? '64px':'200px'">
          <web-nav></web-nav>
      </el-aside>
      <!-- 主题内容 -->
      <el-main>
          <common-tags></common-tags>
          <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import webHeader from '../webHeader/webHeader.vue'
import WebNav from '../webNav/webNav.vue'
import CommonTags from '../../components/commomTags/commonTags'
export default {
  components: { CommonTags, webHeader, WebNav },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.home_container{
    height: 100%;
}
.el-header{
  padding: 0;
}
.el-aside{
    background-color: #333744;
}
.el-main{
    background-color: #eaedf1;
}
</style>
