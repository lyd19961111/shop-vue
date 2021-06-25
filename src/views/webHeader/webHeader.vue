<template>
  <div class="header">
    <div class="logo">
      <img src="@/assets/logo.svg" style="width: 60px; height: 60px" alt />
      <span>智慧魔方管理平台</span>
      <el-button type="primary" icon="el-icon-menu" size="mini" @click="changeCollapse"></el-button>
      <common-crumb ></common-crumb>
    </div>

    <el-button type="info" @click="logout" class="logout">退出</el-button>
  </div>
</template>

<script>
import CommonCrumb from '../../components/commonCrumb/commonCrumb'
export default {
  components: { CommonCrumb },
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear() // 清除token
      this.$router.push('./login') // 回到登陆界面
    },
    changeCollapse () {
      this.isCollapse = !this.isCollapse
      this.$store.commit('isCollapse', this.isCollapse)
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  //width: 100%;
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  .logo {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
    .el-button{
      margin-left: 10px;
      margin-right: 10px;
    }
    .el-breadcrumb {
      margin-bottom: 0;
    }
  }
  .logout{
    margin-right: 30px;
  }
}
</style>
