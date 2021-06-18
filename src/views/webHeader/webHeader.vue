<template>
  <div class="header">
    <div class="logo">
      <img src="@/assets/logo.svg" style="width: 60px; height: 60px" alt />
      <span>智慧魔方管理平台</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
    methods:{
        logout() {
      window.sessionStorage.clear(); //清除token
      this.$router.push("./login"); //回到登陆界面
    },
    }
};
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
  }
}
</style>