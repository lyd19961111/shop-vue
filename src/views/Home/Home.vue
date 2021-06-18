<template>
  <el-container class="home_container">
      <!-- 头部 -->
    <el-header>
        <web-header></web-header>
    </el-header>
    <!-- 内容区域 -->
    <el-container>
        <!-- 导航区域 -->
      <el-aside :width="isCollapse? '64px':'200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <web-nav :isCollapse="isCollapse"></web-nav>
      </el-aside>
      <!-- 主题内容 -->
      <el-main>
          <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import webHeader from '../webHeader/webHeader.vue';
import WebNav from '../webNav/webNav.vue';
export default {
  components: { webHeader, WebNav },
  data(){
      return{
           isCollapse:false,
      }
  },
  methods: {
    toggleCollapse(){
        this.isCollapse=!this.isCollapse
    }
  },
};
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
    .toggle-button{
        background-color: #4A5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
}
.el-main{
    background-color: #eaedf1;
}
</style>